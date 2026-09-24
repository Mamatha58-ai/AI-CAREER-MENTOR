import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import "./SkillGapDetection.css";

// All roles and their required skills (mirrors backend)
const ROLE_SKILLS = {
  "Full Stack Developer":      ["HTML", "CSS", "JavaScript", "React", "Node.js", "SQL", "Git"],
  "Frontend Developer":        ["HTML", "CSS", "JavaScript", "React", "TypeScript", "Git"],
  "Backend Developer":         ["Python", "Flask", "Django", "SQL", "Java", "REST APIs", "Git"],
  "Data Scientist":            ["Python", "SQL", "Machine Learning", "Statistics", "Pandas", "Git"],
  "AI Engineer":               ["Python", "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Git"],
  "Cybersecurity Analyst":     ["Networking", "Security", "Linux", "Python", "Ethical Hacking", "Git"],
  "Cloud Engineer":            ["AWS", "Azure", "Docker", "Kubernetes", "Linux", "Terraform", "Git"],
  "DevOps Engineer":           ["Docker", "Kubernetes", "CI/CD", "Linux", "Ansible", "Git"],
  "Mobile Developer":          ["React Native", "Flutter", "Java", "Swift", "Firebase", "Git"],
  "UI/UX Designer":            ["Figma", "Adobe XD", "Wireframing", "Prototyping", "CSS", "User Research"],
  "Database Administrator":    ["SQL", "PostgreSQL", "MongoDB", "Redis", "Database Design", "Git"],
  "Machine Learning Engineer": ["Python", "Machine Learning", "Deep Learning", "MLflow", "Docker", "Git"],
  "Game Developer":            ["C++", "Unity", "Unreal Engine", "3D Math", "OpenGL", "Git"],
  "Blockchain Developer":      ["Solidity", "Web3.js", "Ethereum", "Smart Contracts", "JavaScript", "Git"],
};

const ROLES = Object.keys(ROLE_SKILLS);

// Flat unique list of all skills across all roles for search suggestions
const ALL_SKILLS = [...new Set(Object.values(ROLE_SKILLS).flat())].sort();

