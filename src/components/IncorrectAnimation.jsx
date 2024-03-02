import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";

import incorrectAnimationJson from "../utilities/userNotCorrecAnimation.json";
import cloudImageStyle from "../assets/css/cloud.module.css";

export const IncorrectAnimation = () => {
  const container = useRef(null);

  useEffect(() => {
    const animation = lottie.loadAnimation({
      container: container.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: incorrectAnimationJson,
    });

    return () => {
      animation.destroy();
    };
  }, []);

  return <div className={cloudImageStyle.cloudContainer} ref={container}></div>;
};

export default IncorrectAnimation;
