// module imports
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// utilities import
import baseUrl from "../utilities/baseUrl";
import { saveUserDataToLocalStorage } from "../utilities/localStorageHandler";

// components import
import LandscapeContainer from "./LandscapeContainer";

// style import
import registerStyles from "../assets/css/register.module.css";

const Register = ({ firstName, secondName, dateOfBirth, age, password }) => {
  const [userName, setUserName] = useState("");
  const [errorHasOccured, setErrorHasOccured] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleRegisterUser = async (e) => {
    e.preventDefault();
    setIsRegistering(true);
    try {
      setErrorHasOccured(false);
      if (userName) {
        const response = await axios.post(`${baseUrl}/auth/register`, {
          user_name: userName,
          first_name: firstName,
          last_name: secondName,
          date_of_birth: dateOfBirth,
          age: age,
          password: password,
        });
        const { status, data } = response;
        if (status === 201) {
          const userData = {
            authToken: data.authToken,
            userName: data.user.user_name,
          };
          const userStringifyData = JSON.stringify(userData);
          saveUserDataToLocalStorage(userStringifyData);
          navigate("/dashboard");
        }
      }
    } catch (error) {
      console.log(error);
      setErrorHasOccured(true);
      if (error.response) {
        if (error.response.status === 400) {
          setErrorText(
            "To create an account please enter a unique username this username already exists in the database"
          );
        }
      } else if (error.request) {
        console.error(`No response received:, ${error.request}`);
        setErrorText(
          "An Unexpected Error Occurred Probably a network network, Please Try Again"
        );
      } else {
        console.error(`Error:, ${error.message}`);
        setErrorText("An Unexpected Has Error Occured");
      }
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <section className={registerStyles.registerContainer}>
      <div className={registerStyles.inputCompleteIndicatorContainer}>
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
      <form>
        <input
          className={errorHasOccured ? registerStyles.inputError : ""}
          onChange={(e) => {
            setUserName(e.target.value);
          }}
          value={userName}
          type="text"
          placeholder="USERNAME"
        />
        <div>
          {errorHasOccured && <p>{errorText}</p>}
          <button
            disabled={!userName || isRegistering}
            onClick={handleRegisterUser}
          >
            {isRegistering ? "Registering...." : "CREATE AN ACCOUNT"}
          </button>
        </div>
      </form>

      <div>
        <LandscapeContainer />
      </div>
    </section>
  );
};

export default Register;
