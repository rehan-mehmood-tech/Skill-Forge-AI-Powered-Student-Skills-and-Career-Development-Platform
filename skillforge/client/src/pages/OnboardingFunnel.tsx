import { useState, useEffect } from "react";
import type { View, AppUser } from "../App";
import AuthModal from "../components/AuthModal";
import { post } from "../lib/api";
import toast from 'react-hot-toast';
import { useAuth } from "../context/AuthContext";

interface Props {
  onNavigate: (v: View) => void;
  onLogin:    (u: AppUser) => void;
}

const DOMAINS = [
  { id: "web",      label: "Web Developer",         icon: "🌐" },
  { id: "mobile",   label: "App Developer (Mobile)",icon: "📱" },
  { id: "ai",       label: "AI / ML Engineer",      icon: "🧠" },
  { id: "custom",   label: "Custom Software Dev",   icon: "⚙️" },
  { id: "devops",   label: "DevOps Engineer",       icon: "🚀" },
  { id: "cloud",    label: "Cloud Engineer",        icon: "☁️" },
  { id: "cyber",    label: "Cyber Security Eng",    icon: "🔒" },
  { id: "game",     label: "Game Developer",        icon: "🎮" },
];

const SKILL_LEVELS = [
  { id: "student", label: "Student / Absolute Beginner", sub: "0–1 yrs" },
  { id: "junior",  label: "Junior Developer",            sub: "1–2 yrs" },
  { id: "mid",     label: "Mid-Level Engineer",          sub: "2–4 yrs" },
  { id: "senior",  label: "Senior / Expert",             sub: "5+ yrs" },
];

const SUB_DOMAINS: Record<string, string[]> = {
  web:    ["Frontend", "Backend", "MERN Stack", "Full Stack"],
  mobile: ["iOS (Swift)", "Android (Kotlin)", "React Native", "Flutter"],
  ai:     ["GenAI & Agents", "Machine Learning", "Computer Vision", "NLP"],
  custom: ["Desktop Apps", "Embedded Systems", "Enterprise Software", "Systems Programming"],
  devops: ["CI/CD Pipelines", "Kubernetes Orchestration", "Cloud Architecture", "SRE"],
  cloud:  ["AWS Architecture", "Azure Solutions", "GCP Engineering", "Cloud Networking"],
  cyber:  ["Penetration Testing", "Security Operations", "Application Security", "Cloud Security"],
  game:   ["Unity/C#", "Unreal/C++", "Game Design", "Graphics Programming"],
};

const TECH_STACKS: Record<string, string[]> = {
  web:    ["React", "Node.js", "PostgreSQL", "Docker", "TypeScript", "Redis"],
  mobile: ["Swift", "Kotlin", "React Native", "Firebase", "SQLite"],
  ai:     ["Python", "PyTorch", "TensorFlow", "Pandas", "Scikit-Learn", "LangChain"],
  custom: ["C++", "Rust", "Java", "SQL", "Make/CMake", "Git"],
  devops: ["Docker", "Kubernetes", "Terraform", "GitHub Actions", "Jenkins", "Ansible"],
  cloud:  ["AWS EC2/S3", "Lambda", "GCP Compute", "Azure Blob", "IAM", "VPC"],
  cyber:  ["Kali Linux", "Wireshark", "Metasploit", "Burp Suite", "OWASP Top 10"],
  game:   ["C#", "C++", "Unity", "Unreal Engine", "Blender", "OpenGL"],
};

// We will fetch these from the backend instead.
// Fallback if backend fails
const fallbackQuestions = (domain: string, sub: string) => {
  return Array.from({ length: 25 }).map((_, i) => ({
    text: `Fallback question ${i + 1} for ${sub} (${domain}). Which of the following is correct?`,
    options: [
      { label: "A", text: "Option A" },
      { label: "B", text: "Option B" },
      { label: "C", text: "Option C" },
      { label: "D", text: "Option D" },
    ],
    correctIndex: Math.floor(Math.random() * 4),
    difficulty: i < 8 ? "Easy" : i < 18 ? "Medium" : "Hard"
  }));
};

