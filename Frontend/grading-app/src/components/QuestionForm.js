import React, { useState } from 'react';

function QuestionForm({ setSubmissionId, setLoading, setError }) {
  const [submissionType, setSubmissionType] = useState('');
  const [questionOrTopic, setQuestionOrTopic] = useState('');
  const [submissionText, setSubmissionText] = useState('');
  const [studentName, setStudentName] = useState('');
  const [submittedFile, setSubmittedFile] = useState(null);

  const handleFileChange = (e) => {
    setSubmittedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      submission_type: submissionType,
      question_or_topic: questionOrTopic,
      submission_text: submissionText,
      student_name: studentName,
    };

    const formData = new FormData();
    formData.append('submission_type', submissionType);
    formData.append('question_or_topic', questionOrTopic);
    formData.append('submission_text', submissionText);
    formData.append('student_name', studentName);
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
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={studentName}
        onChange={(e) => setStudentName(e.target.value)}
        placeholder="Enter your name"
        required
      />
      <select
        value={submissionType}
        onChange={(e) => setSubmissionType(e.target.value)}
        required
      >
        <option value="">Select Type</option>
        <option value="essay">Essay</option>
        <option value="report">Report</option>
        <option value="short answer">Short-Answer</option>
      </select>
      <textarea
        value={questionOrTopic}
        onChange={(e) => setQuestionOrTopic(e.target.value)}
        placeholder="Enter question or topic"
        required
      />
      <textarea
        value={submissionText}
        onChange={(e) => setSubmissionText(e.target.value)}
        placeholder="Enter your answer here"
      />
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
      />
      <button type="submit">Submit</button>
    </form>
  );
}

export default QuestionForm;
