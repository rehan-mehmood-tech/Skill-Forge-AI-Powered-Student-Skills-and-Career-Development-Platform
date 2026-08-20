from typing import List, Dict, Any
from app.core.skill_gap_calculator import SkillGapCalculator

class RoadmapGenerator:
    @classmethod
    def recommend_topics(cls, gap_report: dict, available_resources: list) -> list:
        # Prioritize by gap severity using SkillGapCalculator
        priority_order = SkillGapCalculator.get_priority_order(gap_report)
        
        # We want to pull resources for CRITICAL_GAP and MODERATE_GAP
        target_domains = [p['domain'] for p in priority_order if p['category'] in ('CRITICAL_GAP', 'MODERATE_GAP')]
        
        recommended = []
        for resource in available_resources:
            if resource.get('domain') in target_domains:
                recommended.append(resource)
                
        # Sort recommended resources based on the priority of their domain
        domain_rank = {p['domain']: idx for idx, p in enumerate(priority_order)}
        
        recommended.sort(key=lambda r: domain_rank.get(r.get('domain'), 999))
        return recommended

    @classmethod
    def build_phases(cls, gap_report: dict, recommended_topics: list) -> list:
        phases = [
            {
                "phase_number": 1,
                "title": "Phase 1: Foundational Core & High-Deficit Remediation",
                "duration_weeks": 3,
                "milestones": ["Master core language syntax", "Set up local environment", "Address critical domain gaps"],
                "recommended_resources": [],
                "deliverable_project": "Basic CLI Application"
            },
            {
                "phase_number": 2,
                "title": "Phase 2: System Architecture, Concurrency & Data Flow",
                "duration_weeks": 3,
                "milestones": ["Understand async processing", "Design database schemas", "Build REST APIs"],
                "recommended_resources": [],
                "deliverable_project": "RESTful API with Database"
            },
            {
                "phase_number": 3,
                "title": "Phase 3: Applied Production Engineering & AI Tooling",
                "duration_weeks": 3,
                "milestones": ["Containerize applications", "Integrate LLM APIs", "Implement CI/CD"],
                "recommended_resources": [],
                "deliverable_project": "AI-Integrated Microservice"
            },
            {
                "phase_number": 4,
                "title": "Phase 4: Production Capstone Execution & Deployment",
                "duration_weeks": 3,
                "milestones": ["Deploy to Cloud", "Monitor performance", "Security audit"],
                "recommended_resources": [],
                "deliverable_project": "Deployed Full-Stack Application"
            }
        ]
        
        # Distribute topics across phases simply for this implementation
        for i, topic in enumerate(recommended_topics):
            phase_idx = i % 4
            phases[phase_idx]["recommended_resources"].append(topic)
            
        return phases

    @classmethod
    def generate_roadmap_payload(cls, student_id: str, target_role: str, gap_report: dict, phases: list) -> dict:
        return {
            "student_id": student_id,
            "target_role": target_role,
            "status": "active",
            "gap_summary": gap_report,
            "phases": phases,
            "version": 1,
            "generated_by": "ai-agent"
        }
