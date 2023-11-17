import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css"; // Include the CSS file above

const AdminLogin = ({ setIsAdminAuth }) => {
  const navigate = useNavigate();
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  const adminData = [
    { name: "Admin 1", password: "password1" },
    { name: "Admin 2", password: "password2" },
  ];
 
  const handleAdminSelect = (admin) => {
    setSelectedAdmin(admin);
    setPasswordModalOpen(true);
  };

  const handleLogin = (password) => {
    if (selectedAdmin) {
      const admin = adminData.find((admin) => admin.name === selectedAdmin);
      if (admin && password === admin.password) {
        // Correct password, set isAdminAuth to true
        localStorage.setItem("isAdminAuth", true);
        setIsAdminAuth(true);
        navigate("/AdminHome");
      } else {
        // Incorrect password
        alert("Incorrect password. Please try again.");
      }
    }
  };

  const closeModal = () => {
    setPasswordModalOpen(false);
    setSelectedAdmin(null);
  };

  return (
    <>
      {passwordModalOpen && (
        <div className="centered-container">
          <div className="centered-content">
            <div className="password-modal">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin(e.target.password.value);
                }}
              >
                <h2>Enter the password for {selectedAdmin}</h2>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                />
                <div className="flex">
                  <button
                    className="login-button"
                    type="submit"
                    disabled={isButtonClicked}
                  >
                    {isButtonClicked ? "Logging In..." : "Login"}
                  </button>
                  <button className="cancel-button" onClick={closeModal}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <div className="Admin-loginPage">
        <div className="bg">
          <div className="flex">
            <div className="Admin-thesis"></div>
            <h1>
              <b>
                GCTU<span>Prog</span>
              </b>{" "}
              Admin
            </h1>
            <div className="admin-buttons">
              {adminData.map((admin, index) => (
                <button
                  className=" admin-button"
                  key={index}
                  onClick={() => handleAdminSelect(admin.name)}
                  disabled={isButtonClicked}
                >
                  Admin {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;

{
  /* <p>Sign in with google</p> */
}
{
  /* <button id="btn-message" className="button-message">
              <div className="content-avatar">
                <div className="status-user"></div>
                <div className="avatar">
                  <svg
                    className="user-img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12,12.5c-3.04,0-5.5,1.73-5.5,3.5s2.46,3.5,5.5,3.5,5.5-1.73,5.5-3.5-2.46-3.5-5.5-3.5Zm0-.5c1.66,0,3-1.34,3-3s-1.34-3-3-3-3,1.34-3,3,1.34,3,3,3Z"></path>
                  </svg>
                </div>
              </div>
              <div className="notice-content">
                <div className="username">Elikem Normegbor Selassie</div>
                <div className="lable-message">
                  Elikem<span className="number-message">3</span>
                </div>
                <div className="user-id"></div>
              </div>
            </button>
            <button id="btn-message" className="button-message">
              <div className="content-avatar">
                <div className="status-user"></div>
                <div className="avatar">
                  <svg
                    className="user-img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12,12.5c-3.04,0-5.5,1.73-5.5,3.5s2.46,3.5,5.5,3.5,5.5-1.73,5.5-3.5-2.46-3.5-5.5-3.5Zm0-.5c1.66,0,3-1.34,3-3s-1.34-3-3-3-3,1.34-3,3,1.34,3,3,3Z"></path>
                  </svg>
                </div>
              </div>
              <div className="notice-content">
                <div className="username">Jessica Sanders</div>
                <div className="lable-message">
                  Message<span className="number-message">3</span>
                </div>
                <div className="user-id">Elikem</div>
              </div>
            </button> */
}
{
  /* <a href=""><h7>admin</h7></a> */
}
{
  /* <button
              className="login-with-google-btn"
              onClick={signInWithGoogle}
              disabled={isButtonClicked}
            >
              {isButtonClicked ? "Signing In..." : "Guest"}
            </button> */
}
