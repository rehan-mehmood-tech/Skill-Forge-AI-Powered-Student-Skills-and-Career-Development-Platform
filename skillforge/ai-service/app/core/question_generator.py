import os
import json
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_groq import ChatGroq

class QuestionGenerator:
    @staticmethod
    def generate(domain: str, sub: str, count: int = 25) -> list:
        llm = ChatGroq(
            model_name="openai/gpt-oss-20b",
            temperature=0.7,
            api_key=os.getenv("GROQ_API_KEY")
        )
        
        sys_prompt = f"""You are an expert technical interviewer for software engineering.
Your task is to generate exactly {count} multiple-choice questions for a student specializing in {sub} ({domain}).
The questions should range in difficulty: Easy (1-8), Medium (9-18), and Hard (19-25).
Return ONLY a valid JSON array of objects. Do not include markdown code blocks, backticks, or any conversational text.
Each object must have the exact following structure:
{{
  "text": "The question text",
  "options": [
    {{"label": "A", "text": "Option A"}},
    {{"label": "B", "text": "Option B"}},
    {{"label": "C", "text": "Option C"}},
    {{"label": "D", "text": "Option D"}}
  ],
  "correctIndex": <integer 0-3>,
  "difficulty": "Easy" | "Medium" | "Hard"
}}"""
        
        try:
            response = llm.invoke([SystemMessage(content=sys_prompt), HumanMessage(content="Generate the questions now.")])
            content = response.content.strip()
            # Clean up markdown code blocks if the LLM hallucinated them despite instructions
            if content.startswith("```json"):
                content = content[7:]
            if content.startswith("```"):
                content = content[3:]
            if content.endswith("```"):
                content = content[:-3]
                
            questions = json.loads(content.strip())
            
            # Ensure it's a list and cap at count
            if not isinstance(questions, list):
                questions = [questions]
                
            return questions[:count]
            
        except Exception as e:
            print(f"Failed to generate questions: {e}")
            # Fallback mock questions in case of API failure
            return QuestionGenerator._generate_fallback(domain, sub, count)
            
    @staticmethod
    def _generate_fallback(domain: str, sub: str, count: int) -> list:
        import random
        questions = []
        for i in range(count):
            difficulty = "Easy" if i < 8 else ("Medium" if i < 18 else "Hard")
            questions.append({
                "text": f"Sample dynamic technical question {i + 1} for {sub} ({domain}). Which of the following is correct?",
                "options": [
                    {"label": "A", "text": "Option A - dynamic"},
                    {"label": "B", "text": "Option B - dynamic"},
                    {"label": "C", "text": "Option C - dynamic"},
                    {"label": "D", "text": "Option D - dynamic"},
                ],
                "correctIndex": random.randint(0, 3),
                "difficulty": difficulty
            })
        return questions
