from fastapi import FastAPI, Depends, HTTPException, Security
from fastapi.security.api_key import APIKeyHeader
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from starlette.status import HTTP_403_FORBIDDEN

load_dotenv()

app = FastAPI(title="SkillForge AI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY_NAME = "X-API-Key"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)

def get_api_key(api_key_header: str = Security(api_key_header)):
    expected_key = os.getenv("INTERNAL_API_KEY", "skillforge-secret-key")
    if api_key_header == expected_key:
        return api_key_header
    raise HTTPException(
        status_code=HTTP_403_FORBIDDEN, detail="Could not validate API Key"
    )

from app.routers.agent import router as agent_router
from app.routers.api import router as api_router

app.include_router(agent_router)
app.include_router(api_router, dependencies=[Depends(get_api_key)])

from fastapi.responses import JSONResponse

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"error": "Internal AI Service Error", "detail": str(exc)}
    )

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "ai-service"}
