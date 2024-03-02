import React from "react";
import audioSpeedSwitchStyles from "../assets/css/audiospeedswitch.module.css";

const AudioSpeedSwitch = ({ handleAudioSpeedToggle, isSlow }) => {
  return (
    <div>
      <label className={audioSpeedSwitchStyles.switch}>
        <input
          type="checkbox"
          checked={isSlow}
          onChange={handleAudioSpeedToggle}
        />
        <span className={audioSpeedSwitchStyles.slider}>
          <svg
            className={audioSpeedSwitchStyles.sliderIcon}
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="presentation"
          >
            <path fill="none" d="m4 16.5 8 8 16-16"></path>
          </svg>
        </span>
      </label>
    </div>
  );
};

export default AudioSpeedSwitch;
