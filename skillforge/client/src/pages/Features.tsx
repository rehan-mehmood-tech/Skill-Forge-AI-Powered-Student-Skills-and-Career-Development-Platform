import { useState } from "react";
import type { View, AppUser } from "../App";
import PublicNavbar from "../components/PublicNavbar";
import AuthModal from "../components/AuthModal";

interface Props {
  onNavigate: (v: View) => void;
  user:       AppUser | null;
  onLogin:    (u: AppUser) => void;
  onLogout?:  () => void;
}

function SectionTag({ n, label }: { n: string; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="font-mono text-[11px] text-text-muted tabular-nums">{n}</span>
      <div className="h-px w-5 bg-border" />
      <span className="font-mono text-[11px] text-text-muted tracking-[0.1em] uppercase">{label}</span>
    </div>
  );
}

const ENGINES = [
  {
    id:    "matrix",
    step:  "Engine 01",
    title: "Multi-Domain Skill Matrix Analyzer",
    desc:  "A structured 6-domain assessment engine that maps your competency across Python, System Architecture, Cloud/DevOps, Databases, Applied AI, and Web Systems. Each domain produces a weighted score between 0.00 and 1.00, calibrated against verified 2026 hiring benchmarks.",
    specs: [
      "30–45 adaptive questions per domain",
      "Difficulty calibrated via IRT (Item Response Theory)",
      "Scores update in real time against target role threshold",
      "Visual matrix with gap delta indicators",
    ],
    codeLines: [
      { c: "#52525B", t: "# skill_matrix_analyzer.py" },
      { c: "#A1A1AA", t: "domains = [" },
      { c: "#FAFAFA", t: '  "python",          "system_arch",' },
      { c: "#FAFAFA", t: '  "cloud_devops",     "modern_databases",' },
      { c: "#FAFAFA", t: '  "applied_ai",       "web_systems",' },
      { c: "#A1A1AA", t: "]" },
      { c: "#A1A1AA", t: "" },
      { c: "#22C55E", t: "result = analyzer.run(student_id, domains)" },
      { c: "#52525B", t: "# → { python: 0.79, cloud: 0.20, ... }" },
    ],
  },
  {
    id:    "gap",
    step:  "Engine 02",
    title: "Phased Vector Gap Calculator",
    desc:  "Computes the mathematical delta between your current skill vector and the verified industry threshold for your target role. Outputs a quantified readiness score, critical gap list, and a time-to-close estimate per domain.",
    specs: [
      "cosine similarity against role-requirement vectors",
      "Weighted by domain criticality for target role",
      "Time-to-close estimate per gap domain",
      "Regenerates after every assessment session",
    ],
    codeLines: [
      { c: "#52525B", t: "# gap_calculator.py" },
      { c: "#A1A1AA", t: "delta = gap_engine.calculate(" },
      { c: "#FAFAFA", t: '  student_vector  = {0.79, 0.35, 0.20},' },
      { c: "#FAFAFA", t: '  role_threshold  = {0.85, 0.70, 0.60},' },
      { c: "#FAFAFA", t: '  weights         = [0.3,  0.4,  0.3],' },
      { c: "#A1A1AA", t: ")" },
      { c: "#A1A1AA", t: "" },
      { c: "#EF4444", t: '# → gap: 0.38  [CRITICAL: cloud_devops]' },
    ],
  },
  {
    id:    "roadmap",
    step:  "Engine 03",
    title: "Interactive Vertical Roadmap Generator",
    desc:  "Generates a phase-gated learning sequence based on your gap delta. Phases unlock progressively — each milestone comes with a verified capstone project spec sourced from real system design literature.",
    specs: [
      "Phase-gated: each milestone requires gap closure",
      "Project specs sourced from ACM & official docs",
      "Roadmap regenerates after every assessment",
      "Export to PDF or share as public link",
    ],
    codeLines: [
      { c: "#52525B", t: "# roadmap_generator.py" },
      { c: "#A1A1AA", t: "roadmap = generator.build(" },
      { c: "#FAFAFA", t: '  gap_vector = student.gap_delta,' },
      { c: "#FAFAFA", t: '  target     = "Backend Developer",' },
      { c: "#FAFAFA", t: '  style      = "phase_gated",' },
      { c: "#A1A1AA", t: ")" },
      { c: "#A1A1AA", t: "" },
      { c: "#22C55E", t: "# → 4 phases, 28 topics, 4 capstone specs" },
    ],
  },
  {
    id:    "copilot",
    step:  "Engine 04",
    title: "RAG-Powered AI Copilot Drawer",
    desc:  "An agentic AI career advisor that operates exclusively on verified technical documentation. It retrieves context from your skill vector, queries curated engineering sources via pgvector, and returns grounded recommendations — never generic hallucinations.",
    specs: [
      "Retrieval-Augmented Generation (RAG) over verified docs",
      "pgvector semantic search across 240+ curated resources",
      "Every answer cites traceable ACM or official sources",
      "Roadmap auto-patches after copilot recommendations",
    ],
    codeLines: [
      { c: "#52525B", t: "# rag_copilot.py" },
      { c: "#A1A1AA", t: 'query = "Close my Distributed Systems gap"' },
      { c: "#A1A1AA", t: "" },
      { c: "#52525B", t: "> vector_search(pgvector)..." },
      { c: "#52525B", t: "> retrieved 3 docs from ACM & specs" },
      { c: "#52525B", t: "> roadmap_patch(milestone: Redis Cluster)" },
      { c: "#22C55E", t: "✓ updated in 1.8s · zero hallucinations" },
    ],
  },
];

