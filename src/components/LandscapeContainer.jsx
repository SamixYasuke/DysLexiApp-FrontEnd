import React from "react";

import landScapeImg from "../assets/images/landscape.png";
import landScapeStyles from "../assets/css/landscapeimage.module.css";

const LandscapeContainer = () => {
  return (
    <div className={landScapeStyles.landscapeContainer}>
      <img src={landScapeImg} alt="landScapeImg" />
    </div>
  );
};

export default LandscapeContainer;
