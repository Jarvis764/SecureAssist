from fastapi import APIRouter, HTTPException
from ..models.schemas import GitHubScanRequest, ScanResult
from ..services.ai_scanner import scan_github_repo

router = APIRouter(prefix="/api", tags=["github"])


@router.post("/scan/github", response_model=ScanResult)
async def github_scan_endpoint(request: GitHubScanRequest):
    if not request.repo_url.strip():
        raise HTTPException(status_code=400, detail="Repository URL cannot be empty")
    result = await scan_github_repo(request.repo_url, request.branch or "main")
    return result
