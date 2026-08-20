import { useState } from "react";
import type { View, AppUser } from "../App";

interface Props {
  onNavigate: (v: View) => void;
  user?:      AppUser | null;
  onLogout?:  () => void;
}

type StudentRecord = {
  name: string; email: string; role: string; readiness: number;
  lastAssess: string; status: string;
  skills: { label: string; val: number | null }[];
  phases: { label: string; pct: number; done: boolean }[];
};

const STUDENTS: StudentRecord[] = [
  {
    name: "Aisha Khan", email: "aisha@example.com", role: "Backend Developer", readiness: 62, lastAssess: "Aug 18, 2026", status: "active",
    skills: [
      { label: "Python",    val: 0.79 }, { label: "Web APIs",  val: 0.55 },
      { label: "Databases", val: 0.48 }, { label: "Sys Arch",  val: 0.35 },
      { label: "DevOps",    val: 0.20 },
    ],
    phases: [
      { label: "Foundations",   pct: 100, done: true  }, { label: "Core Systems", pct: 43, done: false },
      { label: "Applied Arch.", pct: 0,   done: false }, { label: "Capstone",     pct: 0,  done: false },
    ],
  },
  {
    name: "Marcus Chen", email: "marcus@example.com", role: "AI / ML Engineer", readiness: 44, lastAssess: "Aug 16, 2026", status: "active",
    skills: [
      { label: "Python",     val: 0.60 }, { label: "Statistics", val: 0.50 },
      { label: "PyTorch",    val: 0.35 }, { label: "MLOps",      val: 0.20 },
      { label: "Applied AI", val: 0.40 },
    ],
    phases: [
      { label: "Foundations",   pct: 100, done: true  }, { label: "Core ML",    pct: 20, done: false },
      { label: "Applied Models", pct: 0,  done: false }, { label: "Capstone",   pct: 0,  done: false },
    ],
  },
  {
    name: "Priya Menon", email: "priya@example.com", role: "Full Stack Developer", readiness: 78, lastAssess: "Aug 20, 2026", status: "active",
    skills: [
      { label: "React",    val: 0.82 }, { label: "Node.js",   val: 0.75 },
      { label: "Postgres", val: 0.68 }, { label: "DevOps",    val: 0.55 },
      { label: "Testing",  val: 0.60 },
    ],
    phases: [
      { label: "Foundations",  pct: 100, done: true  }, { label: "Core Full-Stack", pct: 80, done: false },
      { label: "Arch & Scale", pct: 15,  done: false }, { label: "Capstone",        pct: 0,  done: false },
    ],
  },
  {
    name: "Tobias Feld", email: "tobias@example.com", role: "DevOps Engineer", readiness: 31, lastAssess: "Aug 10, 2026", status: "at-risk",
    skills: [
      { label: "Linux",      val: 0.45 }, { label: "Docker",     val: 0.30 },
      { label: "Kubernetes", val: null  }, { label: "CI/CD",      val: 0.20 },
      { label: "Networking", val: 0.35 },
    ],
    phases: [
      { label: "Foundations",  pct: 65, done: false }, { label: "Container Orch.", pct: 0, done: false },
      { label: "Cloud Infra",  pct: 0,  done: false }, { label: "Capstone",        pct: 0, done: false },
    ],
  },
  {
    name: "Sofia Reyes", email: "sofia@example.com", role: "Backend Developer", readiness: 55, lastAssess: "Aug 17, 2026", status: "active",
    skills: [
      { label: "Python",    val: 0.65 }, { label: "FastAPI",   val: 0.55 },
      { label: "Postgres",  val: 0.50 }, { label: "Redis",     val: 0.30 },
      { label: "Sys Arch",  val: 0.20 },
    ],
    phases: [
      { label: "Foundations",   pct: 100, done: true  }, { label: "Core Systems", pct: 30, done: false },
      { label: "Applied Arch.", pct: 0,   done: false }, { label: "Capstone",     pct: 0,  done: false },
    ],
  },
  {
    name: "James Okafor", email: "james@example.com", role: "Data Engineer", readiness: 20, lastAssess: "Aug 5, 2026", status: "at-risk",
    skills: [
      { label: "SQL",   val: 0.30 }, { label: "Python", val: 0.20 },
      { label: "Spark", val: null  }, { label: "dbt",    val: null  },
      { label: "Kafka", val: null  },
    ],
    phases: [
      { label: "Foundations",   pct: 35, done: false }, { label: "Data Pipelines", pct: 0, done: false },
      { label: "Orchestration", pct: 0,  done: false }, { label: "Capstone",       pct: 0, done: false },
    ],
  },
  {
    name: "Lin Wei", email: "lin@example.com", role: "AI / ML Engineer", readiness: 88, lastAssess: "Aug 19, 2026", status: "strong",
    skills: [
      { label: "Python",     val: 0.92 }, { label: "PyTorch",    val: 0.88 },
      { label: "Statistics", val: 0.85 }, { label: "MLOps",      val: 0.75 },
      { label: "Applied AI", val: 0.82 },
    ],
    phases: [
      { label: "Foundations",    pct: 100, done: true  }, { label: "Core ML",     pct: 100, done: true  },
      { label: "Applied Models", pct: 80,  done: false }, { label: "Capstone",    pct: 20,  done: false },
    ],
  },
  {
    name: "Nadia Petrov", email: "nadia@example.com", role: "Security Engineer", readiness: 49, lastAssess: "Aug 12, 2026", status: "active",
    skills: [
      { label: "Networking",  val: 0.60 }, { label: "Linux",      val: 0.55 },
      { label: "Pentesting",  val: 0.40 }, { label: "SIEM",       val: 0.25 },
      { label: "Cryptography",val: 0.30 },
    ],
    phases: [
      { label: "Foundations",   pct: 100, done: true  }, { label: "Offense/Def.", pct: 25, done: false },
      { label: "Detection Eng.",pct: 0,   done: false }, { label: "Capstone",     pct: 0,  done: false },
    ],
  },
];

