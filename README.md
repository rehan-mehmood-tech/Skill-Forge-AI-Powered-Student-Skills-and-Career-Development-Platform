# 🚀 SkillForge — AI-Powered Student Career & Skill Development Platform


---

## 📌 Problem Statement
Students often know they want a career in technology but do not know what skills they are missing, what projects they should build, or how to structure their learning journey. **SkillForge** solves this by evaluating a student's current competencies and generating a practical, containerized, AI-driven development roadmap.

---

## 🏗️ System Architecture & Microservices
SkillForge uses a decoupled microservices architecture integrated via an API gateway, fully containerized and ready for production scaling.

* **Frontend:** React / Next.js UI dashboard with real-time interactive components
* **API Gateway:** Central routing layer dispatching traffic to backend modules
* **Core Services:** Auth Service, Profile API, AI Service, and Python Analyzer
* **Database Layer:** Normalized relational database with clean ER schemas

---

## 🛠️ Tech Stack

* **Backend & AI:** Python, FastAPI, LangChain, LangGraph, Groq API, Pydantic
* **Frontend:** React, Next.js, Tailwind CSS
* **Database & Cache:** PostgreSQL / Redis (Session memory & caching)
* **DevOps & Infrastructure:** Docker, Kubernetes manifests, Terraform, Linux shell scripts, GitHub Actions (CI/CD)

---

## ✨ Core Features & Modules

### 👤 Student Profile & Portfolio
* Manage complete student profiles including education, current skills, project portfolios, certifications, and target career goals.
* Upload and parse CVs/resumes automatically.

### 📝 Intelligent Skill Assessment
* Built-in assessment modules covering **Python, Web Development, Git, DevOps, AI, and Databases**.
* Generates instant quantitative scores to benchmark student proficiency.

### 🗺️ Dynamic Career Roadmap Generation
* Structured trajectory mapping: **Current Level ➔ Skill Gap ➔ Recommended Topics ➔ Projects ➔ Resources ➔ Target Role**.

### 🤖 AI Career Assistant & Agentic RAG
* **Generative AI Assistant:** Context-aware assistant answering queries like *"I know Python and basic web development. I want to become an AI engineer. What should I learn next?"*
* **RAG Engine:** Grounds all recommendations in verified technology documentation, course catalogs, and career paths.
* **Agentic Career Planning Agent:** Autonomous agent equipped with tools to analyze student skills, search learning resources, compute skill gaps, and build tailored roadmaps.

### 🔒 Role-Based Access Control (RBAC)
* **Student:** Manage personal profiles, take assessments, view roadmaps, and interact with the AI assistant.
* **Mentor / Admin:** View student profiles, review metrics, create learning assessments, and recommend resources.

---

## 🚀 DevOps & Deployment

* **Containerization:** Multi-container setup orchestrated via Docker Compose (`Dockerfile`, `docker-compose.yml`).
* **Orchestration & IaC:** Kubernetes manifests and Terraform scripts included for cloud deployment.
* **Automation:** Linux shell scripts for quick environment bootstrapping and local setup.

---

## 📋 Submission Checklist (PS-03)

* [x] Live link : https://skillforge-nine-liard.vercel.app/
* [x] GitHub Repository (`rehan-mehmood-tech`)
* [x] Live Application Deployment (Vercel / Render)
* [x] Student & Mentor Dashboards
* [x] AI Assistant & RAG Knowledge Base
* [x] Agent Implementation & Python Core Services (`SkillAnalyzer`, `SkillGapCalculator`)
* [x] Docker Files, Kubernetes Manifests & Terraform Scripts
* [x] Architecture Diagrams, Database Schema & API Documentation
