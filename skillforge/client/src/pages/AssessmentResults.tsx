import type { View } from "../App";

interface Props {
  onNavigate: (v: View) => void;
}

const ANSWER_BREAKDOWN = [
  { q: "Q01", topic: "Data Classes",         correct: true  },
  { q: "Q02", topic: "Generators",           correct: true  },
  { q: "Q03", topic: "Context Managers",     correct: false },
  { q: "Q04", topic: "Liskov Substitution",  correct: true  },
  { q: "Q05", topic: "Metaclasses",          correct: false },
  { q: "Q06", topic: "Decorators",           correct: true  },
  { q: "Q07", topic: "AsyncIO",              correct: true  },
  { q: "Q08", topic: "Multiple Inheritance", correct: false },
  { q: "Q09", topic: "Type Hints",           correct: true  },
  { q: "Q10", topic: "Dataclasses",          correct: true  },
  { q: "Q11", topic: "Abstract Classes",     correct: true  },
  { q: "Q12", topic: "GIL & Threading",      correct: true  },
];

const VECTOR_DELTA = [
  { domain: "Python",    before: 0.65, after: 0.79, required: 0.90 },
  { domain: "Web",       before: 0.55, after: 0.55, required: 0.80 },
  { domain: "Git",       before: 0.45, after: 0.45, required: 0.70 },
  { domain: "DevOps",    before: null,  after: null, required: 0.50 },
  { domain: "Databases", before: 0.30, after: 0.30, required: 0.75 },
];

