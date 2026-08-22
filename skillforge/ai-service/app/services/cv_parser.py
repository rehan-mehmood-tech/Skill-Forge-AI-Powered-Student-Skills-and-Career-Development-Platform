import io
from pypdf import PdfReader
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
import json
import os
from pydantic import BaseModel
from typing import List
from fastembed import TextEmbedding
from supabase import create_client

class CVParseResult(BaseModel):
    skills: List[str]
    current_level: str
    detected_role: str
    summary: str

class CVParser:
    def __init__(self):
        self.llm = ChatGroq(
            model_name="llama-3.3-70b-versatile",
            temperature=0.0,
            api_key=os.getenv("GROQ_API_KEY")
        ).with_structured_output(CVParseResult)
        
        self.embedding_model = TextEmbedding(model_name="BAAI/bge-base-en-v1.5")
        
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        self.supabase = create_client(supabase_url, supabase_key) if supabase_url and supabase_key else None

    def parse_cv_bytes(self, file_bytes: bytes, student_id: str = None) -> CVParseResult:
        reader = PdfReader(io.BytesIO(file_bytes))
        text = ""
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"

        prompt = PromptTemplate.from_template(
            "You are an expert HR resume parser. Analyze the following resume text and extract the required information.\n\n"
            "Resume Text:\n{text}\n\n"
            "Output strictly valid JSON conforming to the requested schema. Provide a list of technical 'skills', the 'current_level' of the candidate (e.g. Junior, Mid-level), the 'detected_role' they are aiming for or currently hold, and a brief 'summary' of their profile.\n"
            "CRITICAL: If the resume contains zero software engineering or technical skills, DO NOT hallucinate defaults. Return an empty list `[]` for skills, 'General / Undecided' for detected_role, and state 'No software engineering experience detected' in the summary."
        )
        
        chain = prompt | self.llm
        result: CVParseResult = chain.invoke({"text": text[:15000]})
        
        if student_id and student_id != "temp-id" and self.supabase:
            skills_text = ", ".join(result.skills)
            embedding = next(self.embedding_model.embed([skills_text])).tolist()
            
            self.supabase.table('profiles').update({
                'metadata': {
                    'extracted_skills': result.skills,
                    'summary': result.summary,
                    'current_level': result.current_level,
                    'detected_role': result.detected_role
                }
            }).eq('id', student_id).execute()
            
        return result
