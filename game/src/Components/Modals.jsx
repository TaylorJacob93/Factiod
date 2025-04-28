import React from "react";
import "../styles/modal.css";

function Modals({
  showHowToPlay,
  displayedFacts,
  showCongratsModal,
  showBetterLuckModal,
  handleCloseModal,
  selectedFact,
  setShowCongratsModal,
  setShowBetterLuckModal,
  correctLetters,
}) {
  const renderWordGrid = (
    word,
    correctLetters = [],
    highlightIndices = [],
    incorrectIndices = []
  ) => {
    return word.split("").map((letter, index) => (
      <div
        key={index}
        className={`box ${correctLetters.includes(index) ? "correct" : ""} ${
          highlightIndices.includes(index) ? "almost" : ""
        } ${incorrectIndices.includes(index) ? "incorrect" : ""}`}
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
              displayed facts. For every incorrect guess, you are provided with
              a new fact. 5 incorrect guesses and you lose!
            </p>
            <p>
              Green letters are correct; yellow letters are correct but in the
              wrong position, and any that are grey are not in the word.
            </p>
            <p>Example:</p>
            <div className="howToPlayBoxGrid">
              {renderWordGrid("SPADE", [0, 1, 2, 3, 4])}
            </div>
            <p>The correct word was "SPADE".</p>
            <div className="howToPlayBoxGrid">
              {renderWordGrid("CIHCKEN", [0, 3, 4, 5, 6], [1, 2])}
            </div>
            <p>"H" and "I" are in the word but in the wrong spot.</p>
            <div className="howToPlayBoxGrid">
              {renderWordGrid("PYLOT", [0, 2, 3, 4], [], [1])}
            </div>
            <p>The correct word was "PILOT" so "Y" was not in the word.</p>
            <button
              className="closeButton"
              onClick={handleCloseModal}
              aria-label="Close How to Play modal"
            >
              x
            </button>
          </div>
        </div>
      )}

      {showCongratsModal && (
        <div className="modal">
          <div className="modal-content showCongratsModal">
            <h2>Congratulations!</h2>
            <p>You guessed the word correctly:</p>
            <div className="showCongratsModalBoxGrid">
              {renderWordGrid(selectedFact.name, correctLetters)}
            </div>
            <ul className="factList">
              {displayedFacts.map((fact, index) => (
                <li key={index}>{fact}</li>
              ))}
            </ul>
            <hr></hr>
            <p>
              A new fact is revealed every day so come back tomorrow to guess
              again!
            </p>
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
          <div className="modal-content betterLuckModal">
            <h2>Better Luck Next Time!</h2>
            <p>The correct answer was:</p>
            <div className="showBetterLuckModalBoxGrid">
              {renderWordGrid(selectedFact.name, correctLetters)}
            </div>
            <ul className="factList">
              {displayedFacts.map((fact, index) => (
                <li key={index}>{fact}</li>
              ))}
            </ul>
            <hr></hr>
            <p>
              A new fact is revealed every day so come back tomorrow to guess
              again!
            </p>
            <button
              className="closeButton"
              onClick={() => setShowBetterLuckModal(false)}
              aria-label="Close Better Luck Next Time modal"
            >
              x
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Modals;
