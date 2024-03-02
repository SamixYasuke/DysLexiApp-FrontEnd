// module imports
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// components imports
import AudioSpeedSwitch from "../components/AudioSpeedSwitch";
import Timer from "../components/Timer";
import SoundButton from "../components/SoundButton";
import WordSelector from "../components/WordSelector";
import SubmitAnswerButton from "../components/SubmitAnswerButton";
import WrongAnswerButtons from "../components/WrongAnswerButtons";
import NextQuestionButton from "../components/NextQuestionButton";
import ScoreAndLife from "../components/ScoreAndLife";
import SavingLevel from "../components/SavingLevel";

// utility functions imports
import {
  checkAnswer,
  checkCorrectAnswer,
  playBase64Audio,
  tryAgain,
} from "../utilities/soundSelectorFunctions";
import calculateStarsEarned from "../utilities/calculateStarsEarned";
import {
  getUserDataFromLocalStorage,
  removeUserDataFromLocalStorage,
} from "../utilities/localStorageHandler";
import baseUrl from "../utilities/baseUrl";

// game data imports
import unitOneData from "../game data/unitOne";

// style import
import SoundSelectorStyles from "../assets/css/soundselector.module.css";

const SoundSelector = () => {
  const { levelNumber } = useParams();
  const [isSlow, setIsSlow] = useState(false);
  const [remainingTime, setRemainingTime] = useState(30000);
  const [questionId, setQuestionId] = useState(0);
  const [selectedWord, setSelectedWord] = useState("");
  const [userIsWrong, setUserIsWrong] = useState(false);
  const [score, setScore] = useState(0);
  const [lifeCount, setLifeCount] = useState(3);
  const [correctAnswerChecked, setCorrectAnswerChecked] = useState(false);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(-1);
  const [levelData, setLevelData] = useState([]);
  const [isSavingLevelProgress, setIsSavingLevelProgress] = useState(false);
  const navigate = useNavigate();

  const handleWordClick = (word) => {
    setSelectedWord(word);
  };

  const handleNextQuestion = () => {
    if (questionId === levelData.length - 1) {
      saveUserProgress();
      return;
    }
    setQuestionId(questionId + 1);
    setCorrectAnswerChecked(false);
    setUserIsWrong(false);
    setCorrectAnswerIndex(-1);
    setRemainingTime(30000);
  };

  const saveUserProgress = async () => {
    const { authToken } = getUserDataFromLocalStorage();
    const starsEarned = calculateStarsEarned(score, levelData);
    setIsSavingLevelProgress(true);
    try {
      const response = await axios.post(
        `${baseUrl}/user/units/1/levels/${levelNumber}/complete`,
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
      navigate("/unit/1");
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

  const handleTimeElapsed = () => {
    if (remainingTime <= 0) {
      setUserIsWrong(true);
      setLifeCount(lifeCount - 1);
    }
  };

  const handleAudioSpeedToggle = () => {
    setIsSlow((prevIsSlow) => !prevIsSlow);
  };

  useEffect(() => {
    if (levelData[questionId]) {
      playBase64Audio(levelData[questionId].soundUrl, isSlow ? 0.5 : 1.0);
    }
  }, [questionId, levelData, isSlow]);

  useEffect(() => {
    if (!getUserDataFromLocalStorage()) {
      navigate("/");
      return;
    }
    setLevelData(unitOneData[levelNumber - 1].questions);
    console.log(unitOneData[levelNumber - 1].level);
    console.log(unitOneData[levelNumber - 1].questions);
  }, []);

  useEffect(() => {
    if (lifeCount === 0) {
      setQuestionId(questionId + 1);
      setLifeCount(3);
      setScore(score - 20);
    }
  }, [lifeCount]);

  if (isSavingLevelProgress) {
    return <SavingLevel />;
  }

  return (
    <section className={SoundSelectorStyles.soundSelectorContainer}>
      <div className={SoundSelectorStyles.headContainer}>
        <Timer
          remainingTime={remainingTime}
          handleTimeElapsed={handleTimeElapsed}
          setRemainingTime={setRemainingTime}
        />
        <ScoreAndLife lifeCount={lifeCount} score={score} />
      </div>
      <div className={SoundSelectorStyles.soundDiv}>
        <p>Select what you hear?</p>
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
      <WordSelector
        levelData={levelData}
        questionId={questionId}
        handleWordClick={handleWordClick}
        selectedWord={selectedWord}
        correctAnswerIndex={correctAnswerIndex}
      />
      {!userIsWrong && !correctAnswerChecked && (
        <SubmitAnswerButton
          selectedWord={selectedWord}
          checkAnswer={checkAnswer}
          levelData={levelData}
          questionId={questionId}
          setScore={setScore}
          handleNextQuestion={handleNextQuestion}
          navigate={navigate}
          setUserIsWrong={setUserIsWrong}
          setLifeCount={setLifeCount}
          lifeCount={lifeCount}
          score={score}
          setSelectedWord={setSelectedWord}
          calculateStarsEarned={calculateStarsEarned}
          saveUserProgress={saveUserProgress}
        />
      )}
      {userIsWrong && !correctAnswerChecked && (
        <WrongAnswerButtons
          tryAgain={tryAgain}
          setSelectedWord={setSelectedWord}
          setUserIsWrong={setUserIsWrong}
          setRemainingTime={setRemainingTime}
          checkCorrectAnswer={checkCorrectAnswer}
          levelData={levelData}
          questionId={questionId}
          setCorrectAnswerIndex={setCorrectAnswerIndex}
          setCorrectAnswerChecked={setCorrectAnswerChecked}
        />
      )}
      {correctAnswerChecked && (
        <NextQuestionButton handleNextQuestion={handleNextQuestion} />
      )}
    </section>
  );
};

export default SoundSelector;
