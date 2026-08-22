from fastapi import FastAPI, Depends, HTTPException, Security
from fastapi.security.api_key import APIKeyHeader
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from starlette.status import HTTP_403_FORBIDDEN

import logging

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="SkillForge AI Service")

allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY_NAME = "X-API-Key"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)
x_internal_key_header = APIKeyHeader(name="x-internal-key", auto_error=False)

def get_api_key(
    api_key_header_val: str = Security(api_key_header),
    x_internal_key_header_val: str = Security(x_internal_key_header)
):
    expected_key = os.getenv("INTERNAL_API_KEY")
    if not expected_key:
        logger.error("INTERNAL_API_KEY environment variable is not set!")
        raise HTTPException(status_code=500, detail="Server Configuration Error")
        
    if api_key_header_val == expected_key or x_internal_key_header_val == expected_key:
        return expected_key
    raise HTTPException(
        status_code=HTTP_403_FORBIDDEN, detail="Could not validate API Key"
    )

from app.routers.agent import router as agent_router
from app.routers.api import router as api_router
from app.routers.api import generate_roadmap_endpoint
from app.schemas import GenerateRoadmapRequest

@app.post("/roadmap/generate", dependencies=[Depends(get_api_key)])
async def generate_roadmap_direct(req: GenerateRoadmapRequest):
    return await generate_roadmap_endpoint(req)

app.include_router(agent_router)
app.include_router(api_router, dependencies=[Depends(get_api_key)])

from fastapi.responses import JSONResponse

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Internal AI Service Error: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"error": "Internal AI Service Error", "detail": "An unexpected error occurred. Please try again later."}
    )

@app.get("/")
@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "ai-service"}
