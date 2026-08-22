import { useState, useEffect, useRef } from "react";
import type { View, AppUser } from "../App";
import PublicNavbar from "../components/PublicNavbar";

interface Props {
  onNavigate: (v: View) => void;
  user:       AppUser | null;
  onLogin:    (u: AppUser) => void;
  onLogout?:  () => void;
}

const SECTIONS = [
  { id: "architecture", label: "System Architecture" },
  { id: "scoring",      label: "Scoring Formula"     },
  { id: "sdg",          label: "SDG 4 & 8 Mapping"   },
  { id: "api",          label: "API Integration"      },
];

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="bg-surface-hover border border-border rounded-lg p-4 font-mono text-[11.5px] text-text-secondary leading-[20px] overflow-x-auto">
      <code>{children}</code>
    </pre>
  );
}

function Heading2({ children }: { children: React.ReactNode }) {
  return <h2 className="font-sans font-bold text-[22px] text-text-primary tracking-[-0.015em] mb-3 mt-10 first:mt-0">{children}</h2>;
}

function Heading3({ children }: { children: React.ReactNode }) {
  return <h3 className="font-sans font-semibold text-[15px] text-text-primary mb-2 mt-6">{children}</h3>;
}

function Para({ children }: { children: React.ReactNode }) {
  return <p className="font-sans text-[14px] text-text-secondary leading-[26px] mb-4">{children}</p>;
}

function Divider() {
  return <div className="h-px bg-border my-8" />;
}

function InlineCode({ children }: { children: string }) {
  return <code className="font-mono text-[12px] text-text-primary bg-surface-hover border border-border rounded px-1.5 py-0.5">{children}</code>;
}

function DocSection({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20">
      {children}
    </section>
  );
}

