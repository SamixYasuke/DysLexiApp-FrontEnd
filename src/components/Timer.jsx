import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import timerStyles from "../assets/css/timer.module.css";

const Timer = ({ remainingTime, handleTimeElapsed, setRemainingTime }) => {
  const containerWidth = 200;

  useEffect(() => {
    if (setRemainingTime && remainingTime !== undefined) {
      const timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(timer);
            handleTimeElapsed();
            return 0;
          } else {
            return prevTime - 100;
          }
        });
      }, 100);
      return () => clearInterval(timer);
    }
  }, [remainingTime, setRemainingTime]);

  return (
    <div
      className={timerStyles.timerBarContainer}
      style={{ width: containerWidth }}
    >
      <div
        className={timerStyles.timerBar}
        style={{ width: `${(remainingTime / 30000) * 100}%` }}
      ></div>
    </div>
  );
};

Timer.propTypes = {
  remainingTime: PropTypes.number,
  handleTimeElapsed: PropTypes.func,
  setRemainingTime: PropTypes.func,
};

export default Timer;
