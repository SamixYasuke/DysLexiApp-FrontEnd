import React from "react";
import errorGettingLevelsStyles from "../assets/css/errorgettinglevels.module.css";

const ErrorGettingLevels = ({ getUserLevels }) => {
  return (
    <section className={errorGettingLevelsStyles.errorGettingLevelsContainer}>
      <p>An Error Occured While Getting Levels</p>
      <button onClick={getUserLevels}>Try Again</button>
    </section>
  );
};

export default ErrorGettingLevels;
