import json
import os
import uuid

import httpx
import openai
from dotenv import load_dotenv

load_dotenv()

_client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))
_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o")
# Maximum characters read per file when scanning a GitHub repository.
# Increase via MAX_FILE_CHARS env var for more thorough analysis.
_MAX_FILE_CHARS = int(os.getenv("MAX_FILE_CHARS", "4000"))

SCAN_PROMPT = """You are an expert cybersecurity engineer performing a thorough code security review.

Analyze the following {language} code for ALL security vulnerabilities.

Code to analyze:
```
{code}
```

Return ONLY a valid JSON object (no markdown, no extra text) with this exact structure:
{{
  "vulnerabilities": [
    {{
      "id": "VULN-001",
      "name": "Vulnerability Name",
      "risk_level": "critical|high|medium|low",
      "explanation": "Clear explanation of why this is dangerous",
      "attack_example": "How an attacker would exploit this in the real world",
      "line_hint": "approximate line or code snippet where issue occurs",
      "cwe": "CWE-89"
    }}
  ],
  "secure_fix": "Complete rewritten secure version of the code",
  "security_score": 75,
  "summary": "Brief overall security assessment",
  "language_detected": "python"
}}

Check for: SQL Injection, XSS, CSRF, Hardcoded secrets/API keys/passwords, Insecure authentication, Unsafe input handling, Command injection, Path traversal, Insecure deserialization, Missing error handling that leaks info, Weak cryptography, Open redirects, SSRF, and any other relevant vulnerabilities.

The security_score should be 0 (worst) to 100 (best). Deduct points based on severity and count of vulnerabilities found."""


def scan_code(code: str, language: str = "auto") -> dict:
    scan_id = str(uuid.uuid4())
    try:
        prompt = SCAN_PROMPT.format(language=language, code=code)
        response = _client.chat.completions.create(
            model=_MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1,
            max_tokens=4096,
        )
        raw = response.choices[0].message.content.strip()
        # Strip markdown code fences if present
        if raw.startswith("```"):
            raw = raw.split("```", 2)[1]
            if raw.startswith("json"):
                raw = raw[4:]
            raw = raw.rsplit("```", 1)[0]
        result = json.loads(raw)
        result["scan_id"] = scan_id
        return result
    except Exception as exc:
        return {
            "vulnerabilities": [],
            "secure_fix": code,
            "security_score": 100,
            "summary": f"Scan could not be completed: {exc}",
            "language_detected": language,
            "scan_id": scan_id,
        }


async def scan_github_repo(repo_url: str, branch: str = "main") -> dict:
    """Fetch files from a public GitHub repo and scan them."""
    scan_id = str(uuid.uuid4())
    try:
        # Parse owner/repo from URL
        parts = repo_url.rstrip("/").split("/")
        owner = parts[-2]
        repo = parts[-1].replace(".git", "")

        headers = {}
        gh_token = os.getenv("GITHUB_TOKEN", "")
        if gh_token:
            headers["Authorization"] = f"token {gh_token}"

        api_base = f"https://api.github.com/repos/{owner}/{repo}"

        async with httpx.AsyncClient(timeout=30, headers=headers) as client:
            # Get tree
            tree_resp = await client.get(
                f"{api_base}/git/trees/{branch}?recursive=1"
            )
            tree_resp.raise_for_status()
            tree = tree_resp.json().get("tree", [])

            # Pick up to 5 source code files to scan
            extensions = {".py", ".js", ".ts", ".java", ".php", ".go", ".rb", ".cs"}
            files_to_scan = [
                item for item in tree
                if item.get("type") == "blob"
                and any(item["path"].endswith(ext) for ext in extensions)
            ][:5]

            combined_code = ""
            for f in files_to_scan:
                raw_url = f"https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{f['path']}"
                r = await client.get(raw_url)
                if r.status_code == 200:
                    combined_code += f"\n\n# === FILE: {f['path']} ===\n" + r.text[:_MAX_FILE_CHARS]

        if not combined_code:
            combined_code = "# No source files found in repository"

        result = scan_code(combined_code, language="mixed")
        result["scan_id"] = scan_id
        result["repo_url"] = repo_url
        return result
    except Exception as exc:
        return {
            "vulnerabilities": [],
            "secure_fix": "",
            "security_score": 100,
            "summary": f"GitHub scan could not be completed: {exc}",
            "language_detected": "unknown",
            "scan_id": scan_id,
            "repo_url": repo_url,
        }
