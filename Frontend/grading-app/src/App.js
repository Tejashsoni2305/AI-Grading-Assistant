import React, { useState } from 'react';
import QuestionForm from './components/QuestionForm';
import ResponseDisplay from './components/ResponseDisplay';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './styles/App.css';  // Importing the external CSS
// Importing the external CSS


function App() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleResponse = (data) => {
    setLoading(false);
    setError(null);
    setResponse(data);
  };

  const handleError = () => {
    setLoading(false);
    setError("An error occurred while grading. Please try again.");
  };

  return (
    <div className="app">
      <Navbar />
      <h1>Grading Application</h1>

      {error && <p className="error">{error}</p>}

      <QuestionForm setResponse={handleResponse} setLoading={setLoading} setError={handleError} />

      {loading ? (
        <Loader />
      ) : (
        response && <ResponseDisplay response={response} />
      )}

      <Footer />
    </div>
  );
}

export default App;
