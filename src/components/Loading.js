import React from "react";
import "./Loading.css"; // Ensure you have the appropriate CSS for the spinner

const Loading = () => {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
    </div>
  );
};

export default Loading;
