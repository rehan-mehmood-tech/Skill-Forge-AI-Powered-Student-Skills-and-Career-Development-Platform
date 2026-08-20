import { useState } from "react";
import type { View, AppUser } from "../App";
import AppShell from "../components/AppShell";

interface Props {
  onNavigate: (v: View) => void;
  user?:      AppUser | null;
  onLogout?:  () => void;
}

const SKILL_VECTOR: { domain: string; key: string; value: number | null; required: number }[] = [
  { domain: "Python",    key: "python",    value: 0.79, required: 0.90 },
  { domain: "Web Dev",   key: "web",       value: 0.55, required: 0.80 },
  { domain: "Git",       key: "git",       value: 0.45, required: 0.70 },
  { domain: "DevOps",    key: "devops",    value: null,  required: 0.50 },
  { domain: "AI",        key: "ai",        value: 0.00, required: 0.40 },
  { domain: "Databases", key: "databases", value: 0.30, required: 0.75 },
];

const EXTRACTED_SKILLS = [
  "python", "fastapi", "postgresql", "docker", "git",
  "redis", "linux", "rest-apis", "sqlalchemy", "pytest",
];

const EXPERIENCE_OPTIONS = ["Student / Bootcamp", "Junior (0–2 yrs)", "Mid-Level (2–5 yrs)", "Senior (5+ yrs)"];

