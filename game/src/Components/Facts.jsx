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
  const [inputValues, setInputValues] = useState([]);
  const [currentInputIndex, setCurrentInputIndex] = useState(0);
  const [feedbackColors, setFeedbackColors] = useState([]);
  const [displayedFacts, setDisplayedFacts] = useState([]);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showCongratsModal, setShowCongratsModal] = useState(false);
  const [showBetterLuckModal, setShowBetterLuckModal] = useState(false);
  const [incorrectGuessCount, setIncorrectGuessCount] = useState(0);
  const [showLogo, setShowLogo] = useState(true);
  const [keyboardFeedback, setKeyboardFeedback] = useState({});

  const getFactOfTheDay = () => {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((today - startOfYear) / (1000 * 60 * 60 * 24)); // Days since Jan 1
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
    selectedFactIndex !== null ? factInfo[selectedFactIndex] : null;

  const handleCloseModal = () => {
    setShowHowToPlay(false);
    setGameStarted(true);
  };

  const handleClick = () => {
    setShowHowToPlay(true);
    setShowButton(false);
    setShowLogo(false);

    const selectedWord = selectedFact.name.toUpperCase();
    setInputValues(Array(selectedWord.length).fill(""));
    setFeedbackColors(Array(selectedWord.length).fill(""));
    setDisplayedFacts([selectedFact.facts[0]]);
    setCurrentInputIndex(0);
    setIncorrectGuessCount(0);
    setKeyboardFeedback({});
  };

  const handleSubmit = useCallback(() => {
    if (!selectedFact) return;

    const userGuess = inputValues.join("");
    const correctAnswer = selectedFact.name.toUpperCase();

    if (userGuess === correctAnswer) {
      setFeedbackColors(Array(correctAnswer.length).fill("correct"));
      setShowCongratsModal(true);
    } else {
      const newFeedbackColors = inputValues.map((letter, index) => {
        if (letter === correctAnswer[index]) return "correct";
        if (correctAnswer.includes(letter)) return "almost";
        return "incorrect";
      });

      setFeedbackColors(newFeedbackColors);

      setKeyboardFeedback((prev) => {
        const updatedFeedback = { ...prev };
        inputValues.forEach((letter, index) => {
          if (!letter) return; 
          const feedback = newFeedbackColors[index];
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

      setIncorrectGuessCount((prev) => prev + 1);

      if (incorrectGuessCount >= 4) {
        setShowBetterLuckModal(true);
      } else if (displayedFacts.length < selectedFact.facts.length) {
        setDisplayedFacts((prev) => [...prev, selectedFact.facts[prev.length]]);
      }
    }
  }, [inputValues, selectedFact, displayedFacts, incorrectGuessCount]);

  const handleKeyPress = useCallback(
    (event) => {
      const { key } = event;

      if (key.length === 1 && /^[a-zA-Z]$/.test(key)) {
        let indexToInsert = currentInputIndex;

        while (
          indexToInsert < selectedFact.name.length &&
          feedbackColors[indexToInsert] === "correct"
        ) {
          indexToInsert++;
        }

        if (indexToInsert < selectedFact.name.length) {
          setInputValues((prev) => {
            const newValues = [...prev];
            newValues[indexToInsert] = key.toUpperCase();
            return newValues;
          });
          setCurrentInputIndex(indexToInsert + 1);
        }
      } else if (key === "Backspace") {
        handleDelete();
      } else if (key === "ArrowLeft") {
        setCurrentInputIndex((prev) => Math.max(prev - 1, 0));
      } else if (key === "ArrowRight") {
        setCurrentInputIndex((prev) =>
          Math.min(prev + 1, inputValues.length - 1)
        );
      } else if (key === "Enter") {
        if (inputValues.every((letter) => letter !== "")) {
          handleSubmit();
        }
      }
    },
    [currentInputIndex, inputValues, selectedFact, handleSubmit, feedbackColors]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  const handleKeyClick = (key) => {
    if (currentInputIndex < selectedFact.name.length) {
      setInputValues((prev) => {
        const newValues = [...prev];
        if (feedbackColors[currentInputIndex] !== "correct") {
          newValues[currentInputIndex] = key.toUpperCase();
        }
        return newValues;
      });
      setCurrentInputIndex((prev) => Math.min(prev + 1, inputValues.length));
    }
  };

  const handleDelete = () => {
    let newInputIndex = currentInputIndex - 1;
    while (newInputIndex >= 0 && feedbackColors[newInputIndex] === "correct") {
      newInputIndex--;
    }

    if (newInputIndex >= 0) {
      setInputValues((prev) => {
        const newValues = [...prev];
        newValues[newInputIndex] = "";
        return newValues;
      });
      setCurrentInputIndex(newInputIndex);
    }
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
        <div>
          <WordGrid
            selectedFact={selectedFact}
            inputValues={inputValues}
            feedbackColors={feedbackColors}
          />
          <ul className="factInfo">
            {displayedFacts.map((fact, index) => (
              <li key={index}>{fact}</li>
            ))}
          </ul>
          <div className="keyboardContainer">
            <Keyboard
              handleKeyClick={handleKeyClick}
              handleDelete={handleDelete}
              keyboardFeedback={keyboardFeedback}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Facts;
