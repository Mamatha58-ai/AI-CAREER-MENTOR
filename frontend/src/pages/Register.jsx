import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./Auth.css";

const PERKS = [
  { icon: "✅", bg: "rgba(16,185,129,0.2)",   text: "Free to get started" },
  { icon: "⚡", bg: "rgba(245,158,11,0.2)",   text: "Instant AI analysis" },
  { icon: "🗺️", bg: "rgba(91,94,244,0.2)",    text: "Personalised career roadmap" },
  { icon: "🔒", bg: "rgba(14,165,233,0.2)",   text: "Your data stays private" },
];

function passwordStrength(p) {
  if (!p) return 0;
  let s = 0;
  if (p.length >= 8)          s++;
  if (/[A-Z]/.test(p))        s++;
  if (/[0-9]/.test(p))        s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s;
}

const LABELS = ["", "Weak", "Fair", "Good", "Strong"];
const CLASSES = ["", "s-weak", "s-fair", "s-good", "s-strong"];

export default function Register() {
  const [form, setForm]       = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  // Already authenticated → skip to dashboard
  useEffect(() => {
    if (localStorage.getItem("userEmail")) navigate("/dashboard", { replace: true });
  }, [navigate]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res  = await fetch("http://127.0.0.1:5000/auth/register", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Registration failed.");
        setLoading(false);
        return;
      }
      // Auto-login: store user details immediately so they land on dashboard
      localStorage.setItem("userEmail", data.user.email);
      localStorage.setItem("userName",  data.user.name);
      toast.success("Account created! Welcome aboard 🎉");
      navigate("/dashboard");
    } catch {
      toast.error("Could not reach the server. Make sure the backend is running.");
      setLoading(false);
    }
  }

  const strength      = passwordStrength(form.password);
  const strengthClass = CLASSES[strength];
  const strengthLabel = LABELS[strength];

  return (
    <div className="auth-page">

      {/* ── LEFT PANEL ── */}
      <div className="auth-panel">
        <div className="auth-panel-orb auth-panel-orb-1" />
        <div className="auth-panel-orb auth-panel-orb-2" />
        <div className="auth-panel-inner">
          <Link to="/" className="auth-panel-logo">AI Career Mentor</Link>
          <h2>Start your AI career<br />journey today</h2>
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
            <h1>Create your account</h1>
            <p>Join thousands building smarter careers with AI</p>
          </div>

          <form onSubmit={handleRegister} className="auth-form">

            <div className="auth-field">
              <label htmlFor="reg-name">Full name</label>
              <input
                id="reg-name"
                name="name"
                type="text"
                placeholder="Jane Doe"
                value={form.name}
                onChange={handleChange}
                required
                autoComplete="name"
                autoFocus
              />
            </div>

            <div className="auth-field">
              <label htmlFor="reg-email">Email address</label>
              <input
                id="reg-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="reg-pass">Password</label>
              <div className="auth-pass-wrap">
                <input
                  id="reg-pass"
                  name="password"
                  type={showPass ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
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

              {form.password && (
                <div className={`auth-strength ${strengthClass}`}>
                  <div className="auth-strength-bar">
                    <span style={{ width: `${strength * 25}%` }} />
                  </div>
                  <span className="auth-strength-lbl">{strengthLabel}</span>
                </div>
              )}
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? <span className="auth-spin" /> : "Create Account →"}
            </button>

          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>

        </div>
      </div>

    </div>
  );
}
