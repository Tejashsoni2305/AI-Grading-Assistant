import React, { useState, useEffect } from "react";
import QuestionForm from "./components/QuestionForm";
import ResponseDisplay from "./components/ResponseDisplay";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import background from "./images/background.jpg"; // Import the background image

function App() {
  const [submissionId, setSubmissionId] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const appStyle = {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    backgroundImage: `url(${background})`, // Dynamically set the background image
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    textAlign: "center",
    color: "#fff",
  };

  useEffect(() => {
    const fetchResults = async () => {
      if (submissionId) {
        try {
          setLoading(true);
          const res = await fetch(
            `http://localhost:8000/results/${submissionId}/`
          );
          if (!res.ok) {
            throw new Error(`Error: ${res.status}`);
          }
          const data = await res.json();
          setResponse(data);
        } catch (error) {
          console.error("Error fetching results:", error);
          setError("Failed to fetch grading results.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchResults();
  }, [submissionId]);

  return (
    <div style={appStyle}>
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-10">
          <h1 className="text-4xl font-extrabold text-white text-center mb-6">
            Grading Assistant
          </h1>
          <QuestionForm
            setSubmissionId={setSubmissionId}
            setLoading={setLoading}
            setError={setError}
          />
          {loading && (
            <p className="text-center text-white mt-4">Loading...</p>
          )}
          {error && (
            <p className="text-center text-red-400 mt-4">{error}</p>
          )}
          {response && (
            <div className="mt-6">
              <ResponseDisplay response={response} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
