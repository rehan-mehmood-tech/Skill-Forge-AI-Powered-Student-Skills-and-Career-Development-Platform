# SkillForge — AI-Powered Student Skills & Career Development Platform

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Python 3.11](https://img.shields.io/badge/Python_3.11-14354C?style=for-the-badge&logo=python&logoColor=white)
![LangGraph](https://img.shields.io/badge/LangGraph-1C1C1C?style=for-the-badge)
![Groq Llama-3](https://img.shields.io/badge/Groq_Llama--3-F55036?style=for-the-badge)
![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=3ECF8E)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)
![Terraform](https://img.shields.io/badge/Terraform-7B42BC?style=for-the-badge&logo=terraform&logoColor=white)

## Problem Statement & Solution

**Bridging the real-world gap between academic curricula and industry skill readiness.**

Students frequently graduate without the precise, up-to-date technical skills required by modern industry roles. Educational institutions struggle to personalize guidance at scale, while students are overwhelmed by fragmented learning resources.

**SkillForge** solves this by providing an AI-native ecosystem. It leverages agentic reasoning to automatically parse a student's current competencies (via CV/Resume upload or manual entry), measures them against real-time industry role requirements, and dynamically generates a personalized, phase-by-phase learning roadmap. A persistent LangGraph-powered Career Copilot guides the student continuously, creating an autonomous, personalized mentorship loop.

## UN Sustainable Development Goals (SDG) Alignment

- **SDG 4 (Quality Education):** Personalized skill assessment and data-driven learning paths ensure inclusive and equitable quality education.
- **SDG 8 (Decent Work and Economic Growth):** Aligning student competencies directly with market demands to promote sustained, inclusive, and sustainable economic growth.
- **SDG 9 (Industry, Innovation & Infrastructure):** Autonomous AI-agentic career architecture drives technological innovation in the edtech sector.
- **SDG 10 (Reduced Inequalities):** Provides free, highly accessible, world-class career mentorship for all students regardless of geographic or socioeconomic barriers.

## System Architecture

```text
[ React Frontend (Vite / Tailwind) ]
               │
               ▼ (JWT Bearer Auth)
[ Express API Gateway (Port 5000) ]
               │
               ▼ (X-API-Key Proxy)
[ FastAPI AI Microservice (Port 8000) ]
               │
├── LangGraph Career Copilot Agent (Groq LLM)
├── Fastembed Vector Embeddings & RAG Retriever
├── Python OOP Analyzers (SkillAnalyzer, SkillGapCalculator)
└── Supabase PostgreSQL (pgvector & Auth)
```

## Key Features & User Journey

1. **Student & Admin Role-Based Dashboards:** Secure and separate experiences for learning (Students) and tracking/curation (Mentors/Admins).
2. **Automated CV/Resume PDF Parser:** Instantly extracts raw skills, education, and professional context directly from uploaded documents.
3. **Dynamic Skill Gap Diagnostic & Radar Visualization:** Translates extracted skills into continuous vector scores, rendering beautiful visual radar charts to map readiness against target roles.
4. **Generative 4-Phase Career Roadmap Engine:** Synthesizes identified skill gaps into highly structured, actionable, and dynamically generated roadmap phases.
5. **Persistent Floating Agentic Career Copilot:** A globally accessible LLM widget grounded in the user's specific context, equipped with LangGraph autonomous tools to analyze skills, search resources, generate gap analyses, and curate roadmaps dynamically.

## Complete API Documentation

### Express API Gateway (Public Interface)

| Endpoint | Method | Description | Request Payload | Response |
| :--- | :--- | :--- | :--- | :--- |
| `/api/ai/analyze-skills` | POST | Analyzes student skills against target. | `{ "student_id": "uuid", "scores": [...] }` | `{ "student_id": "...", "skill_vector": {...} }` |
| `/api/ai/generate-roadmap` | POST | Generates a 4-phase learning roadmap. | `{ "student_id": "uuid", "target_role": "string" }` | `{ "roadmap": [...], "roadmap_id": "uuid" }` |
| `/api/ai/chat-agent` | POST | Interacts with the LangGraph Copilot. | `{ "student_id": "uuid", "target_role": "string", "message": "string" }` | `{ "response": "string", "action_taken": "string" }` |
| `/api/ai/rag-query` | POST | Performs a semantic search via RAG. | `{ "query": "string", "domain": "string", "match_count": int }` | `{ "results": [...] }` |
| `/api/ai/upload-cv` | POST | Uploads & parses a resume PDF. | `multipart/form-data` (`file`, `student_id`) | `{ "extracted_skills": [...], ... }` |

### FastAPI AI Microservice (Internal/Proxy Interface)

_Note: All Internal AI routes mirror the Gateway signatures but are protected by an internal `X-API-Key`._

| Endpoint | Method | Description | Request Payload | Response |
| :--- | :--- | :--- | :--- | :--- |
| `/api/analyze-skills` | POST | Deep OOP skill vector analysis. | `AnalyzeSkillsRequest` | `{ "student_id": "...", "skill_vector": {...} }` |
| `/api/generate-roadmap` | POST | Generates roadmap using Groq LLM. | `GenerateRoadmapRequest` | `{ "roadmap": [...], "roadmap_id": "uuid" }` |
| `/api/chat-agent` | POST | Triggers LangGraph Agent Nodes. | `ChatAgentRequest` | `{ "response": "...", "action_taken": "..." }` |
| `/api/rag-query` | POST | Top-K similarity vector lookup. | `RagQueryRequest` | `{ "results": [...] }` |
| `/api/upload-cv` | POST | PyPDF Extraction & formatting. | `multipart/form-data` | CV parsing schema |

## Installation & Deployment Guide

### Prerequisites
- Node.js v18+ & Python 3.11+
- Docker & Docker Compose
- Supabase Account (for remote DB initialization)
- Groq API Key (for LLM inference)

### 1. One-Click Launch (Docker)
The easiest way to spin up the entire cluster locally is via Docker:
```bash
docker compose up --build
```
This automatically builds the client, gateway, and AI service, orchestrating their internal networking.

### 2. Manual Bootstrapping (Local)
For local development, utilize the provided cross-platform helper scripts located in the root directory:

**Windows Evaluators:**
```cmd
install_all.bat
```
**Mac/Linux Evaluators:**
```bash
./install_all.sh
```
_Note: You will need to start the three services (`npm run dev` for client/gateway and `uvicorn main:app` for FastAPI) individually in separate terminal windows after running the installer._

### 3. Production Infrastructure (DevOps)
Production environments are governed by automated Infrastructure as Code (IaC):
- **Kubernetes:** Manifests are located in `devops/k8s/` mapping deployments, load balancer services, and horizontal pod autoscalers.
- **Terraform:** Provisioning configurations for AWS EKS/ECS clusters, VPCs, and Security Groups are located in `devops/terraform/`.
