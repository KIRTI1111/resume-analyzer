import { useState } from "react";
import "./App.css";

function App() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);

  const analyzeMatch = async () => {
    if (!resumeText || !jobDescription) {
      alert("Please enter both resume and job description");
      return;
    }
    const response = await fetch("http://127.0.0.1:8000/match-resume", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resume_text: resumeText,
        job_description: jobDescription,
      }),
    });

    const data = await response.json();
    setResult(data);
  };

  return (
  <div className="app">
    <div className="container">
      <h1>Resume Analyzer + JD Matcher</h1>

      <div className="input-section">
        <div className="input-card">
          <label>Resume Text</label>
          <textarea
            placeholder="Paste your resume here"
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
          />
        </div>

        <div className="input-card">
          <label>Job Description</label>
          <textarea
            placeholder="Paste job description here"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>
      </div>

      <button className="analyze-btn" onClick={analyzeMatch}>
        Analyze Match
      </button>

      {result && (
        <div className="results-card">
          <h2>Match Score: {result.match_score}%</h2>

          <div className="skills-summary">
            <p><strong>Resume Skills:</strong> {result.resume_skills.join(", ") || "None"}</p>
            <p><strong>JD Skills:</strong> {result.jd_skills.join(", ") || "None"}</p>
          </div>

          <div className="result-grid">
            <div className="result-box">
              <h3>Matched Skills</h3>
              <p>{result.matched_skills.length > 0 ? result.matched_skills.join(", ") : "No matched skills found"}</p>
            </div>

            <div className="result-box">
              <h3>Missing Skills</h3>
              <p>{result.missing_skills.length > 0 ? result.missing_skills.join(", ") : "No missing skills found"}</p>
            </div>
          </div>

          <div className="suggestions-box">
            <h3>Suggestions</h3>
              <ul>
            {result.suggestions.length > 0 ? (
            result.suggestions.map((item, index) => (
            <li key={index}>{item}</li>
          ))
          ) : (
            <li>Your resume already aligns well with this job description.</li>
          )}
        </ul>
        </div>
        </div>
      )}
    </div>
  </div>
);
}

export default App;