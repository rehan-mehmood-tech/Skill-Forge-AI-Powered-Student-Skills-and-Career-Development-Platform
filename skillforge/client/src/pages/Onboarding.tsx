import { useState } from "react";
import type { View, AppUser } from "../App";

interface Props {
  onNavigate: (v: View) => void;
  onLogin:    (u: AppUser) => void;
}

const ROLES = [
  { id: "backend",   label: "Backend Developer",  tags: ["Python", "Databases", "APIs"] },
  { id: "ai",        label: "AI / ML Engineer",    tags: ["PyTorch", "Statistics", "MLOps"] },
  { id: "devops",    label: "DevOps Engineer",     tags: ["Docker", "Kubernetes", "CI/CD"] },
  { id: "fullstack", label: "Full Stack Developer",tags: ["React", "Node.js", "Postgres"] },
  { id: "data",      label: "Data Engineer",       tags: ["Spark", "SQL", "dbt"] },
  { id: "security",  label: "Security Engineer",   tags: ["Networking", "Pentesting", "SIEM"] },
];

const SKILL_LEVELS = [
  { id: "student",      label: "Student / Bootcamp",  sub: "Currently enrolled or recent grad" },
  { id: "junior",       label: "Junior (0–2 yrs)",     sub: "First professional role" },
  { id: "mid",          label: "Mid-Level (2–5 yrs)",  sub: "Solid fundamentals, growing breadth" },
  { id: "senior",       label: "Senior (5+ yrs)",      sub: "Architecture and team leadership" },
];

type Step = 1 | 2 | 3;

const ROLE_TO_TARGET: Record<string, string> = {
  backend:   "Backend Developer",
  ai:        "AI / ML Engineer",
  devops:    "DevOps Engineer",
  fullstack: "Full Stack Developer",
  data:      "Data Engineer",
  security:  "Security Engineer",
};

