import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import "./CareerRecommendation.css";

const INTEREST_OPTIONS = [
  "AI / Machine Learning","Web Development","Data Science",
  "Mobile Development","Cybersecurity","Cloud & DevOps",
  "Game Development","UI/UX Design","Blockchain",
  "Research & Academia","Database Management","Networking","Others",
];

const WORK_OPTIONS = [
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "office", label: "On-site" },
  { value: "others", label: "Others" },
];

const PREFS = [
  { key: "likes_coding",  label: "I enjoy coding" },
  { key: "likes_logic",   label: "I enjoy problem solving" },
  { key: "likes_design",  label: "I enjoy design / UI work" },
];

const MATCH_COLOR = (pct) =>
  pct >= 75 ? "#10b981" : pct >= 50 ? "#f59e0b" : "#f43f5e";

// All known skills for suggestion dropdown
const ALL_SKILLS = [
  "Python","JavaScript","TypeScript","Java","C","C++","C#","Go","Rust","PHP","Swift","Kotlin","Ruby",
  "HTML","CSS","React","Vue","Angular","Next.js","Node.js","Express","Django","Flask","FastAPI","Spring Boot",
  "SQL","PostgreSQL","MySQL","MongoDB","Redis","Firebase","SQLite","Oracle",
  "Machine Learning","Deep Learning","TensorFlow","PyTorch","scikit-learn","Pandas","NumPy","Matplotlib",
  "AWS","Azure","GCP","Docker","Kubernetes","Terraform","Ansible","CI/CD","Linux","Git","GitHub",
  "React Native","Flutter","Swift","Kotlin","Ionic",
  "Figma","Adobe XD","Wireframing","Prototyping","User Research",
  "Solidity","Web3.js","Ethereum","Smart Contracts",
  "Networking","Cybersecurity","Ethical Hacking","Linux Security",
  "Unity","Unreal Engine","C++","OpenGL","3D Math",
  "REST APIs","GraphQL","WebSockets","Microservices","DevOps",
];

