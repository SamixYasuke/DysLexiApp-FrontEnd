import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";

import dyslexiBearAnimationJson from "../utilities/dyslexiBearAnimation.json";
import dyslexiBearLoaderStyle from "../assets/css/dyslexiBearLoader.module.css";

export const DyslexiBearLoader = () => {
  const container = useRef(null);

  useEffect(() => {
    const animation = lottie.loadAnimation({
      container: container.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: dyslexiBearAnimationJson,
    });

    return () => {
      animation.destroy();
    };
  }, []);

  return (
    <div
      className={dyslexiBearLoaderStyle.dyslexiBearContainer}
      ref={container}
    ></div>
  );
};

export default DyslexiBearLoader;
