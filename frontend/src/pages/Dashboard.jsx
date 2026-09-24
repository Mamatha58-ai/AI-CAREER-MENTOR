import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

const TOOLS = [
  {
    icon: "📄",
    title: "Resume Analyzer",
    desc: "Upload your PDF and get an instant ATS score, skill detection and improvement tips.",
    to: "/resume",
    color: "#5b5ef4",
    badge: "Popular",
  },
  {
    icon: "🧠",
    title: "Skill Gap Detection",
    desc: "See which skills you're missing for any target role with a clear match score.",
    to: "/skill-gap",
    color: "#0ea5e9",
    badge: null,
  },
  {
    icon: "🎯",
    title: "Career Recommendation",
    desc: "Get AI-ranked career path suggestions tailored to your background and goals.",
    to: "/career",
    color: "#f59e0b",
    badge: null,
  },
  {
    icon: "🎤",
    title: "Mock Interview",
    desc: "Practice real technical questions by topic and review model answers at your pace.",
    to: "/mock-interview",
    color: "#10b981",
    badge: "New",
  },
];

const TIPS = [
  "Tailor your resume keywords to match each job description before applying.",
  "Add measurable results to experience bullets — numbers stand out to recruiters.",
  "List tools for your target role even if you're still learning them.",
  "A focused LinkedIn headline gets 3× more profile views than a generic one.",
  "Practice STAR-format answers: Situation → Task → Action → Result.",
  "Apply within 3 days of a job posting — early applicants get more callbacks.",
  "Side projects on GitHub are worth more than certifications for most tech roles.",
];

export default function Dashboard() {
  const [userName, setUserName] = useState("");
  const [tip]      = useState(() => TIPS[Math.floor(Math.random() * TIPS.length)]);

  useEffect(() => {
    setUserName(localStorage.getItem("userName") || "there");
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = userName.split(" ")[0];

  return (
    <div className="dash">

      {/* ── TOP BAR ── */}
      <div className="dash-top">
        <div>
          <span className="dash-eyebrow">{greeting} 👋</span>
          <h1>Welcome back, {firstName}</h1>
        </div>
      </div>

      {/* ── DAILY TIP ── */}
      <div className="dash-tip">
        <span className="dash-tip-badge">💡 Tip of the day</span>
        <p>{tip}</p>
      </div>

      {/* ── TOOLS ── */}
      <div className="dash-section-hd">
        <h2>Your AI Tools</h2>
        <p>Each tool is powered by AI and built around real career challenges.</p>
      </div>

      <div className="dash-grid">
        {TOOLS.map(t => (
          <Link
            key={t.title}
            to={t.to}
            className="dash-card"
            style={{ "--tc": t.color }}
          >
            {t.badge && <span className="dash-card-badge">{t.badge}</span>}
            <div className="dash-card-icon">{t.icon}</div>
            <h3>{t.title}</h3>
            <p>{t.desc}</p>
            <span className="dash-card-cta">Open tool →</span>
          </Link>
        ))}
      </div>


    </div>
  );
}
