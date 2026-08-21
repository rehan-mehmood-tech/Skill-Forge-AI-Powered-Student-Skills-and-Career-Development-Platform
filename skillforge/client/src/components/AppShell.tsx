import { useState } from "react";
import type { View, AppUser } from "../App";
import Sidebar from "./Sidebar";

interface Props {
  active:     View;
  onNavigate: (v: View) => void;
  user?:      AppUser | null;
  onLogout?:  () => void;
  children:   React.ReactNode;
}

export default function AppShell({ active, onNavigate, user, onLogout, children }: Props) {
  const [copilotOpen, setCopilotOpen] = useState(false);

  return (
    <div className="flex h-screen bg-canvas overflow-hidden">
      <Sidebar
        active={active}
        onNavigate={onNavigate}
        user={user}
        onLogout={onLogout}
      />

      <div className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden">
        {children}
      </div>

      <MobileTabBar
        active={active}
        onNavigate={onNavigate}
      />
    </div>
  );
}

function MobileTabBar({
  active,
  onNavigate,
}: {
  active:         View;
  onNavigate:     (v: View) => void;
}) {
  const tabs = [
    { id: "dashboard"   as View, label: "Home",    icon: "⊡", copilot: false },
    { id: "assessments" as View, label: "Assess",  icon: "▷", copilot: false },
    { id: "roadmap"     as View, label: "Roadmap", icon: "≡", copilot: false },
    { id: "copilot"     as View, label: "Copilot", icon: "◎", copilot: true  },
    { id: "profile"     as View, label: "Profile", icon: "◷", copilot: false },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-14 bg-canvas border-t border-border flex items-center justify-around z-40 md:hidden">
      {tabs.map((tab) => {
        if (tab.copilot) return null; // We use FloatingAgentWidget now
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            className="flex flex-col items-center gap-0.5 px-3 py-2 cursor-pointer"
          >
            <span className={`text-base ${isActive ? "text-text-primary" : "text-text-muted"}`}>
              {tab.icon}
            </span>
            <span className={`font-mono text-[9px] tracking-widest uppercase ${isActive ? "text-text-secondary" : "text-text-muted"}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
