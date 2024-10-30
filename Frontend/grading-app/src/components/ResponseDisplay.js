import React from 'react';

const ResponseDisplay = ({ response }) => {
  const responseStyle = {
    marginTop: '20px',
    padding: '15px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f1f1f1',
    maxWidth: '500px',
    margin: 'auto',
  };

  const scoreStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#28a745',
  };

  return (
    <div style={responseStyle}>
      <h2>Grading Result</h2>
      <p>{response.feedback}</p>
      {response.score && <p style={scoreStyle}>Score: {response.score}/10</p>}
      <p>Date Graded: {new Date(response.date_graded).toLocaleString()}</p>
    </div>
  );
};

export default ResponseDisplay;
