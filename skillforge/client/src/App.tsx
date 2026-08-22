import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { supabase } from "./lib/supabaseClient";
import { useAuth } from "./context/AuthContext";
import Landing from "./pages/Landing";
import OnboardingFunnel from "./pages/OnboardingFunnel";
import Dashboard from "./pages/Dashboard";
import AssessmentPicker from "./pages/AssessmentPicker";
import AssessmentResults from "./pages/AssessmentResults";
import Roadmap from "./pages/Roadmap";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Features from "./pages/Features";
import Curriculum from "./pages/Curriculum";
import Mentors from "./pages/Mentors";
import Docs from "./pages/Docs";
import FloatingAgentWidget from "./components/FloatingAgentWidget";

export type View =
  | "landing" | "onboarding" | "dashboard" | "assessments"
  | "assessment" | "results" | "roadmap" | "copilot" | "profile" | "admin"
  | "features" | "curriculum" | "mentors" | "docs";

export interface AppUser {
  name:         string;
  role:         "student" | "mentor";
  targetRole:   string;
  activePhase:  string;
  readinessPct: number;
  skillVector:  { domain: string; score: number; gap?: boolean }[];
}

const VIEW_TO_PATH: Partial<Record<View, string>> = {
  landing:     "/",
  features:    "/features",
  curriculum:  "/curriculum",
  mentors:     "/mentors",
  docs:        "/docs",
  dashboard:   "/dashboard",
  onboarding:  "/onboarding",
  assessments: "/assessments",
  assessment:  "/assessment",
  results:     "/results",
  roadmap:     "/roadmap",
  profile:     "/profile",
  admin:       "/admin",
};

function pathToView(path: string): View {
  const map: Record<string, View> = {
    "/":            "landing",
    "/features":    "features",
    "/curriculum":  "curriculum",
    "/mentors":     "mentors",
    "/docs":        "docs",
    "/dashboard":   "dashboard",
    "/onboarding":  "onboarding",
    "/assessments": "assessments",
    "/assessment":  "assessment",
    "/results":     "results",
    "/roadmap":     "roadmap",
    "/profile":     "profile",
    "/admin":       "admin",
  };
  return map[path] ?? "landing";
}

export default function App() {
  const [view, setView] = useState<View>(() => pathToView(window.location.pathname));
  const { user: authUser, profile, isLoading, logout: authLogout } = useAuth();
  const [user, setUser] = useState<AppUser | null>(null);

  // Background Keep-Alive Ping Engine
  useEffect(() => {
    const pingHealth = async () => {
      try {
        const GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:5000';
        await fetch(`${GATEWAY_URL}/health`);
      } catch (error) {
        // Silently fail on network errors during keep-alive ping
      }
    };
    
    // Initial ping on mount
    pingHealth();
    
    // 9 minutes (540,000 ms) interval to keep Render services awake
    const interval = setInterval(pingHealth, 540000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const handler = () => {
      if (isMounted) setView(pathToView(window.location.pathname));
    };
    window.addEventListener("popstate", handler);
    
    // Auth Persistence from AuthContext
    if (authUser) {

      const metadata = authUser.user_metadata || {};
      const isMentor = metadata.role === "mentor" || profile?.role === "mentor";
      const defaultSkillVector = [
        { domain: "python", score: 0 },
        { domain: "system_arch", score: 0, gap: true }
      ];
      setUser({ 
        name: metadata.full_name || metadata.name || "Student",
        role: isMentor ? "mentor" : "student",
        targetRole: profile?.target_role || "Undeclared",
        activePhase: profile?.active_phase || "Phase 01: Foundations",
        readinessPct: profile?.overall_readiness || 0,
        skillVector: profile?.skill_vector || defaultSkillVector
      });
    } else {
      setUser(null);
    }

    return () => {
      isMounted = false;
      window.removeEventListener("popstate", handler);
    };
  }, [authUser, profile, isLoading, view]);

  function navigate(v: View) {
    const path = VIEW_TO_PATH[v] ?? "/";
    history.pushState({}, "", path);
    setView(v);
    window.scrollTo(0, 0);
  }

  const login    = (u: AppUser) => setUser(u);
  const logout   = async () => {
    await authLogout();
    setUser(null);
    navigate("landing");
  };
  const publicProps = { onNavigate: navigate, user, onLogin: login, onLogout: logout };
  const authProps   = { onNavigate: navigate, user, onLogout: logout };

  const renderView = () => {
    switch (view) {
      case "landing":     return <Landing     {...publicProps} />;
      case "features":    return <Features    {...publicProps} />;
      case "curriculum":  return <Curriculum  {...publicProps} />;
      case "mentors":     return <Mentors     {...publicProps} />;
      case "docs":        return <Docs        {...publicProps} />;
      case "onboarding":  return <OnboardingFunnel onNavigate={navigate} onLogin={login} />;
      case "assessments": return <AssessmentPicker onNavigate={navigate} />;
      case "results":     return <AssessmentResults onNavigate={navigate} />;
      case "roadmap":     return <Roadmap     {...authProps} />;
      case "profile":     return <Profile     {...authProps} />;
      case "admin":       return <Admin       {...authProps} />;
      default:            return <Dashboard   {...authProps} />;
    }
  };

  return (
    <>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#0f172a',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f1f5f9',
            fontFamily: 'monospace',
            borderRadius: '0.5rem',
          }
        }} 
      />
      {renderView()}
      {user && <FloatingAgentWidget />}
    </>
  );
}
