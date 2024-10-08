// src/components/QuestionForm.js

import React, { useState } from 'react';
// import axios from 'axios'; // We'll use this later for the backend connection

const QuestionForm = ({ setResponse }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const formStyle = {
    margin: '20px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    maxWidth: '500px',
    backgroundColor: '#f9f9f9',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    textAlign: 'left',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '14px',
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mock response for now
    const mockResponse = {
      message: 'Answer received and is being graded.',
      score: Math.floor(Math.random() * 10) + 1, // Random score for demonstration
    };

    setResponse(mockResponse);
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <div>
        <label style={labelStyle}>Question:</label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
          style={inputStyle}
        />
      </div>
      <div>
        <label style={labelStyle}>Your Answer:</label>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          required
          rows="5"
          style={inputStyle}
        />
      </div>
      <button type="submit" style={buttonStyle}>Submit for Grading</button>
    </form>
  );
};

export default QuestionForm;
