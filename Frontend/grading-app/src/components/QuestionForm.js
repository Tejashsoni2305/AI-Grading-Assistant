import React, { useState } from 'react';
import '../styles/QuestionForm.css';

function QuestionForm({ setResponse, setLoading, setError }) {
  const [submissionType, setSubmissionType] = useState('');
  const [questionOrTopic, setQuestionOrTopic] = useState('');
  const [submissionText, setSubmissionText] = useState('');
  const [studentName, setStudentName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Log the payload to ensure fields match the backend expectations
    const payload = {
      submission_type: submissionType,
      question_or_topic: questionOrTopic,
      submission_text: submissionText,
      student_name: studentName
    };
    console.log("Payload sent to backend:", payload);

    try {
      const response = await fetch('http://localhost:8000/submitAnswer/', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setResponse(data);
    } catch (error) {
      setError('Failed to submit question.');
      console.error("Error while grading:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="question-form" onSubmit={handleSubmit}>
      <div className="form-container">
        <div className="name-id-container">
          <label className="name-id-label">
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="name-input"
              placeholder="Enter your name"
            />
          </label>
        </div>

        <label className="question-type-label">
          Question Type:
          <select
            value={submissionType}
            onChange={(e) => {
              console.log("Selected submission type:", e.target.value); 
              setSubmissionType(e.target.value)}}
            className="question-type-select"
          >
            <option value="essay">Essay</option>
            <option value="report">Report</option>
            <option value="short answer">Short-Answer</option>
          </select>
        </label>

        <div className="question-answer-container">
          <label className="question-label">
            Question:
            <textarea
              value={questionOrTopic}
              onChange={(e) => setQuestionOrTopic(e.target.value)}
              rows="3"
              cols="50"
              className="question-box"
              placeholder="Enter your question here"
            />
          </label>

          <label className="answer-label">
            Answer:
            <textarea
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
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
