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
  { id: "overview",   label: "Platform Overview" },
  { id: "assessment", label: "Skill Auditing" },
  { id: "readiness",  label: "Readiness Score" },
  { id: "copilot",    label: "AI Career Copilot" },
  { id: "sdg",        label: "SDG Alignment" },
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

export default function Docs({ onNavigate, user, onLogin, onLogout }: Props) {
  const [activeSection, setActiveSection] = useState("overview");
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
            <p className="font-mono text-[11px] text-text-muted mt-1">Platform Guide</p>
          </div>
        </aside>

        {/* Main content */}
        <main ref={contentRef} className="flex-1 min-w-0 px-6 md:px-12 py-10 pb-24">

          {/* Page header */}
          <div className="mb-10 pb-8 border-b border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-4 bg-border" />
              <span className="font-mono text-[11px] text-text-muted uppercase tracking-[0.14em]">Platform User Guide</span>
            </div>
            <h1 className="font-sans font-bold text-[36px] md:text-[44px] text-text-primary tracking-[-0.02em] leading-[1.1] mb-3">
              SkillForge Documentation
            </h1>
            <p className="font-sans text-[15px] text-[#71717A] leading-[26px] max-w-[520px]">
              Comprehensive guide on how to audit skills, verify technical competencies, navigate AI career roadmaps, and leverage the real-time AI Career Copilot.
            </p>
          </div>

          {/* ── Overview ── */}
          <DocSection id="overview">
            <Heading2>Platform Overview & Getting Started</Heading2>
            <Para>
              SkillForge is designed to bridge the gap between academic theory and production-readiness. This section outlines how to set up your account and begin your journey.
            </Para>

            <Heading3>Step 1: Account Creation & Authentication</Heading3>
            <Para>
              Sign in or create an account via Supabase Auth using your email credentials. You can explore the public benchmarks as a guest, or navigate directly to the interactive onboarding funnel to build your profile.
            </Para>
            <CodeBlock>{`# Authentication Flow
1. Navigate to the Landing Page
2. Click "Get Started" or "Sign In"
3. Enter email and secure password
4. Complete the 2-step onboarding wizard`}</CodeBlock>

            <Heading3>Step 2: Choosing Your Pathway</Heading3>
            <Para>
              Select from 8 specialized domains, such as Web Development, AI/ML Engineering, DevOps, Cloud Engineering, Cyber Security, Mobile App Development, Custom Software, or Game Development. After selecting a pathway, define your current experience level (ranging from Student/Beginner to Senior) to calibrate the baseline.
            </Para>

            <Divider />
          </DocSection>

          {/* ── Assessment ── */}
          <DocSection id="assessment">
            <Heading2>Skill Auditing & Assessment Flow</Heading2>
            <Para>
              Once your track is established, SkillForge evaluates your technical foundations through an adaptive onboarding funnel.
            </Para>

            <Heading3>Resume Parsing vs. Step-by-Step Selection</Heading3>
            <Para>
              Option A: Upload a PDF/DOCX resume to auto-detect skills and pre-fill your technical profile using our AI parser. 
              Option B: Manually select your target sub-track and tick known technologies from the market benchmark checklist.
            </Para>

            <Heading3>25-Question Adaptive Evaluation</Heading3>
            <Para>
              Complete 25 targeted multiple-choice questions (8 Easy, 10 Medium, 7 Hard) tailored to your chosen specialization. The engine focuses on code-based questions and conceptual problem-solving without theoretical barriers. Track your time and navigate between questions seamlessly.
            </Para>
            <CodeBlock>{`# Assessment Breakdown (25 Questions)
Difficulty Distribution:
- Easy: 8 questions (Core Syntax & Concepts)
- Medium: 10 questions (Applied Problem Solving)
- Hard: 7 questions (Architecture & Debugging)

Duration: ~30-45 minutes recommended`}</CodeBlock>

            <Divider />
          </DocSection>

          {/* ── Readiness ── */}
          <DocSection id="readiness">
            <Heading2>Understanding Your Readiness Score & Skill Gap</Heading2>
            <Para>
              Upon completing the assessment, SkillForge calculates a deterministic skill vector to highlight where you stand in the market.
            </Para>

            <Heading3>Readiness Matrix Calculation</Heading3>
            <Para>
              Your score is calculated against current 2026 industry hiring standards. The dashboard identifies "Mastered Areas" where you excel, and isolates "Critical Delta Gaps" — specific competencies requiring immediate focus before entering the interview loop.
            </Para>

            <Heading3>Automated Roadmap Generation</Heading3>
            <Para>
              Generate a phase-gated 12-week structured learning roadmap with one click. Each milestone contains focused learning objectives, documentation links, and actionable tasks tailored exactly to your Critical Delta Gaps.
            </Para>
            <CodeBlock>{`# Sample Roadmap Milestone JSON
{
  "phase": "02",
  "title": "System Architecture Foundations",
  "duration": "2 Weeks",
  "objectives": [
    "Implement caching layers with Redis",
    "Design horizontal scaling strategies"
  ],
  "status": "in_progress"
}`}</CodeBlock>

            <Divider />
          </DocSection>

          {/* ── Copilot ── */}
          <DocSection id="copilot">
            <Heading2>Interactive Career Copilot & Real-Time Mentorship</Heading2>
            <Para>
              SkillForge includes an embedded AI assistant to support you continuously throughout your generated roadmap.
            </Para>

            <Heading3>Autonomous Advisory</Heading3>
            <Para>
              Prompt the AI Career Copilot for debugging guidance, concept explanations, and recommended learning resources. All context-aware answers are grounded in modern developer documentation and your verified skill profile, ensuring you don't get generic or hallucinated advice.
            </Para>
            <CodeBlock>{`# Example Copilot Interactions
User: "How do I implement horizontal scaling for my Node app?"
Copilot: "Based on your Roadmap Phase 02, I recommend using PM2 
cluster mode or Docker Swarm. Let's look at a Docker example..."`}</CodeBlock>

            <Divider />
          </DocSection>

          {/* ── SDG ── */}
          <DocSection id="sdg">
            <Heading2>SDG Alignment & Social Impact</Heading2>
            <Para>
              SkillForge is engineered to address global systemic challenges in technical education and employment, explicitly mapping to the United Nations Sustainable Development Goals.
            </Para>

            <Heading3>SDG 4: Quality Education</Heading3>
            <Para>
              We are bridging the gap between university computer science curricula and industry hiring standards with open-access verification tools. By providing deterministic benchmarks, we ensure quality technical education is accessible to everyone.
            </Para>

            <Heading3>SDG 8: Decent Work & Economic Growth</Heading3>
            <Para>
              SkillForge eliminates "tutorial hell" and significantly reduces time-to-employment through deterministic, actionable career paths. This drives sustainable economic growth by efficiently connecting qualified talent to modern technical roles.
            </Para>
            <CodeBlock>{`# Core Impact Metrics
- Tutorial Hell Elimination: 100% focused learning
- Time-to-Employment: Reduced via actionable roadmaps
- Accessibility: Open-access benchmarks for all`}</CodeBlock>
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
