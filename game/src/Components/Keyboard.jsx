import React from "react";
import "../styles/keyboard.css";

function Keyboard({ handleKeyClick, handleEnter, handleDelete, keyboardFeedback = {} }) {
  const row1 = "QWERTYUIOP".split("");
  const row2 = "ASDFGHJKL".split("");
  const row3 = "ZXCVBNM".split("");

  return (
    <div className="keyboard">
      <div className="keyboard-row">
        {row1.map((key) => (
          <button
            key={key}
            className={`key ${keyboardFeedback[key] || ""}`}
            onClick={() => handleKeyClick(key)}
          >
            {key}
          </button>
        ))}
      </div>
      <div className="keyboard-row">
        {row2.map((key) => (
          <button
            key={key}
            className={`key ${keyboardFeedback[key] || ""}`}
            onClick={() => handleKeyClick(key)}
          >
            {key}
          </button>
        ))}
      </div>
      <div className="keyboard-row">
        {row3.map((key) => (
          <button
            key={key}
            className={`key ${keyboardFeedback[key] || ""}`}
            onClick={() => handleKeyClick(key)}
          >
            {key}
          </button>
        ))}
        <button className="key del-button" onClick={handleDelete}>
          Del
        </button>
      </div>
      <div className="keyboard-row enter-row">
        <button className="enter-button" onClick={handleEnter}>
          Enter
        </button>
      </div>
    </div>
  );
}

export default Keyboard;