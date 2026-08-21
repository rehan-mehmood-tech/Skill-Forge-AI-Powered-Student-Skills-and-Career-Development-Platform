import type { View } from "../App";
import AppShell from "../components/AppShell";

interface Props {
  onNavigate: (v: View) => void;
}

const DOMAINS = [
  {
    id: "python",
    title: "Python OOP",
    description: "Data structures, object-oriented patterns, decorators, async/await.",
    questions: 12,
    time: "30m",
    difficulty: "Intermediate",
    prevScore: 0.79,
    prevLabel: "0.79 / 1.0",
    icon: "🐍",
  },
  {
    id: "web",
    title: "Web Development",
    description: "HTTP fundamentals, REST design, authentication, caching strategies.",
    questions: 15,
    time: "45m",
    difficulty: "Intermediate",
    prevScore: 0.55,
    prevLabel: "0.55 / 1.0",
    icon: "⬡",
  },
  {
    id: "git",
    title: "Git & Workflows",
    description: "Branching strategies, merge conflicts, rebasing, CI integration.",
    questions: 10,
    time: "25m",
    difficulty: "Beginner",
    prevScore: 0.45,
    prevLabel: "0.45 / 1.0",
    icon: "◌",
  },
  {
    id: "devops",
    title: "Cloud & DevOps",
    description: "Docker, Kubernetes, CI/CD pipelines, infrastructure as code.",
    questions: 12,
    time: "30m",
    difficulty: "Advanced",
    prevScore: null,
    prevLabel: null,
    icon: "⬗",
  },
  {
    id: "ai",
    title: "AI & ML Foundations",
    description: "Linear algebra, model training, evaluation metrics, prompt engineering.",
    questions: 15,
    time: "45m",
    difficulty: "Advanced",
    prevScore: null,
    prevLabel: null,
    icon: "◈",
  },
  {
    id: "databases",
    title: "Database Engineering",
    description: "SQL query optimization, normalization, indexing, transactions.",
    questions: 12,
    time: "30m",
    difficulty: "Intermediate",
    prevScore: 0.30,
    prevLabel: "0.30 / 1.0",
    icon: "▣",
  },
];

const DIFFICULTY_COLOR: Record<string, string> = {
  Beginner:     "text-success border-success",
  Intermediate: "text-warning border-warning",
  Advanced:     "text-danger border-danger",
};

export default function AssessmentPicker({ onNavigate }: Props) {
  return (
    <AppShell active="assessments" onNavigate={onNavigate}>
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-[1100px] pb-20 md:pb-8">
        {/* Header */}
        <div className="mb-8">
          <p className="font-mono text-[11px] text-text-muted uppercase tracking-widest mb-2">
            Assessments / Domain Picker
          </p>
          <h1 className="font-sans font-bold text-2xl text-text-primary">
            Verified Skill Benchmarks
          </h1>
          <p className="font-sans text-sm text-text-secondary mt-1 max-w-[560px]">
            Select a technical domain to evaluate your baseline competency. Each assessment
            updates your skill vector and adjusts your learning roadmap in real time.
          </p>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-6 mb-8 flex-wrap">
          {[
            { label: "Completed", value: "3", sub: "of 6 domains" },
            { label: "Avg Score", value: "0.52", sub: "across assessed" },
            { label: "Next Rec.", value: "DevOps", sub: "critical gap" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <div>
                <p className="font-mono text-[11px] text-text-muted uppercase tracking-widest">{stat.label}</p>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="font-mono font-bold text-xl text-text-primary tabular-nums">{stat.value}</span>
                  <span className="font-sans text-[12px] text-text-muted">{stat.sub}</span>
                </div>
              </div>
              <div className="w-px h-8 bg-border" />
            </div>
          ))}
        </div>

        {/* Bento grid — 3 columns on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {DOMAINS.map((domain) => (
            <DomainCard
              key={domain.id}
              domain={domain}
              onBegin={() => onNavigate("assessment")}
            />
          ))}
        </div>
      </div>
    </AppShell>
  );
}

function DomainCard({
  domain,
  onBegin,
}: {
  domain: (typeof DOMAINS)[number];
  onBegin: () => void;
}) {
  const assessed = domain.prevScore !== null;

  return (
    <div className="bg-surface border border-border rounded-xl p-5 flex flex-col gap-4 hover:border-text-muted transition-colors duration-150 group">
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div className="w-9 h-9 rounded-lg border border-border bg-surface-hover flex items-center justify-center text-lg select-none">
          {domain.icon}
        </div>
        <span
          className={`font-mono text-[10px] border rounded-md px-2 py-0.5 ${DIFFICULTY_COLOR[domain.difficulty] ?? "text-text-muted border-border"}`}
        >
          [{domain.difficulty}]
        </span>
      </div>

      {/* Title + description */}
      <div>
        <h2 className="font-sans font-semibold text-[15px] text-text-primary leading-tight">
          {domain.title}
        </h2>
        <p className="font-sans text-[13px] text-text-muted leading-5 mt-1">
          {domain.description}
        </p>
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-3">
        <span className="font-mono text-[11px] text-text-muted border border-border rounded-md px-2 py-0.5 bg-surface-hover">
          {domain.questions} Questions
        </span>
        <span className="font-mono text-[11px] text-text-muted border border-border rounded-md px-2 py-0.5 bg-surface-hover">
          {domain.time}
        </span>
      </div>

      {/* Previous score */}
      {assessed ? (
        <div>
          <p className="font-mono text-[10px] text-text-muted uppercase tracking-wide mb-1.5">Previous Score</p>
          <div className="w-full bg-border" style={{ height: 3 }}>
            <div className="h-full bg-text-primary" style={{ width: `${domain.prevScore! * 100}%` }} />
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="font-mono text-[12px] text-text-secondary tabular-nums">{domain.prevLabel}</span>
            <span className={`font-mono text-[11px] ${domain.prevScore! >= 0.7 ? "text-success" : domain.prevScore! >= 0.4 ? "text-warning" : "text-danger"}`}>
              {domain.prevScore! >= 0.7 ? "[Strong]" : domain.prevScore! >= 0.4 ? "[Developing]" : "[Critical Gap]"}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-danger" />
          <span className="font-mono text-[11px] text-danger">[Not Assessed — Critical Gap]</span>
        </div>
      )}

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* CTA */}
      <button
        onClick={onBegin}
        className="w-full h-9 rounded-lg bg-white text-black text-sm font-semibold hover:bg-zinc-100 transition-colors cursor-pointer"
      >
        {assessed ? "Re-Assess →" : "Begin Assessment →"}
      </button>
    </div>
  );
}
