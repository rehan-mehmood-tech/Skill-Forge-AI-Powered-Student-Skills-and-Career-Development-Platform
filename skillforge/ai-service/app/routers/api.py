from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import Optional, Dict, Any, List
import json
from langchain_core.messages import HumanMessage

from app.core.skill_analyzer import SkillAnalyzer
from app.core.roadmap_generator import RoadmapGenerator
from app.core.skill_gap_calculator import SkillGapCalculator
from app.rag.retriever import KnowledgeBaseRetriever
from app.agent.graph import app_graph
from app.agent.tools import supabase
from app.services.cv_parser import CVParser

from app.schemas import AnalyzeSkillsRequest, GenerateRoadmapRequest, ChatAgentRequest, RagQueryRequest

router = APIRouter(prefix="/api", tags=["core_api"])
cv_parser_service = CVParser()


@router.post("/analyze-skills")
async def analyze_skills(req: AnalyzeSkillsRequest):
    try:
        res = supabase.table("profiles").select("skill_vector").eq("id", req.student_id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Student profile not found")
        skill_vector = res.data[0].get("skill_vector", {})
        
        # In a real scenario we'd use req.scores to update skill vector
        # This just returns the current vector
        return {"student_id": req.student_id, "skill_vector": skill_vector}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-roadmap")
async def generate_roadmap_endpoint(req: GenerateRoadmapRequest):
    try:
        res = supabase.table("profiles").select("skill_vector").eq("id", req.student_id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Student profile not found")
            
        skill_vector = res.data[0].get("skill_vector", {})
        gap_report = SkillGapCalculator.identify_gaps(skill_vector, req.target_role)
        
        resources_res = supabase.table("learning_resources").select("*").eq("is_active", True).execute()
        available_resources = resources_res.data if resources_res.data else []
        
        recommended_topics = RoadmapGenerator.recommend_topics(gap_report, available_resources)
        phases = RoadmapGenerator.build_phases(gap_report, recommended_topics)
        
        roadmap_payload = RoadmapGenerator.generate_roadmap_payload(req.student_id, req.target_role, gap_report, phases)
        
        insert_res = supabase.table("roadmaps").insert(roadmap_payload).execute()
        
        return {"roadmap": phases, "roadmap_id": insert_res.data[0].get("id") if insert_res.data else None}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat-agent")
async def chat_agent(req: ChatAgentRequest):
    try:
        state = {
            "messages": [HumanMessage(content=req.message)],
            "student_id": req.student_id,
            "target_role": req.target_role,
            "skill_gaps": None,
            "roadmap_data": None,
            "citations": []
        }
        
        result = app_graph.invoke(state)
        final_messages = result.get("messages", [])
        if not final_messages:
            raise HTTPException(status_code=500, detail="Agent returned no messages")
            
        final_message = final_messages[-1]
        
        return {
            "response": final_message.content,
            "action_taken": "chat",
            "citations": result.get("citations", [])
        }
    except Exception as e:
        return {
            "response": "I'm currently experiencing technical difficulties.",
            "action_taken": "error_fallback",
            "citations": []
        }

@router.post("/rag-query")
async def rag_query(req: RagQueryRequest):
    try:
        retriever = KnowledgeBaseRetriever()
        chunks = retriever.retrieve_relevant_chunks(req.query, domain=req.domain, top_k=req.match_count)
        return {"results": chunks}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upload-cv")
async def upload_cv(file: UploadFile = File(...), student_id: str = Form(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    try:
        contents = await file.read()
        result = cv_parser_service.parse_cv_bytes(contents, student_id)
        return result.model_dump()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process CV: {str(e)}")
