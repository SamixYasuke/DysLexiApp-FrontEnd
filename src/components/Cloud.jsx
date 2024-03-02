import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";
import cloudImageStyle from "../assets/css/cloud.module.css";
import cloudImageJson from "../utilities/cloud_animation.json";

const Cloud = () => {
  const container = useRef(null);

  useEffect(() => {
    const animation = lottie.loadAnimation({
      container: container.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: cloudImageJson,
    });

    return () => {
      animation.destroy();
    };
  }, []);

  return <div className={cloudImageStyle.cloudContainer} ref={container}></div>;
};

export default Cloud;
