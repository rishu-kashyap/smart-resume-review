import React, { useState } from "react";

function App() {
  const [resumeText, setResumeText] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);

  const submitResume = async () => {
    setLoading(true);
    setFeedback("");
    setScore(null);
    try {
      const response = await fetch("http://localhost:8080/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobRole }),
      });
      const data = await response.json();
      setFeedback(data.feedback);
      setScore(data.score);
    } catch (error) {
      setFeedback("Error: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ margin: "20px", fontFamily: "Arial" }}>
      <h1>Smart Resume Reviewer</h1>

      <textarea
        rows="6"
        cols="50"
        placeholder="Paste your resume here..."
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
      />

      <br /><br />

      <input
        type="text"
        placeholder="Enter Job Role (e.g. Software Engineer)"
        value={jobRole}
        onChange={(e) => setJobRole(e.target.value)}
      />

      <br /><br />

      <button onClick={submitResume} disabled={loading}>
        {loading ? "Submitting..." : "Submit Resume"}
      </button>

      <br /><br />

      {feedback && (
        <div style={{ border: "1px solid gray", padding: "10px", borderRadius: "5px" }}>
          <h3>Feedback:</h3>
          <p>{feedback}</p>
        </div>
      )}

      {score && (
        <div>
          <strong>Score:</strong> {score} / 5
        </div>
      )}
    </div>
  );
}

export default App;