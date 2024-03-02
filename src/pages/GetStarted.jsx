// module imports
import React, { useState } from "react";

// component imports
import Register from "../components/Register";
import LandscapeContainer from "../components/LandscapeContainer";

// style import
import getStartedStyles from "../assets/css/getstarted.module.css";

const GetStarted = () => {
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [inputFilled, setInputFilled] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);
  const [age, setAge] = useState(0);
  const [showRegisterPage, setShowRegisterPage] = useState(false);

  const handleInputChange = (setStateFunc, value, index) => {
    setStateFunc(value);
    const updatedInputFilled = inputFilled.map((filled, i) =>
      i === index ? value !== "" : filled
    );
    setInputFilled(updatedInputFilled);
  };

  const handleSubmitInfo = (e) => {
    e.preventDefault();
    if (
      !firstName ||
      !secondName ||
      !dateOfBirth ||
      !password ||
      !confirmPassword
    ) {
      console.log("Complete All Fields");
      return;
    }

    if (password !== confirmPassword) {
      console.log(`Passwords don't match`);
      return;
    }

    const age = getAge(dateOfBirth);
    setAge(age);
    setShowRegisterPage(true);
  };

  const getAge = (dateOfBirth) => {
    const birthDateObj = new Date(dateOfBirth);
    const currentDate = new Date();
    let age = currentDate.getFullYear() - birthDateObj.getFullYear();
    if (
      currentDate.getMonth() < birthDateObj.getMonth() ||
      (currentDate.getMonth() === birthDateObj.getMonth() &&
        currentDate.getDate() < birthDateObj.getDate())
    ) {
      age--;
    }
    return age;
  };

  if (showRegisterPage) {
    return (
      <Register
        firstName={firstName}
        secondName={secondName}
        dateOfBirth={dateOfBirth}
        age={age}
        password={password}
      />
    );
  }

  return (
    <section className={getStartedStyles.getStartedContainer}>
      <div className={getStartedStyles.inputCompleteIndicatorContainer}>
        {inputFilled.map((filled, index) => (
          <div
            key={index}
            className={filled ? getStartedStyles.isFilled : ""}
          ></div>
        ))}
      </div>
      <form>
        <input
          onChange={(e) => handleInputChange(setFirstName, e.target.value, 0)}
          value={firstName}
          type="text"
          placeholder="FIRST NAME"
        />
        <input
          onChange={(e) => handleInputChange(setSecondName, e.target.value, 1)}
          value={secondName}
          type="text"
          placeholder="LAST NAME"
        />
        <label>DATE OF BIRTH</label>
        <input
          className={
            dateOfBirth === ""
              ? `${getStartedStyles.dateNotSelected}`
              : `${getStartedStyles.dateSelected}`
          }
          onChange={(e) => handleInputChange(setDateOfBirth, e.target.value, 2)}
          value={dateOfBirth}
          type="date"
        />
        <input
          onChange={(e) => handleInputChange(setPassword, e.target.value, 3)}
          value={password}
          type="password"
          placeholder="PASSWORD"
        />
        <input
          onChange={(e) =>
            handleInputChange(setConfirmPassword, e.target.value, 4)
          }
          value={confirmPassword}
          type="password"
          placeholder="CONFIRM PASSWORD"
        />
        <div>
          <button
            onClick={handleSubmitInfo}
            disabled={
              !firstName ||
              !secondName ||
              !dateOfBirth ||
              !password ||
              !confirmPassword
            }
          >
            CONTINUE
          </button>
        </div>
      </form>
      <div>
        <LandscapeContainer />
      </div>
    </section>
  );
};

export default GetStarted;
