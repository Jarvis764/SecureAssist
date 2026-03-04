from fastapi import APIRouter, HTTPException
from ..models.schemas import CodeScanRequest, ScanResult
from ..services.ai_scanner import scan_code

router = APIRouter(prefix="/api", tags=["scan"])


@router.post("/scan", response_model=ScanResult)
async def scan_code_endpoint(request: CodeScanRequest):
    if not request.code.strip():
        raise HTTPException(status_code=400, detail="Code cannot be empty")
    result = scan_code(request.code, request.language or "auto")
    return result
