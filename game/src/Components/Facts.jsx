import React, { useState, useEffect, useCallback } from "react";
import "../styles/facts.css";
import factInfo from "../data/facts.json";
import logo from "../images/logo.png";
import Keyboard from "./Keyboard";
import WordGrid from "./WordGrid";
import Modals from "./Modals";

function Facts() {
  const [selectedFactIndex, setSelectedFactIndex] = useState(null);
  const [showButton, setShowButton] = useState(true);
  const [currentGuess, setCurrentGuess] = useState([]);
  const [pastGuesses, setPastGuesses] = useState([]);
  const [currentRow, setCurrentRow] = useState(0);
  const [feedbackColors, setFeedbackColors] = useState([]);
  const [displayedFacts, setDisplayedFacts] = useState([]);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showCongratsModal, setShowCongratsModal] = useState(false);
  const [showBetterLuckModal, setShowBetterLuckModal] = useState(false);
  const [showLogo, setShowLogo] = useState(true);
  const [keyboardFeedback, setKeyboardFeedback] = useState({});
  const MAX_ATTEMPTS = 5;

  const getFactOfTheDay = () => {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((today - startOfYear) / (1000 * 60 * 60 * 24)); 
    const factIndex = dayOfYear % factInfo.length;
    return factIndex;
  };

  useEffect(() => {
    const factIndex = getFactOfTheDay();
    setSelectedFactIndex(factIndex);

    const now = new Date();
    const timeUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0) -
      now;

    const timeout = setTimeout(() => {
      const newFactIndex = getFactOfTheDay();
      setSelectedFactIndex(newFactIndex);
    }, timeUntilMidnight);

    return () => clearTimeout(timeout);
  }, []);

  const selectedFact =
    selectedFactIndex !== null && factInfo[selectedFactIndex]
      ? factInfo[selectedFactIndex]
      : null;

  const handleCloseModal = () => {
    setShowHowToPlay(false);
    setGameStarted(true);
  };

  const handleClick = () => {
    setShowHowToPlay(true);
    setShowButton(false);
    setShowLogo(false);

    if (!selectedFact) return;

    const selectedWord = selectedFact.name.toUpperCase();

    setCurrentGuess(Array(selectedWord.length).fill(""));
    setPastGuesses(
      Array(MAX_ATTEMPTS - 1)
        .fill()
        .map(() => Array(selectedWord.length).fill(""))
    );

    setFeedbackColors(
      Array(MAX_ATTEMPTS)
        .fill()
        .map(() => Array(selectedWord.length).fill(""))
    );

    setDisplayedFacts([selectedFact.facts[0]]);
    setCurrentRow(0);
    setKeyboardFeedback({});
  };

  const calculateFeedback = (guess, correctAnswer) => {
    const feedback = Array(guess.length).fill("");

    const letterCounts = {};
    for (let letter of correctAnswer) {
      letterCounts[letter] = (letterCounts[letter] || 0) + 1;
    }

    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === correctAnswer[i]) {
        feedback[i] = "correct";
        letterCounts[guess[i]]--;
      }
    }

    for (let i = 0; i < guess.length; i++) {
      if (feedback[i] === "") {
        if (letterCounts[guess[i]] && letterCounts[guess[i]] > 0) {
          feedback[i] = "almost";
          letterCounts[guess[i]]--;
        } else {
          feedback[i] = "incorrect";
        }
      }
    }

    return feedback;
  };

  const handleSubmit = useCallback(() => {
    if (!selectedFact || currentGuess.some((letter) => letter === "")) return;

    const userGuess = currentGuess.join("");
    const correctAnswer = selectedFact.name.toUpperCase();

    const newRowFeedback = calculateFeedback(
      currentGuess,
      correctAnswer.split("")
    );

    const newFeedbackColors = [...feedbackColors];
    newFeedbackColors[currentRow] = newRowFeedback;
    setFeedbackColors(newFeedbackColors);

    setKeyboardFeedback((prev) => {
      const updatedFeedback = { ...prev };
      currentGuess.forEach((letter, index) => {
        if (!letter) return;
        const feedback = newRowFeedback[index];

        if (feedback === "correct") {
          updatedFeedback[letter] = "correct";
        } else if (
          feedback === "almost" &&
          updatedFeedback[letter] !== "correct"
        ) {
          updatedFeedback[letter] = "almost";
        } else if (!updatedFeedback[letter]) {
          updatedFeedback[letter] = "incorrect";
        }
      });
      return updatedFeedback;
    });

    if (userGuess === correctAnswer) {
      setShowCongratsModal(true);
      return;
    }

    const newPastGuesses = [...pastGuesses];
    if (currentRow < MAX_ATTEMPTS - 1) {
      newPastGuesses[currentRow] = [...currentGuess];
      setPastGuesses(newPastGuesses);
    }

    const nextRow = currentRow + 1;
    if (nextRow >= MAX_ATTEMPTS) {
      setShowBetterLuckModal(true);
    } else {
      setCurrentRow(nextRow);
      setCurrentGuess(Array(correctAnswer.length).fill(""));

      if (displayedFacts.length < selectedFact.facts.length) {
        setDisplayedFacts((prev) => [...prev, selectedFact.facts[prev.length]]);
      }
    }
  }, [
    currentGuess,
    selectedFact,
    displayedFacts,
    currentRow,
    feedbackColors,
    pastGuesses,
  ]);

  const handleEnter = () => {
    if (!selectedFact || showCongratsModal || showBetterLuckModal) return;

    if (!currentGuess.some((letter) => letter === "")) {
      handleSubmit();
    }
  };

  const handleKeyPress = useCallback(
    (event) => {
      if (!selectedFact || showCongratsModal || showBetterLuckModal) return;

      const { key } = event;
      const correctAnswer = selectedFact.name.toUpperCase();

      if (key.length === 1 && /^[a-zA-Z]$/.test(key)) {
        setCurrentGuess((prev) => {
          const newGuess = [...prev];
          const emptyIndex = newGuess.findIndex((letter) => letter === "");
          if (emptyIndex !== -1) {
            newGuess[emptyIndex] = key.toUpperCase();
          }
          return newGuess;
        });
      } else if (key === "Backspace") {
        setCurrentGuess((prev) => {
          const newGuess = [...prev];

          for (let i = newGuess.length - 1; i >= 0; i--) {
            if (newGuess[i] !== "") {
              newGuess[i] = "";
              break;
            }
          }
          return newGuess;
        });
      } else if (key === "Enter") {
        if (!currentGuess.some((letter) => letter === "")) {
          handleSubmit();
        }
      }
    },
    [
      selectedFact,
      currentGuess,
      handleSubmit,
      showCongratsModal,
      showBetterLuckModal,
    ]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  const handleKeyClick = (key) => {
    if (!selectedFact || showCongratsModal || showBetterLuckModal) return;

    setCurrentGuess((prev) => {
      const newGuess = [...prev];
      const emptyIndex = newGuess.findIndex((letter) => letter === "");
      if (emptyIndex !== -1) {
        newGuess[emptyIndex] = key.toUpperCase();
      }
      return newGuess;
    });
  };

  const handleDelete = () => {
    if (!selectedFact || showCongratsModal || showBetterLuckModal) return;

    setCurrentGuess((prev) => {
      const newGuess = [...prev];

      for (let i = newGuess.length - 1; i >= 0; i--) {
        if (newGuess[i] !== "") {
          newGuess[i] = "";
          break;
        }
      }
      return newGuess;
    });
  };

  return (
    <div className="factContainer">
      <Modals
        showHowToPlay={showHowToPlay}
        showCongratsModal={showCongratsModal}
        showBetterLuckModal={showBetterLuckModal}
        handleCloseModal={handleCloseModal}
        selectedFact={selectedFact}
        displayedFacts={displayedFacts}
        setShowCongratsModal={setShowCongratsModal}
        setShowBetterLuckModal={setShowBetterLuckModal}
      />
      {showLogo && <img className="logo" src={logo} alt="logo" />}
      <div className="buttonContainer">
        {showButton && (
          <button className="playButton" onClick={handleClick}>
            Play
          </button>
        )}
      </div>
      {gameStarted && selectedFact && (
        <div className="gameContent">
          <div className="wordGridContainer">
            {pastGuesses.slice(0, currentRow).map((guess, rowIndex) => (
              <WordGrid
                key={`past-${rowIndex}`}
                inputValues={guess}
                feedbackColors={feedbackColors[rowIndex]}
              />
            ))}

            <WordGrid
              inputValues={currentGuess}
              feedbackColors={
                feedbackColors[currentRow] ||
                Array(selectedFact.name.length).fill("")
              }
            />

            {Array(MAX_ATTEMPTS - currentRow - 1)
              .fill()
              .map((_, rowIndex) => (
                <WordGrid
                  key={`future-${rowIndex}`}
                  inputValues={Array(selectedFact.name.length).fill("")}
                  feedbackColors={Array(selectedFact.name.length).fill("")}
                />
              ))}
          </div>

          <ul className="factInfo">
            {displayedFacts.map((fact, index) => (
              <li key={index}>{fact}</li>
            ))}
          </ul>
          <div className="keyboardContainer">
            <Keyboard
              handleKeyClick={handleKeyClick}
              handleDelete={handleDelete}
              handleSubmit={handleSubmit}
              handleEnter={handleEnter}
              keyboardFeedback={keyboardFeedback}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Facts;
