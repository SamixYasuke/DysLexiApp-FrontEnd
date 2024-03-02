import React from "react";

import savingLevelStyles from "../assets/css/savinglevel.module.css";
import WalkingCartoon from "./WalkingCartoon";

const SavingLevel = () => {
  return (
    <section className={savingLevelStyles.savingLevelContainer}>
      <div>
        <WalkingCartoon />
        <p>SAVING YOUR LEVEL PROGRESS...</p>
      </div>
    </section>
  );
};

export default SavingLevel;
