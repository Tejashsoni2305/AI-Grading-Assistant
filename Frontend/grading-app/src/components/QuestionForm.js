import React, { useState } from 'react';
import '../styles/QuestionForm.css';
import Loader from './Loader'; // Import your Loader component

function QuestionForm({ setSubmissionId, setLoading, setError }) {
  const [submissionType, setSubmissionType] = useState('');
  const [questionOrTopic, setQuestionOrTopic] = useState('');
  const [submissionText, setSubmissionText] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [loading, setLoadingState] = useState(false); // Local loading state
  const [submittedFile, setSubmittedFile] = useState(null);

  const handleFileChange = (e) => {
    setSubmittedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingState(true); // Set loading to true
    setError(null);

    const payload = {
      submission_type: submissionType,
      question_or_topic: questionOrTopic,
      submission_text: submissionText,
      student_name: studentName,
      student_id: studentId,
    };

    const formData = new FormData();
    formData.append('submission_type', submissionType);
    formData.append('question_or_topic', questionOrTopic);
    formData.append('submission_text', submissionText);
    formData.append('student_name', studentName);
    formData.append('student_id', studentId);
    if (submittedFile) {
      formData.append('submittedFile', submittedFile);
    }

    try {
      const response = await fetch('http://localhost:8000/submitAnswer/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      if (data.submission_id) {
        setSubmissionId(data.submission_id);
      } else {
        throw new Error('Submission ID not found in response');
      }
    } catch (error) {
      setError('Failed to submit question.');
      console.error("Error while grading:", error);
    } finally {
      setLoadingState(false); // Set loading to false after submission
    }
  };

  return (
    <>
      {loading ? ( // Conditional rendering for loader
        <Loader />
      ) : (
        <form onSubmit={handleSubmit} className="question-form">
          <div className="name-id-container">
            <div className="name-id-label">
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter your name"
                className="name-input"
                required
              />
            </div>
            <div className="name-id-label">
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Enter your student ID"
                className="id-input"
                required
              />
            </div>
          </div>
          <div className="question-type-label">
            <label>Type of Submission:</label>
            <select
              value={submissionType}
              onChange={(e) => setSubmissionType(e.target.value)}
              className="question-type-select"
              required
            >
              <option value="">Select Type</option>
              <option value="essay">Essay</option>
              <option value="report">Report</option>
              <option value="short answer">Short Answer</option>
            </select>
          </div>
          <div className="question-answer-container">
            <label className="question-label">Question or Topic:</label>
            <textarea
              value={questionOrTopic}
              onChange={(e) => setQuestionOrTopic(e.target.value)}
              placeholder="Enter question or topic"
              className="question-box"
              required
            />
          </div>
          <div className="question-answer-container">
            <label className="answer-label">Your Answer:</label>
            <textarea
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
              placeholder="Enter your answer here"
              className="answer-box"
            />
          </div>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
          />
          <button type="submit" className="submit-btn">Submit</button>
        </form>
      )}
    </>
  );
}

export default QuestionForm;
