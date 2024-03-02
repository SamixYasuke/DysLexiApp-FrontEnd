import React from "react";

import nextQuestionButtonStyles from "../assets/css/nextquestionbutton.module.css";

const NextQuestionButton = ({ handleNextQuestion }) => {
  return (
    <div className={nextQuestionButtonStyles.buttonContainer}>
      <button onClick={handleNextQuestion}>Next Question</button>
    </div>
  );
};

export default NextQuestionButton;