export default function OnboardingFunnel({ onNavigate, onLogin }: Props) {
  const [step, setStep] = useState<number>(() => {
    const s = localStorage.getItem("ob_step");
    return s ? parseInt(s, 10) : 1;
  });

  const [domain, setDomain] = useState<string>(() => localStorage.getItem("ob_domain") || "");
  const [level, setLevel]   = useState<string>(() => localStorage.getItem("ob_level") || "");
  const [sub, setSub]       = useState<string>(() => localStorage.getItem("ob_sub") || "");
  const [techStack, setTechStack] = useState<string[]>(() => {
    const t = localStorage.getItem("ob_tech");
    return t ? JSON.parse(t) : [];
  });
  
  // MCQ state
  const [mcqAnswers, setMcqAnswers] = useState<number[]>(() => {
    const a = localStorage.getItem("ob_answers");
    return a ? JSON.parse(a) : new Array(25).fill(-1);
  });
  const [currentQ, setCurrentQ] = useState(0);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [generatingRoadmap, setGeneratingRoadmap] = useState(false);

  // Resume State
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  // Auth State (Guard for Step 7)
  const [authRequired, setAuthRequired] = useState(false);
  const { user: authUser } = useAuth();

  useEffect(() => {
    localStorage.setItem("ob_step", step.toString());
    localStorage.setItem("ob_domain", domain);
    localStorage.setItem("ob_level", level);
    localStorage.setItem("ob_sub", sub);
    localStorage.setItem("ob_tech", JSON.stringify(techStack));
    localStorage.setItem("ob_answers", JSON.stringify(mcqAnswers));
  }, [step, domain, level, sub, techStack, mcqAnswers]);

  const handleNext = async () => {
    if (step === 5) {
      // About to enter Step 6, fetch questions
      setLoadingQuestions(true);
      try {
        const res = await post('/api/assessment/questions', { domain, sub });
        setQuestions(res.questions || fallbackQuestions(domain, sub));
      } catch (err) {
        console.error("Failed to fetch questions, using fallback", err);
        setQuestions(fallbackQuestions(domain, sub));
      } finally {
        setLoadingQuestions(false);
        setStep(6);
      }
      return;
    }
    if (step === 6) {
      if (!authUser) {
        setAuthRequired(true); // show modal before proceeding to step 7
        return;
      }
    }
    setStep((s) => Math.min(s + 1, 7));
  };

  const finishAuth = (u: AppUser) => {
    setAuthRequired(false);
    onLogin(u);
    setStep(7);
  };

  const handleFinish = async () => {
    setGeneratingRoadmap(true);
    try {
      // Actually hit the backend to generate the roadmap
      const res = await post('/api/roadmap/generate', { 
        student_id: authUser?.id || "temp-id",
        target_role: sub || domain,
        weak_skills: techStack.slice(0, 3), // just an example of what to pass
        experience_level: level,
        answers: mcqAnswers
      });
      toast.success("Roadmap generated successfully!");
      onNavigate("dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate roadmap. Please try again.");
    } finally {
      setGeneratingRoadmap(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return true; // Can skip resume
    if (step === 2) return domain !== "";
    if (step === 3) return level !== "";
    if (step === 4) return sub !== "";
    if (step === 5) return true; // Can skip stack
    if (step === 6) return mcqAnswers.every((a) => a !== -1);
    return true;
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="flex flex-col items-center max-w-lg mx-auto mt-10">
            <h2 className="font-sans font-bold text-3xl mb-2 text-text-primary">Resume Upload</h2>
            <p className="font-sans text-sm text-text-secondary mb-8 text-center">
              Let us parse your existing resume to speed up the process.
            </p>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                if (e.dataTransfer.files[0]) setUploadedFile(e.dataTransfer.files[0].name);
              }}
              onClick={() => setUploadedFile("parsed_resume.pdf")}
              className={`w-full p-12 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors ${
                uploadedFile ? "border-success bg-surface" : dragOver ? "border-text-secondary bg-surface-hover" : "border-border bg-surface"
              }`}
            >
              {uploadedFile ? (
                <>
                  <span className="text-success text-2xl mb-2">✓</span>
                  <p className="font-sans text-sm font-medium">{uploadedFile}</p>
                </>
              ) : (
                <>
                  <span className="text-text-muted text-2xl mb-2">📄</span>
                  <p className="font-sans text-sm text-text-muted">Drag & drop or click to upload</p>
                </>
              )}
            </div>
            {uploadedFile && (
              <button
                onClick={() => setStep(5)}
                className="mt-6 btn-cta h-10 w-full rounded-lg bg-white text-black font-semibold text-[14px]"
              >
                Parse and Skip to Checklist →
              </button>
            )}
            <div className="mt-8 flex items-center justify-center w-full">
              <div className="flex-1 h-px bg-border" />
              <span className="px-3 text-text-muted text-xs">OR</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <button
              onClick={() => setStep(2)}
              className="mt-8 btn-cta h-10 w-full rounded-lg border border-border bg-surface hover:bg-surface-hover text-text-secondary font-medium text-[14px]"
            >
              Build Profile Step-by-Step →
            </button>
          </div>
        );

      case 2:
        return (
          <div className="max-w-4xl mx-auto mt-10">
            <h2 className="font-sans font-bold text-3xl mb-8 text-center text-text-primary">Select Major Domain</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {DOMAINS.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDomain(d.id)}
                  className={`flex flex-col items-center justify-center p-6 rounded-xl border transition-colors cursor-pointer ${
                    domain === d.id ? "border-text-primary bg-surface-hover" : "border-border bg-surface hover:border-text-muted"
                  }`}
                >
                  <span className="text-3xl mb-3">{d.icon}</span>
                  <span className="font-sans text-[13px] font-medium text-center">{d.label}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="max-w-xl mx-auto mt-10">
            <h2 className="font-sans font-bold text-3xl mb-8 text-center text-text-primary">Experience Level</h2>
            <div className="flex flex-col gap-3">
              {SKILL_LEVELS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLevel(l.id)}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer ${
                    level === l.id ? "border-text-primary bg-surface-hover" : "border-border bg-surface hover:border-text-muted"
                  }`}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-sans text-[14px] font-medium text-text-primary">{l.label}</span>
                    <span className="font-sans text-[12px] text-text-muted">{l.sub}</span>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${level === l.id ? "border-text-primary bg-text-primary" : "border-border"}`} />
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="max-w-xl mx-auto mt-10">
            <h2 className="font-sans font-bold text-3xl mb-8 text-center text-text-primary">Sub-Domain Specialization</h2>
            <div className="flex flex-col gap-3">
              {(SUB_DOMAINS[domain || "web"] || []).map((s) => (
                <button
                  key={s}
                  onClick={() => setSub(s)}
                  className={`p-4 rounded-xl border text-left cursor-pointer ${
                    sub === s ? "border-text-primary bg-surface-hover" : "border-border bg-surface hover:border-text-muted"
                  }`}
                >
                  <span className="font-sans text-[14px] font-medium">{s}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 5:
        const stack = TECH_STACKS[domain || "web"] || [];
        return (
          <div className="max-w-2xl mx-auto mt-10">
            <h2 className="font-sans font-bold text-3xl mb-2 text-center text-text-primary">Market Tech Stack</h2>
            <p className="font-sans text-sm text-text-secondary text-center mb-8">
              Industry benchmark for {sub || domain}. Select what you already know.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {stack.map((t) => {
                const checked = techStack.includes(t);
                return (
                  <button
                    key={t}
                    onClick={() => {
                      if (checked) setTechStack(techStack.filter(x => x !== t));
                      else setTechStack([...techStack, t]);
                    }}
                    className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer ${
                      checked ? "border-success bg-surface" : "border-border bg-surface-hover"
                    }`}
                  >
                    <span className="font-sans text-[13px]">{t}</span>
                    <span className={`text-[10px] ${checked ? "text-success" : "text-border"}`}>✓</span>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 6:
        if (loadingQuestions || questions.length === 0) {
          return (
            <div className="max-w-2xl mx-auto mt-20 flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-text-muted border-t-text-primary rounded-full animate-spin mb-4" />
              <p className="font-sans text-sm text-text-secondary">Generating dynamic assessment for {sub}...</p>
            </div>
          );
        }
        const q = questions[currentQ];
        if (!q) return null;
        
        return (
          <div className="max-w-2xl mx-auto mt-10">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs text-text-secondary">Question {currentQ + 1} of 25</span>
              <span className="font-mono text-xs text-warning border border-warning rounded px-2">{q.difficulty}</span>
            </div>
            <div className="w-full h-1 bg-border mb-8">
              <div className="h-full bg-text-primary transition-all" style={{ width: `${((currentQ + 1) / 25) * 100}%` }} />
            </div>
            
            <h3 className="font-sans font-medium text-lg mb-6 leading-7">{q.text}</h3>
            
            <div className="flex flex-col gap-3">
              {q.options.map((opt, idx) => {
                const selected = mcqAnswers[currentQ] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      const newA = [...mcqAnswers];
                      newA[currentQ] = idx;
                      setMcqAnswers(newA);
                    }}
                    className={`flex items-center gap-4 p-4 rounded-lg border text-left cursor-pointer transition-colors ${
                      selected ? "border-text-primary bg-surface-hover" : "border-border bg-surface hover:border-text-muted"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selected ? "border-text-primary bg-text-primary" : "border-border"}`}>
                      {selected && <div className="w-2 h-2 rounded-full bg-canvas" />}
                    </div>
                    <span className="font-mono text-xs text-text-muted flex-shrink-0">{opt.label}</span>
                    <span className="font-sans text-[14px] flex-1">{opt.text}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex items-center justify-between mt-8">
              <button
                disabled={currentQ === 0}
                onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
                className="btn-cta px-4 h-9 rounded-lg border border-border text-sm disabled:opacity-30"
              >
                Previous
              </button>
              {currentQ < 24 ? (
                <button
                  disabled={mcqAnswers[currentQ] === -1}
                  onClick={() => setCurrentQ(currentQ + 1)}
                  className="btn-cta px-6 h-9 rounded-lg bg-white text-black font-semibold text-sm disabled:opacity-30 cursor-pointer"
                >
                  Next Question →
                </button>
              ) : (
                <button
                  disabled={mcqAnswers[currentQ] === -1}
                  onClick={handleNext}
                  className="btn-cta px-6 h-9 rounded-lg bg-accent text-white font-semibold text-sm disabled:opacity-30 cursor-pointer"
                >
                  Submit Assessment →
                </button>
              )}
            </div>
          </div>
        );

      case 7:
        // Final Results
        return (
          <div className="max-w-3xl mx-auto mt-10 animate-fade-in">
            <h2 className="font-sans font-bold text-3xl mb-8 text-center text-text-primary">Audit Results</h2>
            <div className="bg-surface border border-border rounded-xl p-8 flex flex-col items-center">
              <div className="w-32 h-32 rounded-full border-4 border-success flex items-center justify-center mb-6">
                <span className="font-sans font-bold text-4xl text-success">72%</span>
              </div>
              <h3 className="font-sans font-medium text-xl mb-2">Market Ready for {sub}</h3>
              <p className="font-sans text-sm text-text-secondary text-center max-w-md">
                You have strong fundamentals, but critical gaps in system architecture and cloud infrastructure.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="bg-surface border border-border rounded-xl p-6">
                <h4 className="font-mono text-[11px] text-text-muted uppercase tracking-widest mb-4">Strong Competencies</h4>
                <ul className="flex flex-col gap-2">
                  <li className="font-sans text-[13px] text-text-secondary">✓ API Design (92%)</li>
                  <li className="font-sans text-[13px] text-text-secondary">✓ Component Architecture (88%)</li>
                </ul>
              </div>
              <div className="bg-surface border border-border rounded-xl p-6">
                <h4 className="font-mono text-[11px] text-text-muted uppercase tracking-widest mb-4">Critical Gaps</h4>
                <ul className="flex flex-col gap-2">
                  <li className="font-sans text-[13px] text-danger">✕ CI/CD Pipelines (35%)</li>
                  <li className="font-sans text-[13px] text-danger">✕ Cloud Orchestration (20%)</li>
                </ul>
              </div>
            </div>

            <div className="mt-10 flex justify-center">
              <button
                onClick={handleFinish}
                disabled={generatingRoadmap}
                className="btn-cta h-12 px-8 rounded-lg bg-white text-black font-bold text-[15px] hover:bg-zinc-100 cursor-pointer disabled:opacity-50"
              >
                {generatingRoadmap ? "Generating Roadmap..." : "Generate 12-Week Roadmap →"}
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-text-primary flex flex-col overflow-hidden">
      {/* Topbar */}
      <nav className="h-[52px] border-b border-border flex items-center px-6 flex-shrink-0">
        <span className="font-sans font-semibold text-[13px] uppercase tracking-widest cursor-pointer hover:text-text-secondary" onClick={() => onNavigate("landing")}>
          SkillForge Audit
        </span>
        <div className="flex-1" />
        <span className="font-mono text-[11px] text-text-muted">Step {step} of 7</span>
      </nav>

      {/* Progress */}
      <div className="h-1 bg-border w-full flex-shrink-0">
        <div className="h-full bg-text-primary transition-all duration-300" style={{ width: `${(step / 7) * 100}%` }} />
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-20">
        {renderStepContent()}

        {step > 1 && step < 6 && (
          <div className="max-w-xl mx-auto mt-12 flex justify-between">
            <button
              onClick={() => setStep(step - 1)}
              className="font-sans text-sm text-text-muted hover:text-text-primary transition-colors cursor-pointer"
            >
              ← Back
            </button>
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="btn-cta h-9 px-6 bg-white text-black text-sm font-semibold rounded-lg disabled:opacity-30 cursor-pointer"
            >
              Continue →
            </button>
          </div>
        )}
      </div>

      {authRequired && (
        <AuthModal
          onClose={() => setAuthRequired(false)}
          onNavigate={onNavigate}
          onLogin={finishAuth}
          message="Sign in to view your final readiness score and generate your roadmap."
        />
      )}
    </div>
  );
}
