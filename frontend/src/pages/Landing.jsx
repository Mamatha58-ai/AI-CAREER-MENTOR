import { Link } from "react-router-dom";
import "./Landing.css";

const features = [
  {
    icon: "📄",
    title: "Resume Analyzer",
    desc: "Upload your PDF resume and get an instant ATS score, skill detection, and personalised improvement suggestions.",
    color: "#5b5ef4",
  },
  {
    icon: "🧠",
    title: "Skill Gap Detection",
    desc: "See exactly which skills you're missing for any target role — with a clear score and actionable next steps.",
    color: "#0ea5e9",
  },
  {
    icon: "🎯",
    title: "Career Recommendation",
    desc: "Share your background and preferences. Get ranked career path suggestions matched to your profile.",
    color: "#f59e0b",
  },
  {
    icon: "🎤",
    title: "Mock Interview",
    desc: "Practice real technical questions by topic. Reveal model answers at your own pace to build real confidence.",
    color: "#10b981",
  },
];

const stats = [
  { value: "10K+", label: "Students Helped" },
  { value: "95%",  label: "Satisfaction Rate" },
  { value: "500+", label: "Career Paths" },
  { value: "4",    label: "AI-Powered Tools" },
];

const steps = [
  { num: "01", title: "Create a free account",    desc: "Sign up in under 30 seconds. No credit card, no catches." },
  { num: "02", title: "Upload your resume",        desc: "Our AI scans your PDF and scores it instantly." },
  { num: "03", title: "Discover your career path", desc: "Get personalised role matches and a skill-building plan." },
  { num: "04", title: "Practice and get hired",    desc: "Sharpen interview skills and track your readiness over time." },
];

const testimonials = [
  {
    quote: "I was stuck between Data Science and Backend Dev. The career tool ranked my options and I landed a DS role within 3 months.",
    name: "Priya S.",
    role: "Data Scientist, Bangalore",
    avatar: "P",
  },
  {
    quote: "The resume score told me exactly what was missing. Added those skills to my CV and started getting callbacks the same week.",
    name: "Arjun K.",
    role: "Software Engineer, Hyderabad",
    avatar: "A",
  },
  {
    quote: "Mock interview practice helped me stop freezing on JavaScript questions. The answers are short, clear and actually useful.",
    name: "Meera R.",
    role: "Frontend Developer, Chennai",
    avatar: "M",
  },
];

export default function Landing() {
  return (
    <div className="landing">

      {/* ── HERO ── */}
      <section className="land-hero">
        <div className="land-orb land-orb-1" />
        <div className="land-orb land-orb-2" />

        <div className="land-hero-inner">
          <span className="land-badge">✦ AI-Powered Career Guidance</span>

          <h1>
            Meet your personal<br />
            <span className="gradient-text">AI Career Mentor</span>
          </h1>

          <p>
            Stop second-guessing your career path. Get AI-driven resume scoring,
            skill gap analysis, career recommendations and mock interview
            practice — built for students and early-career professionals.
          </p>

          <div className="land-hero-btns">
            <Link to="/register" className="btn-hero-primary">Get Started Free →</Link>
            <Link to="/login"    className="btn-hero-ghost">Sign In</Link>
          </div>

          <span className="land-hero-note">Free to use · No credit card required</span>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="land-stats">
        {stats.map(s => (
          <div key={s.label} className="land-stat">
            <strong>{s.value}</strong>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── FEATURES ── */}
      <section className="land-section">
        <p className="land-eyebrow">What you get</p>
        <h2>Four tools. One goal: <span className="gradient-text">your next career step.</span></h2>
        <p className="land-section-sub">Every tool is built around the real questions students and job-seekers face.</p>

        <div className="land-features-grid">
          {features.map(f => (
            <div key={f.title} className="land-feat-card" style={{ "--fc": f.color }}>
              <div className="land-feat-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="land-section land-how">
        <p className="land-eyebrow">How it works</p>
        <h2>From resume to <span className="gradient-text">offer letter</span> in 4 steps</h2>

        <div className="land-steps">
          {steps.map((s, i) => (
            <div key={s.num} className="land-step">
              <div className="land-step-num">{s.num}</div>
              <div className="land-step-body">
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
              {i < steps.length - 1 && <div className="land-step-line" />}
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="land-section">
        <p className="land-eyebrow">From our users</p>
        <h2>Real results from <span className="gradient-text">real students</span></h2>

        <div className="land-testimonials">
          {testimonials.map(t => (
            <div key={t.name} className="land-testi-card">
              <p className="land-testi-quote">"{t.quote}"</p>
              <div className="land-testi-author">
                <div className="land-testi-avatar">{t.avatar}</div>
                <div>
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="land-cta">
        <div className="land-cta-glow" />
        <h2>Ready to take control of your career?</h2>
        <p>Join thousands of students who are using AI to make smarter career decisions.</p>
        <Link to="/register" className="btn-hero-primary">Start for Free →</Link>
      </section>

      {/* ── FOOTER ── */}
      <footer className="land-footer">
        <span className="land-footer-brand">AI Career Mentor</span>
        <span>© 2025 AI Career Mentor. Built to empower the next generation of professionals.</span>
      </footer>

    </div>
  );
}
