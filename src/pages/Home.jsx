// module imports
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// components imports
import Cloud from "../components/Cloud";
import LandscapeContainer from "../components/LandscapeContainer";

// utility import
import { getUserDataFromLocalStorage } from "../utilities/localStorageHandler";

// style imports
import homeStyles from "../assets/css/home.module.css";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (getUserDataFromLocalStorage()) {
      navigate("/dashboard");
    }
  }, []);

  return (
    <section className={homeStyles.homeContainer}>
      <div></div>
      <div>
        <div className={homeStyles.cloudContainer}>
          <Cloud />
        </div>
        <p>
          Unleash your potential! Enhance your skills and excel at learning new
          words. Don't let dyslexia hold you back your abilities know no bounds!
        </p>
      </div>
      <div>
        <button
          onClick={() => {
            navigate("/get-started");
          }}
        >
          GET STARTED
        </button>
        <button
          onClick={() => {
            navigate("/login");
          }}
        >
          I ALREADY HAVE AN ACCOUNT
        </button>
      </div>
      <div>
        <LandscapeContainer />
      </div>
    </section>
  );
};

export default Home;
