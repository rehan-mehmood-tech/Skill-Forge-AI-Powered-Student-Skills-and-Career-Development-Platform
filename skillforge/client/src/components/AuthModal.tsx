import { useState } from "react";
import type { View, AppUser } from "../App";

export const STUDENT_USER: AppUser = {
  name:         "Aisha Khan",
  role:         "student",
  targetRole:   "Backend Developer",
  activePhase:  "Phase 02: Core Systems & APIs",
  readinessPct: 62,
  skillVector: [
    { domain: "python",           score: 0.79 },
    { domain: "web_apis",         score: 0.55 },
    { domain: "modern_databases", score: 0.48 },
    { domain: "system_arch",      score: 0.35, gap: true },
    { domain: "cloud_devops",     score: 0.20, gap: true },
    { domain: "applied_ai",       score: 0.15, gap: true },
  ],
};

export const MENTOR_USER: AppUser = {
  name:         "Dr. Priya Patel",
  role:         "mentor",
  targetRole:   "Mentor",
  activePhase:  "",
  readinessPct: 0,
  skillVector:  [],
};

interface Props {
  onClose:      () => void;
  onNavigate:   (v: View) => void;
  onLogin:      (u: AppUser) => void;
  defaultRole?: "student" | "mentor";
  message?:     string;
  redirectTo?:  View;
}

export default function AuthModal({
  onClose, onNavigate, onLogin,
  defaultRole = "student", message, redirectTo,
}: Props) {
  const [role,  setRole]  = useState<"student" | "mentor">(defaultRole);
  const [email, setEmail] = useState("");
  const [pass,  setPass]  = useState("");

  function handleSubmit() {
    const user = role === "student" ? STUDENT_USER : MENTOR_USER;
    onLogin(user);
    onClose();
    onNavigate(redirectTo ?? (role === "mentor" ? "admin" : "onboarding"));
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-canvas/80 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-[440px] mx-4 bg-surface border border-border rounded-xl p-8 animate-fade-up">
        {message && (
          <div className="mb-5 px-4 py-3 bg-surface-hover border border-border rounded-lg">
            <p className="font-sans text-[13px] text-text-secondary leading-snug">{message}</p>
          </div>
        )}

        <h2 className="font-sans font-semibold text-[20px] text-text-primary">Sign in to SkillForge</h2>
        <p className="font-sans text-[13px] text-text-muted mt-1">Assess. Measure. Build.</p>

        <div className="mt-5 p-1 bg-surface-hover border border-border rounded-lg flex gap-1">
          {(["student", "mentor"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`flex-1 h-8 rounded-md text-sm font-medium transition-colors duration-150 cursor-pointer btn-cta ${
                role === r ? "bg-text-primary text-canvas" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {r === "student" ? "Student" : "Mentor / Admin"}
            </button>
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="h-9 px-3 rounded-lg bg-surface-hover border border-border text-text-primary text-sm placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Password"
            className="h-9 px-3 rounded-lg bg-surface-hover border border-border text-text-primary text-sm placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="btn-cta mt-5 w-full h-9 rounded-lg bg-white text-black text-sm font-semibold hover:bg-zinc-100 cursor-pointer"
        >
          Continue →
        </button>

        <p className="mt-4 text-center font-sans text-[12px] text-text-muted">
          No account?{" "}
          <span
            onClick={() => { onClose(); onNavigate("onboarding"); }}
            className="text-text-secondary hover:text-text-primary cursor-pointer transition-colors"
          >
            Start free →
          </span>
        </p>
      </div>
    </div>
  );
}
