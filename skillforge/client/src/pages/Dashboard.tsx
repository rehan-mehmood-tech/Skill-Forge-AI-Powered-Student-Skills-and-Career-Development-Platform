import type { View, AppUser } from "../App";
import AppShell from "../components/AppShell";
import { useAuth } from "../context/AuthContext";

interface Props {
  onNavigate: (v: View) => void;
  user?:      AppUser | null;
  onLogout?:  () => void;
}

/* ─── Data ──────────────────────────────────────────────── */



const RECENT = [
  { domain: "Python",    score: "0.79", date: "Aug 18",  status: "done"    },
  { domain: "Web Dev",   score: "0.55", date: "Aug 15",  status: "done"    },
  { domain: "Databases", score: "0.30", date: "Aug 10",  status: "done"    },
  { domain: "DevOps",    score: "—",    date: "—",        status: "pending" },
];

/* ─── Atoms ──────────────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[11px] text-text-muted tracking-widest uppercase mb-4 leading-none">
      {children}
    </p>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-surface border border-border rounded-xl p-6 flex flex-col min-w-0 ${className}`}>
      {children}
    </div>
  );
}

function PrecisionBar({ current, required }: { current: number | null; required: number }) {
  return (
    <div className="relative w-full" style={{ height: 4 }}>
      <div className="absolute inset-0 bg-border" />
      {current === null ? (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg,#27272A 0,#27272A 3px,transparent 3px,transparent 6px)",
          }}
        />
      ) : (
        <div
          className="absolute left-0 top-0 h-full bg-text-primary"
          style={{ width: `${Math.min(current * 100, 100)}%` }}
        />
      )}
      <div
        className="absolute bg-border-subtle"
        style={{ left: `${required * 100}%`, top: -4, width: 1, height: 12 }}
      />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    done:       { label: "Completed",   cls: "text-success border-success"  },
    inProgress: { label: "In Progress", cls: "text-warning border-warning"  },
    pending:    { label: "Not Started", cls: "text-text-muted border-border" },
  };
  const s = map[status] ?? map.pending;
  return (
    <span className={`font-mono text-[10px] border rounded-md px-2 py-0.5 whitespace-nowrap ${s.cls}`}>
      [{s.label}]
    </span>
  );
}

import { useState, useEffect } from "react";

/* ─── Page ───────────────────────────────────────────────── */

