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

const CAPABILITIES = [
  {
    id:    "analytics",
    step:  "01",
    title: "Cohort Analytics Dashboard",
    desc:  "A real-time readiness distribution view across your entire student cohort. See median competency scores per domain, identify students in critical-gap territory, and track cohort-level progress over time.",
    items: [
      "Readiness heatmap across 6 competency domains",
      "Cohort median vs. individual performance tracking",
      "Flag students below domain threshold automatically",
      "Export cohort reports as CSV or PDF",
    ],
    preview: [
      { label: "Aisha Khan",     domain: "Backend Dev",  pct: 62, status: "gap"  },
      { label: "Marcus Lee",     domain: "Full-Stack",   pct: 78, status: "ok"   },
      { label: "Priya Nair",     domain: "ML Engineer",  pct: 44, status: "gap"  },
      { label: "Jordan Smith",   domain: "Cloud Arch",   pct: 85, status: "ok"   },
      { label: "Amira Hassan",   domain: "Backend Dev",  pct: 31, status: "crit" },
    ],
  },
  {
    id:    "audit",
    step:  "02",
    title: "Student Skill Audit Engine",
    desc:  "Deep-dive into any individual student profile. View their full skill vector, domain-by-domain assessment history, and a gap closure trajectory — all in one read-only audit panel.",
    items: [
      "Individual skill vector with delta history",
      "Assessment attempt log and score progression",
      "Gap closure trajectory with time estimates",
      "Send personalized recommendation notes",
    ],
    preview: null,
  },
  {
    id:    "resources",
    step:  "03",
    title: "Curriculum & Resource Management",
    desc:  "Add, curate, and annotate learning resources across the 6 domain tracks. Tag resources by difficulty level, domain, and competency threshold. Resources are surfaced to students by the AI Copilot when relevant.",
    items: [
      "Add resources from ACM, arXiv, or custom URLs",
      "Tag by domain, difficulty, and competency range",
      "Resources cited by AI Copilot (RAG-grounded)",
      "Usage analytics: which resources students open",
    ],
    preview: null,
  },
];

const TESTIMONIALS = [
  {
    quote: "SkillForge gives me the first quantitative view I have ever had of where each of my students actually stands — not where they think they stand.",
    name:  "Dr. Priya Mehra",
    role:  "Professor of CS, IIT Delhi",
  },
  {
    quote: "The cohort heatmap alone saved me 6 hours per semester in end-of-term gap analysis. The skill vector data is genuinely useful for advising.",
    name:  "Prof. James Osei",
    role:  "Technical Advisor, UCL Engineering",
  },
];

