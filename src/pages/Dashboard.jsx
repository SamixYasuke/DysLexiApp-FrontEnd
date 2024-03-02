// module imports
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// components imports
import Cloud from "../components/Cloud";

// icon imports
import unitOneIcon from "../assets/images/unit 1.png";
import unitTwoIcon from "../assets/images/unit 2.png";
import unitThreeIcon from "../assets/images/unit 3.png";
import unitFourIcon from "../assets/images/unit 4.png";
import darkLandscapeIcon from "../assets/images/dark landscape.png";

// audio import
import audioFile from "../assets/audios/dashboard audio.mp3";

// utility import
import {
  getUserDataFromLocalStorage,
  removeUserDataFromLocalStorage,
} from "../utilities/localStorageHandler";

// style import
import dashboardStyles from "../assets/css/dashboard.module.css";

export const Dashboard = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const units = [
    {
      unit: "Unit 1",
      difficulty: "Easy",
      information:
        "Sharpen your auditory skills in Understand Sounds and Select the right spelling, where you listen and choose the correct spelling.",
      icon: unitOneIcon,
    },
    {
      unit: "Unit 2",
      difficulty: "Easy",
      information:
        "Exercise your visual acuity in Identify Items and Spell It Properly, where you identify items and spell them accurately.",
      icon: unitTwoIcon,
    },
    {
      unit: "Unit 3",
      difficulty: "Challenging",
      information:
        "Hone your listening and spelling in Listen To Sounds and Properly Replicate It With The Right Spellings.",
      icon: unitThreeIcon,
    },
    {
      unit: "Unit 4",
      difficulty: "Challenging",
      information:
        "Enhance pronunciation in Identify Pictures and Pronounce It Properly by matching images with correct pronunciations.",
      icon: unitFourIcon,
    },
    {
      unit: "Unit 5",
      difficulty: "Challenging",
      information:
        "Improve pronunciation by repeating words in Repeat words pronounced by the AI.",
      icon: unitTwoIcon,
    },
    {
      unit: "Unit 6",
      difficulty: "Challenging",
      information:
        "Test your pronunciation accuracy in See a word, pronounce it, and the AI verifies if it matches.",
      icon: unitTwoIcon,
    },
  ];

  const getUserData = () => {
    const { userName } = getUserDataFromLocalStorage();
    console.log(userName);
    setName(userName);
  };

  const handlelogOut = () => {
    removeUserDataFromLocalStorage();
    navigate("/");
  };

  useEffect(() => {
    if (getUserDataFromLocalStorage()) {
      getUserData();
      const audio = new Audio(audioFile);
      audio.loop = true;
      audio.play();
      return () => {
        audio.pause();
      };
    } else {
      navigate("/");
    }
  }, []);

  return (
    <section className={dashboardStyles.dashboardConatiner}>
      <div className={dashboardStyles.headerContainer}>
        <div>
          {name && <p>Welcome back {name}</p>}
          <button onClick={handlelogOut}>LOG OUT</button>
        </div>
        <div>
          <Cloud />
        </div>
      </div>
      <div className={dashboardStyles.unitContainerSection}>
        <p>I want to learn....</p>
        <div className={dashboardStyles.unitContainer}>
          {units.map((unit, index) => (
            <div
              onClick={() => {
                navigate(`/unit/${index + 1}`);
              }}
              key={index}
            >
              {unit.unit && <p>{unit.unit}</p>}
              {unit.icon && (
                <div>
                  <img src={unit.icon} alt="unitIcon" />
                </div>
              )}

              {unit.difficulty && <p>Difficulty: {unit.difficulty}</p>}
              {unit.information && <p>{unit.information}</p>}
            </div>
          ))}
        </div>
      </div>
      <div className={dashboardStyles.footerSection}>
        <img src={darkLandscapeIcon} alt="darkLandscapeIcon" />
      </div>
    </section>
  );
};

export default Dashboard;
