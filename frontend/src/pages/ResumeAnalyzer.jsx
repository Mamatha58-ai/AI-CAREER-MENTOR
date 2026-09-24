import { useState, useEffect, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import "./ResumeAnalyzer.css";

export default function ResumeAnalyzer({
  persistedFile,
  setPersistedFile,
  persistedResult,
  setPersistedResult,
}) {
  const [file,     setFile]     = useState(persistedFile);
  const [result,   setResult]   = useState(persistedResult);
  const [loading,  setLoading]  = useState(false);
  const [dragging, setDragging] = useState(false);
  const [saved,    setSaved]    = useState(false);   // true when a record exists in DB
  const [deleting, setDeleting] = useState(false);
  const inputRef = useRef();

  const userEmail = localStorage.getItem("userEmail") || "";

  // Sync back to App-level state so other pages can read the result
  useEffect(() => { setPersistedFile(file); },     [file]);
  useEffect(() => { setPersistedResult(result); }, [result]);

  // On mount: fetch any previously saved resume from the database
  const loadSaved = useCallback(async () => {
    if (!userEmail) return;
    try {
      const res  = await fetch(`http://127.0.0.1:5000/resume/${encodeURIComponent(userEmail)}`);
      const data = await res.json();
      if (data.found) {
        setResult(data.result);
        // Restore a fake File-like object with just the name for display
        setFile({ name: data.filename, _fromDB: true });
        setSaved(true);
      }
    } catch {
      // backend may not be running yet — silently ignore
    }
  }, [userEmail]);

  useEffect(() => { loadSaved(); }, [loadSaved]);

  function onDrop(e) {
    e.preventDefault();
    setDragging(false);
    if (saved) return;   // locked — must delete first
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === "application/pdf") setFile(dropped);
    else toast.error("Please upload a PDF file.");
  }

  async function handleAnalyze() {
    if (!file) { toast.error("Please select a PDF resume first."); return; }
    if (file._fromDB) { toast("Already analyzed — delete first to re-upload.", { icon: "ℹ️" }); return; }
    const fd = new FormData();
    fd.append("resume", file);
    setLoading(true);
    setResult(null);
    try {
      const res  = await fetch("http://127.0.0.1:5000/upload", { method: "POST", body: fd });
      const data = await res.json();
      setResult(data);
      // Auto-save to database
      if (userEmail) {
        await fetch("http://127.0.0.1:5000/resume/save", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userEmail, filename: file.name, result: data }),
        });
        setSaved(true);
      }
      toast.success("Analysis complete — saved to your profile!");
    } catch {
      toast.error("Could not reach the backend. Make sure it is running.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!userEmail) return;
    setDeleting(true);
    try {
      await fetch(`http://127.0.0.1:5000/resume/${encodeURIComponent(userEmail)}`, { method: "DELETE" });
      setFile(null);
      setResult(null);
      setSaved(false);
      setPersistedFile(null);
      setPersistedResult(null);
      toast.success("Resume deleted. You can now upload a new one.");
    } catch {
      toast.error("Could not delete. Make sure the backend is running.");
    } finally {
      setDeleting(false);
    }
  }

  const scoreColour = !result ? "#5b5ef4"
    : result.score >= 80 ? "#10b981"
    : result.score >= 55 ? "#f59e0b"
    : "#f43f5e";

  return (
    <div className="ra-page">
      <div className="ra-header">
        <h1>📄 Resume Analyzer</h1>
        <p>Upload your PDF resume and get an instant ATS score with AI-powered feedback.</p>
      </div>

      {/* ── UPLOAD ZONE ── */}
      <div
        className={`ra-drop${dragging ? " ra-drop-active" : ""}${file ? " ra-drop-filled" : ""}${saved ? " ra-drop-locked" : ""}`}
        onDragOver={e => { e.preventDefault(); if (!saved) setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => { if (!saved) inputRef.current.click(); }}
        role="button"
        tabIndex={0}
        onKeyDown={e => { if (e.key === "Enter" && !saved) inputRef.current.click(); }}
        aria-label={saved ? "Resume locked — delete to replace" : "Upload resume PDF"}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          style={{ display: "none" }}
          onChange={e => { if (!saved) setFile(e.target.files[0]); }}
        />
        {file ? (
          <>
            <div className="ra-drop-icon ra-drop-icon-ok">{saved ? "🔒" : "✅"}</div>
            <p className="ra-drop-name">{file.name}</p>
            <span className="ra-drop-hint">
              {saved ? "Delete this resume to upload a new one" : "Click to change file"}
            </span>
          </>
        ) : (
          <>
            <div className="ra-drop-icon">📂</div>
            <p className="ra-drop-text">
              {dragging ? "Drop it here!" : "Drag & drop your resume here"}
            </p>
            <span className="ra-drop-hint">or click to browse — PDF only</span>
          </>
        )}
      </div>

      {/* Delete button — shown only when a resume is saved */}
      {saved && (
        <button className="ra-delete-btn" onClick={handleDelete} disabled={deleting}>
          {deleting ? <><span className="ra-spin" /> Deleting…</> : "🗑 Delete Resume"}
        </button>
      )}

      {!saved && (
        <button
          className="ra-analyze-btn"
          onClick={handleAnalyze}
          disabled={loading || !file}
        >
          {loading
            ? <><span className="ra-spin" /> Analyzing…</>
            : "Analyze Resume →"
          }
        </button>
      )}

      {/* ── RESULTS ── */}
      {result && (
        <div className="ra-results">

          {/* Score banner */}
          <div className="ra-score-card" style={{ "--sc": scoreColour }}>
            <div className="ra-score-label">ATS Score</div>
            <div className="ra-score-ring">
              <svg viewBox="0 0 100 100" className="ra-ring-svg">
                <circle cx="50" cy="50" r="42" className="ra-ring-track" />
                <circle
                  cx="50" cy="50" r="42"
                  className="ra-ring-fill"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - (result.score ?? 0) / 100)}`}
                  style={{ stroke: scoreColour }}
                />
              </svg>
              <span className="ra-ring-value">{result.score ?? 0}</span>
            </div>
            <div className="ra-score-sub">out of 100</div>
            <div className="ra-score-verdict">
              {result.score >= 80 ? "Excellent — ready to apply!"
                : result.score >= 55 ? "Good — a few improvements needed"
                : "Needs work — follow the suggestions below"}
            </div>
          </div>

          {/* Skills detected */}
          {(result.skills || []).length > 0 && (
            <div className="ra-panel">
              <div className="ra-panel-title">✅ Skills Detected</div>
              <div className="ra-pills">
                {result.skills.map((s, i) => (
                  <span key={i} className="ra-pill">{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Missing skills */}
          {(result.missing_skills || []).length > 0 && (
            <div className="ra-panel">
              <div className="ra-panel-title">❌ Missing Skills</div>
              <ul className="ra-list">
                {result.missing_skills.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}

          {/* Suggestions */}
          {(result.suggestions || []).length > 0 && (
            <div className="ra-panel">
              <div className="ra-panel-title">💡 Suggestions</div>
              <ul className="ra-list">
                {result.suggestions.map((s, i) => (
                  <li key={i}>
                    {s}
                    <a
                      href={`https://www.google.com/search?q=how+to+learn+${encodeURIComponent(s)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ra-learn-link"
                    >
                      Learn →
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Strengths */}
          {(result.strengths || []).length > 0 && (
            <div className="ra-panel">
              <div className="ra-panel-title">⭐ Strengths</div>
              <ul className="ra-list">
                {result.strengths.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
