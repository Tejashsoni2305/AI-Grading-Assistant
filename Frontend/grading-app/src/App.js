// src/App.js

import React, { useState } from 'react';
import QuestionForm from './components/QuestionForm';
import ResponseDisplay from './components/ResponseDisplay';

function App() {
  const [response, setResponse] = useState(null);

  // Inline styling for the main app container
  const appStyle = {
    textAlign: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  };

  const headerStyle = {
    color: '#333',
  };

  return (
    <div style={appStyle}>
      <h1 style={headerStyle}>Grading Application</h1>
      <QuestionForm setResponse={setResponse} />
      {response && <ResponseDisplay response={response} />}
    </div>
  );
}

export default App;
