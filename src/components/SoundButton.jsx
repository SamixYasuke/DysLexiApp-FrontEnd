import React from "react";

import soundStyles from "../assets/css/soundbutton.module.css";
import soundIcon from "../assets/images/sound icon.png";

const SoundButton = ({ playBase64Audio, levelData, questionId, isSlow }) => {
  return (
    <div className={soundStyles.soundButtonContainer}>
      <img
        src={soundIcon}
        alt="soundIcon"
        onClick={() => {
          playBase64Audio(levelData[questionId].soundUrl, isSlow ? 0.5 : 1.0);
        }}
      />
    </div>
  );
};

export default SoundButton;
