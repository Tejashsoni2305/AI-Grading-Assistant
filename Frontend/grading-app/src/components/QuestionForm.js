import React, { useState } from 'react';
import '../styles/QuestionForm.css';  // Import the CSS

function QuestionForm({ setResponse, setLoading, setError }) {
  const [questionType, setQuestionType] = useState('Essay');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [name, setName] = useState('');
  const [id, setId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetch('http://localhost:8000/api/grade/', {
        method: 'POST',
        body: JSON.stringify({ questionType, question, answer, name, id }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      const data = await response.json();
      setResponse(data);
    } catch (error) {
      setError('Failed to submit question.'); // This error will be displayed in App.js
      console.error("Error while grading:", error); // Log the exact error in console
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <form className="question-form" onSubmit={handleSubmit}>
      <div className="form-container">  {/* New container for the form fields */}
        <div className="name-id-container">
          <label className="name-id-label">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="name-input"
              placeholder="Enter your name"
            />
          </label>

          <label className="name-id-label">
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="id-input"
              placeholder="Enter your ID"
            />
          </label>
        </div>

        <label className="question-type-label">
          Question Type:
          <select
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
            className="question-type-select"
          >
            <option value="Essay">Essay</option>
            <option value="Multiple Choice">Multiple Choice</option>
            <option value="Fill in the Blanks">Fill in the Blanks</option>
            <option value="Short Answer">Short Answer</option>
          </select>
        </label>

        <div className="question-answer-container">
          <label className="question-label">
            Question:
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows="3"
              cols="50"
              className="question-box"
              placeholder="Enter your question here"
            />
          </label>

          <label className="answer-label">
            Answer:
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows="6"
              cols="50"
              className="answer-box"
              placeholder="Enter your answer here"
            />
          </label>
        </div>

        <button type="submit" className="submit-btn">Submit</button>
      </div>
    </form>
  );
}

export default QuestionForm;
