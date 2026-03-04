from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import scan, github_scan

app = FastAPI(
    title="CodeSentinel AI",
    description="AI-powered secure code review and vulnerability intelligence platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    # In production, replace "*" with your frontend's domain(s)
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scan.router)
app.include_router(github_scan.router)


@app.get("/")
async def root():
    return {"message": "CodeSentinel AI API is running", "version": "1.0.0"}


@app.get("/health")
async def health():
    return {"status": "healthy"}
