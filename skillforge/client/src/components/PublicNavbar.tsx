import { useState, useEffect } from "react";
import type { View, AppUser } from "../App";
import AuthModal from "./AuthModal";

const NAV_LINKS: { label: string; view: View }[] = [
  { label: "Features",   view: "features"   },
  { label: "Curriculum", view: "curriculum" },
  { label: "Mentors",    view: "mentors"    },
  { label: "Docs",       view: "docs"       },
];

interface Props {
  active:     View;
  onNavigate: (v: View) => void;
  user:       AppUser | null;
  onLogin:    (u: AppUser) => void;
  onLogout?:  () => void;
}

export default function PublicNavbar({ active, onNavigate, user, onLogin, onLogout }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [auth,     setAuth]     = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 inset-x-0 z-50 h-[52px] flex items-center justify-between px-6 md:px-10 transition-all duration-200 ${
          scrolled ? "bg-canvas/90 backdrop-blur-md border-b border-border" : "bg-transparent"
        }`}
      >
        {/* Brand */}
        <div
          className="flex items-center gap-3 select-none cursor-pointer"
          onClick={() => onNavigate("landing")}
        >
          <svg className="w-5 h-5 text-text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor" stroke="none" />
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
            <path d="M12 12L12 22" />
          </svg>
          <span className="font-sans font-semibold text-[13px] text-text-primary tracking-[0.1em] uppercase hidden sm:inline">
            SkillForge
          </span>
          <span className="font-sans font-semibold text-[13px] text-text-primary tracking-[0.1em] uppercase sm:hidden">
            SF
          </span>
          <span className="font-mono text-[11px] text-text-muted hidden sm:inline">[v1.0]</span>
          {user?.role === "student" && (
            <span className="hidden sm:inline-flex font-mono text-[10px] text-accent border border-accent rounded-md px-2 py-0.5 animate-fade-in">
              [Active Track: {user.targetRole}]
            </span>
          )}
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => {
            const isActive = active === link.view;
            return (
              <button
                key={link.label}
                onClick={() => onNavigate(link.view)}
                className={`relative font-sans text-[13px] transition-colors duration-150 cursor-pointer bg-transparent border-none pb-0.5 ${
                  isActive ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-px left-0 right-0 h-[2px] bg-text-primary rounded-full" />
                )}
              </button>
            );
          })}

          <div className="w-px h-4 bg-border" />

          {user ? (
            <>
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => onNavigate("profile")}
              >
                <div className="w-7 h-7 rounded-full bg-surface-hover border border-border flex items-center justify-center">
                  <span className="font-mono text-[10px] text-text-muted">
                    {user.name[0].toUpperCase()}
                  </span>
                </div>
                <span className="font-sans text-[13px] text-text-secondary">
                  {user.name.split(" ")[0]}
                </span>
              </div>
              <button
                onClick={() => onNavigate("dashboard")}
                className="btn-cta h-8 px-4 rounded-lg bg-white text-black text-[13px] font-semibold hover:bg-zinc-100 cursor-pointer"
              >
                Dashboard →
              </button>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="btn-cta h-8 px-4 rounded-lg border border-border bg-transparent text-text-secondary hover:border-text-muted hover:text-danger text-[13px] font-medium cursor-pointer"
                >
                  Logout
                </button>
              )}
            </>
          ) : (
            <>
              <button
                onClick={() => setAuth(true)}
                className="btn-cta h-8 px-4 rounded-lg border border-border bg-transparent text-text-secondary hover:border-text-muted hover:text-text-primary text-[13px] font-medium cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => setAuth(true)}
                className="btn-cta h-8 px-4 rounded-lg bg-white text-black text-[13px] font-semibold hover:bg-zinc-100 cursor-pointer"
              >
                Get Started
              </button>
            </>
          )}
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={() => user ? onNavigate("dashboard") : setAuth(true)}
            className="btn-cta h-8 px-3 rounded-lg bg-white text-black text-xs font-semibold cursor-pointer"
          >
            {user ? "Dashboard" : "Get Started"}
          </button>
          {user && onLogout && (
            <button
              onClick={onLogout}
              className="text-text-secondary hover:text-danger text-xs font-medium cursor-pointer ml-2"
            >
              Logout
            </button>
          )}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-text-primary text-lg cursor-pointer"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="fixed top-[52px] inset-x-0 bg-surface border-b border-border z-40 flex flex-col p-4 gap-4 shadow-lg md:hidden">
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => { onNavigate(link.view); setMenuOpen(false); }}
              className={`font-sans text-[15px] text-left ${
                active === link.view ? "text-text-primary font-semibold" : "text-text-secondary"
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}

      {auth && (
        <AuthModal
          onClose={() => setAuth(false)}
          onNavigate={onNavigate}
          onLogin={onLogin}
        />
      )}
    </>
  );
}
