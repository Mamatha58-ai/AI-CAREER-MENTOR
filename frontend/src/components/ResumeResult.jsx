function ResumeResult() {
  return (
    <div className="result-container">

      <h2>📄 Resume Analysis Report</h2>

      <div className="score-card">
        <h1>88%</h1>
        <p>Resume Score</p>
      </div>

      <div className="result-grid">

        <div className="result-card">
          <h3>✅ Skills Found</h3>
          <ul>
            <li>Python</li>
            <li>React</li>
            <li>JavaScript</li>
            <li>SQL</li>
          </ul>
        </div>

        <div className="result-card">
          <h3>❌ Missing Skills</h3>
          <ul>
            <li>Machine Learning</li>
            <li>Docker</li>
            <li>AWS</li>
          </ul>
        </div>

        <div className="result-card">
          <h3>💡 Suggestions</h3>
          <ul>
            <li>Add more projects</li>
            <li>Add certifications</li>
            <li>Improve resume summary</li>
          </ul>
        </div>

        <div className="result-card">
          <h3>🎯 Recommended Career</h3>
          <p>AI Engineer</p>
        </div>

      </div>

      <div className="roadmap">

        <h3>📚 Learning Roadmap</h3>

        <div className="roadmap-items">

          <div className="week">
            <h4>Week 1</h4>
            <p>Advanced Python</p>
          </div>

          <div className="week">
            <h4>Week 2</h4>
            <p>Machine Learning</p>
          </div>

          <div className="week">
            <h4>Week 3</h4>
            <p>FastAPI</p>
          </div>

          <div className="week">
            <h4>Week 4</h4>
            <p>AI Projects</p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default ResumeResult;