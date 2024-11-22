import React, { useState } from 'react';
import '../styles/QuestionForm.css';
import Loader from './Loader'; // Import your Loader component
import ToggleSwitch from './ToggleSwitch'; // Import the new component

function QuestionForm({ setSubmissionId, setLoading, setError }) {
  const [submissionType, setSubmissionType] = useState('');
  const [questionOrTopic, setQuestionOrTopic] = useState('');
  const [submissionText, setSubmissionText] = useState('');
  const [studentName, setStudentName] = useState('');
  // const [studentId, setStudentId] = useState(''); // New state for student ID
  const [loading, setLoadingState] = useState(false);
  const [submittedFile, setSubmittedFile] = useState(null);
  const [bulkFile, setBulkFile] = useState(null);
  const [isBulkUpload, setIsBulkUpload] = useState(false);

  const handleFileChange = (e) => {
    setSubmittedFile(e.target.files[0]);
  };

  const handleBulkFileChange = (e) => {
    setBulkFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingState(true);
    setError(null);

    const formData = new FormData();

    if (isBulkUpload) {
      if (bulkFile) {
        formData.append('file', bulkFile);
      } else {
        setError('Please upload a CSV file for bulk grading.');
        setLoadingState(false);
        return;
      }
    } else {
      formData.append('submission_type', submissionType);
      formData.append('question_or_topic', questionOrTopic);
      formData.append('submission_text', submissionText);
      formData.append('student_name', studentName);
      // formData.append('student_id', studentId); // Append student ID
      if (submittedFile) {
        formData.append('submittedFile', submittedFile);
      }
    }

    try {
      const endpoint = isBulkUpload
        ? 'http://localhost:8000/bulkSubmit/'
        : 'http://localhost:8000/submitAnswer/';

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      if (isBulkUpload) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'GradingResults.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        const data = await response.json();
        if (data.submission_id) {
          setSubmissionId(data.submission_id);
        } else {
          throw new Error('Submission ID not found in response');
        }
      }
    } catch (error) {
      setError('Failed to submit question.');
      console.error('Error while grading:', error);
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="form-container">
          <div className="toggle-container">
            <ToggleSwitch
              isBulkUpload={isBulkUpload}
              setIsBulkUpload={setIsBulkUpload}
            />
            <span className="toggle-label">
              {isBulkUpload ? 'Bulk Upload Mode' : 'Single Submission Mode'}
            </span>
          </div>

          {!isBulkUpload ? (
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
                {/* <div className="name-id-label">
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="Enter your ID"
                    className="id-input"
                    required
                  />
                </div> */}
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
                <label>Question or Topic:</label>
                <textarea
                  value={questionOrTopic}
                  onChange={(e) => setQuestionOrTopic(e.target.value)}
                  placeholder="Enter question or topic"
                  className="question-box"
                  required
                />
              </div>
              <div className="question-answer-container">
                <label>Your Answer:</label>
                <textarea
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  placeholder="Enter your answer here"
                  className="answer-box"
                />
              </div>
              <input type="file" accept=".pdf" onChange={handleFileChange} />
              <button type="submit" className="submit-btn">
                Submit
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="bulk-upload-form">
              <div className="bulk-upload-container">
                <label>Upload a CSV File for Bulk Grading:</label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleBulkFileChange}
                />
              </div>
              <button type="submit" className="submit-btn">
                Submit Bulk File
              </button>
            </form>
          )}
        </div>
      )}
    </>
  );
}

export default QuestionForm;
