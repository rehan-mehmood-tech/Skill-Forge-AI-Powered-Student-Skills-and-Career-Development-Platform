import { useState, useEffect, useRef, useCallback } from "react";
import type { View, AppUser } from "../App";
import AuthModal from "../components/AuthModal";
import PublicNavbar from "../components/PublicNavbar";

/* ══════════════════════════════════════════════════════════
   HOOKS
══════════════════════════════════════════════════════════ */

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function useCounter(target: number, active: boolean, ms = 1300) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    const steps = 60;
    const inc   = target / steps;
    const tick  = ms / steps;
    let cur = 0;
    const t = setInterval(() => {
      cur += inc;
      if (cur >= target) { setVal(target); clearInterval(t); }
      else setVal(Math.round(cur));
    }, tick);
    return () => clearInterval(t);
  }, [target, active, ms]);
  return val;
}

function useBlink(ms = 530) {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setOn((v) => !v), ms);
    return () => clearInterval(t);
  }, [ms]);
  return on;
}

const TRACKS = [
  "Production Backend Engineer.",
  "Applied AI & ML Specialist.",
  "Cloud & DevOps Architect.",
  "Full-Stack Systems Developer.",
];

function useTypewriter(tracks: string[], typeSpeed = 55, deleteSpeed = 28, holdMs = 2200) {
  const [displayed, setDisplayed] = useState("");
  const [trackIdx,  setTrackIdx]  = useState(0);
  const [phase,     setPhase]     = useState<"typing" | "deleting">("typing");

  useEffect(() => {
    const track = tracks[trackIdx];
    let t: ReturnType<typeof setTimeout>;
    if (phase === "typing") {
      if (displayed.length < track.length) {
        t = setTimeout(() => setDisplayed(track.slice(0, displayed.length + 1)), typeSpeed);
      } else {
        t = setTimeout(() => setPhase("deleting"), holdMs);
      }
    } else {
      if (displayed.length > 0) {
        t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), deleteSpeed);
      } else {
        setTrackIdx((i) => (i + 1) % tracks.length);
        setPhase("typing");
      }
    }
    return () => clearTimeout(t);
  }, [displayed, phase, trackIdx, tracks, typeSpeed, deleteSpeed, holdMs]);

  return displayed;
}

/* ══════════════════════════════════════════════════════════
   ATOMS
══════════════════════════════════════════════════════════ */

function SectionTag({ n, label }: { n: string; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="font-mono text-[11px] text-text-muted tabular-nums">{n}</span>
      <div className="h-px w-5 bg-border" />
      <span className="font-mono text-[11px] text-text-muted tracking-[0.1em] uppercase">{label}</span>
    </div>
  );
}

