import type { View, AppUser } from "../App";

interface Props {
  active:         View;
  onNavigate:     (v: View) => void;
  user?:          AppUser | null;
  onLogout?:      () => void;
}

const NAV_ITEMS: { id: View | "copilot"; label: string; icon: string }[] = [
  { id: "dashboard",   label: "Dashboard",   icon: "⊡" },
  { id: "assessments", label: "Assessments", icon: "▷" },
  { id: "roadmap",     label: "Roadmap",     icon: "≡" },
  { id: "copilot",     label: "Copilot",     icon: "◎" },
  { id: "profile",     label: "Profile",     icon: "◷" },
];

export default function Sidebar({ active, onNavigate, user, onLogout }: Props) {
  const initials = user
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "ST";
  const displayName = user?.name ?? "Student";
  const displayRole = user?.role === "mentor" ? "[mentor]" : "[student]";
  const isMentor    = user?.role === "mentor";

  return (
    <aside
      className="hidden md:flex flex-col flex-shrink-0 border-r border-border bg-canvas py-6"
      style={{ width: 240, minHeight: "100vh" }}
    >
      {/* Brand */}
      <div 
        className="px-5 flex items-center gap-2 mb-2 cursor-pointer select-none"
        onClick={() => onNavigate("landing")}
      >
        <svg className="w-5 h-5 text-text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor" stroke="none" />
          <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
          <path d="M12 12L12 22" />
        </svg>
        <span className="font-sans font-semibold text-[13px] text-text-primary tracking-[0.1em] uppercase">
          SkillForge
        </span>
        <span className="font-mono text-[11px] text-text-muted">[v1.0]</span>
      </div>
      <div className="h-px bg-border mx-3 mb-4 mt-2" />

      {/* Primary nav */}
      <nav className="flex flex-col gap-0.5 px-3 flex-1">
        {NAV_ITEMS.map((item) => {
          const isCopilot = item.id === "copilot";
          const isActive  = !isCopilot && item.id === active;
          return (
            <button
              key={item.id}
              onClick={() => { if (!isCopilot) onNavigate(item.id as View); }}
              className={`relative flex items-center gap-3 h-8 px-3 rounded-lg text-[13px] font-medium transition-colors duration-100 w-full text-left ${
                isCopilot ? "hidden" : ""
              } ${
                isActive
                  ? "bg-surface-hover text-text-primary"
                  : "text-[#71717A] hover:bg-surface hover:text-text-secondary"
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-accent" />
              )}
              <span className="text-sm w-4 text-center flex-shrink-0 select-none">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}

        {/* Admin — only visible to mentors */}
        {isMentor && (
          <>
            <div className="h-px bg-border my-2" />
            <button
              onClick={() => onNavigate("admin")}
              className={`relative flex items-center gap-3 h-8 px-3 rounded-lg text-[13px] font-medium transition-colors duration-100 cursor-pointer w-full text-left ${
                active === "admin"
                  ? "bg-surface-hover text-text-primary"
                  : "text-[#71717A] hover:bg-surface hover:text-text-secondary"
              }`}
            >
              {active === "admin" && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-accent" />
              )}
              <span className="text-sm w-4 text-center flex-shrink-0 select-none">⬡</span>
              <span>Admin Panel</span>
            </button>
          </>
        )}
      </nav>

      {/* User footer */}
      <div className="px-3 mt-4 pt-4 border-t border-border flex flex-col gap-1">
        <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg">
          <div className="w-7 h-7 rounded-full bg-surface-hover border border-border flex items-center justify-center flex-shrink-0">
            <span className="font-sans text-[11px] font-semibold text-text-secondary select-none">{initials}</span>
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="font-sans text-[13px] font-medium text-text-primary truncate leading-none">
              {displayName}
            </span>
            <span className="font-mono text-[10px] text-text-muted mt-0.5">{displayRole}</span>
          </div>
        </div>
        {onLogout && (
          <button
            onClick={() => { onLogout(); onNavigate("landing"); }}
            className="w-full text-left px-2 py-1 font-mono text-[10px] text-text-muted hover:text-text-secondary transition-colors cursor-pointer rounded"
          >
            [logout →]
          </button>
        )}
      </div>
    </aside>
  );
}
