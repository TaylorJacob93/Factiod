import React from "react";
import "../styles/facts.css";

function WordGrid({ inputValues, feedbackColors }) {
  return (
    <div className="boxGrid">
      <div className="boxRow">
        {inputValues.map((letter, index) => (
          <div 
            key={index} 
            className={`box ${feedbackColors && feedbackColors[index] ? feedbackColors[index] : ""}`}
          >
            <span className="boxLetter">{letter}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WordGrid;