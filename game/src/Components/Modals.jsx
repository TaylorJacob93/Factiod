import React from "react";

import "../styles/modal.css";

function Modals({
  showHowToPlay,
  showCongratsModal,
  showBetterLuckModal,
  handleCloseModal,
  selectedFact,
  setShowCongratsModal,
  setShowBetterLuckModal,
}) {
  // Modify renderWordGrid to take a second parameter for correct letters
  const renderWordGrid = (word, correctLetters = []) => {
    return word.split("").map((letter, index) => (
      <div
        key={index}
        className={`box ${correctLetters.includes(index) ? "correct" : ""}`}
      >
        <span className="boxLetter">{letter}</span>
      </div>
    ));
  };

  return (
    <>
      {showHowToPlay && (
        <div className="modal">
          <div className="modal-content howToPlayModal">
            <h2>How to Play</h2>
            <p>
              The aim of Factiod is quite simple. Guess the word related to the
              displayed facts by typing letters.
            </p>
            <p>
              Green letters are correct; yellow letters are correct but in the
              wrong position and any that stay the same are not in the word.
            </p>

            <p>Example:</p>
            <div className="howToPlayBoxGrid">
              {renderWordGrid("TRLEVISION", [0, 2, 3, 4, 5, 6, 8, 9])}
            </div>
            <p>
              As you can see the Factiod we were looking for was infact
              "TELEVISION."
            </p>
            <button
              className="closeButton"
              onClick={() => handleCloseModal()}
              aria-label="Close Congratulations modal"
            >
              x
            </button>
          </div>
        </div>
      )}

      {showCongratsModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Congratulations!</h2>
            <p>You guessed the word correctly:</p>
            <div className="boxGrid">
              {renderWordGrid(selectedFact.name.split(""))}{" "}
            </div>
            <button
              className="closeButton"
              onClick={() => setShowCongratsModal(false)}
              aria-label="Close Congratulations modal"
            >
              x
            </button>
          </div>
        </div>
      )}

      {showBetterLuckModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Better Luck Next Time!</h2>
            <p>The correct answer was:</p>
            <div className="boxGrid">
              {renderWordGrid(selectedFact.name.split(""))}{" "}
            </div>
            <button
              className="closeButton"
              onClick={() => setShowBetterLuckModal(false)}
              aria-label="Close Better Luck Next Time modal"
            ></button>
          </div>
        </div>
      )}
    </>
  );
}

export default Modals;
