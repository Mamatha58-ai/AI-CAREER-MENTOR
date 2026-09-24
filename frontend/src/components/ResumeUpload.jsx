function ResumeUpload({ onAnalyze }) {

  function handleUpload(e) {

    const file = e.target.files[0];

    console.log(file);

  }

  return (

    <div className="upload">

      <h2>Upload Resume</h2>

      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleUpload}
      />

      <button onClick={onAnalyze}>
        Analyze Resume
      </button>

    </div>

  );

}

export default ResumeUpload;