function Badge({ children, color = "muted" }: { children: React.ReactNode; color?: "muted" | "success" | "danger" | "warning" }) {
  const cls = {
    muted:   "text-text-muted  border-border",
    success: "text-success     border-success",
    danger:  "text-danger      border-danger",
    warning: "text-warning     border-warning",
  }[color];
  return (
    <span className={`inline-flex items-center font-mono text-[10px] border rounded-md px-2 py-0.5 ${cls}`}>
      {children}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════
   TERMINAL CARD (hero widget)
══════════════════════════════════════════════════════════ */

const PUBLIC_TERMINAL_LINES = [
  { c: "#52525B", t: "# Target Evaluation: Engineering Competency Matrix" },
  { c: "#A1A1AA", t: "student_profile = {" },
  { c: "#FAFAFA", t: '    "core_cs_foundations": 0.82,  # Algorithms, DS, Memory' },
  { c: "#EF4444", t: '    "system_architecture": 0.35,  # APIs, Concurrency  [CRITICAL GAP]' },
  { c: "#EF4444", t: '    "cloud_infrastructure": 0.20, # Docker, CI/CD, K8s [CRITICAL GAP]' },
  { c: "#F59E0B", t: '    "modern_databases":    0.48,  # Indexing, Query Optimization' },
  { c: "#EF4444", t: '    "applied_ai_systems":  0.15   # Embeddings, Vector Search [GAP]' },
  { c: "#A1A1AA", t: "}" },
  { c: "#A1A1AA", t: "" },
  { c: "#FAFAFA", t: 'status = "Diagnosis Complete: 48% Readiness Delta Detected"' },
];

function personalTerminalLines(user: AppUser) {
  return [
    { c: "#52525B", t: `# Skill Vector — ${user.targetRole}` },
    { c: "#A1A1AA", t: `skill_vector = {  # ${user.name}` },
    ...user.skillVector.map((s) => ({
      c: s.gap ? "#EF4444" : s.score >= 0.70 ? "#22C55E" : "#F59E0B",
      t: `    "${s.domain.padEnd(20)}" : ${s.score.toFixed(2)}${s.gap ? "  # [GAP]" : ""}`,
    })),
    { c: "#A1A1AA", t: "}" },
    { c: "#A1A1AA", t: "" },
    { c: "#FAFAFA", t: `readiness = ${(user.readinessPct / 100).toFixed(2)}  # Resume ${user.activePhase} →` },
  ];
}

function TerminalCard({ title, lines, laser }: { title: string; lines: { c: string; t: string }[]; laser?: boolean }) {
  return (
    <div className="rounded-xl border border-text-muted overflow-hidden flex flex-col card-hover">
      <div className="h-8 bg-surface-hover border-b border-border flex items-center px-3 gap-3 flex-shrink-0">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => <div key={i} className="w-2 h-2 rounded-full bg-border" />)}
        </div>
        <span className="font-mono text-[10px] text-text-muted flex-1 text-center">{title}</span>
        {laser && (
          <span className="font-mono text-[10px] text-success flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" />
            live
          </span>
        )}
      </div>
      <div className="relative bg-surface p-4 font-mono text-[11.5px] leading-[20px] overflow-x-auto flex-1">
        {laser && <div className="scan-laser" />}
        {lines.map((line, i) =>
          line.t === "" ? <div key={i} style={{ height: 20 }} /> :
          <div key={i} className="whitespace-pre" style={{ color: line.c }}>{line.t}</div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   HERO SECTION
══════════════════════════════════════════════════════════ */

function HeroSection({ onNavigate, user, onLogin }: { onNavigate: (v: View) => void; user: AppUser | null; onLogin: (u: AppUser) => void }) {
  const [auth,   setAuth]   = useState(false);
  const [authRedirect, setAuthRedirect] = useState<View | undefined>();

  const handleAuth = (redirectTo?: View) => {
    setAuthRedirect(redirectTo);
    setAuth(true);
  };

  const terminalLines = user ? personalTerminalLines(user) : PUBLIC_TERMINAL_LINES;

  return (
    <section className="pt-[88px] pb-16 px-6 md:px-10 flex flex-col items-center">
      <div className="w-full max-w-[1080px]">

        <div className="flex items-center gap-3 mb-5 animate-fade-up delay-0">
          <div className="h-px w-4 bg-border" />
          <span className="font-mono text-[11px] text-text-muted uppercase tracking-[0.14em]">
            Engineering Career Infrastructure · 2026
          </span>
        </div>

        {/* Public — generic hero */}
        {!user && (
          <h1 className="mb-5 animate-fade-up delay-50">
            <span className="block font-sans font-bold text-[40px] md:text-[58px] text-text-primary tracking-[-0.025em] leading-[1.06]">
              Architect Your Engineering Career
            </span>
          </h1>
        )}

        {/* Logged-in — personalized welcome */}
        {user && (
          <h1 className="mb-5 animate-fade-up delay-0">
            <span className="block font-mono text-[12px] text-text-muted mb-1 uppercase tracking-widest">Welcome back</span>
            <span className="block font-sans font-bold text-[40px] md:text-[58px] text-text-primary tracking-[-0.025em] leading-[1.06]">
              {user.name}.
            </span>
            <span className="block font-sans font-bold text-[34px] md:text-[46px] text-text-secondary tracking-[-0.02em] leading-[1.1]">
              Your sprint toward{" "}
              <span className="text-text-primary">{user.targetRole}.</span>
            </span>
          </h1>
        )}

        <p className="mt-2 max-w-[640px] font-sans text-[15px] text-[#71717A] leading-[27px] animate-fade-up delay-100">
          {user
            ? `Your current readiness score is ${user.readinessPct}%. Resume ${user.activePhase} to close the critical delta.`
            : "CS degree programs teach syntax and algorithms, but tech hiring evaluates production readiness. SkillForge identifies your exact technical blind spots across System Architecture, Cloud, Databases, and AI — then generates a personalized, grounded execution roadmap."}
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-3 animate-fade-up delay-150">
          {user ? (
            <>
              <button onClick={() => onNavigate("onboarding")} className="btn-cta h-10 px-6 rounded-lg bg-white text-black text-[13px] font-semibold hover:bg-zinc-100 cursor-pointer">
                Audit Your Skillset →
              </button>
              <button onClick={() => onNavigate("dashboard")} className="btn-cta h-10 px-5 rounded-lg border border-border bg-surface text-text-secondary hover:border-text-muted hover:bg-surface-hover hover:text-text-primary text-[13px] font-medium cursor-pointer">
                Open Dashboard
              </button>
            </>
          ) : (
            <>
              <button onClick={() => handleAuth("landing")} className="btn-cta h-10 px-6 rounded-lg bg-white text-black text-[13px] font-semibold hover:bg-zinc-100 cursor-pointer">
                Audit Your Skill Set →
              </button>
              <button onClick={() => handleAuth("dashboard")} className="btn-cta h-10 px-5 rounded-lg border border-border bg-surface text-text-secondary hover:border-text-muted hover:bg-surface-hover hover:text-text-primary text-[13px] font-medium cursor-pointer">
                Explore Benchmarks
              </button>
              <div className="flex items-center gap-1.5 ml-1">
                <span className="w-1.5 h-1.5 rounded-full bg-success" />
                <span className="font-mono text-[11px] text-text-muted">1,240 engineers enrolled</span>
              </div>
            </>
          )}
        </div>

        {user && (
          <>
            <div className="mt-10 animate-fade-up delay-200">
              <TerminalCard
                title={`skill_vector_${user.name.split(" ")[0].toLowerCase()}.py`}
                lines={terminalLines}
                laser
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 animate-fade-up delay-300">
              <span className="font-mono text-[10px] text-text-muted">
                PERSONALIZED SKILL VECTOR
              </span>
              <div className="h-px w-4 bg-border" />
              {user.skillVector.slice(0, 3).map((s) => (
                <span key={s.domain} className={`font-mono text-[11px] border rounded-md px-2 py-0.5 bg-surface ${s.gap ? "text-danger border-danger" : "text-success border-success"}`}>
                  [{s.domain} {s.score.toFixed(2)}]
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      {auth && <AuthModal onClose={() => setAuth(false)} onNavigate={onNavigate} onLogin={onLogin} redirectTo={authRedirect} />}
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   SOCIAL PROOF BANNER
══════════════════════════════════════════════════════════ */

const PROOF_STATS = [
  { val: "6",    sfx: " Core Domains",    sub: "Python · Web · Git · DevOps · AI · Databases"    },
  { val: "Zero", sfx: " Hallucinations",  sub: "Grounded in curated engineering roadmaps"          },
  { val: "SDG",  sfx: " 4 & 8 Aligned",  sub: "Bridging university-to-workplace transition"       },
];

function SocialProofBanner() {
  const { ref, inView } = useInView(0.3);
  return (
    <div ref={ref} className="border-y border-border px-6 md:px-10 py-12">
      <div className="max-w-[1080px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {PROOF_STATS.map((s, i) => (
          <div
            key={s.sfx}
            className="flex flex-col transition-all duration-500"
            style={{ transitionDelay: `${i * 80}ms`, opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(12px)" }}
          >
            <p className="font-mono font-bold text-[40px] text-text-primary leading-none tabular-nums">
              {s.val}<span className="text-[22px] font-semibold text-text-secondary ml-0.5">{s.sfx}</span>
            </p>
            <p className="font-sans text-[13px] text-text-muted mt-2 leading-snug">{s.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   CS GRADUATE DILEMMA
══════════════════════════════════════════════════════════ */

function CSGraduateDilemma() {
  const { ref, inView } = useInView(0.1);
  return (
    <section className="px-6 md:px-10 py-20 flex flex-col items-center">
      <div className="w-full max-w-[1080px]" ref={ref}>
        <SectionTag n="01" label="The CS Graduate Dilemma" />
        <div className="mb-10 transition-all duration-500" style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(14px)" }}>
          <h2 className="font-sans font-bold text-[36px] md:text-[44px] text-text-primary tracking-[-0.02em] leading-[1.1] mb-2">
            Two Traps. One Outcome.<br />
            <span className="text-text-secondary">An Offer That Never Comes.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="bg-surface rounded-xl border p-6 flex flex-col gap-3 transition-all duration-500"
            style={{ borderColor: "#3F1515", transitionDelay: "80ms", opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(16px)" }}>
            <div className="flex items-center justify-between mb-1">
              <p className="font-mono text-[11px] text-text-muted uppercase tracking-widest">The Shallow Generalist</p>
              <Badge color="danger">[HIGH RISK]</Badge>
            </div>
            <p className="font-sans text-[15px] text-text-secondary leading-[26px]">
              "10 different 2-hour crash courses on YouTube, 5 half-finished starter apps, 0 understanding of deployment, indexing, or unit testing."
            </p>
            <div className="mt-2 pt-4 border-t border-border flex flex-col gap-2">
              {["No assessed competency baseline", "No architectural depth signal", "Deployment experience: none", "Interview pass rate: ~15%"].map((item) => (
                <div key={item} className="flex gap-2 items-center">
                  <span className="font-mono text-[10px] text-danger flex-shrink-0">✕</span>
                  <span className="font-sans text-[12px] text-text-muted">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface rounded-xl border p-6 flex flex-col gap-3 transition-all duration-500"
            style={{ borderColor: "#3F2A0F", transitionDelay: "140ms", opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(16px)" }}>
            <div className="flex items-center justify-between mb-1">
              <p className="font-mono text-[11px] text-text-muted uppercase tracking-widest">The Over-Specialized Novice</p>
              <Badge color="warning">[FRAGILE]</Badge>
            </div>
            <p className="font-sans text-[15px] text-text-secondary leading-[26px]">
              "Mastered basic frontend framework syntax, but unable to configure a reverse proxy, debug an N+1 database query, or write concurrent Python code."
            </p>
            <div className="mt-2 pt-4 border-t border-border flex flex-col gap-2">
              {["Deep in one layer, blind to the stack", "Cannot reason about systems at scale", "N+1 query: unrecognized failure mode", "Senior screening: instant elimination"].map((item) => (
                <div key={item} className="flex gap-2 items-center">
                  <span className="font-mono text-[10px] text-warning flex-shrink-0">!</span>
                  <span className="font-sans text-[12px] text-text-muted">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all duration-500"
          style={{ transitionDelay: "200ms", opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(12px)" }}>
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-surface-hover border border-border flex items-center justify-center">
            <span className="font-mono text-[12px] text-text-secondary">→</span>
          </div>
          <p className="font-sans text-[14px] text-text-secondary leading-[22px]">
            <span className="text-text-primary font-semibold">SkillForge replaces guesswork with deterministic skill-gap quantification.</span>{" "}
            A weighted assessment vector tells you exactly where you stand — not where you think you stand.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   4-PILLAR METHODOLOGY
══════════════════════════════════════════════════════════ */

const PILLARS = [
  { step: "01", title: "Multi-Domain Benchmarking",          tags: ["Python", "System Design", "Cloud", "Databases", "AI/ML", "DevOps"],       desc: "Dynamic, weighted assessments across 6 core technical verticals. Each question calibrated against verified 2026 industry job requirements — not generic tutorials." },
  { step: "02", title: "Deterministic Gap Analysis",         tags: ["skill_vector.py", "pgvector", "cosine_similarity"],                        desc: "Mathematical vector delta calculation between your current skill scores and the verified industry threshold for your target role. No guesswork. No self-reporting bias." },
  { step: "03", title: "Phased Interactive Roadmap",         tags: ["Phase-gated", "Verified milestones", "Capstone specs"],                    desc: "A structured sequence — Foundations → Core Systems → Applied Engineering → Capstone — where each phase unlocks only when the prior gap closes to threshold." },
  { step: "04", title: "Grounded AI Copilot",                tags: ["RAG", "pgvector", "ACM docs", "Zero hallucinations"],                     desc: "An autonomous RAG agent that cites ACM, official docs, and curated engineering specs — never hallucinating generic advice. Every answer traceable to a verified source." },
];

function FourPillarMethodology() {
  const { ref, inView } = useInView(0.08);
  return (
    <section className="px-6 md:px-10 py-20 flex flex-col items-center">
      <div className="w-full max-w-[1080px]" ref={ref}>
        <SectionTag n="02" label="The 4-Pillar Methodology" />
        <div className="mb-10 transition-all duration-500" style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(14px)" }}>
          <h2 className="font-sans font-bold text-[36px] md:text-[44px] text-text-primary tracking-[-0.02em] leading-[1.1] mb-2">
            How SkillForge Works
          </h2>
          <p className="font-sans text-[14px] text-text-secondary max-w-[480px]">
            Four deterministic stages that turn a vague CS background into a production-ready engineering profile.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {PILLARS.map((pillar, i) => (
            <div key={pillar.step} className="bg-surface border border-border rounded-xl p-6 flex flex-col gap-3 card-hover transition-all duration-500"
              style={{ transitionDelay: `${i * 70}ms`, opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(16px)" }}>
              <div className="flex items-start gap-3">
                <span className="font-mono text-[11px] text-text-muted flex-shrink-0 mt-0.5">Step {pillar.step}</span>
                <div className="h-px flex-1 bg-border mt-[9px]" />
              </div>
              <h3 className="font-sans font-semibold text-[16px] text-text-primary leading-snug">{pillar.title}</h3>
              <p className="font-sans text-[13px] text-text-secondary leading-[22px] flex-1">{pillar.desc}</p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {pillar.tags.map((tag) => (
                  <span key={tag} className="font-mono text-[10px] text-text-muted border border-border rounded-md px-2 py-0.5 bg-surface-hover">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   ROADMAP ENGINE
══════════════════════════════════════════════════════════ */

const PHASES = [
  { id: "p1", label: "Phase 01", name: "Systems Foundations",                 status: "done",   pct: 100,
    spec: { title: "Build a Multi-Threaded LRU Cache Engine",      desc: "Thread-safe LRU cache in Python with benchmarking vs Redis at 10k ops/sec.", tags: ["Python","Threading","LRU","Benchmarking"], dur: "~3 weeks", level: "Intermediate" } },
  { id: "p2", label: "Phase 02", name: "High-Throughput APIs & Concurrency", status: "active", pct: 68,
    spec: { title: "Design an Async Distributed Job Queue",         desc: "Fault-tolerant task queue with FastAPI + Celery + Redis Pub/Sub for 1M+ tasks/day.", tags: ["FastAPI","Celery","Redis","AsyncIO"], dur: "~4 weeks", level: "Advanced" } },
  { id: "p3", label: "Phase 03", name: "Distributed Storage & Kubernetes",   status: "locked", pct: 0,
    spec: { title: "Deploy a Stateful Postgres Cluster on K8s",    desc: "3-node PostgreSQL cluster with StatefulSets, Patroni failover, PgBouncer pooling.", tags: ["Kubernetes","PostgreSQL","Patroni","Helm"], dur: "~5 weeks", level: "Advanced" } },
  { id: "p4", label: "Phase 04", name: "Production Architecture & Capstone", status: "locked", pct: 0,
    spec: { title: "Architect a Full Production SaaS Backend",      desc: "Microservices with API gateway, Istio service mesh, Jaeger tracing, GitHub Actions CI/CD.", tags: ["Microservices","Istio","Observability","CI/CD"], dur: "~6 weeks", level: "Expert" } },
];

function RoadmapEngine() {
  const { ref, inView } = useInView(0.08);
  const [active, setActive] = useState("p2");
  const spec = PHASES.find((p) => p.id === active)?.spec;

  return (
    <section className="px-6 md:px-10 py-20 flex flex-col items-center">
      <div className="w-full max-w-[1080px]" ref={ref}>
        <SectionTag n="03" label="Live Roadmap Engine" />
        <div className="mb-10 transition-all duration-500" style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(14px)" }}>
          <h2 className="font-sans font-bold text-[36px] md:text-[44px] text-text-primary tracking-[-0.02em] leading-[1.1] mb-2">
            Your Path, Computed<br />from Your Gap.
          </h2>
          <p className="font-sans text-[14px] text-text-secondary max-w-[460px]">
            Hover any phase to preview its capstone project. Every milestone is grounded in real system design.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-5 items-start">
          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[11px] text-text-muted uppercase tracking-widest">Active Roadmap</span>
              <span className="font-mono text-[10px] text-text-muted border border-border rounded-md px-2 py-0.5">[Backend Developer]</span>
            </div>
            <div className="relative" style={{ paddingLeft: 22 }}>
              <div className="absolute bg-border" style={{ left: 7, top: 10, bottom: 20, width: 1 }} />
              {PHASES.map((phase, i) => {
                const isActive = active === phase.id;
                return (
                  <div key={phase.id} onMouseEnter={() => setActive(phase.id)} onClick={() => setActive(phase.id)}
                    className={`relative cursor-pointer rounded-lg px-3 py-2.5 -ml-3 transition-colors duration-100 ${i > 0 ? "mt-1" : ""} ${isActive ? "bg-surface-hover" : ""}`}>
                    <div className={`absolute flex items-center justify-center rounded-full border-2 transition-all duration-200 ${
                      phase.status === "done" ? "bg-text-primary border-text-primary" :
                      phase.status === "active" ? "border-accent bg-canvas" : "border-border bg-canvas"}`}
                      style={{ left: -18, top: 13, width: 14, height: 14 }}>
                      {phase.status === "active" && <div className={`rounded-full bg-accent ${isActive ? "w-2 h-2" : "w-1.5 h-1.5"}`} />}
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-mono text-[10px] text-text-muted">{phase.label}</span>
                          {phase.status === "locked" && <span className="font-mono text-[10px] text-text-muted border border-border rounded-md px-1.5 py-0.5">[locked]</span>}
                        </div>
                        <p className={`font-sans font-medium text-[13px] leading-tight ${phase.status === "locked" ? "text-text-muted" : isActive ? "text-text-primary" : "text-text-secondary"}`}>
                          {phase.name}
                        </p>
                        {phase.status !== "locked" && (
                          <div className="flex items-center gap-2 mt-1.5">
                            <div className="flex-1 bg-border" style={{ height: 2 }}>
                              <div className={`h-full ${phase.status === "done" ? "bg-success" : "bg-warning"}`}
                                style={inView ? { animation: `count-bar 1s cubic-bezier(0.16,1,0.3,1) ${0.2 + i * 0.08}s both`, width: `${phase.pct}%` } : { width: 0 }} />
                            </div>
                            <span className={`font-mono text-[10px] flex-shrink-0 ${phase.status === "done" ? "text-success" : "text-warning"}`}>{phase.pct}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:sticky lg:top-6">
            {spec && (
              <div key={active} className="bg-surface border border-border rounded-xl p-5 card-hover"
                style={{ animation: "fade-up-sm 0.2s cubic-bezier(0.16,1,0.3,1) both" }}>
                <p className="font-mono text-[10px] text-text-muted uppercase tracking-widest mb-3">Capstone Project Spec</p>
                <h3 className="font-sans font-semibold text-[15px] text-text-primary leading-snug mb-2">{spec.title}</h3>
                <p className="font-sans text-[13px] text-text-secondary leading-[21px] mb-4">{spec.desc}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {spec.tags.map((tag) => (
                    <span key={tag} className="font-mono text-[10px] text-text-muted border border-border rounded-md px-2 py-0.5 bg-surface-hover">{tag}</span>
                  ))}
                </div>
                <div className="h-px bg-border mb-4" />
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-mono text-[10px] text-text-muted uppercase tracking-wide">Duration</p>
                    <p className="font-mono text-[12px] text-text-secondary mt-0.5">{spec.dur}</p>
                  </div>
                  <div className="w-px h-7 bg-border" />
                  <div>
                    <p className="font-mono text-[10px] text-text-muted uppercase tracking-wide">Level</p>
                    <p className={`font-mono text-[12px] mt-0.5 ${spec.level === "Expert" ? "text-danger" : spec.level === "Advanced" ? "text-warning" : "text-success"}`}>[{spec.level}]</p>
                  </div>
                  <div className="flex-1" />
                  <span className="font-mono text-[10px] text-text-muted border border-border rounded-md px-2 py-0.5">[verified spec]</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   COPILOT TERMINAL
══════════════════════════════════════════════════════════ */

interface TraceLine { delay: number; text: string; color: string }
const TRACE: TraceLine[] = [
  { delay: 0,    color: "#A1A1AA", text: '> query: "How do I close my Distributed Systems gap?"' },
  { delay: 800,  color: "#52525B", text: "> invoking vector_search(pgvector)..." },
  { delay: 1500, color: "#52525B", text: "> retrieved 3 verified docs from ACM & System Design specs" },
  { delay: 2200, color: "#52525B", text: "> invoking calculate_gap(target: Backend Developer)..." },
  { delay: 2900, color: "#EF4444", text: "> gap: distributed_sys = 0.12  (threshold: 0.50 — CRITICAL)" },
  { delay: 3600, color: "#52525B", text: "> invoking roadmap_patch(milestone: Redis Clustering)..." },
  { delay: 4300, color: "#22C55E", text: "✓ roadmap updated · 3 tools · 1.8s" },
  { delay: 4900, color: "#52525B", text: "" },
  { delay: 5000, color: "#FAFAFA", text: "  Recommendation: Start Phase 03 — Redis Clustering." },
  { delay: 5600, color: "#FAFAFA", text: "  Your distributed_sys score will hit 0.50 in ~3 weeks" },
  { delay: 6200, color: "#FAFAFA", text: "  if you complete the StatefulSet capstone project." },
];

function CopilotTerminal() {
  const { ref, inView }       = useInView(0.15);
  const [visible, setVisible] = useState<number[]>([]);
  const [started, setStarted] = useState(false);
  const cursor                = useBlink(530);

  const runTrace = useCallback(() => {
    setVisible([]);
    setStarted(true);
    TRACE.forEach((_, i) => {
      setTimeout(() => setVisible((prev) => prev.includes(i) ? prev : [...prev, i]), TRACE[i].delay);
    });
  }, []);

  useEffect(() => { if (inView && !started) runTrace(); }, [inView, started, runTrace]);

  const lastIdx = visible.length > 0 ? Math.max(...visible) : -1;
  const allDone = visible.length >= TRACE.length;

  return (
    <section className="px-6 md:px-10 py-20 flex flex-col items-center">
      <div className="w-full max-w-[1080px]" ref={ref}>
        <SectionTag n="04" label="Agentic Copilot Terminal" />
        <div className="mb-10 transition-all duration-500" style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(14px)" }}>
          <h2 className="font-sans font-bold text-[36px] md:text-[44px] text-text-primary tracking-[-0.02em] leading-[1.1] mb-2">
            An AI That Actually Executes<br />on Your Gap.
          </h2>
          <p className="font-sans text-[14px] text-text-secondary max-w-[480px]">
            Not a chatbot. An agentic copilot that searches verified docs, patches your roadmap, and grounds every answer in your skill vector.
          </p>
        </div>

        <div className="rounded-xl border border-border overflow-hidden" style={{ backgroundColor: "#0F0F12" }}>
          <div className="h-9 bg-surface border-b border-border flex items-center justify-between px-4">
            <div className="flex gap-1.5">{[0,1,2].map((i) => <div key={i} className="w-2 h-2 rounded-full bg-border" />)}</div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
              <span className="font-mono text-[11px] text-text-muted">career_copilot — SkillForge</span>
            </div>
            <button onClick={runTrace} className="btn-cta font-mono text-[10px] text-text-muted border border-border rounded px-2 py-0.5 hover:border-text-muted hover:text-text-secondary transition-colors cursor-pointer">
              [re-run ↺]
            </button>
          </div>
          <div className="p-5 font-mono text-[12px] leading-[22px]" style={{ minHeight: 290 }}>
            {TRACE.map((line, i) => {
              if (!visible.includes(i)) return null;
              if (!line.text) return <div key={i} style={{ height: 22 }} />;
              return (
                <div key={`${i}-${started}`} className="whitespace-pre-wrap animate-fade-in" style={{ color: line.color }}>
                  {line.text}
                  {!allDone && i === lastIdx && (
                    <span className="inline-block ml-0.5 w-[0.55ch]" style={{ color: "#FAFAFA", opacity: cursor ? 1 : 0 }}>▋</span>
                  )}
                </div>
              );
            })}
            {allDone && (
              <div className="mt-1" style={{ color: "#52525B" }}>
                <span>$ </span>
                <span style={{ color: "#FAFAFA", opacity: cursor ? 1 : 0 }}>▋</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   FINAL CTA
══════════════════════════════════════════════════════════ */

function FinalCTA({ onNavigate, user, onLogin }: { onNavigate: (v: View) => void; user: AppUser | null; onLogin: (u: AppUser) => void }) {
  const { ref, inView } = useInView(0.25);
  const [auth, setAuth] = useState(false);
  const [authRedirect, setAuthRedirect] = useState<View | undefined>();

  const handleAuth = (redirectTo?: View) => {
    setAuthRedirect(redirectTo);
    setAuth(true);
  };

  return (
    <section className="px-6 py-28 flex flex-col items-center text-center">
      <div ref={ref} className="w-full max-w-[600px] transition-all duration-600"
        style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(20px)" }}>
        <div className="flex items-center justify-center gap-3 mb-5">
          <div className="h-px w-5 bg-border" />
          <span className="font-mono text-[11px] text-text-muted uppercase tracking-[0.12em]">Start Here</span>
          <div className="h-px w-5 bg-border" />
        </div>
        <h2 className="font-sans font-bold text-[40px] md:text-[52px] text-text-primary tracking-[-0.025em] leading-[1.08] mb-4">
          {user ? `Close the Gap, ${user.name.split(" ")[0]}.` : "Stop Guessing.\nStart Measuring."}
        </h2>
        <p className="font-sans text-[15px] text-[#71717A] leading-[26px] mb-10 max-w-[440px] mx-auto">
          {user
            ? `You are ${user.readinessPct}% ready for ${user.targetRole}. The remaining gap is measurable and closeable.`
            : "Join engineers who replaced random tutorials with a quantified, assessed, roadmap-driven career system."}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => user ? onNavigate("onboarding") : handleAuth("landing")}
            className="btn-cta w-full sm:w-auto h-11 px-8 rounded-lg bg-white text-black text-[13px] font-semibold hover:bg-zinc-100 cursor-pointer"
          >
            {user ? `Resume ${user.activePhase} →` : "Audit My Skillset — Free →"}
          </button>
          <button
            onClick={() => user ? onNavigate("dashboard") : handleAuth("dashboard")}
            className="btn-cta w-full sm:w-auto h-11 px-6 rounded-lg border border-border bg-surface text-text-secondary hover:border-text-muted hover:bg-surface-hover hover:text-text-primary text-[13px] font-medium cursor-pointer"
          >
            {user ? "Open Dashboard" : "Explore 2026 CS Benchmarks"}
          </button>
        </div>
        <p className="mt-6 font-mono text-[11px] text-text-muted">
          {user ? `Active Track: ${user.targetRole} · Readiness: ${user.readinessPct}%` : "No credit card · Free assessment · Roadmap in 5 minutes"}
        </p>
      </div>
      {auth && <AuthModal onClose={() => setAuth(false)} onNavigate={onNavigate} onLogin={onLogin} redirectTo={authRedirect} />}
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════════════════ */

export default function Landing({ onNavigate, user, onLogin, onLogout }: {
  onNavigate: (v: View) => void;
  user:       AppUser | null;
  onLogin:    (u: AppUser) => void;
  onLogout?:  () => void;
}) {
  return (
    <div className="min-h-screen bg-canvas text-text-primary overflow-x-hidden">
      <PublicNavbar active="landing" onNavigate={onNavigate} user={user} onLogin={onLogin} onLogout={onLogout} />

      <main>
        <HeroSection onNavigate={onNavigate} user={user} onLogin={onLogin} />
      </main>

      <SocialProofBanner />
      <CSGraduateDilemma />
      <FourPillarMethodology />

      {user && (
        <>
          <div className="h-px bg-border mx-6 md:mx-10" />
          <RoadmapEngine />

          <div className="h-px bg-border mx-6 md:mx-10" />
          <CopilotTerminal />
        </>
      )}

      <div className="h-px bg-border mx-6 md:mx-10" />
      <FinalCTA onNavigate={onNavigate} user={user} onLogin={onLogin} />

      <footer className="px-6 md:px-10 py-7 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 select-none">
          <span className="font-sans font-semibold text-[12px] text-text-muted tracking-[0.1em] uppercase">SkillForge</span>
          <span className="font-mono text-[11px] text-text-disabled">[v1.0]</span>
        </div>
        <div className="flex items-center gap-5">
          {["Privacy", "Terms", "Docs", "Status"].map((l) => (
            <span key={l} className="font-sans text-[12px] text-text-muted hover:text-text-secondary transition-colors cursor-pointer">{l}</span>
          ))}
        </div>
        <span className="font-mono text-[11px] text-text-disabled">© 2026 SkillForge</span>
      </footer>
    </div>
  );
}
