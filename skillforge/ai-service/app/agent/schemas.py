from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class AgentChatRequest(BaseModel):
    student_id: str
    message: str
    target_role: Optional[str] = None
    conversation_history: Optional[List[Dict[str, str]]] = Field(default_factory=list)

class AgentChatResponse(BaseModel):
    response: str
    action_taken: Optional[str] = None
    data: Optional[Dict[str, Any]] = None
    citations: List[str] = Field(default_factory=list)
