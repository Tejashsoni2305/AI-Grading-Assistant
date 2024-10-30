import React, { useState, useEffect } from 'react';
import QuestionForm from './components/QuestionForm';
import ResponseDisplay from './components/ResponseDisplay';

function App() {
  const [submissionId, setSubmissionId] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch grading results when submissionId is updated
  useEffect(() => {
    const fetchResults = async () => {
      if (submissionId) {
        try {
          setLoading(true);
          const res = await fetch(`http://localhost:8000/results/${submissionId}/`);
          if (!res.ok) {
            throw new Error(`Error: ${res.status}`);
          }
          const data = await res.json();
          setResponse(data);
        } catch (error) {
          console.error("Error fetching results:", error);
          setError('Failed to fetch grading results.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchResults();
  }, [submissionId]);

  return (
    <div className="App">
      <h1>Grading Assistant</h1>
      <QuestionForm setSubmissionId={setSubmissionId} setLoading={setLoading} setError={setError} />
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {response && <ResponseDisplay response={response} />}
    </div>
  );
}

export default App;
