import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar         from "./components/Navbar";
import Sidebar        from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

// Public
import Landing  from "./pages/Landing";
import Login    from "./pages/Login";
import Register from "./pages/Register";

// Protected
import Dashboard            from "./pages/Dashboard";
import ResumeAnalyzer       from "./pages/ResumeAnalyzer";
import CareerRecommendation from "./pages/CareerRecommendation";
import SkillGapDetection    from "./pages/SkillGapDetection";
import MockInterview        from "./pages/MockInterview";

const PUBLIC_PATHS  = ["/", "/login", "/register"];

function AppShell({ resumeFile, setResumeFile, resumeResult, setResumeResult }) {
  const location  = useLocation();
  const isPublic  = PUBLIC_PATHS.includes(location.pathname);
  const isLoggedIn = Boolean(localStorage.getItem("userEmail"));
  const showSidebar = !isPublic && isLoggedIn;

  const protect = (el) => <ProtectedRoute>{el}</ProtectedRoute>;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      {/* Sidebar for authenticated pages */}
      {showSidebar && <Sidebar />}

      {/* Main area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Top navbar for public pages */}
        {isPublic && <Navbar />}

        {/* Page content */}
        <main style={{ flex: 1 }}>
          <Routes>
            {/* Public */}
            <Route path="/"         element={<Landing />} />
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected */}
            <Route path="/dashboard"      element={protect(<Dashboard />)} />
            <Route path="/resume"         element={protect(
              <ResumeAnalyzer
                persistedFile={resumeFile}
                setPersistedFile={setResumeFile}
                persistedResult={resumeResult}
                setPersistedResult={setResumeResult}
              />
            )} />
            <Route path="/career"         element={protect(<CareerRecommendation />)} />
            <Route path="/skill-gap"      element={protect(<SkillGapDetection />)} />
            <Route path="/mock-interview" element={protect(<MockInterview />)} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

      </div>
    </div>
  );
}

export default function App() {
  const [resumeFile,   setResumeFile]   = useState(null);
  const [resumeResult, setResumeResult] = useState(null);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background:   "#1a1a2a",
            color:        "#eef0f6",
            border:       "1px solid rgba(255,255,255,0.09)",
            borderRadius: "12px",
            fontSize:     "0.88rem",
            fontWeight:   "500",
            boxShadow:    "0 8px 24px rgba(0,0,0,0.4)",
          },
          success: { iconTheme: { primary: "#10b981", secondary: "#1a1a2a" } },
          error:   { iconTheme: { primary: "#f43f5e", secondary: "#1a1a2a" } },
        }}
      />
      <AppShell
        resumeFile={resumeFile}
        setResumeFile={setResumeFile}
        resumeResult={resumeResult}
        setResumeResult={setResumeResult}
      />
    </BrowserRouter>
  );
}
