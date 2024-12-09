import React, { useState, useRef, useEffect, useCallback } from "react";
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
  const inputRef = useRef(null);

  const selectedFact = selectedFactIndex !== null ? factInfo[selectedFactIndex] : null;

  const handleCloseModal = () => {
    setShowHowToPlay(false);
    setGameStarted(true);
  };

  const handleClick = () => {
    setShowHowToPlay(true);
    const index = Math.floor(Math.random() * factInfo.length);
    setSelectedFactIndex(index);
    setShowButton(false);
    setShowLogo(false);
    const selectedWord = factInfo[index].name.toUpperCase();
    setInputValues(Array(selectedWord.length).fill(""));
    setFeedbackColors(Array(selectedWord.length).fill(""));
    setDisplayedFacts([factInfo[index].facts[0]]);
    setCurrentInputIndex(0);
    setIncorrectGuessCount(0);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSubmit = useCallback(() => {
    if (!selectedFact) return;
  
    const userGuess = inputValues.join("");
    const correctAnswer = selectedFact.name.toUpperCase();
  
    if (userGuess === correctAnswer) {
      const newFeedbackColors = Array(correctAnswer.length).fill("correct");
      setFeedbackColors(newFeedbackColors);
      setShowCongratsModal(true);
    } else {
      const newFeedbackColors = inputValues.map((letter, index) => {
        if (letter === correctAnswer[index]) {
          return "correct";  // Correct letter and position (green)
        } else if (correctAnswer.includes(letter)) {
          return "almost";   // Correct letter, wrong position (yellow)
        } else {
          return "incorrect"; // Incorrect letter (default color)
        }
      });
  
      setFeedbackColors(newFeedbackColors);
      setIncorrectGuessCount((prev) => prev + 1);
  
      if (incorrectGuessCount >= 4) setShowBetterLuckModal(true);
  
      if (displayedFacts.length < selectedFact.facts.length) {
        setDisplayedFacts((prev) => [...prev, selectedFact.facts[prev.length]]);
      }
  
      alert("Try again!");
    }
  }, [inputValues, selectedFact, displayedFacts, incorrectGuessCount]);
  

  const handleKeyPress = useCallback((event) => {
    const { key } = event;

    if (key.length === 1 && /^[a-zA-Z]$/.test(key)) {
      let indexToInsert = currentInputIndex;

      while (indexToInsert < selectedFact.name.length && feedbackColors[indexToInsert] === "correct") {
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
      setCurrentInputIndex((prev) => Math.min(prev + 1, inputValues.length - 1));
    } else if (key === "Enter") {
      if (inputValues.every((letter) => letter !== "")) handleSubmit();
      else alert("Please complete the guess!");
    }
  }, [currentInputIndex, inputValues, selectedFact, handleSubmit, feedbackColors]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
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
        setShowCongratsModal={setShowCongratsModal}
        setShowBetterLuckModal={setShowBetterLuckModal}
      />

      {showLogo && <img className="logo" src={logo} alt="logo" />}
      <div className="buttonContainer">
        {showButton && (
          <button className="playButton" onClick={handleClick}>Play</button>
        )}
      </div>

      {gameStarted && selectedFact && (
        <div>
          <WordGrid selectedFact={selectedFact} inputValues={inputValues} feedbackColors={feedbackColors} />
          <ul className="factInfo">
            {displayedFacts.map((fact, index) => (
              <li key={index}>{fact}</li>
            ))}
          </ul>

          <div className="keyboardContainer">
            <Keyboard handleKeyClick={handleKeyClick} handleDelete={handleDelete} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Facts;
