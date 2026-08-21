import { useState } from "react";
import type { View, AppUser } from "../App";
import { post } from "../lib/api";
import AppShell from "../components/AppShell";

interface Props {
  onNavigate: (v: View) => void;
  user?:      AppUser | null;
  onLogout?:  () => void;
}

type TopicStatus = "pending" | "in_progress" | "done";

interface Topic {
  id: string;
  name: string;
  status: TopicStatus;
  projects: string[];
  resources: { type: string; title: string }[];
}

interface Phase {
  id: string;
  label: string;
  name: string;
  status: "done" | "active" | "future";
  progress: string;
  topics: Topic[];
}

const INITIAL_PHASES: Phase[] = [
  {
    id: "p1", label: "Phase 01", name: "Foundations: Python & Git",
    status: "done", progress: "7/7 topics",
    topics: [
      {
        id: "t1", name: "Python Data Structures", status: "done",
        projects: ["Build a CLI inventory system", "Implement a custom stack/queue library"],
        resources: [
          { type: "course",  title: "Python for Beginners — freeCodeCamp" },
          { type: "docs",    title: "Python Official Docs — Data Structures" },
        ],
      },
      {
        id: "t2", name: "Git & Version Control", status: "done",
        projects: ["Set up a personal project with branching strategy"],
        resources: [{ type: "article", title: "Pro Git Book — Scott Chacon" }],
      },
      {
        id: "t3", name: "OOP Principles", status: "done",
        projects: ["Refactor procedural code into OOP design"],
        resources: [{ type: "course", title: "OOP in Python — Real Python" }],
      },
    ],
  },
  {
    id: "p2", label: "Phase 02", name: "Core Systems: Web & APIs",
    status: "active", progress: "3/7 topics",
    topics: [
      {
        id: "t4", name: "HTTP & REST APIs", status: "done",
        projects: ["Build a REST API with FastAPI"],
        resources: [
          { type: "docs",    title: "FastAPI Documentation" },
          { type: "article", title: "REST API Design Best Practices" },
        ],
      },
      {
        id: "t5", name: "Authentication & Security", status: "in_progress",
        projects: ["Add JWT auth to your FastAPI project"],
        resources: [{ type: "article", title: "JWT Authentication Guide — Auth0" }],
      },
      {
        id: "t6", name: "Database Integration", status: "pending",
        projects: ["Connect PostgreSQL to your API", "Implement migrations with Alembic"],
        resources: [
          { type: "course", title: "SQLAlchemy ORM — SQLAlchemy Docs" },
          { type: "docs",   title: "PostgreSQL Tutorial" },
        ],
      },
    ],
  },
  {
    id: "p3", label: "Phase 03", name: "Applied Architecture",
    status: "future", progress: "0/6 topics",
    topics: [
      {
        id: "t7", name: "SQL Fundamentals", status: "pending",
        projects: ["Design a normalized schema for an e-commerce app"],
        resources: [{ type: "course", title: "SQL for Data Science — Coursera" }],
      },
      {
        id: "t8", name: "NoSQL & Redis", status: "pending",
        projects: ["Cache API responses with Redis"],
        resources: [{ type: "docs", title: "Redis Getting Started Guide" }],
      },
    ],
  },
  {
    id: "p4", label: "Phase 04", name: "Capstone: DevOps & Deployment",
    status: "future", progress: "0/8 topics",
    topics: [
      {
        id: "t9", name: "Docker & Containers", status: "pending",
        projects: ["Containerize your FastAPI app", "Write a docker-compose for local dev"],
        resources: [
          { type: "course", title: "Docker for Beginners — FreeCodeCamp" },
          { type: "docs",   title: "Docker Official Documentation" },
        ],
      },
      {
        id: "t10", name: "CI/CD Pipelines", status: "pending",
        projects: ["Set up GitHub Actions for your project"],
        resources: [{ type: "article", title: "GitHub Actions — Practical Guide" }],
      },
    ],
  },
];

const STATUS_CYCLE: Record<TopicStatus, TopicStatus> = {
  pending: "in_progress",
  in_progress: "done",
  done: "pending",
};

