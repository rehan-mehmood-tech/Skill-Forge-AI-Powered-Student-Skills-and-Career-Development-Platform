import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { supabase } from "./lib/supabaseClient";
import { useAuth } from "./context/AuthContext";
import { STUDENT_USER, MENTOR_USER } from "./components/AuthModal";
import Landing from "./pages/Landing";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import AssessmentPicker from "./pages/AssessmentPicker";
import Assessment from "./pages/Assessment";
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
  const { user: authUser, profile, isLoading } = useAuth();
  const [user, setUser] = useState<AppUser | null>(null);

  useEffect(() => {
    let isMounted = true;
    const handler = () => {
      if (isMounted) setView(pathToView(window.location.pathname));
    };
    window.addEventListener("popstate", handler);
    
    // Auth Persistence from AuthContext
    if (authUser) {
      if (!isLoading && !profile && view !== "onboarding") {
        history.pushState({}, "", "/onboarding");
        if (isMounted) setView("onboarding");
      }

      const metadata = authUser.user_metadata || {};
      const isMentor = metadata.role === "mentor";
      const baseUser = isMentor ? MENTOR_USER : STUDENT_USER;
      setUser({ 
        ...baseUser, 
        name: metadata.full_name || metadata.name || baseUser.name,
        targetRole: profile?.target_role || baseUser.targetRole
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
  const logout   = () => setUser(null);
  const publicProps = { onNavigate: navigate, user, onLogin: login };
  const authProps   = { onNavigate: navigate, user, onLogout: logout };

  const renderView = () => {
    switch (view) {
      case "landing":     return <Landing     {...publicProps} />;
      case "features":    return <Features    {...publicProps} />;
      case "curriculum":  return <Curriculum  {...publicProps} />;
      case "mentors":     return <Mentors     {...publicProps} />;
      case "docs":        return <Docs        {...publicProps} />;
      case "onboarding":  return <Onboarding  onNavigate={navigate} onLogin={login} />;
      case "assessments": return <AssessmentPicker onNavigate={navigate} />;
      case "assessment":  return <Assessment  onNavigate={navigate} />;
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
