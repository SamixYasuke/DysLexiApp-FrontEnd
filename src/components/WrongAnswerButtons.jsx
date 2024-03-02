import React from "react";

import wrongAnswerButtonsStyles from "../assets/css/wronganswerbuttons.module.css";

const WrongAnswerButtons = ({
  tryAgain,
  setSelectedWord,
  setUserIsWrong,
  setRemainingTime,
  checkCorrectAnswer,
  levelData,
  questionId,
  setCorrectAnswerIndex,
  setCorrectAnswerChecked,
}) => {
  return (
    <div className={wrongAnswerButtonsStyles.wrongAnswerbuttonContainer}>
      <button
        onClick={() => {
          tryAgain(setSelectedWord, setUserIsWrong, setRemainingTime);
        }}
      >
        Try Again
      </button>
      <button
        onClick={() => {
          checkCorrectAnswer(
            levelData,
            questionId,
            setCorrectAnswerIndex,
            setCorrectAnswerChecked,
            setSelectedWord
          );
        }}
      >
        Check Answer
      </button>
    </div>
  );
};

export default WrongAnswerButtons;
