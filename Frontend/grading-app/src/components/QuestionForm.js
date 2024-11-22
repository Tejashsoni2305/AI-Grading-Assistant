import React, { useState } from 'react';
import '../styles/QuestionForm.css';
import Loader from './Loader'; // Import your Loader component
import ToggleSwitch from './ToggleSwitch'; // Import the new component

function QuestionForm({ setSubmissionId, setLoading, setError }) {
  const [submissionType, setSubmissionType] = useState('');
  const [questionOrTopic, setQuestionOrTopic] = useState('');
  const [submissionText, setSubmissionText] = useState('');
  const [studentName, setStudentName] = useState('');
  const [loading, setLoadingState] = useState(false); // Local loading state
  const [submittedFile, setSubmittedFile] = useState(null);
  const [bulkFile, setBulkFile] = useState(null); // State for bulk upload file
  const [isBulkUpload, setIsBulkUpload] = useState(false); // Toggle state for bulk upload

  const handleFileChange = (e) => {
    setSubmittedFile(e.target.files[0]);
  };

  const handleBulkFileChange = (e) => {
    setBulkFile(e.target.files[0]); // Store single CSV file for bulk upload
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingState(true);
    setError(null);

    const formData = new FormData();

    if (isBulkUpload) {
      // Bulk file upload for CSV
      if (bulkFile) {
        formData.append('file', bulkFile); // Append the single CSV file
      } else {
        setError('Please upload a CSV file for bulk grading.');
        setLoadingState(false);
        return;
      }
    } else {
      // Single submission upload
      formData.append('submission_type', submissionType);
      formData.append('question_or_topic', questionOrTopic);
      formData.append('submission_text', submissionText);
      formData.append('student_name', studentName);
      if (submittedFile) {
        formData.append('submittedFile', submittedFile);
      }
    }

    try {
      const endpoint = isBulkUpload
        ? 'http://localhost:8000/bulkSubmit/' // Bulk grading CSV endpoint
        : 'http://localhost:8000/submitAnswer/'; // Single submission endpoint

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      if (isBulkUpload) {
        // Handle bulk upload response
        const blob = await response.blob(); // Get the file as a Blob
        const url = window.URL.createObjectURL(blob); // Create a URL for the Blob
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'GradingResults.csv'); // Set the file name
        document.body.appendChild(link);
        link.click(); // Trigger the download
        link.remove(); // Clean up the DOM
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
              {/* Single submission form */}
              <div className="name-id-container">
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Enter your name"
                  className="name-input"
                  required
                />
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
              {/* Bulk upload form */}
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