export default function Dashboard({ onNavigate, user, onLogout }: Props) {
  const { user: authUser, profile } = useAuth();
  
  const rawName = authUser?.user_metadata?.full_name || authUser?.user_metadata?.name || user?.name || authUser?.email?.split('@')[0] || 'User';
  const firstName = rawName.split(' ')[0];
  const fullName = rawName;
  const targetRole = profile?.target_role || "Software Engineer";
  const readiness = profile?.overall_readiness != null ? profile.overall_readiness : 0;

  const [roadmapPhases, setRoadmapPhases] = useState<any[]>([
    { label: "Phase 01", name: "Foundations", status: "pending", progress: "0 topics" },
    { label: "Phase 02", name: "Architecture", status: "pending", progress: "0 topics" },
    { label: "Phase 03", name: "Deployment", status: "pending", progress: "0 topics" }
  ]);

  const [skills, setSkills] = useState<any[]>([]);

  useEffect(() => {
    // Load roadmap from local storage
    const fallbackStr = localStorage.getItem("skillforge_fallback_roadmap");
    if (fallbackStr) {
      try {
        const parsed = JSON.parse(fallbackStr);
        if (Array.isArray(parsed)) {
          setRoadmapPhases(parsed.map((p: any, i: number) => ({
            label: `Phase 0${i + 1}`,
            name: p.title || p.name || `Phase ${i + 1}`,
            status: i === 0 ? "active" : "pending",
            progress: `0/${p.topics?.length || 0} topics`
          })));
        }
      } catch (e) {
        console.error("Failed to parse fallback roadmap", e);
      }
    }

    if (profile?.skill_vector) {
      const vec = Object.entries(profile.skill_vector).map(([k, v]) => ({
        domain: k.charAt(0).toUpperCase() + k.slice(1),
        current: v as number,
        required: 0.80,
        delta: (v as number) >= 0.80 ? `+${((v as number) - 0.80).toFixed(2)}` : `${((v as number) - 0.80).toFixed(2)}`,
        positive: (v as number) >= 0.80,
        assessed: true
      }));
      setSkills(vec);
    } else {
      setSkills([
        { domain: "Programming", current: 0, required: 0.8, delta: "-0.80", positive: false, assessed: false },
        { domain: "Databases", current: 0, required: 0.7, delta: "-0.70", positive: false, assessed: false },
        { domain: "Architecture", current: 0, required: 0.8, delta: "-0.80", positive: false, assessed: false }
      ]);
    }
  }, [profile]);

  return (
    <AppShell active="dashboard" onNavigate={onNavigate} user={user} onLogout={onLogout}>
      <div className="px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6 max-w-[1100px] pb-20 md:pb-8">

        {/* ── Topbar ── */}
        <header className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="font-sans text-sm text-text-secondary leading-none">Welcome back, {firstName}</p>
            <h1 className="font-sans font-semibold text-xl text-text-primary mt-1 leading-none">
              {fullName}
            </h1>
          </div>
          <div className="flex items-center gap-3 flex-wrap flex-shrink-0">
            <div className="flex items-center gap-2 h-9 px-3 rounded-lg bg-surface border border-border">
              <span className="font-sans font-medium text-[13px] text-text-primary whitespace-nowrap">
                {targetRole}
              </span>
              <span className="font-mono text-[11px] text-text-muted">↓</span>
              <span className="font-mono text-[11px] text-warning whitespace-nowrap">[{readiness}% ready]</span>
            </div>
            <button
              onClick={() => onNavigate("assessments")}
              className="h-9 px-4 rounded-lg bg-white text-black text-sm font-semibold hover:bg-zinc-100 transition-colors cursor-pointer whitespace-nowrap"
            >
              Take Assessment →
            </button>
          </div>
        </header>

        {/* ── Row 1: Readiness + Skill Matrix ── */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">

          {/* Card A — Overall Readiness */}
          <Card>
            <SectionLabel>Overall Readiness</SectionLabel>
            <span className="font-mono font-bold text-[56px] leading-none text-text-primary tabular-nums">
              {readiness}%
            </span>
            <p className="font-sans text-[13px] text-[#71717A] mt-1 mb-4 leading-none">
              {targetRole}
            </p>
            <div className="w-full bg-border" style={{ height: 4 }}>
              <div className="h-full bg-text-primary" style={{ width: `${readiness}%` }} />
            </div>
            <p className="font-sans text-[12px] text-text-muted mt-2">{100 - readiness}% gap to target role</p>
          </Card>

          {/* Card B — Skill Matrix */}
          <Card>
            <SectionLabel>Skill Matrix</SectionLabel>
            <div className="flex flex-col">
              {skills.map((skill, i) => (
                <div key={skill.domain}>
                  {i > 0 && <div className="h-px bg-border-subtle" />}
                  <div className="flex items-center gap-3 py-2">
                    {/* Domain name */}
                    <div className="flex-shrink-0" style={{ width: 88 }}>
                      <span className="font-sans font-medium text-[13px] text-text-secondary block leading-none">
                        {skill.domain}
                      </span>
                      {!skill.assessed && (
                        <span className="font-mono text-[9px] text-text-muted uppercase tracking-wide block mt-0.5">
                          not assessed
                        </span>
                      )}
                    </div>
                    {/* Precision bar */}
                    <div className="flex-1 min-w-0 px-1">
                      <PrecisionBar current={skill.current} required={skill.required} />
                    </div>
                    {/* Score */}
                    <div className="flex-shrink-0 text-right" style={{ width: 52 }}>
                      <span className="font-mono text-[12px] text-text-secondary tabular-nums">
                        {skill.current !== null ? skill.current.toFixed(2) : "—"}
                      </span>
                    </div>
                    {/* Delta */}
                    <div className="flex-shrink-0 text-right" style={{ width: 56 }}>
                      <span className={`font-mono text-[11px] tabular-nums ${skill.positive ? "text-success" : "text-danger"}`}>
                        [{skill.delta}]
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ── Row 2: Roadmap Mini + Recent Assessments ── */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">

          {/* Card C — Active Roadmap */}
          <Card>
            <div className="flex items-start justify-between mb-4">
              <SectionLabel>Active Roadmap</SectionLabel>
              <span className="font-mono text-[10px] text-text-muted border border-border rounded-md px-2 py-0.5 bg-surface-hover whitespace-nowrap -mt-1">
                [{targetRole}]
              </span>
            </div>

            <div className="relative flex-1" style={{ paddingLeft: 20 }}>
              {/* Spine */}
              <div className="absolute bg-border" style={{ left: 7, top: 6, bottom: 32, width: 1 }} />

              {roadmapPhases.map((phase, i) => (
                <div key={phase.label} className={`relative flex gap-3 ${i > 0 ? "mt-5" : ""}`}>
                  <div className="flex-shrink-0 mt-0.5" style={{ width: 14 }}>
                    <div
                      className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                        phase.status === "done"
                          ? "bg-text-primary border-text-primary"
                          : phase.status === "active"
                          ? "border-accent bg-canvas"
                          : "border-border bg-canvas"
                      }`}
                    >
                      {phase.status === "active" && (
                        <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-mono text-[10px] text-text-muted leading-none">{phase.label}</p>
                      <p className={`font-sans font-medium text-[13px] mt-0.5 leading-tight ${phase.status === "done" ? "text-text-muted" : "text-text-primary"}`}>
                        {phase.name}
                      </p>
                    </div>
                    <span className={`font-mono text-[10px] flex-shrink-0 mt-1 ${phase.status === "done" ? "text-success" : phase.status === "active" ? "text-warning" : "text-text-muted"}`}>
                      [{phase.progress}]
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate("roadmap")}
              className="mt-5 font-sans text-[12px] text-text-secondary hover:text-text-primary transition-colors cursor-pointer text-left"
            >
              View full roadmap →
            </button>
          </Card>

          {/* Card D — Recent Assessments */}
          <Card>
            <SectionLabel>Recent Assessments</SectionLabel>

            {/* Table header */}
            <div className="flex items-center gap-3 pb-2 border-b border-border">
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-wide flex-shrink-0" style={{ width: 80 }}>Domain</span>
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-wide flex-shrink-0" style={{ width: 44 }}>Score</span>
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-wide flex-1">Date</span>
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-wide flex-shrink-0 text-right" style={{ width: 90 }}>Status</span>
            </div>

            {RECENT.map((item, i) => (
              <div key={item.domain}>
                {i > 0 && <div className="h-px bg-border-subtle" />}
                <div className="flex items-center gap-3 py-2.5">
                  <span
                    className="font-mono text-[10px] text-text-muted border border-border rounded-md px-1.5 py-0.5 bg-surface-hover text-center whitespace-nowrap"
                    style={{ width: 80 }}
                  >
                    {item.domain}
                  </span>
                  <span className="font-mono text-[12px] text-text-secondary tabular-nums flex-shrink-0" style={{ width: 44 }}>
                    {item.score}
                  </span>
                  <span className="font-sans text-[12px] text-text-muted flex-1">{item.date}</span>
                  <div className="flex-shrink-0" style={{ width: 90, textAlign: "right" }}>
                    <StatusBadge status={item.status} />
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
              <button
                onClick={() => onNavigate("results")}
                className="font-sans text-[12px] text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              >
                View last results →
              </button>
              <button
                onClick={() => onNavigate("assessments")}
                className="font-sans text-[12px] text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              >
                Take next assessment →
              </button>
            </div>
          </Card>
        </div>

      </div>
    </AppShell>
  );
}
