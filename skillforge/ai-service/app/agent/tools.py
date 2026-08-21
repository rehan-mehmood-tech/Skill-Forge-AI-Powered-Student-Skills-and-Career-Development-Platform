import os
import json
from typing import Optional
from dotenv import load_dotenv
from langchain_core.tools import tool
from supabase import create_client, Client
from app.core.skill_gap_calculator import SkillGapCalculator
from app.core.roadmap_generator import RoadmapGenerator
from app.rag.retriever import KnowledgeBaseRetriever

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if SUPABASE_URL and SUPABASE_KEY:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
else:
    supabase = None

@tool
def analyze_student_skills(student_id: str) -> str:
    """Fetches assessment results or skill vector from Supabase and returns structured skill breakdown."""
    if not supabase:
        return "Error: Supabase client not initialized."
    
    res = supabase.table("profiles").select("skill_vector").eq("id", student_id).execute()
    if not res.data:
        return f"No profile found for student_id: {student_id}"
        
    skill_vector = res.data[0].get("skill_vector", {})
    if not skill_vector:
        return "Student has no skills recorded yet."
        
    return f"Student Skill Vector: {json.dumps(skill_vector, indent=2)}"

@tool
def calculate_gap(student_id: str, target_role: str) -> str:
    """Compares the student's current skill profile against the target role benchmark and returns missing skills with priority weights."""
    if not supabase:
        return "Error: Supabase client not initialized."
        
    res = supabase.table("profiles").select("skill_vector").eq("id", student_id).execute()
    if not res.data:
        return f"No profile found for student_id: {student_id}"
        
    skill_vector = res.data[0].get("skill_vector", {})
    
    gap_report = SkillGapCalculator.identify_gaps(skill_vector, target_role)
    priority_order = SkillGapCalculator.get_priority_order(gap_report)
    
    return json.dumps({
        "gap_report": gap_report,
        "priority_order": priority_order
    }, indent=2)

@tool
def search_knowledge_base(query: str, domain: Optional[str] = None) -> str:
    """Invokes KnowledgeBaseRetriever to search the knowledge base."""
    retriever = KnowledgeBaseRetriever()
    chunks = retriever.retrieve_relevant_chunks(query, domain=domain, top_k=3)
    
    if not chunks:
        return "No relevant knowledge found."
        
    formatted = []
    for chunk in chunks:
        title = chunk.get("metadata", {}).get("title", "Unknown Source")
        content = chunk.get("content", "")
        formatted.append(f"Source: {title}\nContent:\n{content}\n")
        
    return "\n---\n".join(formatted)

@tool
def generate_roadmap(student_id: str, target_role: str, gap_summary: str) -> str:
    """Builds a 4-phase structured action plan and inserts the generated roadmap into Supabase roadmaps table."""
    if not supabase:
        return "Error: Supabase client not initialized."
        
    res = supabase.table("profiles").select("skill_vector").eq("id", student_id).execute()
    skill_vector = res.data[0].get("skill_vector", {}) if res.data else {}
    gap_report = SkillGapCalculator.identify_gaps(skill_vector, target_role)
    
    resources_res = supabase.table("learning_resources").select("*").eq("is_active", True).execute()
    available_resources = resources_res.data if resources_res.data else []
    
    recommended_topics = RoadmapGenerator.recommend_topics(gap_report, available_resources)
    phases = RoadmapGenerator.build_phases(gap_report, recommended_topics)
    
    insert_res = supabase.table("roadmaps").insert({
        "student_id": student_id,
        "target_role": target_role,
        "status": "active",
        "gap_summary": gap_report,
        "phases": phases,
        "generated_by": "ai-agent"
    }).execute()
    
    if insert_res.data:
        return f"Successfully generated and saved roadmap with ID: {insert_res.data[0].get('id')}\nRoadmap Summary:\n{json.dumps(phases, indent=2)}"
    else:
        return "Failed to save roadmap to database."
