import React, { useState } from "react";
import Loader from "./Loader";
import ToggleSwitch from "./ToggleSwitch";

function QuestionForm({ setSubmissionId, setLoading, setError }) {
  const [submissionType, setSubmissionType] = useState("");
  const [questionOrTopic, setQuestionOrTopic] = useState("");
  const [submissionText, setSubmissionText] = useState("");
  const [studentName, setStudentName] = useState("");
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
        formData.append("file", bulkFile);
      } else {
        setError("Please upload a CSV file for bulk grading.");
        setLoadingState(false);
        return;
      }
    } else {
      formData.append("submission_type", submissionType);
      formData.append("question_or_topic", questionOrTopic);
      formData.append("submission_text", submissionText);
      formData.append("student_name", studentName);
      if (submittedFile) {
        formData.append("submittedFile", submittedFile);
      }
    }

    try {
      const endpoint = isBulkUpload
        ? "http://localhost:8000/bulkSubmit/"
        : "http://localhost:8000/submitAnswer/";

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      if (isBulkUpload) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "GradingResults.csv");
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        const data = await response.json();
        if (data.submission_id) {
          setSubmissionId(data.submission_id);
        } else {
          throw new Error("Submission ID not found in response");
        }
      }
    } catch (error) {
      setError("Failed to submit question.");
      console.error("Error while grading:", error);
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="min-h-screen flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-100 mb-4 text-center">
              Submit Your Assignment
            </h2>

            <div className="flex items-center justify-between mb-4">
              <ToggleSwitch
                isBulkUpload={isBulkUpload}
                setIsBulkUpload={setIsBulkUpload}
              />
              <span className="text-gray-400 font-medium">
                {isBulkUpload ? "Bulk Upload Mode" : "Single Submission Mode"}
              </span>
            </div>

            {!isBulkUpload ? (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="block text-gray-400 font-bold mb-2">
                    Student Name
                  </label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full p-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="block text-gray-400 font-bold mb-2">
                    Type of Submission
                  </label>
                  <select
                    value={submissionType}
                    onChange={(e) => setSubmissionType(e.target.value)}
                    className="w-full p-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="" disabled>
                      Select Type
                    </option>
                    <option value="essay">Essay</option>
                    <option value="report">Report</option>
                    <option value="short answer">Short Answer</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="block text-gray-400 font-bold mb-2">
                    Question or Topic
                  </label>
                  <textarea
                    value={questionOrTopic}
                    onChange={(e) => setQuestionOrTopic(e.target.value)}
                    placeholder="Enter question or topic"
                    className="w-full p-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label className="block text-gray-400 font-bold mb-2">
                    Your Answer
                  </label>
                  <textarea
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    placeholder="Enter your answer here"
                    className="w-full p-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>

                <div className="mb-3">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="block w-full text-gray-400 bg-gray-700 border border-gray-600 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-green-400 text-gray-100 p-3 rounded-md shadow-lg hover:shadow-xl transition duration-200"
                >
                  Submit
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="block text-gray-400 font-bold mb-2">
                    Upload a CSV File for Bulk Grading
                  </label>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleBulkFileChange}
                    className="block w-full text-gray-400 bg-gray-700 border border-gray-600 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-green-400 text-gray-100 p-3 rounded-md shadow-lg hover:shadow-xl transition duration-200"
                >
                  Submit Bulk File
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default QuestionForm;
