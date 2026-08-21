import { useState } from "react";
import type { View, AppUser } from "../App";
import { signInWithGoogle, signInWithPassword, signUpWithPassword } from "../lib/auth";
import toast from 'react-hot-toast';

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
  const [confirmPass, setConfirmPass] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuthResult = (errorMsg: string | null) => {
    setLoading(false);
    if (errorMsg) {
      setError(errorMsg);
      toast.error(errorMsg);
    } else {
      toast.success("Successfully authenticated!");
      // For now, fallback to mock user state until we sync it with App.tsx full real state
      const user = role === "student" ? { ...STUDENT_USER, name: fullName || "Student" } : { ...MENTOR_USER, name: fullName || "Mentor" };
      onLogin(user);
      onClose();
      onNavigate(redirectTo ?? (role === "mentor" ? "admin" : "onboarding"));
    }
  };

  async function handleSubmit() {
    setError("");
    setLoading(true);
    
    if (isSignUp) {
      if (pass !== confirmPass) {
        handleAuthResult("Passwords do not match");
        return;
      }
      if (!fullName) {
        handleAuthResult("Full name is required");
        return;
      }
      const { error } = await signUpWithPassword(email, pass, fullName);
      handleAuthResult(error?.message || null);
    } else {
      const { error } = await signInWithPassword(email, pass);
      handleAuthResult(error?.message || null);
    }
  }

  async function handleGoogleSignIn() {
    setLoading(true);
    const { error } = await signInWithGoogle();
    handleAuthResult(error?.message || null);
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-canvas/80 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-[95%] sm:w-full max-w-md mx-auto sm:mx-4 bg-surface border border-border rounded-xl p-6 sm:p-8 animate-fade-up max-h-[90vh] overflow-y-auto">
        {(message || error) && (
          <div className="mb-5 px-4 py-3 bg-surface-hover border border-border rounded-lg">
            <p className={`font-sans text-[13px] leading-snug ${error ? 'text-red-500' : 'text-text-secondary'}`}>
              {error || message}
            </p>
          </div>
        )}

        <h2 className="font-sans font-semibold text-[20px] text-text-primary">
          {isSignUp ? "Create your account" : "Sign in to SkillForge"}
        </h2>
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
          {isSignUp && (
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name"
              className="h-9 px-3 rounded-lg bg-surface-hover border border-border text-text-primary text-sm placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-accent"
            />
          )}
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
          {isSignUp && (
            <input
              type="password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              placeholder="Confirm Password"
              className="h-9 px-3 rounded-lg bg-surface-hover border border-border text-text-primary text-sm placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-accent"
            />
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="btn-cta mt-5 w-full h-9 rounded-lg bg-white text-black text-sm font-semibold hover:bg-zinc-100 cursor-pointer disabled:opacity-50"
        >
          {loading ? "Please wait..." : "Continue →"}
        </button>

        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-border"></div>
          <span className="px-3 text-text-muted text-xs font-medium">OR</span>
          <div className="flex-1 border-t border-border"></div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="flex items-center justify-center w-full h-9 rounded-lg bg-surface-hover border border-border text-text-primary text-sm font-medium hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-50"
        >
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          {loading ? "Connecting to Google..." : "Continue with Google"}
        </button>

        <p className="mt-4 text-center font-sans text-[12px] text-text-muted">
          {isSignUp ? "Already have an account?" : "No account?"}{" "}
          <span
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-text-secondary hover:text-text-primary cursor-pointer transition-colors"
          >
            {isSignUp ? "Sign in →" : "Start free →"}
          </span>
        </p>
      </div>
    </div>
  );
}