export default function SkillGapDetection() {
  const [selectedRole, setSelectedRole] = useState("Full Stack Developer");
  const [addedSkills,  setAddedSkills]  = useState([]);
  const [query,        setQuery]        = useState("");
  const [dropOpen,     setDropOpen]     = useState(false);
  const [result,       setResult]       = useState(null);
  const [loading,      setLoading]      = useState(false);

  const inputRef    = useRef(null);
  const wrapperRef  = useRef(null);

  // Skills for the currently selected role (hint chips)
  const roleSkills = ROLE_SKILLS[selectedRole] || [];

  // Search dropdown suggestions: filter ALL_SKILLS by query, exclude already added
  const suggestions = query.trim().length === 0 ? [] :
    ALL_SKILLS.filter(s =>
      s.toLowerCase().includes(query.trim().toLowerCase()) &&
      !addedSkills.map(a => a.toLowerCase()).includes(s.toLowerCase())
    );

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // When role changes, reset result (but keep added skills)
  useEffect(() => {
    setResult(null);
  }, [selectedRole]);

  function addSkill(skill) {
    const trimmed = skill.trim();
    if (!trimmed) return;
    if (addedSkills.map(s => s.toLowerCase()).includes(trimmed.toLowerCase())) {
      toast("Already added!", { icon: "⚠️" });
      return;
    }
    setAddedSkills(prev => [...prev, trimmed]);
    setQuery("");
    setDropOpen(false);
    inputRef.current?.focus();
  }

  function removeSkill(skill) {
    setAddedSkills(prev => prev.filter(s => s !== skill));
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (suggestions.length > 0) {
        addSkill(suggestions[0]);
      } else if (query.trim()) {
        addSkill(query.trim());
      }
    }
    if (e.key === "Escape") {
      setDropOpen(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (addedSkills.length === 0) {
      toast.error("Add at least one skill first.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("http://127.0.0.1:5000/skill-gap", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: selectedRole, skills: addedSkills }),
      });
      const data = await res.json();
      setResult(data);
      toast.success("Skill gap analysis done!");
    } catch {
      toast.error("Could not reach the backend. Make sure it is running.");
    } finally {
      setLoading(false);
    }
  }

  const scoreColor = !result ? "#5b5ef4"
    : result.score >= 75 ? "#10b981"
    : result.score >= 45 ? "#f59e0b"
    : "#f43f5e";

  return (
    <div className="sg-page">
      <div className="sg-header">
        <h1>🧠 Skill Gap Detection</h1>
        <p>Select a target role, add your skills, and see exactly what you're missing.</p>
      </div>

      <form onSubmit={handleSubmit} className="sg-form">

        {/* ── Role selector ── */}
        <div className="sg-field">
          <label>Target Role</label>
          <div className="sg-role-grid">
            {ROLES.map(r => (
              <button
                key={r}
                type="button"
                className={`sg-role-btn${selectedRole === r ? " active" : ""}`}
                onClick={() => setSelectedRole(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* ── Role skill hints ── */}
        <div className="sg-field">
          <label>
            Skills needed for <span className="sg-hint-role">{selectedRole}</span>
            <span> — click to add any you have</span>
          </label>
          <div className="sg-hint-pills">
            {roleSkills.map(skill => {
              const added = addedSkills.map(s => s.toLowerCase()).includes(skill.toLowerCase());
              return (
                <button
                  key={skill}
                  type="button"
                  className={`sg-hint-chip${added ? " added" : ""}`}
                  onClick={() => added ? removeSkill(skill) : addSkill(skill)}
                  title={added ? "Click to remove" : "Click to add"}
                >
                  {added ? `✓ ${skill}` : `+ ${skill}`}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Search input ── */}
        <div className="sg-field" ref={wrapperRef}>
          <label htmlFor="sg-search">
            Search &amp; add skills <span>(or type a custom skill and press Enter)</span>
          </label>
          <div className="sg-search-wrap">
            {/* Added skill chips */}
            {addedSkills.map(skill => (
              <span key={skill} className="sg-tag">
                {skill}
                <button
                  type="button"
                  className="sg-tag-remove"
                  onClick={() => removeSkill(skill)}
                  aria-label={`Remove ${skill}`}
                >×</button>
              </span>
            ))}
            <input
              id="sg-search"
              ref={inputRef}
              className="sg-search-input"
              value={query}
              onChange={e => { setQuery(e.target.value); setDropOpen(true); }}
              onFocus={() => query && setDropOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder={addedSkills.length === 0 ? "Type a skill, e.g. Python…" : "Add more…"}
              autoComplete="off"
            />
          </div>

          {/* Dropdown */}
          {dropOpen && suggestions.length > 0 && (
            <ul className="sg-dropdown">
              {suggestions.map(s => (
                <li key={s} onMouseDown={() => addSkill(s)} className="sg-dropdown-item">
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button type="submit" className="sg-submit" disabled={loading}>
          {loading ? <><span className="sg-spin" /> Analyzing…</> : "Check Skill Gap →"}
        </button>

      </form>

      {/* ── Results ── */}
      {result && (
        <div className="sg-results">

          <div className="sg-score-card">
            <div className="sg-score-left">
              <span className="sg-score-role">{result.role}</span>
              <span className="sg-score-lbl">Skill match score</span>
              <div className="sg-score-num" style={{ color: scoreColor }}>
                {result.score}<span>%</span>
              </div>
            </div>
            <div className="sg-score-right">
              <div className="sg-donut-wrap">
                <svg viewBox="0 0 80 80" className="sg-donut">
                  <circle cx="40" cy="40" r="32" className="sg-donut-track" />
                  <circle
                    cx="40" cy="40" r="32"
                    className="sg-donut-fill"
                    strokeDasharray={`${2 * Math.PI * 32}`}
                    strokeDashoffset={`${2 * Math.PI * 32 * (1 - result.score / 100)}`}
                    style={{ stroke: scoreColor }}
                  />
                </svg>
                <span className="sg-donut-val">{result.score}%</span>
              </div>
            </div>
          </div>

          <div className="sg-bar-section">
            <div className="sg-bar-labels">
              <span>0%</span>
              <span style={{ color: scoreColor }}>Your score: {result.score}%</span>
              <span>100%</span>
            </div>
            <div className="sg-bar-track">
              <div className="sg-bar-fill" style={{ width: `${result.score}%`, background: scoreColor }} />
            </div>
          </div>

          {(result.known_skills || []).length > 0 && (
            <div className="sg-panel">
              <div className="sg-panel-title">✅ Skills You Already Have</div>
              <div className="sg-pills">
                {result.known_skills.map((s, i) => <span key={i} className="sg-pill sg-pill-ok">{s}</span>)}
              </div>
            </div>
          )}

          {(result.missing_skills || []).length > 0 && (
            <div className="sg-panel">
              <div className="sg-panel-title">❌ Skills You're Missing</div>
              <div className="sg-pills">
                {result.missing_skills.map((s, i) => <span key={i} className="sg-pill sg-pill-miss">{s}</span>)}
              </div>
            </div>
          )}

          {(result.suggestions || []).length > 0 && (
            <div className="sg-panel">
              <div className="sg-panel-title">📋 Suggested Next Steps</div>
              <ul className="sg-list">
                {result.suggestions.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
