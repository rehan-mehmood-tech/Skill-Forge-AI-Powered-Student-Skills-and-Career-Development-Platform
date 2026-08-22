import { useState, useRef, useEffect } from "react";
import { post } from "../lib/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  toolTrace?: string[];
  citations?: string[];
  isTyping?: boolean;
}

const STARTER_PROMPTS = [
  "What's my biggest skill gap for Backend Dev?",
  "Generate a 3-month learning plan for me",
  "Which assessment should I take next?",
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "user",
    content: "What should I focus on first to become a backend developer?",
  },
  {
    id: "2",
    role: "assistant",
    content:
      "Based on your skill vector, DevOps is your most critical gap at 0.12 — well below the 0.50 threshold for Backend Developer. I'd recommend starting there before AI/ML.\n\nYour Python score (0.79) is solid and only needs light reinforcement.",
    toolTrace: [
      "> invoking analyze_student_skills...",
      "> invoking calculate_gap (target: Backend Developer)...",
      "> invoking search_knowledge_base (query: docker fundamentals)...",
      "✓ 3 tools completed in 1.2s",
    ],
    citations: ["[↗ Backend Developer Roadmap 2026]", "[↗ Docker Fundamentals — FreeCodeCamp]"],
  },
];

export default function FloatingAgentWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const sessionIdRef = useRef(`session_${Date.now()}`);

  useEffect(() => {
    if (isOpen && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isStreaming) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text.trim() };
    const typingMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", content: "", isTyping: true };
    setMessages((prev) => [...prev, userMsg, typingMsg]);
    setInput("");
    setIsStreaming(true);

    try {
      const history = messages
        .filter(m => !m.isTyping && m.role !== 'assistant')
        .map(m => ({ role: m.role, content: m.content }));

      const res: any = await post('/api/ai/chat-agent', { 
        message: text.trim(), 
        session_id: sessionIdRef.current,
        target_role: "Backend Developer",
        conversation_history: history
      });

      setMessages((prev) =>
        prev.map((m) =>
          m.id === typingMsg.id
            ? {
                ...m,
                isTyping: false,
                content: res.response || "No response received.",
                citations: res.citations || [],
                toolTrace: res.action_taken ? [`> action: ${res.action_taken}`] : undefined
              }
            : m
        )
      );
    } catch (err) {
      console.error(err);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === typingMsg.id
            ? {
                ...m,
                isTyping: false,
                content: "Unable to connect to AI Mentor. Please retry in a moment.",
              }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen ? (
        <div className="w-80 sm:w-96 h-[480px] max-h-[80vh] shadow-2xl rounded-2xl border border-border bg-[#0F0F12] flex flex-col mb-4 overflow-hidden animate-fade-up">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <span className="font-sans font-semibold text-sm text-text-primary">Career Copilot</span>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                <span className="font-mono text-[11px] text-success">online</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-text-muted hover:text-text-secondary transition-colors cursor-pointer text-sm w-6 h-6 flex items-center justify-center"
              aria-label="Minimize copilot"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 min-h-0 bg-[#0F0F12]">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                <div className="text-text-muted text-3xl select-none">◎</div>
                <div>
                  <p className="font-sans font-medium text-sm text-text-secondary">
                    Ask anything about your career path
                  </p>
                  <p className="font-sans text-[13px] text-text-muted mt-1 max-w-[260px] leading-5">
                    Copilot can analyze your gaps, suggest resources, and generate your roadmap in real time.
                  </p>
                </div>
                <div className="flex flex-col gap-2 w-full mt-2">
                  {STARTER_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => sendMessage(prompt)}
                      className="font-mono text-[10px] text-text-muted border border-border rounded-md px-3 py-1.5 bg-surface hover:border-text-muted hover:text-text-secondary transition-colors cursor-pointer text-left"
                    >
                      [{prompt}]
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg) =>
                msg.role === "user" ? (
                  <div key={msg.id} className="flex justify-end">
                    <div
                      className="bg-surface-hover border border-border px-3 py-2 rounded-xl rounded-tr-sm"
                      style={{ maxWidth: "80%" }}
                    >
                      <p className="font-sans text-[13px] text-[#E4E4E7] leading-5">{msg.content}</p>
                    </div>
                  </div>
                ) : (
                  <div key={msg.id}>
                    <p className="font-sans font-medium text-[11px] text-text-muted mb-1 uppercase tracking-wide">
                      Copilot
                    </p>
                    {msg.isTyping ? (
                      <div className="flex items-center gap-1 py-1">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="w-1 h-1 rounded-full bg-text-muted animate-dot-bounce"
                            style={{ animationDelay: `${i * 200}ms` }}
                          />
                        ))}
                      </div>
                    ) : (
                      <>
                        <p className="font-sans text-[13px] text-text-secondary leading-5 whitespace-pre-line">
                          {msg.content}
                        </p>
                        {msg.toolTrace && (
                          <div className="mt-2 border-l-2 border-border pl-2 py-1.5 rounded-r-lg bg-surface-hover">
                            {msg.toolTrace.map((line, i) => (
                              <p key={i} className="font-mono text-[11px] text-text-muted leading-[18px]">
                                {line.startsWith("✓") ? (
                                  <>
                                    <span className="text-success">✓</span>
                                    <span>{line.slice(1)}</span>
                                  </>
                                ) : (
                                  line
                                )}
                              </p>
                            ))}
                          </div>
                        )}
                        {msg.citations && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {msg.citations.map((c) => (
                              <span
                                key={c}
                                className="font-mono text-[10px] text-[#71717A] bg-surface border border-border rounded-md px-1.5 py-0.5 hover:border-text-muted cursor-pointer transition-colors"
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )
              )
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input area */}
          <div className="border-t border-border p-3 flex-shrink-0 bg-surface">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                placeholder="Ask about your skill gaps..."
                disabled={isStreaming}
                className="w-full h-9 pl-3 pr-10 rounded-lg bg-surface-hover border border-border font-mono text-[12px] text-text-secondary placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-50"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={isStreaming}
                className={`absolute right-3 font-sans font-medium text-sm transition-colors cursor-pointer ${
                  input.trim() && !isStreaming ? "text-text-primary" : "text-text-muted cursor-not-allowed"
                }`}
                aria-label="Send message"
              >
                ↵
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          {isHovering && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface border border-border text-text-primary text-xs px-2.5 py-1 rounded-md shadow-lg whitespace-nowrap animate-fade-in">
              Ask Career Copilot
            </div>
          )}
          <button
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={() => setIsOpen(true)}
            aria-label="Open Career Copilot"
            className="w-14 h-14 rounded-full bg-white text-black border-2 border-black flex items-center justify-center shadow-xl hover:scale-105 transition-transform duration-200 cursor-pointer select-none group"
          >
            {/* Simple spark/bot icon representation */}
            <span className="text-2xl group-hover:animate-pulse">◎</span>
          </button>
        </div>
      )}
    </div>
  );
}
