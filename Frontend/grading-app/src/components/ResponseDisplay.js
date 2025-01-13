import React from "react";

const ResponseDisplay = ({ response }) => {
  return (
    <div className="mt-5 p-4 border border-gray-600 rounded-lg bg-gray-800 max-w-md mx-auto shadow-lg">
      <h2 className="text-lg font-semibold text-gray-100 mb-3">Grading Result</h2>
      <p className="text-gray-300 mb-2">{response.feedback}</p>
      {response.score && (
        <p className="text-green-400 font-bold text-md mb-2">
          Score: {response.score}
        </p>
      )}
      <p className="text-gray-400 text-sm">
        Date Graded: {new Date(response.date_graded).toLocaleString()}
      </p>
    </div>
  );
};

export default ResponseDisplay;
