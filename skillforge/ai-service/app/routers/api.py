from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import Optional, Dict, Any, List
import json
from langchain_core.messages import HumanMessage

from app.core.skill_analyzer import SkillAnalyzer
from app.core.roadmap_generator import RoadmapGenerator
from app.core.skill_gap_calculator import SkillGapCalculator
from app.core.question_generator import QuestionGenerator
from app.rag.retriever import KnowledgeBaseRetriever
from app.agent.graph import app_graph
from app.agent.tools import supabase
from app.services.cv_parser import CVParser

from pydantic import BaseModel
from app.schemas import AnalyzeSkillsRequest, GenerateRoadmapRequest, ChatAgentRequest, RagQueryRequest

class AssessmentQuestionsRequest(BaseModel):
    domain: str
    sub: str
    student_id: Optional[str] = None

router = APIRouter(prefix="/api", tags=["core_api"])
cv_parser_service = None

def get_cv_parser():
    global cv_parser_service
    if cv_parser_service is None:
        cv_parser_service = CVParser()
    return cv_parser_service


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

@router.post("/assessment/questions")
async def generate_assessment_questions(req: AssessmentQuestionsRequest):
    try:
        questions = QuestionGenerator.generate(domain=req.domain, sub=req.sub, count=25)
        return {"questions": questions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-roadmap")
async def generate_roadmap_endpoint(req: GenerateRoadmapRequest):
    try:
        skill_vector = {}
        overall_readiness = 0
        if req.answers:
            correct_count = sum(1 for a in req.answers if a.get("isCorrect"))
            total = len(req.answers)
            overall_readiness = round((correct_count / total) * 100) if total > 0 else 0
            
            skill_vector = {
                "python": min(1.0, (overall_readiness / 100.0) + 0.1),
                "system_arch": max(0.0, (overall_readiness / 100.0) - 0.2),
                "cloud_devops": max(0.0, (overall_readiness / 100.0) - 0.3)
            }
        else:
            res = supabase.table("profiles").select("skill_vector", "overall_readiness").eq("id", req.student_id).execute()
            if res.data:
                skill_vector = res.data[0].get("skill_vector", {})
                overall_readiness = res.data[0].get("overall_readiness", 0)

        # Update profile with newly calculated metrics
        if req.student_id and req.student_id != "temp-id":
            supabase.table("profiles").update({
                "skill_vector": skill_vector,
                "overall_readiness": overall_readiness,
                "target_role": req.target_role,
                "active_phase": "Phase 1: Foundations"
            }).eq("id", req.student_id).execute()
            
        gap_report = SkillGapCalculator.identify_gaps(skill_vector, req.target_role)
        
        # Groq LLM Roadmap Generation
        from langchain_groq import ChatGroq
        from langchain_core.messages import SystemMessage, HumanMessage
        import os
        
        llm = ChatGroq(
            model_name="llama-3.3-70b-versatile",
            temperature=0.2,
            api_key=os.getenv("GROQ_API_KEY")
        )
        
        sys_prompt = f"""You are an expert career advisor and technical architect.
Generate a structured 12-week study roadmap for a student targeting the role of '{req.target_role}' with experience level '{req.experience_level}'.
The student's weak skills are: {', '.join(req.weak_skills) if hasattr(req, 'weak_skills') and req.weak_skills else 'general topics'}.
The roadmap MUST consist of exactly 4 phases tailored specifically to the '{req.target_role}' domain:
- Phase 1: Foundations (Weeks 1-3)
- Phase 2: Domain-Specific Architecture (Weeks 4-6)
- Phase 3: Advanced Topics & Tools (Weeks 7-9)
- Phase 4: Production & Scale (Weeks 10-12)

Return ONLY a valid JSON array of 4 phase objects. Do not include markdown code blocks, backticks, or any conversational text.
Each phase object must have the exact following structure:
[{{
  "title": "Phase title",
  "topics": [
    {{
      "name": "Topic Name",
      "projects": ["Project description 1"],
      "resources": [
        {{"type": "course", "title": "Resource title"}}
      ]
    }}
  ]
}}]"""

        try:
            response = llm.invoke([
                SystemMessage(content=sys_prompt), 
                HumanMessage(content="Generate the 12-week roadmap JSON now.")
            ])
            content = response.content.strip()
            if content.startswith("```json"):
                content = content[7:]
            if content.startswith("```"):
                content = content[3:]
            if content.endswith("```"):
                content = content[:-3]
            phases = json.loads(content.strip())
            
            # Ensure it is a list of 4 items
            if not isinstance(phases, list) or len(phases) != 4:
                raise ValueError("Invalid phase format from LLM")
        except Exception as llm_err:
            # Safe fallback
            phases = [
                {
                    "title": "Phase 1: Foundations",
                    "topics": [
                        {
                            "name": f"Master core syntax for {req.target_role}",
                            "projects": [f"Command-line script demonstrating {req.target_role} features"],
                            "resources": [{"type": "docs", "title": "Official Documentation"}]
                        },
                        {
                            "name": "Data Structures & Algorithms",
                            "projects": ["Implement a custom stack/queue"],
                            "resources": [{"type": "course", "title": "Data Structures - FreeCodeCamp"}]
                        }
                    ]
                },
                {
                    "title": "Phase 2: Core Architecture",
                    "topics": [
                        {
                            "name": "REST API & Authentication",
                            "projects": ["Build a REST API with JWT Auth"],
                            "resources": [{"type": "article", "title": "RESTful Design Principles"}]
                        },
                        {
                            "name": "Database Integration",
                            "projects": ["Connect PostgreSQL and implement ORM"],
                            "resources": [{"type": "course", "title": "SQL and Database Design"}]
                        }
                    ]
                },
                {
                    "title": "Phase 3: Production/Scale",
                    "topics": [
                        {
                            "name": "Containerization (Docker)",
                            "projects": ["Dockerize the API service"],
                            "resources": [{"type": "docs", "title": "Docker Getting Started"}]
                        },
                        {
                            "name": "CI/CD & Deployment",
                            "projects": ["Deploy API via GitHub Actions"],
                            "resources": [{"type": "article", "title": "CI/CD Best Practices"}]
                        }
                    ]
                }
            ]
            
        roadmap_payload = RoadmapGenerator.generate_roadmap_payload(req.student_id, req.target_role, gap_report, phases)
        
        insert_res = supabase.table("roadmaps").insert(roadmap_payload).execute()
        
        return {"roadmap": phases, "roadmap_id": insert_res.data[0].get("id") if insert_res.data else None}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat-agent")
async def chat_agent(req: ChatAgentRequest):
    try:
        from langchain_core.messages import AIMessage, HumanMessage
        messages = []
        if req.conversation_history:
            for msg in req.conversation_history:
                if msg.get("role") == "user":
                    messages.append(HumanMessage(content=msg.get("content", "")))
                elif msg.get("role") == "assistant":
                    messages.append(AIMessage(content=msg.get("content", "")))
        messages.append(HumanMessage(content=req.message))

        state = {
            "messages": messages,
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
        parser = get_cv_parser()
        result = parser.parse_cv_bytes(contents, student_id)
        return result.model_dump()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process CV: {str(e)}")
