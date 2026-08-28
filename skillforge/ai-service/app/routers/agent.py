import os
from fastapi import APIRouter, HTTPException
from typing import List
from langchain_core.messages import HumanMessage, AIMessage, BaseMessage

from app.agent.schemas import AgentChatRequest, AgentChatResponse
from app.agent.graph import app_graph

router = APIRouter(prefix="/internal/agent", tags=["agent"])

@router.post("/chat", response_model=AgentChatResponse)
async def chat_with_agent(request: AgentChatRequest):
    try:
        messages: List[BaseMessage] = []
        for msg in request.conversation_history:
            if msg.get("role") == "user":
                messages.append(HumanMessage(content=msg.get("content", "")))
            elif msg.get("role") == "assistant":
                messages.append(AIMessage(content=msg.get("content", "")))
        
        messages.append(HumanMessage(content=request.message))
        
        state = {
            "messages": messages,
            "student_id": request.student_id,
            "target_role": request.target_role,
            "skill_gaps": None,
            "roadmap_data": None,
            "citations": []
        }
        
        result = app_graph.invoke(state)
        
        final_messages = result.get("messages", [])
        if not final_messages:
            raise HTTPException(status_code=500, detail="Agent returned no messages")
            
        final_message = final_messages[-1]
        
        return AgentChatResponse(
            response=final_message.content,
            action_taken=None,
            data=None,
            citations=result.get("citations", [])
        )
        
    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Agent error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Agent execution failed.")