export default function CareerRecommendation() {
  const [step, setStep] = useState("goal");
  const [goal, setGoal] = useState(null);

  const [form, setForm] = useState({
    name: "", education: "", branch: "", current_year: "", cgpa: "",
    skills: [], interests: [], otherInterest: "",
    likes_coding: false, likes_logic: false, likes_design: false,
    work_style: "", work_style_other: "",
  });

  const [skillInput,    setSkillInput]    = useState("");
  const [skillDropOpen, setSkillDropOpen] = useState(false);
  const [interestOpen,  setInterestOpen]  = useState(false);
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const interestRef = useRef(null);
  const skillWrapRef = useRef(null);

  useEffect(() => {
    const email = localStorage.getItem("userEmail") || "";
    const name  = localStorage.getItem("userName")  || "";
    if (name) setForm(f => ({ ...f, name }));
    if (!email) return;
    fetch(`http://127.0.0.1:5000/resume/${encodeURIComponent(email)}`)
      .then(r => r.json())
      .then(d => {
        if (d.found && Array.isArray(d.result?.skills) && d.result.skills.length > 0)
          setForm(f => ({ ...f, skills: d.result.skills }));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handler(e) {
      if (interestRef.current && !interestRef.current.contains(e.target))
        setInterestOpen(false);
      if (skillWrapRef.current && !skillWrapRef.current.contains(e.target))
        setSkillDropOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  function addSkill(s) {
    const t = s.trim();
    if (!t) return;
    if (form.skills.map(x => x.toLowerCase()).includes(t.toLowerCase())) return;
    set("skills", [...form.skills, t]);
    setSkillInput("");
  }
  function removeSkill(s) { set("skills", form.skills.filter(x => x !== s)); }

  function toggleInterest(opt) {
    if (form.interests.includes(opt))
      set("interests", form.interests.filter(x => x !== opt));
    else
      set("interests", [...form.interests, opt]);
  }

  function chooseGoal(g) {
    setGoal(g);
    setStep("form");
    setResult(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.work_style) { toast.error("Please select a work preference."); return; }
    if (form.interests.length === 0) { toast.error("Please select at least one interest."); return; }

    const interestList = [
      ...form.interests.filter(i => i !== "Others"),
      ...(form.interests.includes("Others") && form.otherInterest ? [form.otherInterest] : []),
    ];
    const workStyle = form.work_style === "others"
      ? (form.work_style_other || "others")
      : form.work_style;

    setLoading(true);
    setResult(null);
    try {
      const res  = await fetch("http://127.0.0.1:5000/career-recommendation", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name, education: form.education, branch: form.branch,
          current_year: form.current_year, cgpa: form.cgpa,
          skills: form.skills, interests: interestList,
          likes_coding: form.likes_coding, likes_logic: form.likes_logic,
          likes_design: form.likes_design, goal, work_style: workStyle,
        }),
      });
      const data = await res.json();
      setResult(data);
      toast.success("Recommendations ready!");
    } catch {
      toast.error("Could not reach the backend. Make sure it is running.");
    } finally {
      setLoading(false);
    }
  }

  // ── GOAL CHOOSER SCREEN ─────────────────────────────────────────────────
  if (step === "goal") {
    return (
      <div className="cr-page">
        <div className="cr-header">
          <h1>🎯 Career Recommendation</h1>
          <p>What are you aiming for right now? Choose one to get started.</p>
        </div>
        <div className="cr-goal-chooser">
          <button className="cr-goal-card" onClick={() => chooseGoal("job")}>
            <span className="cr-goal-card-icon">💼</span>
            <h2>Find a Job</h2>
            <p>Get AI-ranked career recommendations based on your skills, interests, and profile.</p>
            <span className="cr-goal-card-cta">Choose this →</span>
          </button>
          <button className="cr-goal-card" onClick={() => chooseGoal("higher_studies")}>
            <span className="cr-goal-card-icon">🎓</span>
            <h2>Higher Education</h2>
            <p>Discover the best research and study paths that align with your academic background.</p>
            <span className="cr-goal-card-cta">Choose this →</span>
          </button>
        </div>
      </div>
    );
  }

  // ── DETAIL FORM ─────────────────────────────────────────────────────────
  return (
    <div className="cr-page">
      <div className="cr-header">
        <button className="cr-back-btn" onClick={() => { setStep("goal"); setResult(null); }}>
          ← Back
        </button>
        <h1>{goal === "job" ? "💼 Find a Job" : "🎓 Higher Education"}</h1>
        <p>Fill in your details and we'll rank the best paths for you.</p>
      </div>

      <form onSubmit={handleSubmit} className="cr-form">

        {/* Basic info */}
        <div className="cr-grid">
          {[
            { name: "name",         label: "Name",          placeholder: "Your name" },
            { name: "education",    label: "Education",     placeholder: "e.g. B.Tech, BSc" },
            { name: "branch",       label: "Branch / Major",placeholder: "e.g. Computer Science" },
            { name: "current_year", label: "Year",          placeholder: "e.g. 3rd Year" },
            { name: "cgpa",         label: "CGPA / GPA",    placeholder: "e.g. 8.5" },
          ].map(f => (
            <div key={f.name} className="cr-field">
              <label>{f.label}</label>
              <input
                name={f.name}
                value={form[f.name]}
                onChange={e => set(f.name, e.target.value)}
                placeholder={f.placeholder}
              />
            </div>
          ))}
        </div>

        {/* Skills — tag input with suggestions dropdown */}
        <div className="cr-field cr-field-full" ref={skillWrapRef}>
          <label>
            Skills
            {form.skills.length > 0
              ? <span> — pre-filled from your resume, add or remove as needed</span>
              : <span> — type to search and select skills</span>}
          </label>
          <div className="cr-skill-wrap">
            {form.skills.map(s => (
              <span key={s} className="cr-skill-tag">
                {s}
                <button
                  type="button"
                  onClick={() => removeSkill(s)}
                  className="cr-skill-remove"
                  aria-label={`Remove ${s}`}
                >×</button>
              </span>
            ))}
            <input
              className="cr-skill-input"
              value={skillInput}
              onChange={e => { setSkillInput(e.target.value); setSkillDropOpen(true); }}
              onFocus={() => { if (skillInput) setSkillDropOpen(true); }}
              onKeyDown={e => {
                if (e.key === "Enter") { e.preventDefault(); addSkill(skillInput); setSkillDropOpen(false); }
                if (e.key === "Escape") setSkillDropOpen(false);
              }}
              placeholder={form.skills.length === 0 ? "Type to search skills…" : "Add more…"}
              autoComplete="off"
            />
          </div>

          {/* Suggestions dropdown */}
          {skillDropOpen && skillInput.trim().length > 0 && (() => {
            const suggestions = ALL_SKILLS.filter(s =>
              s.toLowerCase().includes(skillInput.trim().toLowerCase()) &&
              !form.skills.map(x => x.toLowerCase()).includes(s.toLowerCase())
            );
            return suggestions.length > 0 ? (
              <ul className="cr-skill-dropdown">
                {suggestions.map(s => (
                  <li
                    key={s}
                    className="cr-skill-dropdown-item"
                    onMouseDown={() => { addSkill(s); setSkillDropOpen(false); }}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            ) : null;
          })()}
        </div>

        {/* Interests — multi-select dropdown */}
        <div className="cr-field cr-field-full" ref={interestRef}>
          <label>Interests <span>(select all that apply)</span></label>
          <div
            className={`cr-interest-trigger${interestOpen ? " open" : ""}`}
            onClick={() => setInterestOpen(o => !o)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === "Enter" && setInterestOpen(o => !o)}
          >
            {form.interests.length === 0
              ? <span className="cr-interest-placeholder">Select your interests…</span>
              : <span className="cr-interest-selected">{form.interests.join(", ")}</span>}
            <span className="cr-interest-arrow">{interestOpen ? "▲" : "▼"}</span>
          </div>
          {interestOpen && (
            <div className="cr-interest-dropdown">
              {INTEREST_OPTIONS.map(opt => (
                <label key={opt} className="cr-interest-option">
                  <input
                    type="checkbox"
                    checked={form.interests.includes(opt)}
                    onChange={() => toggleInterest(opt)}
                  />
                  <span className="cr-interest-check-box" />
                  {opt}
                </label>
              ))}
            </div>
          )}
          {form.interests.includes("Others") && (
            <input
              className="cr-others-input"
              value={form.otherInterest}
              onChange={e => set("otherInterest", e.target.value)}
              placeholder="Specify your interest…"
            />
          )}
        </div>

        {/* Preferences — all unchecked by default */}
        <div className="cr-field cr-field-full">
          <label>Your preferences <span>(check all that apply)</span></label>
          <div className="cr-prefs">
            {PREFS.map(p => (
              <label key={p.key} className={`cr-check${form[p.key] ? " checked" : ""}`}>
                <input
                  type="checkbox"
                  checked={form[p.key]}
                  onChange={e => set(p.key, e.target.checked)}
                />
                <span className="cr-check-box">{form[p.key] ? "✓" : ""}</span>
                {p.label}
              </label>
            ))}
          </div>
        </div>

        {/* Work preference — dropdown with Others */}
        <div className="cr-field cr-field-full">
          <label>Work preference</label>
          <select
            className="cr-select"
            value={form.work_style}
            onChange={e => set("work_style", e.target.value)}
          >
            <option value="" disabled>Select work preference…</option>
            {WORK_OPTIONS.map(w => (
              <option key={w.value} value={w.value}>{w.label}</option>
            ))}
          </select>
          {form.work_style === "others" && (
            <input
              className="cr-others-input"
              value={form.work_style_other}
              onChange={e => set("work_style_other", e.target.value)}
              placeholder="Describe your work preference…"
            />
          )}
        </div>

        <button type="submit" className="cr-submit" disabled={loading}>
          {loading ? <><span className="cr-spin" /> Finding careers…</> : "Get Recommendations →"}
        </button>

      </form>

      {/* Results */}
      {result && (
        <div className="cr-results">
          <h2>Top matches for <span>{result.name}</span></h2>
          {(result.recommendations || []).map((item, i) => {
            const mc = MATCH_COLOR(item.match);
            return (
              <div key={i} className="cr-card" style={{ "--mc": mc }}>
                <div className="cr-card-top">
                  <div>
                    <span className="cr-card-rank">#{i + 1}</span>
                    <span className="cr-card-role">{item.role}</span>
                  </div>
                  <div className="cr-match-badge" style={{ color: mc, borderColor: mc, background: `${mc}18` }}>
                    {item.match}% match
                  </div>
                </div>
                <div className="cr-bar-track">
                  <div className="cr-bar-fill" style={{ width: `${item.match}%`, background: mc }} />
                </div>
                <p className="cr-card-reason">{item.reason}</p>
                <div className="cr-card-meta">
                  <div className="cr-meta-item">
                    <span className="cr-meta-lbl">Required Skills</span>
                    <span className="cr-meta-val">{(item.required_skills || []).join(", ")}</span>
                  </div>
                  <div className="cr-meta-item">
                    <span className="cr-meta-lbl">Expected Salary</span>
                    <span className="cr-meta-val cr-salary">{item.salary}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
