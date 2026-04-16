import { useState } from "react";

function App() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);

  const analyzeResume = async () => {
    const response = await fetch("http://127.0.0.1:8000/analyze", {
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
    <div style={styles.container}>
      <h1 style={styles.title}>Resume Analyzer</h1>

      <div style={styles.card}>
        <h3>Resume</h3>
        <textarea
          style={styles.textarea}
          placeholder="Paste your resume here..."
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
        />

        <h3 style={{ marginTop: "20px" }}>Job Description</h3>
        <textarea
          style={styles.textarea}
          placeholder="Paste job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />

        <button style={styles.button} onClick={analyzeResume}>
          Analyze
        </button>
      </div>

      {result && (
        <div style={styles.resultCard}>
          <h2>Analysis Result</h2>

          <p><b>Word Count:</b> {result.word_count}</p>

          <Section title="Skills Found" items={result.found_skills} color="#4caf50" />
          <Section title="Matched Skills" items={result.matched_skills} color="#2196f3" />
          <Section title="Missing Skills" items={result.missing_skills} color="#f44336" />
          <Section title="Missing Sections" items={result.missing_sections} color="#ff9800" />
          <Section title="Suggestions" items={result.suggestions} />
          <Section title="AI Suggestions" items={result.ai_suggestions} />
        </div>
      )}
    </div>
  );
}

function Section({ title, items, color }) {
  if (!items || items.length === 0) return null;

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>{title}</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {items.map((item, index) => (
          <span
            key={index}
            style={{
              backgroundColor: color || "#555",
              padding: "6px 12px",
              borderRadius: "20px",
              color: "white",
              fontSize: "14px",
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#0f172a",
    minHeight: "100vh",
    color: "white",
    padding: "20px",
    fontFamily: "Arial",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  card: {
    backgroundColor: "#1e293b",
    padding: "20px",
    borderRadius: "10px",
    maxWidth: "800px",
    margin: "auto",
  },
  resultCard: {
    backgroundColor: "#1e293b",
    padding: "20px",
    borderRadius: "10px",
    maxWidth: "800px",
    margin: "20px auto",
  },
  textarea: {
    width: "100%",
    height: "120px",
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    marginTop: "10px",
  },
  button: {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#3b82f6",
    border: "none",
    borderRadius: "5px",
    color: "white",
    cursor: "pointer",
  },
};

export default App;