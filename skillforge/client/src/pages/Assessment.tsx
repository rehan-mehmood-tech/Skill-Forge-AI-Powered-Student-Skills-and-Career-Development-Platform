import { useState, useEffect } from "react";
import type { View } from "../App";
import { post } from "../lib/api";
import toast from 'react-hot-toast';

interface Props {
  onNavigate: (v: View) => void;
}

const QUESTIONS = [
  {
    domain: "Python", weight: "1.5x", difficulty: "Intermediate",
    topic: "Python — OOP",
    text: "Which of the following correctly demonstrates the Liskov Substitution Principle in a Python class hierarchy?",
    options: [
      { label: "A", text: "A subclass overrides a method to raise NotImplementedError, preventing any inherited behavior from being used." },
      { label: "B", text: "A subclass extends a parent class and overrides methods such that any code using the parent class works correctly with the subclass." },
      { label: "C", text: "A subclass adds new methods not present in the parent and overrides the constructor to accept different parameters." },
      { label: "D", text: "A subclass inherits all methods unchanged and delegates to the parent via super() without adding any logic." },
    ],
    correctIndex: 1,
  },
  {
    domain: "Python", weight: "1.0x", difficulty: "Intermediate",
    topic: "Python — Decorators",
    text: "What does the @property decorator allow you to do in Python?",
    options: [
      { label: "A", text: "Define a class method that can be called without instantiating the class." },
      { label: "B", text: "Access a method as if it were an attribute, allowing computed properties with getter/setter control." },
      { label: "C", text: "Prevent subclasses from overriding a method." },
      { label: "D", text: "Automatically memoize the return value of a function." },
    ],
    correctIndex: 1,
  },
  {
    domain: "Python", weight: "1.2x", difficulty: "Advanced",
    topic: "Python — Concurrency",
    text: "When is asyncio.gather() preferable to running threads with concurrent.futures.ThreadPoolExecutor?",
    options: [
      { label: "A", text: "When tasks are CPU-bound and can release the GIL independently." },
      { label: "B", text: "When tasks are I/O-bound and can be modeled as coroutines without blocking the event loop." },
      { label: "C", text: "When shared mutable state must be protected by a mutex lock." },
      { label: "D", text: "When subprocess calls need to run in parallel across multiple cores." },
    ],
    correctIndex: 1,
  },
  {
    domain: "Web APIs", weight: "1.0x", difficulty: "Beginner",
    topic: "REST — HTTP Methods",
    text: "Which HTTP method is idempotent but NOT safe according to the HTTP specification?",
    options: [
      { label: "A", text: "GET" },
      { label: "B", text: "POST" },
      { label: "C", text: "PUT" },
      { label: "D", text: "PATCH" },
    ],
    correctIndex: 2,
  },
  {
    domain: "Web APIs", weight: "1.3x", difficulty: "Intermediate",
    topic: "REST — Auth",
    text: "A client sends a JWT in the Authorization header. The server verifies the signature but the exp claim is 30 seconds in the past. What should the server do?",
    options: [
      { label: "A", text: "Accept the token because the signature is valid." },
      { label: "B", text: "Reject with 401 Unauthorized and prompt the client to refresh the token." },
      { label: "C", text: "Accept and extend the token's expiry by another 15 minutes server-side." },
      { label: "D", text: "Reject with 403 Forbidden and invalidate all tokens for that user." },
    ],
    correctIndex: 1,
  },
  {
    domain: "Databases", weight: "1.2x", difficulty: "Intermediate",
    topic: "SQL — Indexing",
    text: "A table has 10M rows and a composite index on (status, created_at). Which query will most likely use the index efficiently?",
    options: [
      { label: "A", text: "SELECT * FROM orders WHERE created_at > '2026-01-01';" },
      { label: "B", text: "SELECT * FROM orders WHERE status = 'pending' AND created_at > '2026-01-01';" },
      { label: "C", text: "SELECT * FROM orders WHERE LOWER(status) = 'pending';" },
      { label: "D", text: "SELECT * FROM orders ORDER BY created_at DESC;" },
    ],
    correctIndex: 1,
  },
  {
    domain: "Databases", weight: "1.0x", difficulty: "Intermediate",
    topic: "SQL — Transactions",
    text: "Which isolation level prevents phantom reads but still allows non-repeatable reads?",
    options: [
      { label: "A", text: "Read Uncommitted" },
      { label: "B", text: "Read Committed" },
      { label: "C", text: "Repeatable Read" },
      { label: "D", text: "Serializable" },
    ],
    correctIndex: 2,
  },
  {
    domain: "Algorithms", weight: "1.5x", difficulty: "Intermediate",
    topic: "Data Structures — Hash Maps",
    text: "What is the worst-case time complexity of lookup in a hash map with separate chaining, assuming n keys and a poor hash function that maps all keys to the same bucket?",
    options: [
      { label: "A", text: "O(1)" },
      { label: "B", text: "O(log n)" },
      { label: "C", text: "O(n)" },
      { label: "D", text: "O(n log n)" },
    ],
    correctIndex: 2,
  },
  {
    domain: "Algorithms", weight: "1.3x", difficulty: "Advanced",
    topic: "Graph — BFS vs DFS",
    text: "You need to find the shortest path (by hop count) between two nodes in an unweighted directed graph. Which algorithm is most appropriate?",
    options: [
      { label: "A", text: "Depth-First Search (DFS)" },
      { label: "B", text: "Breadth-First Search (BFS)" },
      { label: "C", text: "Dijkstra's Algorithm" },
      { label: "D", text: "Bellman-Ford Algorithm" },
    ],
    correctIndex: 1,
  },
  {
    domain: "Distributed Systems", weight: "1.5x", difficulty: "Advanced",
    topic: "CAP Theorem",
    text: "According to the CAP theorem, a distributed system that is partitioned must sacrifice either Consistency or Availability. Which of the following is an example of a CP system?",
    options: [
      { label: "A", text: "Cassandra (tunable consistency)" },
      { label: "B", text: "DynamoDB with eventual consistency" },
      { label: "C", text: "HBase (strong consistency via ZooKeeper)" },
      { label: "D", text: "CouchDB (optimistic replication)" },
    ],
    correctIndex: 2,
  },
  {
    domain: "DevOps", weight: "1.0x", difficulty: "Beginner",
    topic: "Docker — Layers",
    text: "Which Dockerfile instruction creates a new writable layer in the image?",
    options: [
      { label: "A", text: "ENV" },
      { label: "B", text: "ARG" },
      { label: "C", text: "RUN" },
      { label: "D", text: "EXPOSE" },
    ],
    correctIndex: 2,
  },
  {
    domain: "Applied AI", weight: "1.2x", difficulty: "Intermediate",
    topic: "LLMs — RAG",
    text: "In a Retrieval-Augmented Generation (RAG) pipeline, what is the primary purpose of the vector similarity search step?",
    options: [
      { label: "A", text: "To fine-tune the language model on domain-specific examples." },
      { label: "B", text: "To fetch semantically relevant document chunks to include in the model's prompt context." },
      { label: "C", text: "To compress the prompt into fewer tokens before sending to the API." },
      { label: "D", text: "To validate that the model's output matches a known ground truth." },
    ],
    correctIndex: 1,
  },
];

