import React from "react";

import wordSelectorStyles from "../assets/css/wordselector.module.css";

const WordSelector = ({
  levelData,
  questionId,
  handleWordClick,
  selectedWord,
  correctAnswerIndex,
}) => {
  return (
    <div className={wordSelectorStyles.wordsContainer}>
      {levelData[questionId]?.options.map((option, index) => (
        <div
          key={index}
          onClick={() => handleWordClick(option)}
          style={{
            border:
              selectedWord === option
                ? "2px solid rgba(67, 166, 146, 1)"
                : "2px solid rgba(229, 229, 229, 1)",
            backgroundColor:
              correctAnswerIndex === index // Apply background color to the correct answer index
                ? "rgba(67, 166, 146, 1)"
                : "transparent",
            color:
              correctAnswerIndex === index // Apply text color to the correct answer index
                ? "rgba(255, 255, 255, 1)"
                : "inherit",
          }}
        >
          <p>{option}</p>
        </div>
      ))}
    </div>
  );
};

export default WordSelector;
