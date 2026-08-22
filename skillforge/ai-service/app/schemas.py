from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

class AnalyzeSkillsRequest(BaseModel):
    student_id: str
    scores: Optional[Dict[str, float]] = None

class GenerateRoadmapRequest(BaseModel):
    student_id: str
    target_role: str
    timeframe_weeks: Optional[int] = 12
    experience_level: Optional[str] = "Beginner"
    answers: Optional[List[Dict[str, Any]]] = None

class ChatAgentRequest(BaseModel):
    student_id: str
    message: str
    target_role: Optional[str] = None

class RagQueryRequest(BaseModel):
    query: str
    domain: Optional[str] = None
    match_count: Optional[int] = 4
