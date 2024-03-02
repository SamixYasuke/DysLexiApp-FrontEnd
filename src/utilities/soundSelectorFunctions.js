export const checkAnswer = (
  levelData,
  questionId,
  setScore,
  handleNextQuestion,
  setUserIsWrong,
  setLifeCount,
  lifeCount,
  selectedWord,
  score,
  setSelectedWord,
  saveUserProgress
) => {
  const correctAnswer = levelData[questionId]?.correctAnswer;
  if (selectedWord === correctAnswer) {
    setScore(score + 20);
    handleNextQuestion();
  } else {
    setUserIsWrong(true);
    if (lifeCount > 1) {
      setLifeCount(lifeCount - 1);
    } else {
      setScore(score - 20);
      setLifeCount(3);
    }
  }
};

export const checkCorrectAnswer = (
  levelData,
  questionId,
  setCorrectAnswerIndex,
  setCorrectAnswerChecked,
  setSelectedWord
) => {
  const correctAnswer = levelData[questionId].correctAnswer;
  const correctIndex = levelData[questionId].options.indexOf(correctAnswer);
  setCorrectAnswerIndex(correctIndex);
  setCorrectAnswerChecked(true);
  setSelectedWord("");
};

export const tryAgain = (setSelectedWord, setUserIsWrong, setRemainingTime) => {
  setSelectedWord("");
  setUserIsWrong(false);
  setRemainingTime(30000);
};

export const playBase64Audio = async (base64Data, playbackSpeed = 1.0) => {
  // Decode the Base64 data to binary
  const binaryData = atob(base64Data);
  // Convert the binary data to an ArrayBuffer
  const buffer = new ArrayBuffer(binaryData.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < binaryData.length; i++) {
    view[i] = binaryData.charCodeAt(i);
  }
  // Create a Blob from the binary data
  const blob = new Blob([view], { type: "audio/mpeg" });
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);
    // Create an Audio element and set its src attribute to the URL
    const audio = new Audio(url);
    console.log(audio);
    // Set the playback rate
    audio.playbackRate = playbackSpeed;
    // Play the audio
    audio.autoplay = true;
    audio.play();
  } catch (error) {
    // Permission denied or error occurred
    console.error("Error accessing audio:", error);
    alert("Without The Appopriate Permission, Sound Cannot Be Heard");
  }
};
