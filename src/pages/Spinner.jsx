import React from 'react';
import './Spinner.css'; // Assuming you create a separate CSS file for styling

const Spinner = () => {
  return (
    <div className="spinner-wrapper">
      <img src="/assets/spinnerlogo.png" alt="Loading..." className="spinner" />
    </div>
  );
};

export default Spinner;
