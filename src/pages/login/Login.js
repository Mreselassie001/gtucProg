import React, { useState, useEffect } from "react";
import { auth, provider } from "../../firebase-config";
import { signInWithRedirect, getRedirectResult } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { Icon } from "@iconify/react";

const Login = ({ setIsAuth }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        setIsAuth(true);
        navigate("/");

        if (result && result.user) {
          // Save author's name and image to localStorage
          localStorage.setItem("isAuth", true);
          localStorage.setItem("authorName", result.user.displayName);
          localStorage.setItem("authorImage", result.user.photoURL);
        }
      } catch (error) {
        // Handle errors from the redirect result
        console.error("Redirect result error:", error);
      }
    };

    handleRedirectResult();
  }, [setIsAuth, navigate]);

  const signInWithGoogle = () => {
    signInWithRedirect(auth, provider);
  };

  return (
    <>
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
              <br /> <h2>Where Ideas Flourish. The Nexus of Imagination. </h2>
              <br />
              <div className="flex_buttons">
                <button
                  className="login-with-google-btn"
                  onClick={signInWithGoogle}
                >
                  Student Sign in
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
    </>
  );
};

export default Login;
