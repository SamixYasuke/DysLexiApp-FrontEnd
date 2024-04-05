// module imports
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

// components imports
import ScoreAndLife from "../components/ScoreAndLife";
import Timer from "../components/Timer";
import AnswerModal from "../components/AnswerModal";
import CorrectAnswerModal from "../components/CorrectAnswerModal";
import SavingLevel from "../components/SavingLevel";

// utility functions imports
import calculateStarsEarned from "../utilities/calculateStarsEarned";
import {
  getUserDataFromLocalStorage,
  removeUserDataFromLocalStorage,
} from "../utilities/localStorageHandler";
import baseUrl from "../utilities/baseUrl";
import removePunctuation from "../utilities/removePunctuation";

// game data import
import unitTwoData from "../game data/unitTwo";

// style import
import seeAndTypeStyles from "../assets/css/seeandtype.module.css";

const SeeAndType = () => {
  const { levelNumber } = useParams();
  const [remainingTime, setRemainingTime] = useState(30000);
  const [userIsWrong, setUserIsWrong] = useState(false);
  const [lifeCount, setLifeCount] = useState(3);
  const [questionId, setQuestionId] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [checkAnswerModalIsOpen, setCheckAnswerModalIsOpen] = useState(false);
  const [score, setScore] = useState(0);
  const [levelData, setLevelData] = useState([]);
  const [isSavingLevelProgress, setIsSavingLevelProgress] = useState(false);
  const navigate = useNavigate();

  const handleTimeElapsed = () => {
    if (remainingTime <= 0) {
      setUserIsWrong(true);
      setLifeCount(lifeCount - 1);
    }
  };

  const handleCheckAnswer = () => {
    const correctAnswerLowerCase =
      levelData[questionId].correctAnswer.toLowerCase();
    const userAnswerLowerCase = userAnswer.toLowerCase();
    const cleanedUserAnswer = removePunctuation(userAnswerLowerCase.trim());
    if (correctAnswerLowerCase === cleanedUserAnswer) {
      setUserAnswer("");
      setModalIsOpen(true);
      setScore(score + 20);
      setUserIsWrong(false);
    } else {
      setUserIsWrong(true);
      setUserAnswer("");
      setLifeCount(lifeCount - 1);
    }
  };

  const handleNextQuestion = () => {
    if (questionId === levelData.length - 1) {
      saveUserProgress();
      return;
    }
    setQuestionId(questionId + 1);
    setModalIsOpen(false);
    setCheckAnswerModalIsOpen(false);
    setRemainingTime(30000);
    setUserIsWrong(false);
    setUserAnswer("");
  };

  const saveUserProgress = async () => {
    const { authToken } = getUserDataFromLocalStorage();
    const starsEarned = calculateStarsEarned(score, levelData);
    setIsSavingLevelProgress(true);
    try {
      const response = await axios.post(
        `${baseUrl}/user/units/2/levels/${levelNumber}/complete`,
        {
          starsEarned: parseInt(starsEarned),
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const { data } = response;
      console.log(data);
      console.log(starsEarned);
      navigate("/unit/2");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Expired token");
        removeUserDataFromLocalStorage();
        navigate("/");
      } else {
        console.log(error);
      }
    } finally {
      setIsSavingLevelProgress(false);
    }
  };

  const handleTryAgain = () => {
    setUserIsWrong(false);
    setRemainingTime(30000);
    if (lifeCount <= 0) {
      setScore(score - 20);
      setLifeCount(lifeCount + 3);
    }
  };

  const handleCheckCorrectAnswer = () => {
    setCheckAnswerModalIsOpen(true);
  };

  useEffect(() => {
    if (!getUserDataFromLocalStorage()) {
      navigate("/");
      return;
    }
    console.log(unitTwoData[levelNumber - 1].questions);
    setLevelData(unitTwoData[levelNumber - 1].questions);
  }, []);

  if (isSavingLevelProgress) {
    return <SavingLevel />;
  }

  return (
    <section className={seeAndTypeStyles.seeAndTypeContainer}>
      <div className={seeAndTypeStyles.timerAndScoreContainer}>
        <Timer
          remainingTime={remainingTime}
          setRemainingTime={setRemainingTime}
          handleTimeElapsed={handleTimeElapsed}
        />
        <ScoreAndLife lifeCount={lifeCount} score={score} />
      </div>
      <div className={seeAndTypeStyles.typeWhatYouSeeContainer}>
        <p>Spell What You See</p>
      </div>
      <div className={seeAndTypeStyles.seeAndTypeimageContainer}>
        <img
          src={levelData[questionId]?.imageData}
          alt={levelData[questionId]?.correctAnswer}
        />
      </div>
      <div className={seeAndTypeStyles.seeAndTypeInputContainer}>
        <input
          onChange={(e) => {
            setUserAnswer(e.target.value);
          }}
          value={userAnswer}
          type="text"
          placeholder="Type what you see here"
          autoComplete="off"
        />
      </div>
      {!userIsWrong && (
        <div className={seeAndTypeStyles.seeAndTypeButtonContainer}>
          <button onClick={handleCheckAnswer} disabled={userAnswer === ""}>
            CHECK
          </button>
        </div>
      )}
      {userIsWrong && (
        <div className={seeAndTypeStyles.seeAndTypeWrongAnswerButtonContainer}>
          <button onClick={handleTryAgain}>Try Again</button>
          <button onClick={handleCheckCorrectAnswer}>Check Answer</button>
        </div>
      )}
      {modalIsOpen && <AnswerModal handleNextQuestion={handleNextQuestion} />}
      {checkAnswerModalIsOpen && (
        <CorrectAnswerModal
          handleNextQuestion={handleNextQuestion}
          answer={levelData[questionId].correctAnswer}
        />
      )}
    </section>
  );
};

export default SeeAndType;
