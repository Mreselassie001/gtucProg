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
    setIsButtonClicked(false)
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

