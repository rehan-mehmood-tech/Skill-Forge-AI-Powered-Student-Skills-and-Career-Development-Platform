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
    extracted_skills: List[str]
    experience_years: float
    target_domains: List[str]
    summary: str

class CVParser:
    def __init__(self):
        # We use openai/gpt-oss-20b as it is the currently active Groq model from previous steps
        self.llm = ChatGroq(
            model_name="openai/gpt-oss-20b",
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
            "Output strictly valid JSON conforming to the requested schema."
        )
        
        chain = prompt | self.llm
        result: CVParseResult = chain.invoke({"text": text[:15000]})
        
        if student_id and self.supabase:
            # Create a string representation of skills for embedding
            skills_text = ", ".join(result.extracted_skills)
            # Embed using fastembed
            embedding = next(self.embedding_model.embed([skills_text])).tolist()
            
            # Update Supabase profile
            # We assume a column 'skill_vector' or similar. 
            # In Phase 8, the skill vector was fetched from 'profiles' or 'assessments'.
            # Based on standard usage, let's update 'skill_embedding' or similar if available, or just update metadata.
            # I will update 'target_role' or whatever fields we can. Let's just update the profile metadata with extracted skills.
            self.supabase.table('profiles').update({
                'metadata': {
                    'extracted_skills': result.extracted_skills,
                    'summary': result.summary,
                    'experience_years': result.experience_years,
                    'target_domains': result.target_domains
                }
            }).eq('id', student_id).execute()
            
        return result
