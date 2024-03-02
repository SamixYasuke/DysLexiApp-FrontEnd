import React from "react";

import scoreAndLifeStyles from "../assets/css/scoreandlife.module.css";

const ScoreAndLife = ({ lifeCount, score }) => {
  return (
    <div className={scoreAndLifeStyles.scoreAndLifeContainer}>
      <p>❤️ {lifeCount}</p>
      <p>Score: {score}</p>
    </div>
  );
};

export default ScoreAndLife;