function CohortPreview({ rows }: { rows: typeof CAPABILITIES[0]["preview"] }) {
  if (!rows) return null;
  return (
    <div className="mt-5 bg-surface-hover border border-border rounded-xl p-4">
      <p className="font-mono text-[10px] text-text-muted uppercase tracking-widest mb-3">Cohort Snapshot — Live Preview</p>
      <div className="flex flex-col gap-2">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-surface border border-border flex items-center justify-center flex-shrink-0">
              <span className="font-mono text-[10px] text-text-muted">{row.label[0]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="font-sans text-[12px] text-text-secondary truncate">{row.label}</span>
                <span className={`font-mono text-[10px] flex-shrink-0 ml-2 ${
                  row.status === "ok" ? "text-success" : row.status === "gap" ? "text-warning" : "text-danger"
                }`}>{row.pct}%</span>
              </div>
              <div className="w-full bg-border" style={{ height: 2 }}>
                <div
                  className={`h-full ${row.status === "ok" ? "bg-success" : row.status === "gap" ? "bg-warning" : "bg-danger"}`}
                  style={{ width: `${row.pct}%` }}
                />
              </div>
            </div>
            <span className="font-mono text-[10px] text-text-muted flex-shrink-0" style={{ minWidth: 80 }}>{row.domain}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Mentors({ onNavigate, user, onLogin, onLogout }: Props) {
  const [auth, setAuth] = useState<{ open: boolean; tab: "signin" | "apply" }>({ open: false, tab: "signin" });

  const openAuth = (tab: "signin" | "apply") => setAuth({ open: true, tab });

  return (
    <div className="min-h-screen bg-canvas text-text-primary overflow-x-hidden">
      <PublicNavbar active="mentors" onNavigate={onNavigate} user={user} onLogin={onLogin} onLogout={onLogout} />

      {/* Hero */}
      <div className="pt-[88px] pb-14 px-6 md:px-10 max-w-[1080px] mx-auto">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-px w-4 bg-border" />
          <span className="font-mono text-[11px] text-text-muted uppercase tracking-[0.14em]">For Educators & Technical Advisors</span>
        </div>
        <h1 className="font-sans font-bold text-[42px] md:text-[56px] text-text-primary tracking-[-0.025em] leading-[1.05] mb-4 max-w-[760px]">
          Institutional Intelligence<br />
          <span className="text-text-secondary">for Technical Mentors.</span>
        </h1>
        <p className="font-sans text-[15px] text-[#71717A] leading-[27px] max-w-[560px] mb-8">
          SkillForge gives university faculty and technical advisors a quantitative lens on student readiness — replacing gut-feel advising with a verified, domain-accurate competency system.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => openAuth("apply")}
            className="btn-cta h-10 px-6 rounded-lg bg-white text-black text-[13px] font-semibold hover:bg-zinc-100 cursor-pointer"
          >
            Apply as Mentor →
          </button>
          <button
            onClick={() => openAuth("signin")}
            className="btn-cta h-10 px-5 rounded-lg border border-border bg-surface text-text-secondary hover:border-text-muted hover:bg-surface-hover hover:text-text-primary text-[13px] font-medium cursor-pointer"
          >
            Mentor Sign In
          </button>
        </div>

        {/* Stat strip */}
        <div className="mt-10 flex flex-wrap gap-8">
          {[
            { val: "47+",   label: "Cohorts managed" },
            { val: "1,240", label: "Students assessed" },
            { val: "6",     label: "Domains tracked"  },
            { val: "SDG 4", label: "Education impact"  },
          ].map((s) => (
            <div key={s.label}>
              <p className="font-mono font-bold text-[28px] text-text-primary leading-none">{s.val}</p>
              <p className="font-sans text-[12px] text-text-muted mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Capabilities */}
      <div className="px-6 md:px-10 max-w-[1080px] mx-auto pb-20">
        {CAPABILITIES.map((cap, i) => (
          <div key={cap.id} className={`border-t border-border py-12 grid lg:grid-cols-2 gap-10 items-start ${i === 0 ? "" : ""}`}>
            {/* Left */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-[11px] text-text-muted">{cap.step}</span>
                <div className="h-px w-5 bg-border" />
                <span className="font-mono text-[11px] text-text-muted tracking-[0.1em] uppercase">Mentor Capability</span>
              </div>
              <h2 className="font-sans font-bold text-[26px] md:text-[32px] text-text-primary tracking-[-0.02em] leading-[1.15] mb-4">
                {cap.title}
              </h2>
              <p className="font-sans text-[14px] text-text-secondary leading-[24px] mb-5">{cap.desc}</p>
              <div className="flex flex-col gap-2">
                {cap.items.map((item) => (
                  <div key={item} className="flex gap-2.5 items-start">
                    <span className="font-mono text-[10px] text-success mt-0.5 flex-shrink-0">✓</span>
                    <span className="font-sans text-[13px] text-text-secondary">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: preview or empty */}
            <div>
              {cap.preview ? (
                <CohortPreview rows={cap.preview} />
              ) : (
                <div className="bg-surface border border-border rounded-xl p-6 flex flex-col gap-4">
                  <p className="font-mono text-[11px] text-text-muted uppercase tracking-widest">{cap.title}</p>
                  <div className="flex flex-col gap-3">
                    {cap.items.map((item, j) => (
                      <div key={item} className="flex items-center gap-3 py-2.5 border-b border-border last:border-0">
                        <span className="font-mono text-[10px] text-text-muted w-5 text-center">{String(j + 1).padStart(2, "0")}</span>
                        <span className="font-sans text-[13px] text-text-secondary flex-1">{item}</span>
                        <span className="font-mono text-[10px] text-success">✓</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Testimonials */}
        <div className="border-t border-border pt-12">
          <p className="font-mono text-[11px] text-text-muted uppercase tracking-widest mb-7">From educators using SkillForge</p>
          <div className="grid md:grid-cols-2 gap-4">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-surface border border-border rounded-xl p-6">
                <p className="font-sans text-[14px] text-text-secondary leading-[24px] mb-5 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-hover border border-border flex items-center justify-center">
                    <span className="font-mono text-[11px] text-text-muted">{t.name[0]}</span>
                  </div>
                  <div>
                    <p className="font-sans font-medium text-[13px] text-text-primary">{t.name}</p>
                    <p className="font-sans text-[11px] text-text-muted mt-0.5">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 border-t border-border pt-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div>
            <h3 className="font-sans font-semibold text-[18px] text-text-primary mb-1">Ready to instrument your cohort?</h3>
            <p className="font-sans text-[13px] text-text-secondary">Applications reviewed within 48 hours. No cost for academic institutions.</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <button onClick={() => openAuth("apply")} className="btn-cta h-9 px-5 rounded-lg bg-white text-black text-[13px] font-semibold hover:bg-zinc-100 cursor-pointer">
              Apply as Mentor
            </button>
            <button onClick={() => openAuth("signin")} className="btn-cta h-9 px-4 rounded-lg border border-border text-text-secondary hover:border-text-muted text-[13px] cursor-pointer">
              Mentor Sign In
            </button>
          </div>
        </div>
      </div>

      <footer className="px-6 md:px-10 py-7 border-t border-border flex items-center justify-between">
        <span className="font-sans font-semibold text-[12px] text-text-muted tracking-[0.1em] uppercase cursor-pointer" onClick={() => onNavigate("landing")}>SkillForge</span>
        <span className="font-mono text-[11px] text-text-disabled">© 2026 SkillForge</span>
      </footer>

      {auth && (
        <AuthModal
          onClose={() => setAuth(false)}
          onNavigate={onNavigate}
          onLogin={onLogin}
          defaultRole="mentor"
          message={authFor === "apply" ? "Apply for mentor access — your application will be reviewed within 48 hours." : undefined}
          redirectTo="admin"
        />
      )}
    </div>
  );
}
