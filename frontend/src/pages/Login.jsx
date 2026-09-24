import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./Auth.css";

const PERKS = [
  { icon: "📄", bg: "rgba(91,94,244,0.2)",  text: "AI Resume Scoring" },
  { icon: "🧠", bg: "rgba(14,165,233,0.2)",  text: "Skill Gap Detection" },
  { icon: "🎯", bg: "rgba(245,158,11,0.2)",  text: "Career Recommendations" },
  { icon: "🎤", bg: "rgba(16,185,129,0.2)",  text: "Mock Interview Practice" },
];

export default function Login() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  // Already authenticated → skip to dashboard
  useEffect(() => {
    if (localStorage.getItem("userEmail")) navigate("/dashboard", { replace: true });
  }, [navigate]);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res  = await fetch("http://127.0.0.1:5000/auth/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Login failed.");
        setLoading(false);
        return;
      }
      // Persist user details so the whole app can read them
      localStorage.setItem("userEmail",    data.user.email);
      localStorage.setItem("userName",     data.user.name);
      toast.success(`Welcome back, ${data.user.name.split(" ")[0]}! 👋`);
      navigate("/dashboard");
    } catch {
      toast.error("Could not reach the server. Make sure the backend is running.");
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">

      {/* ── LEFT PANEL ── */}
      <div className="auth-panel">
        <div className="auth-panel-orb auth-panel-orb-1" />
        <div className="auth-panel-orb auth-panel-orb-2" />
        <div className="auth-panel-inner">
          <Link to="/" className="auth-panel-logo">AI Career Mentor</Link>
          <h2>Your AI-powered<br />career guidance starts here</h2>
          <ul className="auth-panel-perks">
            {PERKS.map(p => (
              <li key={p.text}>
                <span className="perk-icon" style={{ background: p.bg }}>{p.icon}</span>
                {p.text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── RIGHT FORM ── */}
      <div className="auth-form-side">
        <div className="auth-card">

          <Link to="/" className="auth-home-link">← Back to home</Link>

          <div className="auth-heading">
            <h1>Sign in to AI Career Mentor</h1>
            <p>Enter your credentials to continue your journey</p>
          </div>

          <form onSubmit={handleLogin} className="auth-form">

            <div className="auth-field">
              <label htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                autoFocus
              />
            </div>

            <div className="auth-field">
              <label htmlFor="login-pass">Password</label>
              <div className="auth-pass-wrap">
                <input
                  id="login-pass"
                  type={showPass ? "text" : "password"}
                  placeholder="Your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="auth-pass-toggle"
                  onClick={() => setShowPass(v => !v)}
                  tabIndex={-1}
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? <span className="auth-spin" /> : "Sign In →"}
            </button>

          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/register">Create one free</Link>
          </p>

        </div>
      </div>

    </div>
  );
}
