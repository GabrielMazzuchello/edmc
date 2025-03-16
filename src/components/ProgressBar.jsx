import React from "react";

const ProgressBar = ({ percentage }) => {
  const getColor = () => {
    if (percentage > 75) return "#4CAF50"; // Verde
    if (percentage > 40) return "#FFC107"; // Amarelo
    return "#F44336"; // Vermelho
  };

  return (
    <div className="progress-container">
      <div
        className="progress-bar"
        style={{
          width: `${percentage}%`,
          backgroundColor: getColor(),
        }}
      >
        <span className="progress-text">{percentage.toFixed(1)}%</span>
      </div>
    </div>
  );
};

export default ProgressBar;
