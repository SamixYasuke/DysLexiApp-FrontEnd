// module imports
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

// components imports
import Timer from "../components/Timer";
import ScoreAndLife from "../components/ScoreAndLife";
import SoundButton from "../components/SoundButton";
import AudioSpeedSwitch from "../components/AudioSpeedSwitch";
import SavingLevel from "../components/SavingLevel";

// utility functions imports
import calculateStarsEarned from "../utilities/calculateStarsEarned";
import { playBase64Audio } from "../utilities/soundSelectorFunctions";
import removePunctuation from "../utilities/removePunctuation";
import {
  getUserDataFromLocalStorage,
  removeUserDataFromLocalStorage,
} from "../utilities/localStorageHandler";
import baseUrl from "../utilities/baseUrl";

// game data imports
import unitFiveData from "../game data/unitFive";

// assets imports
import microPhoneIcon from "../assets/images/Microphone Icon.png";
import activeMicrophoneIcon from "../assets/images/Green Microphone Icon.png";

// style import
import hearAndPronounceStyles from "../assets/css/hearandpronounce.module.css";

const HearAndPronounce = () => {
  const { levelNumber } = useParams();
  const navigate = useNavigate();
  const [userAnswer, setUserAnswer] = useState("");
  const [lifeCount, setLifeCount] = useState(3);
  const [userIsWrong, setUserIsWrong] = useState(false);
  const [score, setScore] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [errorGettingText, setErrorGettingText] = useState(false);
  const [isGettingText, setIsGettingText] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [levelData, setLevelData] = useState([]);
  const [questionId, setQuestionId] = useState(0);
  const [isSlow, setIsSlow] = useState(false);
  const [isSavingLevelProgress, setIsSavingLevelProgress] = useState(false);

  const handleCheckAnswer = () => {
    const correctAnswerLowerCase =
      levelData[questionId].correctAnswer.toLowerCase();
    const userAnswerLowerCase = userAnswer.toLowerCase();
    const cleanedUserAnswer = removePunctuation(userAnswerLowerCase.trim());
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
        `${baseUrl}/user/units/5/levels/${levelNumber}/complete`,
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
      navigate("/unit/5");
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

  const handleTryAgain = () => {
    setUserIsWrong(false);

    if (lifeCount <= 0) {
      setScore(score - 20);
      setLifeCount(lifeCount + 3);
    }
  };

  const handleAudioSpeedToggle = () => {
    setIsSlow((prevIsSlow) => !prevIsSlow);
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
    if (levelData.length > 0 && levelData[questionId]) {
      playBase64Audio(levelData[questionId].soundUrl, isSlow ? 0.5 : 1);
    }
  }, [questionId, levelData, isSlow]);

  useEffect(() => {
    if (!getUserDataFromLocalStorage()) {
      navigate("/");
      return;
    }
    console.log(levelNumber);
    console.log(unitFiveData[levelNumber - 1].questions);
    setLevelData(unitFiveData[levelNumber - 1].questions);
  }, []);

  if (isSavingLevelProgress) {
    return <SavingLevel />;
  }

  return (
    <section className={hearAndPronounceStyles.hearAndPronounceContainer}>
      <div className={hearAndPronounceStyles.hearAndPronounceHeadContainer}>
        <Timer />
        <ScoreAndLife lifeCount={lifeCount} score={score} />
      </div>
      <div className={hearAndPronounceStyles.typeWhatYouSeeContainer}>
        <p>Repeat After The AI</p>
      </div>
      <div className={hearAndPronounceStyles.soundButtonContainer}>
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
      <div className={hearAndPronounceStyles.hearAndPronounceInputContainer}>
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
            className={hearAndPronounceStyles.microphoneIsRecording}
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
        <div className={hearAndPronounceStyles.hearAndPronounceButtonContainer}>
          <button onClick={handleCheckAnswer} disabled={userAnswer === ""}>
            CHECK
          </button>
        </div>
      )}

      {userIsWrong && (
        <div
          className={
            hearAndPronounceStyles.hearAndPronounceWrongAnswerButtonContainer
          }
        >
          <button onClick={handleTryAgain}>Try Again</button>
          <button onClick={handleNextQuestion}>Next Question</button>
        </div>
      )}
    </section>
  );
};

export default HearAndPronounce;