const TOTAL = QUESTIONS.length;

type OptionState = "default" | "selected" | "correct" | "incorrect";

function CountdownTimer({ totalSeconds, onExpire }: { totalSeconds: number; onExpire: () => void }) {
  const [remaining, setRemaining] = useState(totalSeconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) { clearInterval(interval); onExpire(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const mins = String(Math.floor(remaining / 60)).padStart(2, "0");
  const secs = String(remaining % 60).padStart(2, "0");
  const colorClass = remaining < 60 ? "text-danger" : remaining < 300 ? "text-warning" : "text-text-primary";

  return (
    <span className={`font-mono font-bold text-xl tabular-nums ${colorClass}`}>
      {mins}:{secs}
    </span>
  );
}

export default function Assessment({ onNavigate }: Props) {
  const [questionIdx, setQuestionIdx] = useState(0);
  const [selected,    setSelected]    = useState<number | null>(null);
  const [submitted,   setSubmitted]   = useState(false);
  const [autosaved,   setAutosaved]   = useState(false);
  
  const [answers, setAnswers] = useState<number[]>(new Array(TOTAL).fill(-1));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const q = QUESTIONS[questionIdx];
  const progressPct = Math.round((questionIdx / TOTAL) * 100);
  const isLast = questionIdx >= TOTAL - 1;

  const handleSelect = (idx: number) => {
    if (submitted) return;
    setSelected(idx);
    const newAnswers = [...answers];
    newAnswers[questionIdx] = idx;
    setAnswers(newAnswers);
    setAutosaved(true);
    setTimeout(() => setAutosaved(false), 2000);
  };

  const handleSubmit = () => { if (selected !== null) setSubmitted(true); };

  const handleNext = async () => {
    if (isLast) { 
      setIsSubmitting(true);
      setError(null);
      
      // Calculate scores
      const scores: Record<string, { correct: number, total: number }> = {};
      QUESTIONS.forEach((q, i) => {
        if (!scores[q.domain]) {
          scores[q.domain] = { correct: 0, total: 0 };
        }
        scores[q.domain].total += 1;
        if (answers[i] === q.correctIndex) {
          scores[q.domain].correct += 1;
        }
      });
      
      const payload = {
        student_id: "me", // Depending on API this might be replaced/injected on the gateway
        answers: scores,
        // The API actually expects `AnalyzeSkillsRequest` with fields or similar.
        // Let's pass the raw scores. The python backend might need specific fields.
        raw_scores: scores,
        current_skills: [],
        target_role: "Software Engineer",
      };

      try {
        await post('/ai/analyze-skills', payload);
        toast.success("Assessment submitted successfully!");
        onNavigate("results"); 
      } catch (err: any) {
        setError(err.message || "Failed to submit assessment");
        toast.error(err.message || "Failed to submit assessment");
        setIsSubmitting(false);
      }
      return; 
    }
    setQuestionIdx((i) => i + 1);
    setSelected(answers[questionIdx + 1] !== -1 ? answers[questionIdx + 1] : null);
    setSubmitted(false);
  };

  const getState = (idx: number): OptionState => {
    if (!submitted) return selected === idx ? "selected" : "default";
    if (idx === q.correctIndex) return "correct";
    if (idx === selected && selected !== q.correctIndex) return "incorrect";
    return "default";
  };

  const optionStyles: Record<OptionState, string> = {
    default:   "border-border   bg-surface-hover text-[#E4E4E7]",
    selected:  "border-text-primary bg-surface text-[#E4E4E7]",
    correct:   "border-success  bg-surface text-[#E4E4E7]",
    incorrect: "border-danger   bg-surface text-[#E4E4E7]",
  };

  return (
    <div className="min-h-screen bg-canvas text-text-primary font-sans">
      {/* 3px fixed progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-border" style={{ height: 3 }}>
        <div className="h-full bg-text-primary transition-all duration-300" style={{ width: `${progressPct}%` }} />
      </div>

      {/* Topbar */}
      <div className="fixed top-[3px] left-0 right-0 z-40 h-[52px] bg-canvas border-b border-border flex items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-text-secondary border border-border rounded-md px-2 py-0.5 bg-surface-hover">
            [{q.domain}]
          </span>
          <span className="font-sans font-medium text-[13px] text-text-secondary hidden sm:block">
            Question {questionIdx + 1} / {TOTAL}
          </span>
        </div>
        <CountdownTimer totalSeconds={TOTAL * 90} onExpire={() => onNavigate("results")} />
        <button
          onClick={() => onNavigate("assessments")}
          className="font-sans text-[13px] text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
        >
          Exit assessment
        </button>
      </div>

      {/* Content */}
      <div className="pt-[55px] pb-10 px-4">
        <div className="max-w-[720px] mx-auto pt-10">

          {/* Badges */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="font-mono text-[11px] border border-border rounded-md px-2 py-0.5 bg-surface-hover text-text-secondary">
              [Weight: {q.weight}]
            </span>
            <span className="font-mono text-[11px] border border-border rounded-md px-2 py-0.5 bg-surface-hover text-warning">
              [{q.difficulty}]
            </span>
            <span className="font-mono text-[11px] border border-border rounded-md px-2 py-0.5 bg-surface-hover text-text-secondary">
              [{q.topic}]
            </span>
          </div>

          {/* Question card */}
          <div className="bg-surface border border-border rounded-xl p-6 md:p-8">
            <p className="font-mono font-bold text-[11px] text-text-muted tracking-[0.1em]">
              {String(questionIdx + 1).padStart(2, "0")}
            </p>
            <p className="font-sans font-medium text-lg text-text-primary leading-7 mt-2">
              {q.text}
            </p>
          </div>

          {/* Answer options */}
          <div className="mt-6 flex flex-col gap-2">
            {q.options.map((opt, idx) => {
              const state = getState(idx);
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`relative flex items-center gap-4 px-4 py-3 rounded-lg border text-left transition-colors duration-150 cursor-pointer w-full ${optionStyles[state]} ${!submitted && selected !== idx ? "hover:border-text-muted hover:bg-[#1C1C1F]" : ""}`}
                >
                  {submitted && state === "correct" && (
                    <div className="absolute left-0 top-2 bottom-2 w-[3px] bg-success rounded-full" />
                  )}
                  {submitted && state === "incorrect" && (
                    <div className="absolute left-0 top-2 bottom-2 w-[3px] bg-danger rounded-full" />
                  )}
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      state === "selected" || state === "correct" ? "border-text-primary bg-text-primary" :
                      state === "incorrect" ? "border-danger" : "border-border"
                    }`}
                  >
                    {(state === "selected" || state === "correct") && (
                      <div className="w-1.5 h-1.5 rounded-full bg-canvas" />
                    )}
                  </div>
                  <span className="font-mono text-[12px] text-text-muted w-4 flex-shrink-0">{opt.label}</span>
                  <span className="font-sans text-sm leading-5 flex-1">{opt.text}</span>
                  {submitted && state === "correct"   && <span className="font-mono text-[10px] text-success  flex-shrink-0">[correct]</span>}
                  {submitted && state === "incorrect" && <span className="font-mono text-[10px] text-danger   flex-shrink-0">[incorrect]</span>}
                </button>
              );
            })}
          </div>

          {/* Bottom actions */}
          {error && <div className="mt-4 text-danger text-sm">{error}</div>}
          <div className="mt-8 flex items-center justify-between">
            <button
              disabled={questionIdx === 0 || isSubmitting}
              onClick={() => { 
                const newIdx = Math.max(0, questionIdx - 1);
                setQuestionIdx(newIdx); 
                setSelected(answers[newIdx] !== -1 ? answers[newIdx] : null); 
                setSubmitted(false); 
              }}
              className={`h-9 px-4 rounded-lg border border-border bg-surface text-text-secondary text-sm font-medium transition-colors ${
                questionIdx === 0 || isSubmitting ? "opacity-30 cursor-not-allowed" : "hover:bg-surface-hover hover:text-text-primary cursor-pointer"
              }`}
            >
              ← Previous
            </button>

            {submitted ? (
              <button
                onClick={handleNext}
                disabled={isSubmitting}
                className={`h-9 px-4 rounded-lg bg-white text-black text-sm font-semibold transition-colors ${
                  isSubmitting ? "opacity-50 cursor-wait" : "hover:bg-zinc-100 cursor-pointer"
                }`}
              >
                {isSubmitting ? "Analyzing..." : (isLast ? "Finish Assessment" : "Next Question →")}
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={selected === null}
                className={`h-9 px-4 rounded-lg text-sm font-semibold transition-colors ${
                  selected !== null
                    ? "bg-white text-black hover:bg-zinc-100 cursor-pointer"
                    : "bg-surface border border-border text-text-muted cursor-not-allowed opacity-40"
                }`}
              >
                Save & Next →
              </button>
            )}
          </div>
        </div>
      </div>

      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 font-mono text-[11px] text-text-muted transition-opacity duration-300 pointer-events-none ${autosaved ? "opacity-100" : "opacity-0"}`}
      >
        [autosaved 0.3s ago]
      </div>
    </div>
  );
}
