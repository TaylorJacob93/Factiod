import React from "react";

function Keyboard({ handleKeyClick, handleDelete }) {
  return (
    <div className="keyboard">
      {[...Array(3)].map((_, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {[
            "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
            "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
          ].slice(rowIndex * 9, (rowIndex + 1) * 9).map((key) => (
            <button key={key} className="key" onClick={() => handleKeyClick(key)}>{key}</button>
          ))}
        </div>
      ))}
      <div className="keyboard-row">
        <button className="key del-button" onClick={handleDelete}>DEL</button>
      </div>
    </div>
  );
}

export default Keyboard;
