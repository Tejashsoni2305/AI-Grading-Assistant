import React, { useState } from 'react';
import '../styles/QuestionForm.css';
import Loader from './Loader'; // Import your Loader component
import ToggleSwitch from './ToggleSwitch'; // Import the new component

function QuestionForm({ setSubmissionId, setLoading, setError }) {
  const [submissionType, setSubmissionType] = useState('');
  const [questionOrTopic, setQuestionOrTopic] = useState('');
  const [submissionText, setSubmissionText] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [loading, setLoadingState] = useState(false); // Local loading state
  const [submittedFile, setSubmittedFile] = useState(null);
  const [bulkFiles, setBulkFiles] = useState([]); // State for bulk upload files
  const [isBulkUpload, setIsBulkUpload] = useState(false); // Toggle state for bulk upload

  const handleFileChange = (e) => {
    setSubmittedFile(e.target.files[0]);
  };

  const handleBulkFileChange = (e) => {
    setBulkFiles(Array.from(e.target.files)); // Store multiple files
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingState(true);
    setError(null);

    const formData = new FormData();

    if (isBulkUpload) {
      // Bulk file upload handling
      bulkFiles.forEach((file, index) => {
        formData.append(`file_${index}`, file); // Append each file with a unique key
      });
    } else {
      // Single question upload handling
      formData.append('submission_type', submissionType);
      formData.append('question_or_topic', questionOrTopic);
      formData.append('submission_text', submissionText);
      formData.append('student_name', studentName);
      formData.append('student_id', studentId);
      if (submittedFile) {
        formData.append('submittedFile', submittedFile);
      }
    }

    try {
      const endpoint = isBulkUpload
        ? 'http://localhost:8000/bulkSubmit/' // Bulk submission endpoint
        : 'http://localhost:8000/submitAnswer/'; // Single submission endpoint

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      if (isBulkUpload) {
        // Handle bulk upload response
        console.log('Bulk upload response:', data);
      } else {
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
              <input type="file" accept=".pdf" onChange={handleFileChange} />
              <button type="submit" className="submit-btn">
                Submit
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="bulk-upload-form">
              {/* Bulk upload form */}
              <div className="bulk-upload-container">
                <label className="bulk-upload-label">
                  Upload Multiple PDFs for Bulk Grading:
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handleBulkFileChange}
                />
              </div>
              <button type="submit" className="submit-btn">
                Submit Bulk Files
              </button>
            </form>
          )}
        </div>
      )}
    </>
  );
}

export default QuestionForm;
