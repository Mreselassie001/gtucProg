import React, { useState } from "react";
import { auth, provider } from "../../firebase-config";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { Icon } from "@iconify/react";

const Login = ({ setIsAuth }) => {
  const navigate = useNavigate();
  const [isButtonClicked, setIsButtonClicked] = useState(false);

 const signInWithGoogle = async () => {
   try {
     const result = await signInWithPopup(auth, provider);
     // This gives you a Google Access Token. You can use it to access the Google API.
     const credential = GoogleAuthProvider.credentialFromResult(result);
     const token = credential.accessToken;
     // The signed-in user info.
     const user = result.user;

     // Save author's name and image to localStorage
     localStorage.setItem("isAuth", true);
     localStorage.setItem("authorName", user.displayName);
     localStorage.setItem("authorImage", user.photoURL);

     setIsAuth(true);
     navigate("/");
   } catch (error) {
     // Handle Errors here.
     const errorCode = error.code;
     const errorMessage = error.message;
     // The email of the user's account used.
     const email = error.email;
     // The AuthCredential type that was used.
     const credential = GoogleAuthProvider.credentialFromError(error);
     // Handle network error
     console.error("Network error:", error);
   }
 };


  return (
    <>
      <div className="loginPage">
        <div className="bg">
          <div className="flex-container">
            <div>
              <h1>Welcome to{" "}
                <b>
                  GCTU<span>Prog</span>
                </b>
              </h1>
              <br /> <h2>Where Ideas Flourish. The Nexus of Imagination. </h2>
              <br />
              <div className="flex_buttons">
                <button className="login-with-google-btn" onClick={signInWithGoogle} disabled={isButtonClicked}>
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
    </>
  );
};

export default Login;
