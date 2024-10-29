import React from 'react';

function Loader() {
  const loaderStyle = {
    display: 'inline-block',
    width: '80px',
    height: '80px',
    border: '3px solid rgba(195, 195, 195, 0.6)',
    borderRadius: '50%',
    borderTop: '3px solid #333',
    animation: 'spin 1s linear infinite',
  };

  return (
    <div>
      <div style={loaderStyle}></div>
    </div>
  );
}

export default Loader;
