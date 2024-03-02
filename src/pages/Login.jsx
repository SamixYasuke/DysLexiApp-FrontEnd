// module imports
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// component import
import LandscapeContainer from "../components/LandscapeContainer";

// utility import
import {
  getUserDataFromLocalStorage,
  saveUserDataToLocalStorage,
} from "../utilities/localStorageHandler";
import baseUrl from "../utilities/baseUrl";

// style import
import loginStyles from "../assets/css/login.module.css";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorHasOccured, setErrorHasOccured] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [isLogging, setIsLogging] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (getUserDataFromLocalStorage()) {
      navigate("/dashboard");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLogging(true);
    try {
      setErrorHasOccured(false);
      if (userName && password) {
        const response = await axios.post(`${baseUrl}/auth/login`, {
          user_name: userName,
          password: password,
        });
        const { status, data } = response;
        if (status === 200) {
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
        if (error.response.status === 404) {
          setErrorText(
            `No account with user name ${userName} found, please recheck and try again`
          );
        } else if (error.response.status === 400) {
          setErrorText(`Incorrect Password!!`);
        }
      } else if (error.request) {
        console.error(`No response received:, ${error.request}`);
        setErrorText(
          "An Unexpected Error Occurred Probably a network network, Please Try Again"
        );
      } else {
        console.error(`Error:, ${error.message}`);
        setErrorText("An Unexpected Has Error Occured, couldn't log in");
      }
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <section className={loginStyles.loginContainer}>
      <form>
        <input
          onChange={(e) => {
            setUserName(e.target.value);
          }}
          value={userName}
          type="text"
          placeholder="USER NAME"
        />
        <input
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          value={password}
          type="text"
          placeholder="PASSWORD"
        />
        {errorHasOccured && (
          <p style={{ color: "red", width: "280px", textAlign: "center" }}>
            {errorText}
          </p>
        )}
        <div>
          <button
            onClick={handleLogin}
            disabled={!userName || !password || isLogging}
          >
            {isLogging ? "Logging" : "Login"}
          </button>
        </div>
      </form>
      <div>
        <LandscapeContainer />
      </div>
    </section>
  );
};

export default Login;
