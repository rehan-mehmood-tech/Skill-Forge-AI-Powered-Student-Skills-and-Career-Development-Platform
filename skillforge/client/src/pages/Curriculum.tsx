import { useState } from "react";
import type { View, AppUser } from "../App";
import PublicNavbar from "../components/PublicNavbar";
import AuthModal from "../components/AuthModal";

interface Props {
  onNavigate: (v: View) => void;
  user:       AppUser | null;
  onLogin:    (u: AppUser) => void;
}

const DIFFICULTY_COLOR = {
  Beginner:     "text-success border-success",
  Intermediate: "text-warning border-warning",
  Advanced:     "text-danger  border-danger",
} as const;

const DOMAINS = [
  {
    id:         "python",
    title:      "Python OOP & Algorithms",
    difficulty: "Intermediate" as const,
    weeks:      8,
    modules:    24,
    pct:        79,
    sample:     "Build a thread-safe LRU cache with O(1) get/put using doubly-linked list + hashmap.",
    tags:       ["OOP", "Data Structures", "Concurrency", "Testing"],
    desc:       "From Python fundamentals to production-grade object-oriented design. Covers data structures, algorithmic complexity, threading, and unit testing.",
  },
  {
    id:         "web",
    title:      "Web Systems & REST APIs",
    difficulty: "Intermediate" as const,
    weeks:      6,
    modules:    18,
    pct:        55,
    sample:     "Design an async REST API with FastAPI, JWT auth, rate limiting, and OpenAPI documentation.",
    tags:       ["FastAPI", "REST", "Auth", "OpenAPI"],
    desc:       "HTTP internals, REST design principles, authentication patterns, async frameworks, and API testing strategies for production-grade web services.",
  },
  {
    id:         "git",
    title:      "Git Workflows & Collaboration",
    difficulty: "Beginner" as const,
    weeks:      2,
    modules:    8,
    pct:        45,
    sample:     "Implement a GitFlow branching strategy for a team of 5 with automated PR checks.",
    tags:       ["Git", "GitFlow", "CI Integration", "Code Review"],
    desc:       "Version control fundamentals, branching strategies, merge conflict resolution, and integrating Git with CI/CD pipelines.",
  },
  {
    id:         "devops",
    title:      "Cloud Infrastructure & DevOps",
    difficulty: "Advanced" as const,
    weeks:      10,
    modules:    28,
    pct:        20,
    sample:     "Deploy a 3-node PostgreSQL cluster on Kubernetes with StatefulSets and automated failover.",
    tags:       ["Docker", "Kubernetes", "Terraform", "CI/CD"],
    desc:       "Containerization, orchestration, infrastructure-as-code, CI/CD pipelines, and observability across AWS/GCP cloud environments.",
  },
  {
    id:         "ai",
    title:      "Applied AI & ML Systems",
    difficulty: "Advanced" as const,
    weeks:      12,
    modules:    32,
    pct:        15,
    sample:     "Implement a RAG pipeline with pgvector, FastAPI, and streaming LLM responses.",
    tags:       ["PyTorch", "RAG", "pgvector", "MLOps"],
    desc:       "Machine learning fundamentals, neural network architectures, vector databases, RAG pipelines, and deploying models to production with monitoring.",
  },
  {
    id:         "databases",
    title:      "Modern Database Engineering",
    difficulty: "Intermediate" as const,
    weeks:      6,
    modules:    20,
    pct:        48,
    sample:     "Design a normalized e-commerce schema, optimize N+1 queries, and benchmark index strategies.",
    tags:       ["PostgreSQL", "Redis", "Indexing", "Query Optimization"],
    desc:       "Relational modeling, query optimization, indexing strategies, caching with Redis, and choosing between SQL and NoSQL for production systems.",
  },
];

