// module imports
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

// components imports
import Timer from "../components/Timer";
import ScoreAndLife from "../components/ScoreAndLife";
import SavingLevel from "../components/SavingLevel";

// game data import
import unitSixData from "../game data/unitSix";

// utility functions imports
import {
  getUserDataFromLocalStorage,
  removeUserDataFromLocalStorage,
} from "../utilities/localStorageHandler";
import { playBase64Audio } from "../utilities/soundSelectorFunctions";
import removePunctuation from "../utilities/removePunctuation";
import calculateStarsEarned from "../utilities/calculateStarsEarned";
import baseUrl from "../utilities/baseUrl";

// assets imports
import microPhoneIcon from "../assets/images/Microphone Icon.png";
import activeMicrophoneIcon from "../assets/images/Green Microphone Icon.png";

// style import
import readAndPronounceStyles from "../assets/css/readandpronounce.module.css";

const ReadAndPronounce = () => {
  const { levelNumber } = useParams();
  const navigate = useNavigate();
  const [userAnswer, setUserAnswer] = useState("");
  const [remainingTime, setRemainingTime] = useState(30000);
  const [userIsWrong, setUserIsWrong] = useState(false);
  const [lifeCount, setLifeCount] = useState(3);
  const [score, setScore] = useState(0);
  const [isGettingText, setIsGettingText] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [errorGettingText, setErrorGettingText] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [questionId, setQuestionId] = useState(0);
  const [levelData, setLevelData] = useState([]);
  const [isSavingLevelProgress, setIsSavingLevelProgress] = useState(false);

  const handleTryAgain = () => {
    setUserIsWrong(false);

    if (lifeCount <= 0) {
      setScore(score - 20);
      setLifeCount(lifeCount + 3);
    }
  };

  const handleCheckAnswer = () => {
    const correctAnswerLowerCase =
      levelData[questionId].correctAnswer.toLowerCase();
    const userAnswerLowerCase = userAnswer.toLowerCase();
    const cleanedUserAnswer = removePunctuation(userAnswerLowerCase.trim());
    console.log("Correct answer", correctAnswerLowerCase);
    console.log("User Answer", cleanedUserAnswer);
    if (correctAnswerLowerCase === cleanedUserAnswer) {
      setScore(score + 20);
      setUserAnswer("");
      setUserIsWrong(false);
      handleNextQuestion();
    } else {
      setUserAnswer("");
      setLifeCount(lifeCount - 1);
      setUserIsWrong(true);
    }
  };

  const handleNextQuestion = () => {
    if (questionId === levelData.length - 1) {
      saveUserProgress();
      return;
    }
    setQuestionId(questionId + 1);

    setUserIsWrong(false);
    setUserAnswer("");
  };

  const saveUserProgress = async () => {
    const { authToken } = getUserDataFromLocalStorage();
    const starsEarned = calculateStarsEarned(score, levelData);
    setIsSavingLevelProgress(true);
    try {
      const response = await axios.post(
        `${baseUrl}/user/units/6/levels/${levelNumber}/complete`,
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
      navigate("/unit/6");
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

  const handleStartRecording = async () => {
    if (remainingTime != 0) {
      setUserAnswer("");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const mediaRecorder = new MediaRecorder(stream);
        const chunks = [];
        mediaRecorder.ondataavailable = (e) => {
          chunks.push(e.data);
        };
        mediaRecorder.onstop = async () => {
          const blob = new Blob(chunks, { type: "audio/wav" });
          const audioFile = new File([blob], "recordedAudio.wav", {
            type: "audio/wav",
          });
          handleFileChange(audioFile);
        };
        mediaRecorder.start();
        setRecorder(mediaRecorder);
        setIsRecording(true);
        setErrorGettingText(false);
      } catch (error) {
        console.error("Error starting recording:", error);
      }
    }
  };

  const handleStopRecording = () => {
    if (recorder) {
      recorder.stop();
      setIsRecording(false);
      setErrorGettingText(false);
    }
  };

  const handleFileChange = async (audioFile) => {
    if (audioFile) {
      try {
        setIsGettingText(true);
        const data = await audioFile.arrayBuffer();
        const response = await axios.post(
          "https://api-inference.huggingface.co/models/openai/whisper-large-v3",
          data,
          {
            headers: {
              Authorization: "Bearer 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",
            },
          }
        );
        const result = response.data;
        console.log(result);
        setUserAnswer(result.text);
      } catch (error) {
        console.error("Error fetching or processing audio:", error);
        setErrorGettingText(true);
      } finally {
        setIsGettingText(false);
      }
    }
  };

  const handlePronounceWord = () => {
    playBase64Audio(levelData[questionId]?.soundUrl);
  };

  useEffect(() => {
    if (!getUserDataFromLocalStorage()) {
      navigate("/");
      return;
    }
    if (unitSixData) {
      console.log(unitSixData[levelNumber - 1]?.questions);
      setLevelData(unitSixData[levelNumber - 1]?.questions);
    }
  }, []);

  if (isSavingLevelProgress) {
    return <SavingLevel />;
  }

  return (
    <section className={readAndPronounceStyles.readAndPronounceContainer}>
      <div className={readAndPronounceStyles.readAndPronounceHeadContainer}>
        <Timer />
        <ScoreAndLife lifeCount={lifeCount} score={score} />
      </div>
      <div className={readAndPronounceStyles.pronounceWhatYouSeeContainer}>
        <p>Pronounce What You See</p>
      </div>
      <div className={readAndPronounceStyles.pronounceWhatYouSeeTextContainer}>
        {levelData[questionId]?.correctAnswer && (
          <p>{levelData[questionId]?.correctAnswer} </p>
        )}
      </div>
      <div className={readAndPronounceStyles.readAndPronounceInputContainer}>
        <input
          onChange={(e) => {
            setUserAnswer(e.target.value);
          }}
          value={userAnswer}
          type="text"
          placeholder={
            isRecording
              ? "Recording Your Voice......"
              : isGettingText
              ? "Loading....."
              : errorGettingText
              ? "A Network Error Occurred Try Again"
              : "Click The Microphone Icon"
          }
          readOnly={true}
        />
        {isRecording ? (
          <img
            src={activeMicrophoneIcon}
            alt="microPhoneIcon"
            className={readAndPronounceStyles.microphoneIsRecording}
            onClick={handleStopRecording}
          />
        ) : (
          <img
            src={microPhoneIcon}
            alt="microPhoneIcon"
            onClick={handleStartRecording}
          />
        )}
      </div>
      {!userIsWrong && (
        <div className={readAndPronounceStyles.readAndPronounceButtonContainer}>
          <button onClick={handleCheckAnswer} disabled={userAnswer === ""}>
            CHECK
          </button>
        </div>
      )}
      {userIsWrong && (
        <div
          className={
            readAndPronounceStyles.readAndPronounceWrongAnswerButtonContainer
          }
        >
          <button onClick={handleTryAgain}>Try Again</button>
          <button onClick={handlePronounceWord}>Check Pronounciation</button>
        </div>
      )}
      {userIsWrong && (
        <div
          className={
            readAndPronounceStyles.readAndPronounceNextQuestionButtonContainer
          }
        >
          <button onClick={handleNextQuestion}>Next Question</button>
        </div>
      )}
    </section>
  );
};

export default ReadAndPronounce;