function EngineCard({ engine, onNavigate, user, onLogin }: {
  engine:     typeof ENGINES[0];
  onNavigate: (v: View) => void;
  user:       AppUser | null;
  onLogin:    (u: AppUser) => void;
}) {
  const [auth, setAuth] = useState(false);

  function handleCTA() {
    if (user) {
      onNavigate("assessment");
    } else {
      setAuth(true);
    }
  }

  return (
    <div className="border-t border-border pt-10 pb-10">
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Left: text */}
        <div>
          <SectionTag n={engine.step} label="Platform Engine" />
          <h2 className="font-sans font-bold text-[28px] md:text-[34px] text-text-primary tracking-[-0.02em] leading-[1.1] mb-4">
            {engine.title}
          </h2>
          <p className="font-sans text-[14px] text-text-secondary leading-[24px] mb-6">
            {engine.desc}
          </p>
          <div className="flex flex-col gap-2 mb-7">
            {engine.specs.map((s) => (
              <div key={s} className="flex gap-2.5 items-start">
                <span className="font-mono text-[10px] text-success mt-0.5 flex-shrink-0">✓</span>
                <span className="font-sans text-[13px] text-text-secondary">{s}</span>
              </div>
            ))}
          </div>
          <button
            onClick={handleCTA}
            className="btn-cta h-10 px-5 rounded-lg bg-white text-black text-[13px] font-semibold hover:bg-zinc-100 cursor-pointer"
          >
            Try This Engine →
          </button>
        </div>

        {/* Right: code widget */}
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="h-8 bg-surface-hover border-b border-border flex items-center px-3 gap-2">
            <div className="flex gap-1.5">{[0,1,2].map((i) => <div key={i} className="w-2 h-2 rounded-full bg-border" />)}</div>
            <span className="font-mono text-[10px] text-text-muted flex-1 text-center">{engine.id}.py — SkillForge</span>
          </div>
          <div className="bg-surface p-4 font-mono text-[11.5px] leading-[20px]">
            {engine.codeLines.map((line, i) =>
              line.t === "" ? <div key={i} style={{ height: 20 }} /> :
              <div key={i} className="whitespace-pre" style={{ color: line.c }}>{line.t}</div>
            )}
          </div>
        </div>
      </div>

      {auth && (
        <AuthModal
          onClose={() => setAuth(false)}
          onNavigate={onNavigate}
          onLogin={onLogin}
          message="Sign in to access personalized assessments and roadmaps"
          redirectTo="dashboard"
        />
      )}
    </div>
  );
}

export default function Features({ onNavigate, user, onLogin, onLogout }: Props) {
  return (
    <div className="min-h-screen bg-canvas text-text-primary">
      <PublicNavbar active="features" onNavigate={onNavigate} user={user} onLogin={onLogin} onLogout={onLogout} />

      {/* Hero */}
      <div className="pt-[88px] pb-12 px-6 md:px-10 max-w-[1080px] mx-auto">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-px w-4 bg-border" />
          <span className="font-mono text-[11px] text-text-muted uppercase tracking-[0.14em]">Platform Capabilities</span>
        </div>
        <h1 className="font-sans font-bold text-[42px] md:text-[56px] text-text-primary tracking-[-0.025em] leading-[1.05] mb-4">
          Four Engines.<br />
          <span className="text-text-secondary">One Accurate Career Delta.</span>
        </h1>
        <p className="font-sans text-[15px] text-[#71717A] leading-[27px] max-w-[560px]">
          Each engine in the SkillForge platform operates independently and in sequence — producing a deterministic, measurable, actionable output. No black boxes. No generic advice.
        </p>
      </div>

      {/* Engine sections */}
      <div className="px-6 md:px-10 max-w-[1080px] mx-auto pb-20">
        {ENGINES.map((engine) => (
          <EngineCard key={engine.id} engine={engine} onNavigate={onNavigate} user={user} onLogin={onLogin} />
        ))}
      </div>

      <footer className="px-6 md:px-10 py-7 border-t border-border flex items-center justify-between">
        <span className="font-sans font-semibold text-[12px] text-text-muted tracking-[0.1em] uppercase cursor-pointer" onClick={() => onNavigate("landing")}>SkillForge</span>
        <span className="font-mono text-[11px] text-text-disabled">© 2026 SkillForge</span>
      </footer>
    </div>
  );
}
