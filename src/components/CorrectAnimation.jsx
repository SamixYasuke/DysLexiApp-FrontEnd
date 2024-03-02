import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";

import correctAnimationJson from "../utilities/userCorrectAnimation.json";
import cloudImageStyle from "../assets/css/cloud.module.css";

export const CorrectAnimation = () => {
  const container = useRef(null);

  useEffect(() => {
    const animation = lottie.loadAnimation({
      container: container.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: correctAnimationJson,
    });

    return () => {
      animation.destroy();
    };
  }, []);

  return <div className={cloudImageStyle.cloudContainer} ref={container}></div>;
};

export default CorrectAnimation;
