import React from "react";

import answerModalStyles from "../assets/css/answermodal.module.css";
import CorrectAnimation from "./CorrectAnimation";

const AnswerModal = ({ handleNextQuestion }) => {
  return (
    <div className={answerModalStyles.answerModal}>
      <h1>YOU ARE CORRECT</h1>
      <div>
        <CorrectAnimation />
      </div>
      <div className={answerModalStyles.answerModalNextButtonContainer}>
        <button onClick={handleNextQuestion}>NEXT</button>
      </div>
    </div>
  );
};

export default AnswerModal;
