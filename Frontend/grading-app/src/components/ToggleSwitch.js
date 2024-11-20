import React from 'react';
import '../styles/ToggleSwitch.css';

const ToggleSwitch = ({ isBulkUpload, setIsBulkUpload }) => {
  return (
    <label className="toggle-switch">
      <input
        type="checkbox"
        checked={isBulkUpload}
        onChange={() => setIsBulkUpload(!isBulkUpload)}
      />
      <span className="slider"></span>
    </label>
  );
};

export default ToggleSwitch;
