import React from "react";

import levelSkeletonLoaderStyles from "../assets/css/levelskeletonloader.module.css";

const LevelSkeletonLoader = () => {
  return (
    <section className={levelSkeletonLoaderStyles.levelSkeletonLoaderContainer}>
      <div className={levelSkeletonLoaderStyles.circle}></div>
      <div className={levelSkeletonLoaderStyles.circle}></div>
      <div className={levelSkeletonLoaderStyles.circle}></div>
      <div className={levelSkeletonLoaderStyles.circle}></div>
      <div className={levelSkeletonLoaderStyles.circle}></div>
      <div className={levelSkeletonLoaderStyles.circle}></div>
      <div className={levelSkeletonLoaderStyles.circle}></div>
      <div className={levelSkeletonLoaderStyles.circle}></div>
      <div className={levelSkeletonLoaderStyles.circle}></div>
    </section>
  );
};

export default LevelSkeletonLoader;
