import { Icon } from "@iconify/react";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { auth } from "./firebase-config";
import Bookmark from "./pages/bookmark/Bookmark";
import CreateProject from "./pages/createproject/CreateProject";
import AdminHome from "./pages/Admin/AdminHome/AdminHome";
import Home from "./pages/home/Home";
import AdminLogin from "./pages/login/AdminLogin";
import Login from "./pages/login/Login";
import Project from "./pages/project/Project";
import AdminProjectList from "./pages/Admin/AdminProjectList/AdminProjectList";
import { debounce } from "lodash";

function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));
  const [showNavigation, setShowNavigation] = useState(false);
  const [isAdminAuth, setIsAdminAuth] = useState(
    localStorage.getItem("isAdminAuth")
  );
  const [authorName, setAuthorName] = useState(
    localStorage.getItem("authorName")
  );
  const [authorImage, setAuthorImage] = useState(
    localStorage.getItem("authorImage")
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [searchText, setSearchText] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Step 2: Functions to show and hide the logout modal
  const showLogoutConfirmation = () => {
    setShowLogoutModal(true);
  };

  const hideLogoutModal = () => {
    setShowLogoutModal(false);
  };

  // Step 3: Function to handle user logout
  const handleLogout = () => {
    signUserOut(); // You should define this function to handle the actual logout.
  };

  const handleClearSearch = () => {
    // Check if the button click event is triggered
    setSearchText("");
    setSearchTerm("");
    // e.preventDefault();
  };
  useEffect(() => {
    // Function to clear the search term when "Escape" key is pressed
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleClearSearch();
      }
    };

    // Add event listener for the "keydown" event
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup function for removing event listener
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const signUserOut = () => {
    signOut(auth).then(() => {
      localStorage.clear();
      setIsAuth(false);
      setIsAdminAuth(false);
      window.location.pathname = "/login";
    });
  };

  // React state to manage 'active' className for sidebar Links
  const [activeLink, setActiveLink] = useState(null);

  // React state to manage the search form visibility

  // Function to toggle the sidebar

  // Function to handle search button click

  const handleThemeToggle = () => {
    const body = document.body;
    const toggler = document.getElementById("theme-toggle");
    const isDarkMode = toggler.checked;

    // Save the theme preference to localStorage
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");

    if (isDarkMode) {
      body.classList.add("dark");
    } else {
      body.classList.remove("dark");
    }
  };

  useEffect(() => {
    // Check the saved theme preference from localStorage
    const savedTheme = localStorage.getItem("theme");

    // Set the initial theme based on the saved preference
    if (savedTheme === "dark") {
      document.getElementById("theme-toggle").checked = true;
      document.body.classList.add("dark");
    } else {
      document.getElementById("theme-toggle").checked = false;
      document.body.classList.remove("dark");
    }

    // Rest of your useEffect code...
  }, []); // Only re-run when showSearchForm changes

  const toggleSidebar = debounce(() => {
    const sideBar = document.querySelector(".sidebar");
    sideBar.classList.toggle("close");
  }, 300); // Adjust the debounce time as needed

  useEffect(() => {
    const sideLinks = document.querySelectorAll(
      ".sidebar .side-menu li a:not(.logout)"
    );

    sideLinks.forEach((item) => {
      const li = item.parentElement;
      item.addEventListener("click", () => {
        sideLinks.forEach((i) => {
          i.parentElement.classList.remove("active");
        });
        li.classList.add("active");
        setActiveLink(item);
      });
    });

    const menuBar = document.querySelector(".content nav .bx.bx-menu");
    const searchBtn = document.querySelector(
      ".content nav form .form-input button"
    );

    menuBar.addEventListener("click", toggleSidebar);

    const toggler = document.getElementById("theme-toggle");
    toggler.addEventListener("change", handleThemeToggle);

    return () => {
      menuBar.removeEventListener("click", toggleSidebar);
      toggler.removeEventListener("change", handleThemeToggle);
    };
  }, []);
  //--------------------------------------------------
  //------------------------------------------------

 

  return (
    <Router>
      <>
        <div className="sidebar close">
          <div className="logo">
            <img src="GCTULogo.png" alt="" className="bx bx-code-alt" />
            <div className="logo-name">
              <span>GCTU</span>Prog
            </div>
          </div>
          <ul className="side-menu">
            {!isAdminAuth && (
              <li className={activeLink === "/" ? "active" : ""}>
                <Link to="/">
                  <i className="bx bx-analyse">
                    <Icon icon="pepicons-pop:list" />
                  </i>
                  Project list
                </Link>
              </li>
            )}

            {isAuth && (
              <li className={activeLink === "bookmarks" ? "active" : ""}>
                <Link to="/Bookmark">
                  <i className="bx bx-analyse">
                    <Icon icon="material-symbols:bookmark" />
                  </i>
                  Bookmarks
                </Link>
              </li>
            )}

            {isAuth && (
              <li className={activeLink === "createProject" ? "active" : ""}>
                <Link to="/createProject">
                  <i className="bx bx-cog">
                    <Icon icon="mingcute:upload-fill" />
                  </i>
                  Upload
                </Link>
              </li>
            )}

            {isAdminAuth && (
              <>
                <li
                  className={activeLink === "AdminProjectList" ? "active" : ""}
                >
                  <Link to="/AdminHome">
                    <i className="bx bx-analyse">
                      <Icon icon="majesticons:home" />{" "}
                    </i>
                    Home
                  </Link>
                </li>
                <li className={activeLink === "AdminHome" ? "active" : ""}>
                  <Link to="/AdminProjectList">
                    <i className="bx bx-analyse">
                      <Icon icon="typcn:th-list" />{" "}
                    </i>
                    Project List
                  </Link>
                </li>
              </>
            )}
          </ul>

          <ul className="side-menu">
            {isAuth || isAdminAuth ? (
              <li>
                <Link onClick={showLogoutConfirmation} className="logout">
                  <i id="logouticon" className="bx bx-analyse">
                    <Icon icon="ri:logout-circle-line" />
                  </i>
                  Logout
                </Link>
              </li>
            ) : (
              <li>
                <Link to="/" onClick={signUserOut} className="logout">
                  <i className="bx bx-log-out-circle">
                    <Icon icon="teenyicons:home-solid" />{" "}
                  </i>
                  Home
                </Link>
              </li>
            )}
          </ul>

          <div className="side-menu-bottom">
            <ul className="side-menu">
              <li>
                <input type="checkbox" id="theme-toggle" />
                <label htmlFor="theme-toggle" className="theme-toggle"></label>
              </li>
            </ul>
            <ul className="side-menu">
              {isAuth && (
                <li className="userProfile">
                  <a href="/Bookmark">
                    <img className="profileImg" src={authorImage} alt="User " />
                    <div className="name-flex">
                      {" "}
                      <h4>{authorName}</h4>
                    </div>
                  </a>
                </li>
              )}
            </ul>
          </div>
          {/* Step 4: Create the logout confirmation modal */}
          {showLogoutModal && (
            <div className="modal">
              <div className="modal-content">
                <h2>Logout Confirmation</h2>
                <p>Are you sure you want to log out?</p>
                <div className="modal-buttons">
                  <button id="logout" onClick={handleLogout}>
                    Yes
                  </button>
                  <button onClick={hideLogoutModal}>No</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
      <>
        <div className="content">
          <nav>
            <button className="bx bx-menu">
              <Icon icon="mingcute:menu-fill" />
            </button>
            
              <form action="#">
                <div className="form-input">
                  <input
                    placeholder="search.."
                    name="text"
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />

                  <button
                    className="search-btn"
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault(); // Prevent the default form submission
                      setSearchTerm(searchText);
                    }}
                  >
                    <i className="bx bx-search">
                      <Icon icon="iconamoon:search-bold" />
                    </i>
                  </button>
                  {searchText && (
                    <button
                      className="clearButton"
                      onClick={(e) => {
                        e.preventDefault();
                        handleClearSearch();
                      }}
                    >
                      <i className="bx bx-search">
                        <Icon icon="ep:close-bold" />
                      </i>
                    </button>
                  )}
                </div>
              </form>
            

            <input type="checkbox" id="theme-toggle" hidden />
          </nav>
        </div>
      </>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              isAuth={isAuth}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              setSearchText={setSearchText}
              authorName={authorName} // Pass authorName as a prop
              authorImage={authorImage} // Pass authorImage as a prop
            />
          }
        />
        <Route
          path="/AdminHome"
          element={
            <AdminHome
              isAuth={isAuth}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              setSearchText={setSearchText}
              authorName={authorName} // Pass authorName as a prop
              authorImage={authorImage} // Pass authorImage as a prop
            />
          }
        />
        <Route
          path="/AdminProjectList"
          element={
            <AdminProjectList
              isAuth={isAuth}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              setSearchText={setSearchText}
              authorName={authorName} // Pass authorName as a prop
              authorImage={authorImage} // Pass authorImage as a prop
            />
          }
        />

        <Route
          path="/createProject"
          element={
            <CreateProject
              isAuth={isAuth}
              authorName={authorName} // Pass authorName as a prop
              authorImage={authorImage} // Pass authorImage as a prop
            />
          }
        />
        <Route
          path="/Bookmark"
          element={
            <Bookmark
              isAuth={isAuth}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              setSearchText={setSearchText}
              authorName={authorName} // Pass authorName as a prop
              authorImage={authorImage} // Pass authorImage as a prop
            />
          }
        />
        <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
        <Route
          path="/Admin"
          element={<AdminLogin setIsAdminAuth={setIsAdminAuth} />}
        />

        <Route
          path="/project/:projectId"
          element={
            <Project
              setIsAuth={setIsAuth}
              setIsAdminAuth={setIsAdminAuth}
              authorName={authorName} // Pass authorName as a prop
              authorImage={authorImage} // Pass authorImage as a prop
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