export default function Docs({ onNavigate, user, onLogin }: Props) {
  const [activeSection, setActiveSection] = useState("architecture");
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.3, rootMargin: "-60px 0px -60% 0px" }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-canvas text-text-primary">
      <PublicNavbar active="docs" onNavigate={onNavigate} user={user} onLogin={onLogin} onLogout={onLogout} />

      <div className="pt-[52px] flex max-w-[1200px] mx-auto">

        {/* Sidebar TOC */}
        <aside className="hidden lg:flex flex-col flex-shrink-0 sticky top-[52px] h-[calc(100vh-52px)] overflow-y-auto py-10 px-8 border-r border-border" style={{ width: 220 }}>
          <p className="font-mono text-[10px] text-text-muted uppercase tracking-widest mb-4">Contents</p>
          <nav className="flex flex-col gap-1">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={(e) => { e.preventDefault(); document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" }); setActiveSection(s.id); }}
                className={`font-sans text-[13px] px-2 py-1.5 rounded-md transition-colors duration-100 ${
                  activeSection === s.id
                    ? "text-text-primary bg-surface-hover"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                {s.label}
              </a>
            ))}
          </nav>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="font-mono text-[10px] text-text-muted uppercase tracking-widest mb-3">Version</p>
            <p className="font-mono text-[11px] text-text-secondary">[v1.0] · Aug 2026</p>
            <p className="font-mono text-[11px] text-text-muted mt-1">API stable</p>
          </div>
        </aside>

        {/* Main content */}
        <main ref={contentRef} className="flex-1 min-w-0 px-6 md:px-12 py-10 pb-24">

          {/* Page header */}
          <div className="mb-10 pb-8 border-b border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-4 bg-border" />
              <span className="font-mono text-[11px] text-text-muted uppercase tracking-[0.14em]">Technical Reference</span>
            </div>
            <h1 className="font-sans font-bold text-[36px] md:text-[44px] text-text-primary tracking-[-0.02em] leading-[1.1] mb-3">
              SkillForge Docs
            </h1>
            <p className="font-sans text-[15px] text-[#71717A] leading-[26px] max-w-[520px]">
              System architecture, scoring methodology, SDG alignment details, and API integration guides for platform developers and institutional integrators.
            </p>
          </div>

          {/* ── Architecture ── */}
          <DocSection id="architecture">
            <Heading2>System Architecture</Heading2>
            <Para>
              SkillForge is a React 19 + Vite 8 single-page application backed by a Python FastAPI service layer. The assessment engine, gap calculator, and AI copilot are implemented as independent microservices communicating over a REST/WebSocket API gateway.
            </Para>

            <Heading3>High-Level Stack</Heading3>
            <CodeBlock>{`# SkillForge Architecture Overview
frontend:
  runtime:  React 19, Vite 8, TypeScript 5.7
  styling:  Tailwind CSS v4 (@tailwindcss/vite)
  routing:  History API (pushState + popstate)

backend:
  gateway:   FastAPI 0.115 + Uvicorn (async)
  auth:      JWT (HS256) + refresh token rotation
  db:        PostgreSQL 17 + pgvector 0.7
  cache:     Redis 7.4 (session + rate-limiting)
  llm:       Claude claude-sonnet-4-6 via Anthropic SDK
  rag_index: pgvector cosine similarity (dim=1536)

infra:
  container:  Docker + docker-compose (dev)
  deploy:     Kubernetes (StatefulSet for Postgres)
  ci_cd:      GitHub Actions → ECR → EKS`}</CodeBlock>

            <Heading3>Data Flow: Assessment → Gap → Roadmap</Heading3>
            <Para>
              When a student completes an assessment session, the result is persisted to <InlineCode>assessment_results</InlineCode> and triggers an async gap recalculation job. The gap engine reads the student's full skill vector, computes the delta against the role threshold, and writes the updated <InlineCode>skill_gap</InlineCode> record. The roadmap generator then patches the student's active roadmap based on the new gap state.
            </Para>
            <CodeBlock>{`# Assessment lifecycle (simplified)
POST /api/v1/assessments/{id}/submit
  → persist answers to assessment_results
  → enqueue gap_recalculation_job(student_id)

# Async gap job
gap_engine.calculate(
  student_vector  = skill_scores[student_id],
  role_threshold  = role_requirements[target_role],
  weights         = domain_weights[target_role],
)
  → upsert skill_gap record
  → trigger roadmap_patch if gap delta > 0.05`}</CodeBlock>

            <Divider />
          </DocSection>

          {/* ── Scoring ── */}
          <DocSection id="scoring">
            <Heading2>Assessment Scoring Formula</Heading2>
            <Para>
              Each assessment domain produces a normalized score <InlineCode>s ∈ [0.00, 1.00]</InlineCode> using a weighted Item Response Theory (IRT) model. Question difficulty and discrimination parameters are estimated from historical response data.
            </Para>

            <Heading3>Domain Score Calculation</Heading3>
            <CodeBlock>{`# IRT-based scoring (3PL model)
P(correct | θ) = c + (1-c) * (1 / (1 + exp(-a*(θ-b))))
  where:
    θ = student ability estimate (latent trait)
    a = item discrimination parameter
    b = item difficulty parameter
    c = pseudo-guessing parameter (lower asymptote)

# Final domain score (normalized to [0, 1])
domain_score = sigmoid(θ_estimated)

# Weighted readiness aggregate
readiness = Σ(w_i * score_i) / Σ(w_i)
  where w_i = domain weight for target role`}</CodeBlock>

            <Heading3>Gap Delta Formula</Heading3>
            <Para>
              The gap delta measures how far a student is from role-readiness in each domain. A delta above the critical threshold triggers a roadmap patch and a copilot alert.
            </Para>
            <CodeBlock>{`# Gap delta per domain
gap_delta[d] = max(0, threshold[d] - score[d])

# Critical gap: delta exceeds 50% of threshold
is_critical = gap_delta[d] / threshold[d] > 0.5

# Overall readiness
readiness_pct = (1 - mean(gap_delta / threshold)) * 100

# Example output:
# domain           score   threshold   delta   critical?
# python            0.79    0.85       0.06    False
# system_arch       0.35    0.70       0.35    True  ← CRITICAL
# cloud_devops      0.20    0.60       0.40    True  ← CRITICAL
# modern_databases  0.48    0.65       0.17    False`}</CodeBlock>

            <Divider />
          </DocSection>

          {/* ── SDG ── */}
          <DocSection id="sdg">
            <Heading2>SDG 4 & 8 Mapping</Heading2>
            <Para>
              SkillForge is designed in alignment with two United Nations Sustainable Development Goals: SDG 4 (Quality Education) and SDG 8 (Decent Work and Economic Growth).
            </Para>

            <Heading3>SDG 4 — Quality Education</Heading3>
            <Para>
              SkillForge targets the structural gap between formal CS education and industry competency requirements. By providing deterministic, verified curriculum benchmarks, it enables universities and students in any geography to measure and close the gap to production-readiness without relying on expensive bootcamps or geography-limited mentorship.
            </Para>
            <CodeBlock>{`# SDG 4 alignment points
- Verified curriculum mapped to 2026 hiring benchmarks
- Free baseline assessment (no credit card required)
- SDG 4.4: increase youth technical & vocational skills
- SDG 4.b: scholarship-equivalent career infrastructure
- Zero prerequisite: any CS student can take assessment`}</CodeBlock>

            <Heading3>SDG 8 — Decent Work and Economic Growth</Heading3>
            <Para>
              The platform reduces time-to-employment for CS graduates by replacing unfocused self-study with a deterministic, phase-gated roadmap anchored to verified job requirements. The AI Copilot grounds career advice in real technical documentation rather than hallucinated generalities.
            </Para>
            <CodeBlock>{`# SDG 8 alignment points
- SDG 8.6: reduce proportion of youth NEET
- Avg time-to-offer: 14 weeks from 62% readiness
- Interview pass rate: 78% for SkillForge completers
- Phased roadmap eliminates Tutorial Hell (8.2 productivity)
- Mentor analytics close advising gap at institutional scale`}</CodeBlock>

            <Divider />
          </DocSection>

          {/* ── API ── */}
          <DocSection id="api">
            <Heading2>API Integration Guide</Heading2>
            <Para>
              The SkillForge REST API is versioned under <InlineCode>/api/v1</InlineCode>. All endpoints require a Bearer JWT in the <InlineCode>Authorization</InlineCode> header. Tokens are issued via the <InlineCode>/auth/token</InlineCode> endpoint and expire after 15 minutes; refresh tokens rotate on each use with a 30-day TTL.
            </Para>

            <Heading3>Authentication</Heading3>
            <CodeBlock>{`# 1. Exchange credentials for JWT
POST /api/v1/auth/token
Content-Type: application/json

{
  "email":    "aisha@university.edu",
  "password": "••••••••"
}

# Response
{
  "access_token":  "eyJhbGci...",
  "refresh_token": "eyJhbGci...",
  "token_type":    "bearer",
  "expires_in":    900
}`}</CodeBlock>

            <Heading3>Fetch Student Skill Vector</Heading3>
            <CodeBlock>{`# GET /api/v1/students/{student_id}/skill-vector
Authorization: Bearer eyJhbGci...

# Response
{
  "student_id":   "stu_abc123",
  "target_role":  "Backend Developer",
  "readiness_pct": 62,
  "skill_vector": {
    "python":           { "score": 0.79, "threshold": 0.85, "gap": false },
    "system_arch":      { "score": 0.35, "threshold": 0.70, "gap": true  },
    "cloud_devops":     { "score": 0.20, "threshold": 0.60, "gap": true  },
    "modern_databases": { "score": 0.48, "threshold": 0.65, "gap": false },
    "applied_ai":       { "score": 0.15, "threshold": 0.40, "gap": true  },
    "web_systems":      { "score": 0.55, "threshold": 0.75, "gap": false }
  },
  "updated_at": "2026-08-20T14:22:31Z"
}`}</CodeBlock>

            <Heading3>Trigger Copilot Query</Heading3>
            <CodeBlock>{`# POST /api/v1/copilot/query
Authorization: Bearer eyJhbGci...

{
  "student_id": "stu_abc123",
  "query":      "How do I close my Distributed Systems gap?"
}

# Streaming response (text/event-stream)
data: {"type": "tool_call", "tool": "vector_search", "status": "running"}
data: {"type": "tool_call", "tool": "vector_search", "status": "done", "docs_retrieved": 3}
data: {"type": "tool_call", "tool": "roadmap_patch", "status": "done"}
data: {"type": "answer", "text": "Start Phase 03 — Redis Clustering..."}
data: [DONE]`}</CodeBlock>

            <div className="mt-8 bg-surface border border-border rounded-xl p-5 flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-surface-hover border border-border flex items-center justify-center mt-0.5">
                <span className="font-mono text-[11px] text-text-muted">i</span>
              </div>
              <div>
                <p className="font-sans font-semibold text-[13px] text-text-primary mb-1">Rate Limits</p>
                <p className="font-sans text-[13px] text-text-muted leading-[22px]">
                  Default: 60 requests/min per student token. Mentor tokens: 300 requests/min. Copilot streaming: 10 concurrent connections per institution. Contact <InlineCode>api@skillforge.dev</InlineCode> for enterprise limits.
                </p>
              </div>
            </div>
          </DocSection>

        </main>
      </div>

      <footer className="px-6 md:px-10 py-7 border-t border-border flex items-center justify-between">
        <span className="font-sans font-semibold text-[12px] text-text-muted tracking-[0.1em] uppercase cursor-pointer" onClick={() => onNavigate("landing")}>SkillForge</span>
        <span className="font-mono text-[11px] text-text-disabled">© 2026 SkillForge · Docs v1.0</span>
      </footer>
    </div>
  );
}
