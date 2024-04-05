// module imports
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

// components imports
import ScoreAndLife from "../components/ScoreAndLife";
import Timer from "../components/Timer";
import AnswerModal from "../components/AnswerModal";
import SoundButton from "../components/SoundButton";
import AudioSpeedSwitch from "../components/AudioSpeedSwitch";
import CorrectAnswerModal from "../components/CorrectAnswerModal";
import SavingLevel from "../components/SavingLevel";

// utility functions imports
import { playBase64Audio } from "../utilities/soundSelectorFunctions";
import calculateStarsEarned from "../utilities/calculateStarsEarned";
import {
  getUserDataFromLocalStorage,
  removeUserDataFromLocalStorage,
} from "../utilities/localStorageHandler";
import baseUrl from "../utilities/baseUrl";
import removePunctuation from "../utilities/removePunctuation";

// game data import
import unitThreeData from "../game data/unitThree";

// style import
import hearAndTypeStyles from "../assets/css/hearandtype.module.css";

const HearAndType = () => {
  const { levelNumber } = useParams();
  const [remainingTime, setRemainingTime] = useState(30000);
  const [lifeCount, setLifeCount] = useState(3);
  const [score, setScore] = useState(0);
  const [userIsWrong, setUserIsWrong] = useState(false);
  const [isSlow, setIsSlow] = useState(false);
  const [questionId, setQuestionId] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [checkAnswerModalIsOpen, setCheckAnswerModalIsOpen] = useState(false);
  const [levelData, setLevelData] = useState([]);
  const [isSavingLevelProgress, setIsSavingLevelProgress] = useState(false);
  const navigate = useNavigate();

  const handleTimeElapsed = () => {
    if (remainingTime <= 0) {
      setUserIsWrong(true);
      setLifeCount(lifeCount - 1);
    }
  };

  const handleAudioSpeedToggle = () => {
    setIsSlow((prevIsSlow) => !prevIsSlow);
  };

  const handleCheckAnswer = () => {
    const correctAnswerLowerCase =
      levelData[questionId].correctAnswer.toLowerCase();
    const userAnswerLowerCase = userAnswer.toLowerCase();
    const cleanedUserAnswer = removePunctuation(userAnswerLowerCase.trim());
    if (correctAnswerLowerCase === cleanedUserAnswer) {
      setScore(score + 20);
      setUserAnswer("");
      setModalIsOpen(true);
    } else {
      setUserAnswer("");
      setLifeCount(lifeCount - 1);
      setUserIsWrong(true);
    }
  };

  const handleTryAgain = () => {
    setUserIsWrong(false);
    setRemainingTime(30000);
    if (lifeCount <= 0) {
      setLifeCount(lifeCount + 3);
      setScore(score - 20);
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
        `${baseUrl}/user/units/3/levels/${levelNumber}/complete`,
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
      navigate("/unit/3");
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

  const handleCheckCorrectAnswer = () => {
    setCheckAnswerModalIsOpen(true);
  };

  useEffect(() => {
    if (levelData[questionId]) {
      playBase64Audio(levelData[questionId].soundUrl, isSlow ? 0.5 : 1);
    }
  }, [questionId, levelData, isSlow]);

  useEffect(() => {
    if (!getUserDataFromLocalStorage()) {
      navigate("/");
      return;
    }
    console.log(unitThreeData[levelNumber - 1].level);
    console.log(unitThreeData[levelNumber - 1].questions);
    setLevelData(unitThreeData[levelNumber - 1].questions);
  }, []);

  if (isSavingLevelProgress) {
    return <SavingLevel />;
  }

  return (
    <section className={hearAndTypeStyles.hearAndTypeContainer}>
      <div className={hearAndTypeStyles.hearAndTypeHeadContainer}>
        <Timer
          remainingTime={remainingTime}
          setRemainingTime={setRemainingTime}
          handleTimeElapsed={handleTimeElapsed}
        />
        <ScoreAndLife lifeCount={lifeCount} score={score} />
      </div>
      <div className={hearAndTypeStyles.typeWhatYouSeeContainer}>
        <p>Spell What You Hear</p>
      </div>
      <div className={hearAndTypeStyles.soundButtonContainer}>
        <SoundButton
          levelData={levelData}
          questionId={questionId}
          playBase64Audio={playBase64Audio}
          isSlow={isSlow}
        />
        <div>
          <AudioSpeedSwitch
            handleAudioSpeedToggle={handleAudioSpeedToggle}
            isSlow={isSlow}
          />
          <p>Slow</p>
        </div>
      </div>
      <div className={hearAndTypeStyles.hearAndTypeInputContainer}>
        <input
          onChange={(e) => {
            setUserAnswer(e.target.value);
          }}
          value={userAnswer}
          type="text"
          placeholder="Type What You Hear Here"
          autoComplete="off"
        />
      </div>
      {!userIsWrong && (
        <div className={hearAndTypeStyles.hearAndTypeButtonContainer}>
          <button onClick={handleCheckAnswer} disabled={userAnswer === ""}>
            CHECK
          </button>
        </div>
      )}
      {userIsWrong && (
        <div
          className={hearAndTypeStyles.hearAndTypeWrongAnswerButtonContainer}
        >
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

export default HearAndType;
