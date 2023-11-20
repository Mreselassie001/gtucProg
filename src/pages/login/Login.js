import React, { useState } from "react";
import { auth, provider } from "../../firebase-config";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { Icon } from "@iconify/react";

const Login = ({ setIsAuth }) => {
  const navigate = useNavigate();
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const signInWithGoogle = async () => {
    if (isButtonClicked) return;
 
    try {
      setIsButtonClicked(true);

      const result = await signInWithPopup(auth, provider);
      const { displayName, photoURL } = result.user;

      // Save user information to localStorage
      localStorage.setItem("isAuth", true);
      localStorage.setItem("authorName", displayName);
      localStorage.setItem("authorImage", photoURL);

      setIsAuth(true);
      navigate("/");
    } catch (error) {
      // Handle Errors here.

      // Handle network error
      console.error("Network error:", error);
    } finally {
      setIsButtonClicked(false);
    }
  };

  return (
    <div className="loginPage">
      <div className="bg">
        <div className="flex-container">
          <div>
            <h1>
              Welcome to{" "}
              <b>
                GCTU<span>Prog</span>
              </b>
            </h1>
            <br />
            <h2>Where Ideas Flourish. The Nexus of Imagination. </h2>
            <br />
            <div className="flex_buttons">
              <button
                className="login-with-google-btn"
                onClick={signInWithGoogle}
                disabled={isButtonClicked}
              >
                {isButtonClicked ? "Signing In..." : "Student Sign in"}
              </button>
            </div>
          </div>
          <div className="flex ">
            <div className="thesis"></div>
            <a className="admin" href="Admin">
              <Icon icon="eos-icons:admin" />
              <h4>Admin</h4>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
