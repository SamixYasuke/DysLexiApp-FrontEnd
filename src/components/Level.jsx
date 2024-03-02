import React from "react";
import { useNavigate } from "react-router-dom";

const Level = ({ levels, levelStyle, handleUnitQuestionUrl }) => {
  const navigate = useNavigate();
  const getGameQuestionRoute = handleUnitQuestionUrl();

  return (
    <div className={levelStyle.levelContainer}>
      {levels.map((level, index) => (
        <div
          onClick={() => {
            navigate(`/${getGameQuestionRoute}/${index + 1}`);
          }}
          key={index}
          className={`${levelStyle.level} ${
            level.locked ? levelStyle.lockedLevel : ""
          } ${
            level.starsEarned === 1
              ? levelStyle.oneStar
              : level.starsEarned === 2
              ? levelStyle.twoStar
              : level.starsEarned === 3
              ? levelStyle.threeStar
              : ""
          }`}
        >
          {!level.locked && <p>{level.levelNumber}</p>}
        </div>
      ))}
    </div>
  );
};

export default Level;