export default function Profile({ onNavigate, user, onLogout }: Props) {
  const [name,       setName]       = useState("Aisha Khan");
  const [email,      setEmail]      = useState("aisha@example.com");
  const [bio,        setBio]        = useState("Backend-focused engineer pursuing a career in distributed systems and cloud infrastructure.");
  const [expLevel,   setExpLevel]   = useState("Junior (0–2 yrs)");
  const [saved,      setSaved]      = useState(false);
  const [fileLabel,  setFileLabel]  = useState("aisha_khan_resume.pdf");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AppShell active="profile" onNavigate={onNavigate} user={user} onLogout={onLogout}>
      <div className="p-8 max-w-[900px] pb-20 md:pb-8">

        {/* Header */}
        <div className="mb-8">
          <p className="font-mono text-[11px] text-text-muted uppercase tracking-widest mb-2">Profile</p>
          <h1 className="font-sans font-bold text-2xl text-text-primary">Account & Skills</h1>
          <p className="font-sans text-sm text-text-secondary mt-1">
            Manage your profile, resume, and inspect your live skill vector.
          </p>
        </div>

        <div className="flex flex-col gap-6">

          {/* ── Profile Overview ── */}
          <div className="bg-surface border border-border rounded-xl p-6">
            <p className="font-mono text-[11px] text-text-muted uppercase tracking-widest mb-5">
              Profile Overview
            </p>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="flex flex-col items-center gap-3 flex-shrink-0">
                <div className="w-20 h-20 rounded-xl bg-surface-hover border border-border flex items-center justify-center">
                  <span className="font-sans font-bold text-2xl text-text-secondary">AK</span>
                </div>
                <button className="font-sans text-[12px] text-text-muted hover:text-text-secondary transition-colors cursor-pointer">
                  Change photo
                </button>
              </div>

              {/* Fields */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[10px] text-text-muted uppercase tracking-wide block mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-surface-hover border border-border text-text-primary text-sm font-sans placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="font-mono text-[10px] text-text-muted uppercase tracking-wide block mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-surface-hover border border-border text-text-primary text-sm font-sans placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="font-mono text-[10px] text-text-muted uppercase tracking-wide block mb-1.5">
                    Bio
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg bg-surface-hover border border-border text-text-primary text-sm font-sans placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                  />
                </div>
                <div>
                  <label className="font-mono text-[10px] text-text-muted uppercase tracking-wide block mb-1.5">
                    Experience Level
                  </label>
                  <select
                    value={expLevel}
                    onChange={(e) => setExpLevel(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-surface-hover border border-border text-text-primary text-sm font-sans focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer"
                  >
                    {EXPERIENCE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className="bg-surface-hover">{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-mono text-[10px] text-text-muted uppercase tracking-wide block mb-1.5">
                    Target Role
                  </label>
                  <div className="h-9 px-3 rounded-lg bg-surface-hover border border-border text-text-primary text-sm font-sans flex items-center justify-between cursor-pointer hover:border-text-muted transition-colors">
                    <span>Backend Developer</span>
                    <span className="text-text-muted">↓</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-5 border-t border-border flex items-center justify-between">
              <span className={`font-mono text-[11px] transition-colors ${saved ? "text-success" : "text-transparent"}`}>
                [changes saved]
              </span>
              <button
                onClick={handleSave}
                className="h-9 px-5 rounded-lg bg-white text-black text-sm font-semibold hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>

          {/* ── Resume Section ── */}
          <div className="bg-surface border border-border rounded-xl p-6">
            <p className="font-mono text-[11px] text-text-muted uppercase tracking-widest mb-5">
              Resume & Parsing
            </p>

            {/* Active file */}
            <div className="flex items-center justify-between p-3 bg-surface-hover border border-border rounded-lg mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-text-muted">
                  ▣
                </div>
                <div>
                  <p className="font-sans font-medium text-[13px] text-text-primary">{fileLabel}</p>
                  <p className="font-mono text-[10px] text-success mt-0.5">[parsed — Aug 20, 2026]</p>
                </div>
              </div>
              <button
                onClick={() => setFileLabel("aisha_khan_resume_v2.pdf")}
                className="h-8 px-3 rounded-lg border border-border bg-surface text-text-secondary text-[13px] font-medium hover:bg-surface-hover hover:text-text-primary transition-colors cursor-pointer"
              >
                Re-upload
              </button>
            </div>

            {/* Extracted skill chips */}
            <div>
              <p className="font-mono text-[10px] text-text-muted uppercase tracking-wide mb-3">
                Extracted Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {EXTRACTED_SKILLS.map((skill) => (
                  <span
                    key={skill}
                    className="font-mono text-[11px] text-text-secondary border border-border rounded-md px-2 py-0.5 bg-surface-hover hover:border-text-muted transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
                <button className="font-mono text-[11px] text-text-muted border border-dashed border-border rounded-md px-2 py-0.5 hover:border-text-muted hover:text-text-secondary transition-colors cursor-pointer">
                  + Add manually
                </button>
              </div>
            </div>
          </div>

          {/* ── Skill Vector Inspector ── */}
          <div className="bg-surface border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <p className="font-mono text-[11px] text-text-muted uppercase tracking-widest">
                Skill Vector Inspector
              </p>
              <span className="font-mono text-[10px] text-text-muted border border-border rounded-md px-2 py-0.5 bg-surface-hover">
                [JSONB — live]
              </span>
            </div>

            {/* Raw JSONB block */}
            <div className="bg-canvas border border-border rounded-lg p-4 mb-5 font-mono text-[12px] leading-6">
              <span className="text-text-muted">{"{"}</span>
              {SKILL_VECTOR.map((row) => (
                <div key={row.key} className="ml-4">
                  <span className="text-text-secondary">&quot;{row.key}&quot;</span>
                  <span className="text-text-muted">: </span>
                  <span className={row.value !== null ? (row.value >= row.required ? "text-success" : row.value > 0 ? "text-text-primary" : "text-danger") : "text-text-muted"}>
                    {row.value !== null ? row.value.toFixed(2) : "null"}
                  </span>
                  <span className="text-text-muted">,</span>
                  <span className="text-text-muted ml-3 text-[11px]">
                    {"// required: "}{row.required.toFixed(2)}{" — "}{row.value !== null ? `${(((row.value / row.required) * 100)).toFixed(0)}% of target` : "not assessed"}
                  </span>
                </div>
              ))}
              <span className="text-text-muted">{"}"}</span>
            </div>

            {/* Visual table */}
            <div className="flex flex-col">
              {/* Header */}
              <div className="flex items-center gap-3 pb-2 border-b border-border">
                <span className="font-mono text-[10px] text-text-muted uppercase tracking-wide flex-shrink-0" style={{ width: 96 }}>Domain</span>
                <span className="font-mono text-[10px] text-text-muted uppercase tracking-wide flex-1">Progress to Target</span>
                <span className="font-mono text-[10px] text-text-muted uppercase tracking-wide flex-shrink-0 text-right" style={{ width: 80 }}>Score</span>
                <span className="font-mono text-[10px] text-text-muted uppercase tracking-wide flex-shrink-0 text-right" style={{ width: 64 }}>Status</span>
              </div>

              {SKILL_VECTOR.map((row, i) => (
                <div key={row.key}>
                  {i > 0 && <div className="h-px bg-border-subtle" />}
                  <div className="flex items-center gap-3 py-2.5">
                    <span className="font-sans font-medium text-[13px] text-text-secondary flex-shrink-0" style={{ width: 96 }}>
                      {row.domain}
                    </span>
                    <div className="flex-1 relative bg-border" style={{ height: 4 }}>
                      {row.value !== null ? (
                        <div
                          className={`absolute left-0 top-0 h-full ${row.value >= row.required ? "bg-success" : "bg-text-primary"}`}
                          style={{ width: `${Math.min(row.value * 100, 100)}%` }}
                        />
                      ) : (
                        <div
                          className="absolute inset-0"
                          style={{
                            backgroundImage: "repeating-linear-gradient(90deg,#27272A 0,#27272A 3px,transparent 3px,transparent 6px)",
                          }}
                        />
                      )}
                      <div
                        className="absolute bg-border-subtle"
                        style={{ left: `${row.required * 100}%`, top: -4, width: 1, height: 12 }}
                      />
                    </div>
                    <span className="font-mono text-[12px] text-text-secondary tabular-nums flex-shrink-0 text-right" style={{ width: 80 }}>
                      {row.value !== null ? `${row.value.toFixed(2)} / ${row.required.toFixed(2)}` : "— / " + row.required.toFixed(2)}
                    </span>
                    <div className="flex-shrink-0 text-right" style={{ width: 64 }}>
                      {row.value === null ? (
                        <span className="font-mono text-[10px] text-danger border border-danger rounded-md px-1.5 py-0.5">[gap]</span>
                      ) : row.value >= row.required ? (
                        <span className="font-mono text-[10px] text-success border border-success rounded-md px-1.5 py-0.5">[met]</span>
                      ) : (
                        <span className="font-mono text-[10px] text-warning border border-warning rounded-md px-1.5 py-0.5">[gap]</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Danger zone */}
          <div className="bg-surface border border-danger rounded-xl p-6">
            <p className="font-mono text-[11px] text-danger uppercase tracking-widest mb-3">
              Danger Zone
            </p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-sans font-medium text-[14px] text-text-primary">Reset Skill Vector</p>
                <p className="font-sans text-[13px] text-text-muted mt-0.5">
                  Clears all assessment data and resets your roadmap. This cannot be undone.
                </p>
              </div>
              <button className="h-9 px-4 rounded-lg border border-danger text-danger text-sm font-medium hover:bg-danger hover:text-canvas transition-colors cursor-pointer flex-shrink-0 ml-4">
                Reset Vector
              </button>
            </div>
          </div>

        </div>
      </div>
    </AppShell>
  );
}
