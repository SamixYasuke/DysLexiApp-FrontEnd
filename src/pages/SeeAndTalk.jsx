// module imports
import React, { useEffect, useState } from "react";
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
import unitFourData from "../game data/unitFour";

// assets imports
import microPhoneIcon from "../assets/images/Microphone Icon.png";
import activeMicrophoneIcon from "../assets/images/Green Microphone Icon.png";

// style import
import seeAndTalkStyles from "../assets/css/seeandtalk.module.css";

const SeeAndTalk = () => {
  const navigate = useNavigate();
  const { levelNumber } = useParams();
  const [userIsWrong, setUserIsWrong] = useState(false);
  const [lifeCount, setLifeCount] = useState(3);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isGettingText, setIsGettingText] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [errorGettingText, setErrorGettingText] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [questionId, setQuestionId] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [checkAnswerModalIsOpen, setCheckAnswerModalIsOpen] = useState(false);
  const [levelData, setLevelData] = useState([]);
  const [isSavingLevelProgress, setIsSavingLevelProgress] = useState(false);

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

    setUserIsWrong(false);
    setUserAnswer("");
  };

  const saveUserProgress = async () => {
    const { authToken } = getUserDataFromLocalStorage();
    const starsEarned = calculateStarsEarned(score, levelData);
    setIsSavingLevelProgress(true);
    try {
      const response = await axios.post(
        `${baseUrl}/user/units/4/levels/${levelNumber}/complete`,
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
      navigate("/unit/4");
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

    if (lifeCount <= 0) {
      setScore(score - 20);
      setLifeCount(lifeCount + 3);
    }
  };

  const handleCheckCorrectAnswer = () => {
    setCheckAnswerModalIsOpen(true);
  };

  const handleStartRecording = async () => {
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

  useEffect(() => {
    if (!getUserDataFromLocalStorage()) {
      navigate("/");
      return;
    }
    console.log(unitFourData[levelNumber - 1].questions);
    setLevelData(unitFourData[levelNumber - 1].questions);
  }, []);

  if (isSavingLevelProgress) {
    return <SavingLevel />;
  }

  return (
    <section className={seeAndTalkStyles.seeAndTalkContainer}>
      <div className={seeAndTalkStyles.seeAndTalkHeadContainer}>
        <Timer />
        <ScoreAndLife lifeCount={lifeCount} score={score} />
      </div>
      <div className={seeAndTalkStyles.tellMeWhatYouSeeContainer}>
        <p>Tell Me What You See?</p>
      </div>
      <div className={seeAndTalkStyles.tellMeWhatYouSeeImageContainer}>
        <img
          src={levelData[questionId]?.imageData}
          alt={levelData[questionId]?.correctAnswer}
        />
      </div>
      <div className={seeAndTalkStyles.seeAndTalkInputContainer}>
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
            className={seeAndTalkStyles.microphoneIsRecording}
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
        <div className={seeAndTalkStyles.seeAndTalkButtonContainer}>
          <button onClick={handleCheckAnswer} disabled={userAnswer === ""}>
            CHECK
          </button>
        </div>
      )}
      {userIsWrong && (
        <div className={seeAndTalkStyles.seeAndTalkWrongAnswerButtonContainer}>
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

export default SeeAndTalk;
