from pydantic import BaseModel
from typing import List, Optional


class CodeScanRequest(BaseModel):
    code: str
    language: Optional[str] = "auto"


class GitHubScanRequest(BaseModel):
    repo_url: str
    branch: Optional[str] = "main"


class Vulnerability(BaseModel):
    id: str
    name: str
    risk_level: str  # low, medium, high, critical
    explanation: str
    attack_example: str
    line_hint: Optional[str] = None
    cwe: Optional[str] = None


class ScanResult(BaseModel):
    vulnerabilities: List[Vulnerability]
    secure_fix: str
    security_score: int
    summary: str
    language_detected: str
    scan_id: str
