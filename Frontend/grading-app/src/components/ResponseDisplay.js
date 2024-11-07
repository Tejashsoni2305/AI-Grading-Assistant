import React from 'react';

const ResponseDisplay = ({ response }) => {
  const responseStyle = {
    marginTop: '20px',
    padding: '15px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#FFFFFF', // Set background to white
    maxWidth: '500px',
    margin: 'auto',
  };

  const scoreStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#28a745', // Green color for the score
  };

  const textStyle = {
    color: '#000000', // Black color for the text
  };

  return (
    <div style={responseStyle}>
      <h2 style={textStyle}>Grading Result</h2>
      <p style={textStyle}>{response.feedback}</p>
      {response.score && <p style={scoreStyle}>Score: {response.score}</p>}
      <p style={textStyle}>Date Graded: {new Date(response.date_graded).toLocaleString()}</p>
    </div>
  );
};

export default ResponseDisplay;