const STATUS_STYLE: Record<TopicStatus, string> = {
  done:       "border-success text-success",
  in_progress:"border-warning text-warning",
  pending:    "border-border text-text-muted",
};

function TopicNode({
  topic,
  onStatusChange,
}: {
  topic: Topic;
  onStatusChange: (id: string, s: TopicStatus) => void;
}) {
  const [open, setOpen] = useState(topic.status === "in_progress");

  return (
    <div className="ml-10 mt-3 pl-4 border-l border-border">
      {/* Header row */}
      <div
        className="flex items-center justify-between cursor-pointer group select-none"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className={`font-mono text-[10px] text-text-muted flex-shrink-0 transition-transform duration-150 ${open ? "rotate-90" : ""}`}>
            ▶
          </span>
          <span className="font-sans font-medium text-sm text-text-primary truncate group-hover:text-text-primary">
            {topic.name}
          </span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onStatusChange(topic.id, STATUS_CYCLE[topic.status]); }}
          className={`font-mono text-[10px] border rounded-full px-2.5 py-0.5 transition-colors cursor-pointer ml-3 flex-shrink-0 ${STATUS_STYLE[topic.status]}`}
        >
          {topic.status === "done" ? "[Done]" : topic.status === "in_progress" ? "[In Progress]" : "[Pending]"}
        </button>
      </div>

      {/* Collapsible content */}
      <div className={`topic-content ${open ? "open" : ""}`}>
        <div className="pt-3 pb-1 flex flex-col gap-3">
          <div>
            <p className="font-mono text-[10px] text-text-muted uppercase tracking-widest mb-2">
              Projects
            </p>
            <div className="flex flex-wrap gap-1.5">
              {topic.projects.map((p) => (
                <span
                  key={p}
                  className="font-sans text-[12px] text-text-secondary bg-surface-hover border border-border rounded-md px-2 py-1 hover:border-text-muted transition-colors cursor-pointer group"
                >
                  {p} <span className="text-text-muted group-hover:text-text-secondary">→</span>
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-[10px] text-text-muted uppercase tracking-widest mb-2">
              Resources
            </p>
            <div className="flex flex-col gap-1.5">
              {topic.resources.map((r) => (
                <div key={r.title} className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-text-muted border border-border rounded-md px-1.5 py-0.5 bg-surface-hover flex-shrink-0">
                    [{r.type}]
                  </span>
                  <span className="font-sans text-[13px] text-text-secondary flex-1 truncate">{r.title}</span>
                  <span className="text-text-muted text-[12px] cursor-pointer hover:text-text-secondary flex-shrink-0">↗</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Roadmap({ onNavigate, user, onLogout }: Props) {
  const [phases, setPhases] = useState<Phase[]>(INITIAL_PHASES);
  const [isGenerating, setIsGenerating] = useState(false);

  const updateTopicStatus = (topicId: string, newStatus: TopicStatus) => {
    setPhases((prev) =>
      prev.map((phase) => ({
        ...phase,
        topics: phase.topics.map((t) => (t.id === topicId ? { ...t, status: newStatus } : t)),
      }))
    );
  };

  const handleGenerateRoadmap = async () => {
    setIsGenerating(true);
    try {
      const response: any = await post('/ai/generate-roadmap', {
        target_role: "Backend Developer",
        timeframe_weeks: 12
      });
      
      // Assume the backend returns an array of phases in `roadmap.phases` or similar.
      if (response.roadmap && response.roadmap.phases) {
        // Simple mapping, might need adjustment based on exact backend shape
        const newPhases = response.roadmap.phases.map((p: any, i: number) => ({
          id: `p${i + 1}`,
          label: `Phase 0${i + 1}`,
          name: p.name || p.title,
          status: i === 0 ? "active" : "future",
          progress: `0/${p.topics?.length || 0} topics`,
          topics: (p.topics || []).map((t: any, j: number) => ({
            id: `t${i}_${j}`,
            name: t.name || t.title,
            status: "pending",
            projects: t.projects || [],
            resources: t.resources || []
          }))
        }));
        setPhases(newPhases);
      } else if (Array.isArray(response)) {
          const newPhases = response.map((p: any, i: number) => ({
          id: `p${i + 1}`,
          label: `Phase 0${i + 1}`,
          name: p.name || p.title || p.phase_name,
          status: i === 0 ? "active" : "future",
          progress: `0/${p.topics?.length || 0} topics`,
          topics: (p.topics || []).map((t: any, j: number) => ({
            id: `t${i}_${j}`,
            name: t.name || t.title,
            status: "pending",
            projects: t.projects || [],
            resources: t.resources || []
          }))
        }));
        setPhases(newPhases);
      }
    } catch (e) {
      console.error("Failed to generate roadmap", e);
      alert("Failed to generate roadmap. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AppShell active="roadmap" onNavigate={onNavigate} user={user} onLogout={onLogout}>
      <div className="p-8 max-w-[920px] pb-20 md:pb-8">

        {/* Header */}
        <div className="mb-8">
          <p className="font-mono text-[12px] text-text-muted mb-2">Roadmap / Backend Developer</p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-sans font-semibold text-2xl text-text-primary">
                Your Learning Roadmap
              </h1>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <span className="font-mono text-[11px] border border-success text-success rounded-md px-2 py-0.5">[Active]</span>
                <span className="font-mono text-[12px] text-text-secondary">Overall Readiness 62%</span>
                <span className="font-sans text-[12px] text-text-muted">Last updated 2d ago</span>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <button 
                onClick={handleGenerateRoadmap}
                disabled={isGenerating}
                className={`h-9 px-4 rounded-lg border border-border bg-surface text-text-secondary text-sm font-medium transition-colors ${
                  isGenerating ? "opacity-50 cursor-wait" : "hover:bg-surface-hover hover:text-text-primary cursor-pointer"
                }`}
              >
                {isGenerating ? "Generating..." : "Regenerate →"}
              </button>
              <button className="font-sans text-sm text-text-muted hover:text-text-secondary transition-colors cursor-pointer">
                Export PDF
              </button>
            </div>
          </div>
        </div>

        {/* Phase timeline */}
        <div className="relative max-w-[800px]">
          {isGenerating ? (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-2 text-text-muted mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                <span className="font-mono text-sm uppercase tracking-widest">AI Engine Computing</span>
              </div>
              <p className="font-sans text-text-secondary text-lg">Analyzing skill gaps and calculating optimal learning paths...</p>
            </div>
          ) : (
            <>
              {/* Vertical spine */}
              <div className="absolute bg-border" style={{ left: 7, top: 12, bottom: 48, width: 1 }} />

          {INITIAL_PHASES.map((phase, pi) => (
            <div key={phase.id} className={`relative ${pi > 0 ? "mt-10" : ""}`}>
              {/* Phase node */}
              <div
                className={`absolute w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                  phase.status === "done"
                    ? "bg-text-primary border-text-primary"
                    : phase.status === "active"
                    ? "border-accent bg-canvas"
                    : "border-border border-dashed bg-canvas"
                }`}
                style={{ left: 0, top: 4 }}
              >
                {phase.status === "active" && <div className="w-1.5 h-1.5 rounded-full bg-accent" />}
              </div>

              {/* Phase label */}
              <div className="ml-10 flex items-baseline justify-between gap-4">
                <div>
                  <p className="font-mono text-[11px] text-text-muted">{phase.label}</p>
                  <h2
                    className={`font-sans font-semibold text-base mt-0.5 ${
                      phase.status === "done" ? "text-text-muted" : phase.status === "active" ? "text-text-primary" : "text-text-muted"
                    }`}
                  >
                    {phase.name}
                  </h2>
                </div>
                <span
                  className={`font-mono text-[11px] flex-shrink-0 ${
                    phase.status === "done" ? "text-success" : phase.status === "active" ? "text-warning" : "text-text-muted"
                  }`}
                >
                  [{phase.progress}]
                </span>
              </div>

              {/* Topics */}
              <div className="flex flex-col">
                {phases.find((p) => p.id === phase.id)?.topics.map((topic) => (
                  <TopicNode key={topic.id} topic={topic} onStatusChange={updateTopicStatus} />
                ))}
              </div>
            </div>
          ))}
            </>
          )}
        </div>

      </div>
    </AppShell>
  );
}