export default function AssessmentResults({ onNavigate }: Props) {
  const correct = ANSWER_BREAKDOWN.filter((a) => a.correct).length;
  const total   = ANSWER_BREAKDOWN.length;
  const score   = (correct / total).toFixed(2);
  const pct     = Math.round((correct / total) * 100);

  return (
    <div className="min-h-screen bg-canvas text-text-primary font-sans">
      {/* Topbar */}
      <div className="h-[52px] border-b border-border flex items-center justify-between px-8 sticky top-0 bg-canvas z-10">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-text-secondary border border-border rounded-md px-2 py-0.5 bg-surface">
            [Python OOP Assessment]
          </span>
          <span className="font-sans text-[13px] text-text-muted">Results</span>
        </div>
        <button
          onClick={() => onNavigate("assessments")}
          className="font-sans text-[13px] text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
        >
          ← Back to Assessments
        </button>
      </div>

      <div className="max-w-[840px] mx-auto px-6 py-10 flex flex-col gap-6">

        {/* ── Main score card ── */}
        <div className="bg-surface border border-border rounded-xl p-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="font-mono text-[11px] text-text-muted uppercase tracking-widest mb-3">
                Assessment Score — Python OOP
              </p>
              <div className="flex items-end gap-4">
                <span className="font-mono font-bold text-[64px] leading-none text-text-primary tabular-nums">
                  {pct}%
                </span>
                <div className="mb-2">
                  <span className="font-mono text-xl text-text-secondary tabular-nums">
                    {score} / 1.00
                  </span>
                  <p className="font-sans text-[13px] text-text-muted mt-0.5">
                    {correct} correct of {total} questions
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full max-w-[400px] bg-border mt-4" style={{ height: 4 }}>
                <div
                  className={`h-full ${pct >= 70 ? "bg-success" : pct >= 50 ? "bg-warning" : "bg-danger"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 items-start md:items-end">
              <span className={`font-mono text-[11px] border rounded-md px-3 py-1 ${pct >= 70 ? "border-success text-success" : pct >= 50 ? "border-warning text-warning" : "border-danger text-danger"}`}>
                [{pct >= 70 ? "Strong Performance" : pct >= 50 ? "Developing" : "Needs Work"}]
              </span>
              <div className="text-right">
                <p className="font-sans text-[12px] text-text-muted">Avg. time per question</p>
                <p className="font-mono text-[14px] text-text-secondary mt-0.5">1m 52s</p>
              </div>
              <div className="text-right">
                <p className="font-sans text-[12px] text-text-muted">Completed</p>
                <p className="font-mono text-[12px] text-text-secondary mt-0.5">Aug 20, 2026 — 14:37</p>
              </div>
            </div>
          </div>

          {/* Correct / Incorrect breakdown bar */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-success" />
                <span className="font-sans text-[13px] text-text-secondary">{correct} Correct</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-danger" />
                <span className="font-sans text-[13px] text-text-secondary">{total - correct} Incorrect</span>
              </div>
            </div>
            {/* Segmented bar */}
            <div className="flex w-full h-2 mt-3 gap-px overflow-hidden rounded-none">
              {ANSWER_BREAKDOWN.map((a, i) => (
                <div
                  key={i}
                  className={`flex-1 ${a.correct ? "bg-success" : "bg-danger"}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Skill Vector Impact ── */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <p className="font-mono text-[11px] text-text-muted uppercase tracking-widest mb-4">
            Skill Vector Impact
          </p>
          <div className="flex flex-col gap-3">
            {VECTOR_DELTA.map((row) => (
              <div key={row.domain} className="flex items-center gap-4">
                {/* Domain */}
                <div className="font-sans font-medium text-[13px] text-text-secondary flex-shrink-0" style={{ width: 88 }}>
                  {row.domain}
                </div>
                {/* Delta display */}
                {row.before !== null && row.after !== null ? (
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {/* Track */}
                    <div className="relative flex-1 bg-border" style={{ height: 4 }}>
                      {/* Before (ghost) */}
                      <div
                        className="absolute left-0 top-0 h-full bg-border-subtle"
                        style={{ width: `${row.before * 100}%` }}
                      />
                      {/* After */}
                      <div
                        className="absolute left-0 top-0 h-full bg-text-primary transition-all"
                        style={{ width: `${row.after * 100}%` }}
                      />
                      {/* Required marker */}
                      <div
                        className="absolute bg-border-subtle"
                        style={{ left: `${row.required * 100}%`, top: -4, width: 1, height: 12 }}
                      />
                    </div>
                    {/* Before → After */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className="font-mono text-[11px] text-text-muted tabular-nums">{row.before.toFixed(2)}</span>
                      {row.after > row.before ? (
                        <>
                          <span className="font-mono text-[11px] text-text-muted">→</span>
                          <span className="font-mono text-[11px] text-success tabular-nums font-medium">{row.after.toFixed(2)}</span>
                          <span className="font-mono text-[10px] text-success">[+{(row.after - row.before).toFixed(2)}]</span>
                        </>
                      ) : (
                        <span className="font-mono text-[11px] text-text-muted tabular-nums">[unchanged]</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center gap-2">
                    <div className="relative flex-1 bg-border" style={{ height: 4 }}>
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage: "repeating-linear-gradient(90deg,#27272A 0,#27272A 3px,transparent 3px,transparent 6px)",
                        }}
                      />
                    </div>
                    <span className="font-mono text-[11px] text-text-muted flex-shrink-0">[not assessed]</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Readiness delta */}
          <div className="mt-5 pt-5 border-t border-border flex items-center justify-between">
            <div>
              <p className="font-sans text-[13px] text-text-secondary">Overall readiness updated</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-xl font-bold text-text-muted tabular-nums">58%</span>
                <span className="font-mono text-base text-text-muted">→</span>
                <span className="font-mono text-xl font-bold text-text-primary tabular-nums">62%</span>
                <span className="font-mono text-[12px] text-success">[+4%]</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Answer-by-Answer breakdown ── */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <p className="font-mono text-[11px] text-text-muted uppercase tracking-widest mb-4">
            Question Breakdown
          </p>
          <div className="flex flex-col">
            {ANSWER_BREAKDOWN.map((item, i) => (
              <div key={item.q}>
                {i > 0 && <div className="h-px bg-border-subtle" />}
                <div className="flex items-center gap-4 py-2.5">
                  <span className="font-mono text-[11px] text-text-muted w-8 flex-shrink-0">{item.q}</span>
                  <span className="font-sans text-[13px] text-text-secondary flex-1">{item.topic}</span>
                  <span
                    className={`font-mono text-[10px] border rounded-md px-2 py-0.5 flex-shrink-0 ${
                      item.correct ? "text-success border-success" : "text-danger border-danger"
                    }`}
                  >
                    {item.correct ? "[Correct]" : "[Incorrect]"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => onNavigate("roadmap")}
            className="flex-1 h-10 rounded-lg bg-white text-black text-sm font-semibold hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            View Updated Roadmap →
          </button>
          <button
            onClick={() => onNavigate("assessments")}
            className="flex-1 h-10 rounded-lg border border-border bg-surface text-text-secondary text-sm font-medium hover:bg-surface-hover hover:text-text-primary transition-colors cursor-pointer"
          >
            Review Incorrect Explanations
          </button>
          <button
            onClick={() => onNavigate("assessments")}
            className="h-10 px-5 rounded-lg border border-border bg-surface text-text-secondary text-sm font-medium hover:bg-surface-hover hover:text-text-primary transition-colors cursor-pointer"
          >
            Take Next Assessment →
          </button>
        </div>
      </div>
    </div>
  );
}