export default function Onboarding({ onNavigate, onLogin }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const canProceed =
    step === 1 ? selectedRole !== null :
    step === 2 ? true :                  // resume is optional
    selectedLevel !== null;

  const handleNext = () => {
    if (step < 3) { setStep((step + 1) as Step); return; }
    const targetRole = ROLE_TO_TARGET[selectedRole ?? "backend"] ?? "Backend Developer";
    const levelLabel = SKILL_LEVELS.find((l) => l.id === selectedLevel)?.label ?? "Student / Bootcamp";
    const newUser: AppUser = {
      name:         "New User",
      role:         "student",
      targetRole,
      activePhase:  "Phase 01: Foundations",
      readinessPct: 0,
      skillVector:  [
        { domain: "python",            score: 0.10 },
        { domain: "web_apis",          score: 0.05 },
        { domain: "modern_databases",  score: 0.05 },
        { domain: "system_arch",       score: 0.00, gap: true },
        { domain: "cloud_devops",      score: 0.00, gap: true },
        { domain: "applied_ai",        score: 0.00, gap: true },
      ],
    };
    void levelLabel;
    onLogin(newUser);
    onNavigate("dashboard");
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      {/* Minimal topbar */}
      <nav className="h-[52px] border-b border-border flex items-center justify-between px-8 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-sans font-semibold text-[13px] text-text-primary tracking-[0.1em] uppercase">SkillForge</span>
          <span className="font-mono text-[11px] text-text-muted">[v1.0]</span>
        </div>
        <button
          onClick={() => onNavigate("dashboard")}
          className="font-sans text-[13px] text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
        >
          Skip setup →
        </button>
      </nav>

      {/* Step progress bar */}
      <div className="w-full h-[3px] bg-border flex-shrink-0">
        <div
          className="h-full bg-text-primary transition-all duration-300"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-start px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-[720px]">

          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-8">
            {([1, 2, 3] as Step[]).map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full border flex items-center justify-center font-mono text-[11px] transition-colors ${
                    s === step
                      ? "border-text-primary bg-text-primary text-canvas"
                      : s < step
                      ? "border-success bg-canvas text-success"
                      : "border-border bg-canvas text-text-muted"
                  }`}
                >
                  {s < step ? "✓" : s}
                </div>
                <span className={`font-sans text-[13px] ${s === step ? "text-text-primary font-medium" : "text-text-muted"}`}>
                  {s === 1 ? "Target Role" : s === 2 ? "Resume Upload" : "Experience Level"}
                </span>
                {s < 3 && <div className="w-8 h-px bg-border" />}
              </div>
            ))}
          </div>

          {/* ── Step 1: Target Role ── */}
          {step === 1 && (
            <div>
              <h1 className="font-sans font-semibold text-2xl text-text-primary mb-1">
                Select your target role
              </h1>
              <p className="font-sans text-sm text-text-secondary mb-8">
                SkillForge will calibrate your assessment engine and generate a personalized roadmap.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {ROLES.map((role) => {
                  const isSelected = selectedRole === role.id;
                  return (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all duration-100 cursor-pointer ${
                        isSelected
                          ? "border-text-primary bg-surface"
                          : "border-border bg-surface hover:border-text-muted hover:bg-surface-hover"
                      }`}
                    >
                      <span className={`font-sans font-medium text-[14px] mb-2 ${isSelected ? "text-text-primary" : "text-text-secondary"}`}>
                        {role.label}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {role.tags.map((tag) => (
                          <span
                            key={tag}
                            className="font-mono text-[10px] text-text-muted border border-border rounded-md px-1.5 py-0.5"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Step 2: Resume Upload ── */}
          {step === 2 && (
            <div>
              <h1 className="font-sans font-semibold text-2xl text-text-primary mb-1">
                Upload your resume
              </h1>
              <p className="font-sans text-sm text-text-secondary mb-8">
                We'll parse your resume to pre-populate your skill vector and save you time. This step is optional.
              </p>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  const file = e.dataTransfer.files[0];
                  if (file) setUploadedFile(file.name);
                }}
                className={`w-full flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed transition-colors py-16 cursor-pointer ${
                  dragOver
                    ? "border-text-secondary bg-surface-hover"
                    : uploadedFile
                    ? "border-success bg-surface"
                    : "border-border bg-surface hover:border-text-muted"
                }`}
                onClick={() => {
                  // Simulate file pick
                  if (!uploadedFile) setUploadedFile("aisha_khan_resume.pdf");
                }}
              >
                {uploadedFile ? (
                  <>
                    <div className="w-10 h-10 rounded-xl border border-success flex items-center justify-center">
                      <span className="text-success text-lg">✓</span>
                    </div>
                    <div className="text-center">
                      <p className="font-sans font-medium text-sm text-text-primary">{uploadedFile}</p>
                      <p className="font-mono text-[11px] text-success mt-1">[parsed successfully]</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setUploadedFile(null); }}
                      className="font-sans text-[12px] text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
                    >
                      Remove file
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-xl border border-border flex items-center justify-center">
                      <span className="text-text-muted text-xl">↑</span>
                    </div>
                    <div className="text-center">
                      <p className="font-sans font-medium text-sm text-text-secondary">
                        Drop your resume here or click to browse
                      </p>
                      <p className="font-mono text-[11px] text-text-muted mt-1">[PDF / DOCX — max 5MB]</p>
                    </div>
                  </>
                )}
              </div>

              {uploadedFile && (
                <div className="mt-6 bg-surface border border-border rounded-xl p-4">
                  <p className="font-mono text-[11px] text-text-muted uppercase tracking-widest mb-3">
                    Extracted Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["python", "fastapi", "postgresql", "docker", "git", "redis", "linux", "rest-apis"].map((skill) => (
                      <span
                        key={skill}
                        className="font-mono text-[11px] text-text-secondary border border-border rounded-md px-2 py-0.5 bg-surface-hover"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Step 3: Experience Level ── */}
          {step === 3 && (
            <div>
              <h1 className="font-sans font-semibold text-2xl text-text-primary mb-1">
                Self-declare your experience level
              </h1>
              <p className="font-sans text-sm text-text-secondary mb-8">
                This calibrates your initial skill vector baseline. You can update this at any time.
              </p>
              <div className="flex flex-col gap-3">
                {SKILL_LEVELS.map((level) => {
                  const isSelected = selectedLevel === level.id;
                  return (
                    <button
                      key={level.id}
                      onClick={() => setSelectedLevel(level.id)}
                      className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all duration-100 cursor-pointer ${
                        isSelected
                          ? "border-text-primary bg-surface"
                          : "border-border bg-surface hover:border-text-muted hover:bg-surface-hover"
                      }`}
                    >
                      <div>
                        <p className={`font-sans font-medium text-[14px] ${isSelected ? "text-text-primary" : "text-text-secondary"}`}>
                          {level.label}
                        </p>
                        <p className="font-sans text-[12px] text-text-muted mt-0.5">{level.sub}</p>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ml-4 ${
                          isSelected ? "border-text-primary" : "border-border"
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-text-primary" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10">
            <button
              onClick={() => step > 1 && setStep((step - 1) as Step)}
              disabled={step === 1}
              className={`h-9 px-4 rounded-lg border border-border bg-surface text-text-secondary text-sm font-medium transition-colors ${
                step === 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-surface-hover hover:text-text-primary cursor-pointer"
              }`}
            >
              ← Back
            </button>
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className={`h-9 px-6 rounded-lg text-sm font-semibold transition-colors ${
                canProceed
                  ? "bg-white text-black hover:bg-zinc-100 cursor-pointer"
                  : "bg-surface border border-border text-text-muted cursor-not-allowed opacity-40"
              }`}
            >
              {step < 3 ? "Continue →" : "Launch Dashboard →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