const RESOURCES = [
  { domain: "DevOps",    type: "course",   title: "Docker for Beginners",            source: "FreeCodeCamp", verified: true  },
  { domain: "Python",    type: "docs",     title: "Python Official Docs — OOP",      source: "python.org",   verified: true  },
  { domain: "Python",    type: "course",   title: "OOP in Python",                   source: "Real Python",  verified: true  },
  { domain: "Web",       type: "article",  title: "REST API Design Best Practices",  source: "Martin Fowler",verified: true  },
  { domain: "Databases", type: "course",   title: "SQL for Data Science",            source: "Coursera",     verified: false },
  { domain: "AI",        type: "article",  title: "Attention Is All You Need",       source: "arXiv",        verified: true  },
];

type Tab = "students" | "resources";

export default function Admin({ onNavigate, user, onLogout }: Props) {
  const [tab,        setTab]        = useState<Tab>("students");
  const [filter,     setFilter]     = useState("");
  const [inspecting, setInspecting] = useState<number | null>(null);
  const [noteText,   setNoteText]   = useState("");

  const filtered = STUDENTS.filter(
    (s) =>
      s.name.toLowerCase().includes(filter.toLowerCase()) ||
      s.email.toLowerCase().includes(filter.toLowerCase()) ||
      s.role.toLowerCase().includes(filter.toLowerCase())
  );

  const inspected = inspecting !== null ? STUDENTS[inspecting] : null;

  const avgReadiness = Math.round(STUDENTS.reduce((sum, s) => sum + s.readiness, 0) / STUDENTS.length);
  const atRisk       = STUDENTS.filter((s) => s.readiness < 35).length;

  return (
    <div className="min-h-screen bg-canvas text-text-primary font-sans">

      {/* Admin Topbar */}
      <div className="h-[52px] border-b border-border flex items-center justify-between px-8 sticky top-0 bg-canvas z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-sans font-semibold text-[13px] text-text-primary tracking-[0.1em] uppercase">
              SkillForge
            </span>
            <span className="font-mono text-[11px] text-text-muted">[v1.0]</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <span className="font-mono text-[11px] text-warning border border-warning rounded-md px-2 py-0.5">
            [ADMIN]
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate("dashboard")}
            className="font-sans text-[13px] text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
          >
            ← Student View
          </button>
          <div className="w-7 h-7 rounded-full bg-surface-hover border border-border flex items-center justify-center">
            <span className="font-sans text-[11px] font-semibold text-text-secondary">
              {user ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "PP"}
            </span>
          </div>
          {onLogout && (
            <button
              onClick={() => { onLogout(); onNavigate("landing"); }}
              className="font-mono text-[10px] text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
            >
              [logout]
            </button>
          )}
        </div>
      </div>

      {/* Global stats bar */}
      <div className="border-b border-border px-8 py-4 flex items-center gap-8 bg-surface overflow-x-auto">
        {[
          { label: "Total Students",       value: String(STUDENTS.length),   color: "text-text-primary" },
          { label: "Avg Cohort Readiness", value: `${avgReadiness}%`,        color: "text-text-primary" },
          { label: "At-Risk Students",     value: String(atRisk),            color: "text-danger"       },
          { label: "Assessments (30d)",    value: "47",                      color: "text-text-primary" },
          { label: "Roadmaps Active",      value: String(STUDENTS.length - 1), color: "text-success"   },
        ].map((stat, i) => (
          <div key={stat.label} className="flex items-center gap-8 flex-shrink-0">
            {i > 0 && <div className="w-px h-8 bg-border" />}
            <div>
              <p className="font-mono text-[10px] text-text-muted uppercase tracking-widest">{stat.label}</p>
              <p className={`font-mono font-bold text-xl tabular-nums mt-0.5 ${stat.color}`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="px-8 py-6 max-w-[1200px]">

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 bg-surface border border-border rounded-lg w-fit mb-6">
          {(["students", "resources"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`h-8 px-4 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                tab === t
                  ? "bg-canvas text-text-primary"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              {t === "students" ? "Student Directory" : "Resource Manager"}
            </button>
          ))}
        </div>

        {/* ── Student Directory Tab ── */}
        {tab === "students" && (
          <div>
            {/* Search + filter bar */}
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-1 max-w-[360px]">
                <input
                  type="text"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="Search by name, email, or role..."
                  className="w-full h-9 pl-3 pr-3 rounded-lg bg-surface border border-border text-text-primary text-sm font-sans placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
              <span className="font-mono text-[12px] text-text-muted">
                {filtered.length} of {STUDENTS.length} students
              </span>
            </div>

            {/* Table */}
            <div className="bg-surface border border-border rounded-xl overflow-hidden">
              {/* Header */}
              <div className="grid border-b border-border px-5 py-2.5" style={{ gridTemplateColumns: "1fr 1fr 160px 100px 120px 100px" }}>
                {["Name", "Target Role", "Readiness", "Last Assess", "Status", ""].map((h) => (
                  <span key={h} className="font-mono text-[10px] text-text-muted uppercase tracking-widest">
                    {h}
                  </span>
                ))}
              </div>

              {filtered.map((student, i) => (
                <div key={student.email}>
                  {i > 0 && <div className="h-px bg-border-subtle" />}
                  <div
                    className="grid items-center px-5 py-3 hover:bg-surface-hover transition-colors"
                    style={{ gridTemplateColumns: "1fr 1fr 160px 100px 120px 100px" }}
                  >
                    {/* Name + email */}
                    <div>
                      <p className="font-sans font-medium text-[13px] text-text-primary">{student.name}</p>
                      <p className="font-sans text-[12px] text-text-muted">{student.email}</p>
                    </div>
                    {/* Role */}
                    <span className="font-sans text-[13px] text-text-secondary">{student.role}</span>
                    {/* Readiness bar */}
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-border" style={{ height: 3 }}>
                          <div
                            className={`h-full ${student.readiness >= 70 ? "bg-success" : student.readiness >= 40 ? "bg-warning" : "bg-danger"}`}
                            style={{ width: `${student.readiness}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] text-text-secondary tabular-nums flex-shrink-0">
                          {student.readiness}%
                        </span>
                      </div>
                    </div>
                    {/* Date */}
                    <span className="font-sans text-[12px] text-text-muted">{student.lastAssess}</span>
                    {/* Status */}
                    <span
                      className={`font-mono text-[10px] border rounded-md px-2 py-0.5 w-fit ${
                        student.status === "strong"  ? "text-success border-success"  :
                        student.status === "at-risk" ? "text-danger  border-danger"   :
                                                       "text-text-muted border-border"
                      }`}
                    >
                      [{student.status}]
                    </span>
                    {/* Action */}
                    <button
                      onClick={() => setInspecting(STUDENTS.indexOf(student))}
                      className="font-sans text-[12px] text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                    >
                      Inspect →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Resource Manager Tab ── */}
        {tab === "resources" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="font-sans text-sm text-text-secondary">
                Manage verified curriculum resources across all domains.
              </p>
              <button className="h-9 px-4 rounded-lg bg-white text-black text-sm font-semibold hover:bg-zinc-100 transition-colors cursor-pointer">
                + Add Resource
              </button>
            </div>

            <div className="bg-surface border border-border rounded-xl overflow-hidden">
              {/* Header */}
              <div className="grid border-b border-border px-5 py-2.5" style={{ gridTemplateColumns: "80px 64px 1fr 120px 80px 80px" }}>
                {["Domain", "Type", "Title", "Source", "Verified", ""].map((h) => (
                  <span key={h} className="font-mono text-[10px] text-text-muted uppercase tracking-widest">{h}</span>
                ))}
              </div>

              {RESOURCES.map((res, i) => (
                <div key={i}>
                  {i > 0 && <div className="h-px bg-border-subtle" />}
                  <div
                    className="grid items-center px-5 py-3 hover:bg-surface-hover transition-colors"
                    style={{ gridTemplateColumns: "80px 64px 1fr 120px 80px 80px" }}
                  >
                    <span className="font-mono text-[11px] text-text-muted border border-border rounded-md px-1.5 py-0.5 w-fit">
                      {res.domain}
                    </span>
                    <span className="font-mono text-[11px] text-text-muted border border-border rounded-md px-1.5 py-0.5 w-fit">
                      [{res.type}]
                    </span>
                    <span className="font-sans text-[13px] text-text-primary">{res.title}</span>
                    <span className="font-sans text-[12px] text-text-muted">{res.source}</span>
                    <span className={`font-mono text-[11px] ${res.verified ? "text-success" : "text-warning"}`}>
                      {res.verified ? "[✓ verified]" : "[pending]"}
                    </span>
                    <div className="flex items-center gap-2">
                      <button className="font-sans text-[12px] text-text-muted hover:text-text-secondary transition-colors cursor-pointer">
                        Edit
                      </button>
                      <span className="text-border">·</span>
                      <button className="font-sans text-[12px] text-text-muted hover:text-danger transition-colors cursor-pointer">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Student Deep-Dive Drawer ── */}
      {inspected !== null && (
        <>
          <div
            className="fixed inset-0 z-40 bg-canvas/50"
            onClick={() => { setInspecting(null); setNoteText(""); }}
          />
          <div className="fixed top-0 right-0 h-full z-50 flex flex-col border-l border-border overflow-y-auto" style={{ width: 480, backgroundColor: "#0F0F12" }}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
              <div>
                <h2 className="font-sans font-semibold text-base text-text-primary">{inspected.name}</h2>
                <p className="font-sans text-[12px] text-text-muted">{inspected.email}</p>
              </div>
              <button
                onClick={() => { setInspecting(null); setNoteText(""); }}
                className="text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-5 p-6">
              {/* Readiness summary */}
              <div className="bg-surface border border-border rounded-xl p-4">
                <p className="font-mono text-[10px] text-text-muted uppercase tracking-widest mb-3">Readiness Summary</p>
                <div className="flex items-end gap-3 mb-3">
                  <span className="font-mono font-bold text-[40px] leading-none text-text-primary tabular-nums">
                    {inspected.readiness}%
                  </span>
                  <div className="mb-1">
                    <span className="font-sans text-[13px] text-text-secondary">{inspected.role}</span>
                    <p className="font-sans text-[12px] text-text-muted mt-0.5">Last active {inspected.lastAssess}</p>
                  </div>
                </div>
                <div className="w-full bg-border" style={{ height: 4 }}>
                  <div
                    className={`h-full ${inspected.readiness >= 70 ? "bg-success" : inspected.readiness >= 40 ? "bg-warning" : "bg-danger"}`}
                    style={{ width: `${inspected.readiness}%` }}
                  />
                </div>
              </div>

              {/* Skill radar (text-based) */}
              <div className="bg-surface border border-border rounded-xl p-4">
                <p className="font-mono text-[10px] text-text-muted uppercase tracking-widest mb-3">Skill Profile</p>
                {inspected.skills.map((s) => (
                  <div key={s.label} className="flex items-center gap-3 py-1.5">
                    <span className="font-sans text-[12px] text-text-secondary flex-shrink-0" style={{ width: 90 }}>{s.label}</span>
                    <div className="flex-1 bg-border" style={{ height: 3 }}>
                      {s.val !== null && (
                        <div className="h-full bg-text-primary" style={{ width: `${s.val * 100}%` }} />
                      )}
                    </div>
                    <span className="font-mono text-[11px] text-text-muted flex-shrink-0 tabular-nums" style={{ width: 32, textAlign: "right" }}>
                      {s.val !== null ? s.val.toFixed(2) : "—"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Roadmap status */}
              <div className="bg-surface border border-border rounded-xl p-4">
                <p className="font-mono text-[10px] text-text-muted uppercase tracking-widest mb-3">Roadmap Progress</p>
                {inspected.phases.map((phase) => (
                  <div key={phase.label} className="flex items-center gap-3 py-1.5">
                    <span className="font-sans text-[12px] text-text-secondary flex-shrink-0" style={{ width: 120 }}>{phase.label}</span>
                    <div className="flex-1 bg-border" style={{ height: 3 }}>
                      <div
                        className={`h-full ${phase.done ? "bg-success" : "bg-text-primary"}`}
                        style={{ width: `${phase.pct}%` }}
                      />
                    </div>
                    <span className="font-mono text-[11px] text-text-muted flex-shrink-0 tabular-nums">{phase.pct}%</span>
                  </div>
                ))}
              </div>

              {/* Send recommendation note */}
              <div className="bg-surface border border-border rounded-xl p-4">
                <p className="font-mono text-[10px] text-text-muted uppercase tracking-widest mb-3">
                  Send Recommendation Note
                </p>
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Write a personalized recommendation or flag a concern for this student..."
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg bg-surface-hover border border-border text-text-primary text-sm font-sans placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                />
                <button
                  disabled={!noteText.trim()}
                  className={`mt-3 h-9 px-5 rounded-lg text-sm font-semibold transition-colors w-full ${
                    noteText.trim()
                      ? "bg-white text-black hover:bg-zinc-100 cursor-pointer"
                      : "bg-surface border border-border text-text-muted cursor-not-allowed opacity-40"
                  }`}
                >
                  Send Note →
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
