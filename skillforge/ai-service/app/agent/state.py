import operator
from typing import Annotated, Optional
from typing_extensions import TypedDict
from langchain_core.messages import BaseMessage

class AgentState(TypedDict):
    messages: Annotated[list[BaseMessage], operator.add]
    student_id: Optional[str]
    target_role: Optional[str]
    skill_gaps: Optional[dict]
    roadmap_data: Optional[dict]
    citations: list[str]
