import React, { useRef, useEffect } from "react";
import lottie from "lottie-web";
import walkingCartoonStyles from "../assets/css/walkingcartoon.module.css";
import walkingCartoonJson from "../utilities/walking_cartoon_animation.json";

const WalkingCartoon = () => {
  const container = useRef(null);

  useEffect(() => {
    const animation = lottie.loadAnimation({
      container: container.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: walkingCartoonJson,
    });

    return () => {
      animation.destroy();
    };
  }, []);

  return (
    <section
      className={walkingCartoonStyles.walkingCartoonContainer}
      ref={container}
    ></section>
  );
};

export default WalkingCartoon;
