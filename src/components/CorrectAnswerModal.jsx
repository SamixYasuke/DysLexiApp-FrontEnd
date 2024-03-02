import React from "react";

import correctAnswerModalStyles from "../assets/css/correctanswermodal.module.css";
import IncorrectAnimation from "./IncorrectAnimation";

const CorrectAnswerModal = ({ handleNextQuestion, answer }) => {
  return (
    <div className={correctAnswerModalStyles.correctAnswerModalContainer}>
      <h1>WHOOPS YOU DIDN'T GET THIS ONE</h1>
      <div>
        <IncorrectAnimation />
      </div>
      <div
        className={
          correctAnswerModalStyles.correctAnswerModalNextButtonContainer
        }
      >
        <p>The Answer Is {answer}</p>
        <button onClick={handleNextQuestion}>NEXT</button>
      </div>
    </div>
  );
};

export default CorrectAnswerModal;