function DomainCard({ domain, onNavigate, user, onLogin }: {
  domain:     typeof DOMAINS[0];
  onNavigate: (v: View) => void;
  user:       AppUser | null;
  onLogin:    (u: AppUser) => void;
}) {
  const [auth, setAuth] = useState(false);
  const [mode, setMode] = useState<"enroll" | "test" | null>(null);

  function handleCTA(m: "enroll" | "test") {
    if (user) { onNavigate("assessments"); return; }
    setMode(m);
    setAuth(true);
  }

  return (
    <div className="bg-surface border border-border rounded-xl p-5 flex flex-col gap-4 card-hover transition-all duration-150">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-sans font-semibold text-[14px] text-text-primary leading-snug">{domain.title}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className={`font-mono text-[10px] border rounded-md px-1.5 py-0.5 ${DIFFICULTY_COLOR[domain.difficulty]}`}>
              [{domain.difficulty}]
            </span>
            <span className="font-mono text-[10px] text-text-muted">{domain.weeks}w · {domain.modules} modules</span>
          </div>
        </div>
        <span className="font-mono text-[11px] text-text-muted border border-border rounded-md px-2 py-0.5 flex-shrink-0 bg-surface-hover">
          {domain.pct}%
        </span>
      </div>

      {/* Description */}
      <p className="font-sans text-[12px] text-text-muted leading-[20px]">{domain.desc}</p>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between mb-1">
          <span className="font-mono text-[10px] text-text-muted uppercase tracking-wide">Avg Competency</span>
          <span className="font-mono text-[10px] text-text-secondary tabular-nums">{domain.pct}/100</span>
        </div>
        <div className="w-full bg-border" style={{ height: 3 }}>
          <div className="h-full bg-text-primary" style={{ width: `${domain.pct}%` }} />
        </div>
      </div>

      {/* Sample project */}
      <div className="bg-surface-hover border border-border rounded-lg p-3">
        <p className="font-mono text-[10px] text-text-muted uppercase tracking-widest mb-1.5">Sample Project</p>
        <p className="font-sans text-[12px] text-text-secondary leading-[18px]">{domain.sample}</p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {domain.tags.map((tag) => (
          <span key={tag} className="font-mono text-[10px] text-text-muted border border-border rounded-md px-2 py-0.5 bg-canvas">
            {tag}
          </span>
        ))}
      </div>

      {/* CTAs */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={() => handleCTA("enroll")}
          className="btn-cta flex-1 h-8 rounded-lg bg-white text-black text-[12px] font-semibold hover:bg-zinc-100 cursor-pointer"
        >
          Enroll in Track
        </button>
        <button
          onClick={() => handleCTA("test")}
          className="btn-cta flex-1 h-8 rounded-lg border border-border text-text-secondary hover:border-text-muted hover:text-text-primary text-[12px] font-medium cursor-pointer"
        >
          Placement Test
        </button>
      </div>

      {auth && (
        <AuthModal
          onClose={() => { setAuth(false); setMode(null); }}
          onNavigate={onNavigate}
          onLogin={onLogin}
          message={mode === "enroll"
            ? "Sign in to enroll in a domain track and get a personalized roadmap."
            : "Sign in to take a placement test and assess your current level."}
          redirectTo="dashboard"
        />
      )}
    </div>
  );
}

export default function Curriculum({ onNavigate, user, onLogin, onLogout }: Props) {
  const [filter, setFilter] = useState<"all" | "beginner" | "intermediate" | "advanced">("all");

  const filtered = filter === "all" ? DOMAINS :
    DOMAINS.filter((d) => d.difficulty.toLowerCase() === filter);

  return (
    <div className="min-h-screen bg-canvas text-text-primary">
      <PublicNavbar active="curriculum" onNavigate={onNavigate} user={user} onLogin={onLogin} onLogout={onLogout} />

      {/* Hero */}
      <div className="pt-[88px] pb-10 px-6 md:px-10 max-w-[1080px] mx-auto">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-px w-4 bg-border" />
          <span className="font-mono text-[11px] text-text-muted uppercase tracking-[0.14em]">Technical Curriculum</span>
        </div>
        <h1 className="font-sans font-bold text-[42px] md:text-[56px] text-text-primary tracking-[-0.025em] leading-[1.05] mb-4">
          Six Domains.<br />
          <span className="text-text-secondary">Zero Filler Courses.</span>
        </h1>
        <p className="font-sans text-[15px] text-[#71717A] leading-[27px] max-w-[520px] mb-8">
          Every module in the SkillForge curriculum is mapped to a verified industry competency threshold. No padding, no beginner fluff masquerading as intermediate content.
        </p>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {(["all", "beginner", "intermediate", "advanced"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`btn-cta h-8 px-4 rounded-lg text-[12px] font-medium border transition-colors cursor-pointer ${
                filter === f
                  ? "bg-text-primary text-canvas border-text-primary"
                  : "border-border text-text-secondary hover:border-text-muted hover:text-text-primary"
              }`}
            >
              {f === "all" ? "All Domains" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
          <span className="flex items-center font-mono text-[11px] text-text-muted ml-2">
            {filtered.length} domain{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Domain grid */}
      <div className="px-6 md:px-10 max-w-[1080px] mx-auto pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((domain) => (
            <DomainCard key={domain.id} domain={domain} onNavigate={onNavigate} user={user} onLogin={onLogin} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 bg-surface border border-border rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <p className="font-sans font-semibold text-[14px] text-text-primary">Not sure where to start?</p>
            <p className="font-sans text-[13px] text-text-secondary mt-1">Take the full multi-domain benchmark assessment to get your baseline competency vector in under 45 minutes.</p>
          </div>
          <button
            onClick={() => onNavigate("assessment")}
            className="btn-cta flex-shrink-0 h-9 px-5 rounded-lg bg-white text-black text-[13px] font-semibold hover:bg-zinc-100 cursor-pointer"
          >
            Take Full Assessment →
          </button>
        </div>
      </div>

      <footer className="px-6 md:px-10 py-7 border-t border-border flex items-center justify-between">
        <span className="font-sans font-semibold text-[12px] text-text-muted tracking-[0.1em] uppercase cursor-pointer" onClick={() => onNavigate("landing")}>SkillForge</span>
        <span className="font-mono text-[11px] text-text-disabled">© 2026 SkillForge</span>
      </footer>
    </div>
  );
}
