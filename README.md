# 🛡️ CodeSentinel AI

> **AI-powered Secure Code Review & Vulnerability Intelligence Platform**

CodeSentinel AI automatically scans source code and detects security vulnerabilities, insecure patterns, hardcoded secrets, and risky patterns — providing AI-generated explanations, real-world attack examples, and secure code fixes.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔍 **Code Scanner** | Paste code in any language — AI scans for vulnerabilities instantly |
| 🐙 **GitHub Scanner** | Enter a GitHub repo URL — AI fetches and scans source files |
| 🤖 **AI Vulnerability Detection** | Detects SQL Injection, XSS, hardcoded secrets, insecure auth, and more |
| 💡 **AI Explanations** | Each vulnerability includes explanation + real-world attack scenario |
| 🔧 **Secure Fix Generator** | AI rewrites your code with security best practices applied |
| 📊 **Risk Score Dashboard** | Visual security score (0–100) with critical/high/medium/low breakdown |

---

## 🏗️ Architecture

```
Frontend (React + Vite + Tailwind)
         ↓ HTTP POST
Backend (FastAPI)
         ↓ OpenAI API
AI Analysis → JSON Response
         ↓
Security Dashboard
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- OpenAI API key

### 1. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Backend runs at: http://localhost:8000
API docs: http://localhost:8000/docs

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:3000

---

## 📡 API Reference

### `POST /api/scan`
Scan pasted source code.
```json
{ "code": "your code here", "language": "auto" }
```

### `POST /api/scan/github`
Scan a GitHub repository.
```json
{ "repo_url": "https://github.com/owner/repo", "branch": "main" }
```

---

## 🔒 Detected Vulnerability Types

- SQL Injection (CWE-89)
- Cross-Site Scripting / XSS (CWE-79)
- Hardcoded Secrets / API Keys (CWE-798)
- Insecure Authentication (CWE-287)
- Command Injection (CWE-78)
- Path Traversal (CWE-22)
- Insecure Deserialization (CWE-502)
- Weak Cryptography (CWE-327)
- Open Redirects (CWE-601)
- SSRF (CWE-918)

---

## 🎨 Tech Stack

**Backend:** FastAPI · Python · OpenAI GPT-4o · Pydantic · httpx
**Frontend:** React 18 · Vite · Tailwind CSS · Lucide Icons
**AI:** OpenAI GPT-4o (configurable via `OPENAI_MODEL`)

---

## 📁 Project Structure

```
SecureAssist/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt
│   ├── .env.example
│   ├── models/
│   │   └── schemas.py       # Pydantic models
│   ├── routers/
│   │   ├── scan.py          # Code scan endpoint
│   │   └── github_scan.py   # GitHub scan endpoint
│   └── services/
│       └── ai_scanner.py    # OpenAI integration
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── App.jsx           # Main app
        ├── api/
        │   └── scannerApi.js
        └── components/
            ├── CodeScanner.jsx
            ├── GitHubScanner.jsx
            ├── VulnerabilityCard.jsx
            ├── RiskScore.jsx
            └── SecureCodePanel.jsx
```