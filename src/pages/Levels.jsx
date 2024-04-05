// module imports
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

// component imports
import LandscapeContainer from "../components/LandscapeContainer";
import Level from "../components/Level";
import UnitContainer from "../components/UnitContainer";
import LevelSkeletonLoader from "../components/LevelSkeletonLoader";
import ErrorGettingLevels from "../components/ErrorGettingLevels";

// utility imports
import baseUrl from "../utilities/baseUrl";
import {
  getUserDataFromLocalStorage,
  removeUserDataFromLocalStorage,
} from "../utilities/localStorageHandler";

// style import
import levelStyle from "../assets/css/levels.module.css";

const Levels = () => {
  const [levels, setLevels] = useState([]);
  const navigate = useNavigate();
  const { unitId } = useParams();
  const [isGettingLevels, setIsGettingLevels] = useState(false);
  const [errorGettingLevels, setErrorGettingLevels] = useState(false);

  useEffect(() => {
    if (getUserDataFromLocalStorage()) {
      getUserLevels();
    } else {
      navigate("/");
    }
  }, []);

  const handleUnitQuestionUrl = () => {
    const parsedUnitId = parseInt(unitId);
    if (parsedUnitId === 1) {
      return "sound-selector";
    } else if (parsedUnitId === 2) {
      return "see-and-type";
    } else if (parsedUnitId === 3) {
      return "hear-and-type";
    } else if (parsedUnitId === 4) {
      return "see-and-talk";
    } else if (parsedUnitId === 5) {
      return "hear-and-pronounce";
    } else {
      return "read-and-pronounce";
    }
  };

  const unitText = () => {
    const parsedUnitId = parseInt(unitId);
    if (parsedUnitId === 1) {
      return "Sharpen your auditory skills in Understand Sounds and Select the right spelling, where you listen and choose the correct spelling.";
    } else if (parsedUnitId === 2) {
      return "Exercise your visual acuity in Identify Items and Spell It Properly, where you identify items and spell them accurately.";
    } else if (parsedUnitId === 3) {
      return "Hone your listening and spelling in Listen To Sounds and Properly Replicate It With The Right Spellings.";
    } else if (parsedUnitId === 4) {
      return "Enhance pronunciation in Identify Pictures and Pronounce It Properly by matching images with correct pronunciations.";
    } else if (parsedUnitId === 5) {
      return "Improve pronunciation by repeating words in Repeat words pronounced by the AI.";
    } else {
      return "Test your pronunciation accuracy in See a word, pronounce it, and the AI verifies if it matches.";
    }
  };

  const getUserLevels = async () => {
    setIsGettingLevels(true);
    setErrorGettingLevels(false);
    const { authToken } = getUserDataFromLocalStorage();
    try {
      const response = await axios.get(
        `${baseUrl}/user/units/${unitId}/levels`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const { data } = response;
      setLevels(data);
      console.log(data);
    } catch (error) {
      setErrorGettingLevels(true);
      if (error.response) {
        if (error.response.status === 404) {
          console.log("Unit Doesn't Exist");
          return;
        }
      }
      if (error.response && error.response.status === 401) {
        console.log("Expired token");
        removeUserDataFromLocalStorage();
        navigate("/");
      }
      console.error(`Error:, ${error.message}`);
    } finally {
      setIsGettingLevels(false);
    }
  };

  return (
    <>
      <section className={levelStyle.levelsPage}>
        <UnitContainer unitId={unitId} unitText={unitText} />
        {isGettingLevels ? (
          <LevelSkeletonLoader />
        ) : errorGettingLevels ? (
          <ErrorGettingLevels getUserLevels={getUserLevels} />
        ) : (
          <Level
            levels={levels}
            levelStyle={levelStyle}
            handleUnitQuestionUrl={handleUnitQuestionUrl}
          />
        )}
        <LandscapeContainer />
      </section>
    </>
  );
};

export default Levels;
