import React from "react";

import submitAnswerButtonStyles from "../assets/css/submitAnswerbutton.module.css";

const SubmitAnswerButton = ({
  selectedWord,
  checkAnswer,
  levelData,
  questionId,
  setScore,
  handleNextQuestion,
  setUserIsWrong,
  setLifeCount,
  lifeCount,
  score,
  setSelectedWord,
  saveUserProgress,
}) => {
  return (
    <div className={submitAnswerButtonStyles.buttonContainer}>
      <button
        disabled={selectedWord === ""}
        onClick={() => {
          checkAnswer(
            levelData,
            questionId,
            setScore,
            handleNextQuestion,
            setUserIsWrong,
            setLifeCount,
            lifeCount,
            selectedWord,
            score,
            setSelectedWord,
            saveUserProgress
          );
        }}
      >
        CHECK
      </button>
    </div>
  );
};
export default SubmitAnswerButton;
