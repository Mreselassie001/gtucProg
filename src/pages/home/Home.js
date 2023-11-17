import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import { Link } from "react-router-dom";
import { db } from "../../firebase-config";
import "./home.css";
// import { deleteObject, ref } from "firebase/storage";
import { Icon } from "@iconify/react";
import "react-circular-progressbar/dist/styles.css";

const Home = ({ isAuth, searchTerm, setSearchTerm, setSearchText }) => {
  const [projectList, setProjectLists] = useState([]);
  const [online, setOnline] = useState(navigator.onLine);

  const projectCollectionRef = collection(db, "project");

  useEffect(() => {
    const getProject = async () => {
      const data = await getDocs(projectCollectionRef);
      setProjectLists(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getProject();
  }, []);

  const filteredProjects = projectList.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.supervisor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.projectText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.selectedCourse.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log("searchTerm:", searchTerm); // Add this console log
  console.log("filteredProjects:", filteredProjects);

  useEffect(() => {
    // Check for internet connectivity
    const handleOnlineStatusChange = () => {
      setOnline(navigator.onLine);
    };

    window.addEventListener("online", handleOnlineStatusChange);
    window.addEventListener("offline", handleOnlineStatusChange);

    return () => {
      window.removeEventListener("online", handleOnlineStatusChange);
      window.removeEventListener("offline", handleOnlineStatusChange);
    };
  }, []);

  if (!online) {
    return (
      <div className="loaderContainer">
        <div className="NoProject"></div>
        <h1>No Project</h1>
      </div>
    );
  }

  if (projectList.length === 0) {
    return (
      <div className="loaderContainer">
        <div className="loader"></div>
      </div>
    );
  }

  if (filteredProjects.length === 0) {
    return (
      <div className="loaderContainer">
        <div className="NoProject"></div>
        <h1>No Project</h1>
      </div>
    );
  }

  return (
    <div className="home">
      <h1>Course Filter</h1>
      <div className="filter">
        <div className="container">
          <button
            className="card"
            onClick={(e) => {
              e.preventDefault();
              setSearchTerm("BSc. Telecommunications Engineering");
              setSearchText("BSc. Telecommunications Engineering");
            }}
          >
            BSc. Telecommunications Engineering
          </button>

          <button
            className="card"
            onClick={(e) => {
              e.preventDefault();
              setSearchTerm("BSc. Computer Engineering");
              setSearchText("BSc. Computer Engineering");
            }}
          >
            BSc. Computer Engineering
          </button>

          <button
            className="card"
            onClick={(e) => {
              e.preventDefault();
              setSearchTerm("BS Mathematics");
              setSearchText("BS Mathematics");
            }}
          >
            BS Mathematics
          </button>

          <button
            className="card"
            onClick={(e) => {
              e.preventDefault();
              setSearchTerm("BSc. Electrical and Electronic Engineering");
              setSearchText("BSc. Electrical and Electronic Engineering");
            }}
          >
            BSc. Electrical and Electronic Engineering
          </button>

          <button
            className="card"
            onClick={(e) => {
              e.preventDefault();
              setSearchTerm("Diploma in Telecommunications Engineering");
              setSearchText("Diploma in Telecommunications Engineering");
            }}
          >
            Diploma in Telecommunications Engineering
          </button>

          <button
            className="card"
            onClick={(e) => {
              e.preventDefault();
              setSearchTerm("Diploma in Information Technology");
              setSearchText("Diploma in Information Technology");
            }}
          >
            Diploma in Information Technology
          </button>

          <button
            className="card"
            onClick={(e) => {
              e.preventDefault();
              setSearchTerm("BSc. Mobile Computing");
              setSearchText("BSc. Mobile Computing");
            }}
          >
            BSc. Mobile Computing
          </button>

          <button
            className="card"
            onClick={(e) => {
              e.preventDefault();
              setSearchTerm("BSc. Computer Science");
              setSearchText("BSc. Computer Science");
            }}
          >
            BSc. Computer Science
          </button>

          <button
            className="card"
            onClick={(e) => {
              e.preventDefault();
              setSearchTerm("BSc. Software Engineering");
              setSearchText("BSc. Software Engineering");
            }}
          >
            BSc. Software Engineering
          </button>

          <button
            className="card"
            onClick={(e) => {
              e.preventDefault();
              setSearchTerm("BSc. Information Systems");
              setSearchText("BSc. Information Systems");
            }}
          >
            BSc. Information Systems
          </button>

          <button
            className="card"
            onClick={(e) => {
              e.preventDefault();
              setSearchTerm("BSc. Data Science and Analytics");
              setSearchText("BSc. Data Science and Analytics");
            }}
          >
            BSc. Data Science and Analytics
          </button>

          <button
            className="card"
            onClick={(e) => {
              e.preventDefault();
              setSearchTerm("Diploma in Data Science and Analytics");
              setSearchText("Diploma in Data Science and Analytics");
            }}
          >
            Diploma in Data Science and Analytics
          </button>

          <button
            className="card"
            onClick={(e) => {
              e.preventDefault();
              setSearchTerm("Diploma in Information Technology");
              setSearchText("Diploma in Information Technology");
            }}
          >
            Diploma in Information Technology
          </button>

          <button
            className="card"
            onClick={(e) => {
              e.preventDefault();
              setSearchTerm("Diploma in Cyber Security");
              setSearchText("Diploma in Cyber Security");
            }}
          >
            Diploma in Cyber Security
          </button>

          <button
            className="card"
            onClick={(e) => {
              e.preventDefault();
              setSearchTerm("Diploma in Computer Science");
              setSearchText("Diploma in Computer Science");
            }}
          >
            Diploma in Computer Science
          </button>

          <button
            className="card"
            onClick={(e) => {
              e.preventDefault();
              setSearchTerm("Diploma in Multimedia Technology");
              setSearchText("Diploma in Multimedia Technology");
            }}
          >
            Diploma in Multimedia Technology
          </button>

          <button
            className="card"
            onClick={(e) => {
              e.preventDefault();
              setSearchTerm("Diploma in Web Application Development");
              setSearchText("Diploma in Web Application Development");
            }}
          >
            Diploma in Web Application Development
          </button>

          <button
            className="card"
            onClick={(e) => {
              e.preventDefault();
              setSearchTerm("Business School");
              setSearchText("Business School");
            }}
          >
            Business School
          </button>

          <button
            className="card"
            onClick={(e) => {
              e.preventDefault();
              setSearchTerm("BSc. Accounting with Computing");
              setSearchText("BSc. Accounting with Computing");
            }}
          >
            BSc. Accounting with Computing
          </button>

          <button
            className="card"
            onClick={(e) => {
              e.preventDefault();
              setSearchTerm("BSc. Economics");
              setSearchText("BSc. Economics");
            }}
          >
            BSc. Economics
          </button>

          <button
            className="card"
            onClick={(e) => {
              e.preventDefault();
              setSearchTerm("BSc. Procurement and Logistics");
              setSearchText("BSc. Procurement and Logistics");
            }}
          >
            BSc. Procurement and Logistics
          </button>

          <button
            className="card"
            onClick={(e) => {
              e.preventDefault();
              setSearchTerm("BSc. Banking and Finance");
              setSearchText("BSc. Banking and Finance");
            }}
          >
            BSc. Banking and Finance
          </button>

          <button
            className="card"
            onClick={(e) => {
              e.preventDefault();
              setSearchTerm("BSc. Business Administration");
              setSearchText("BSc. Business Administration");
            }}
          >
            BSc. Business Administration
          </button>

          <button
            className="card"
            onClick={(e) => {
              e.preventDefault();
              setSearchTerm("Diploma in Public Relations");
              setSearchText("Diploma in Public Relations");
            }}
          >
            Diploma in Public Relations
          </button>

          <button
            className="card"
            onClick={(e) => {
              e.preventDefault();
              setSearchTerm("Diploma in Management");
              setSearchText("Diploma in Management");
            }}
          >
            Diploma in Management
          </button>

          <button
            className="card"
            onClick={(e) => {
              e.preventDefault();
              setSearchTerm("Diploma in Accounting");
              setSearchText("Diploma in Accounting");
            }}
          >
            Diploma in Accounting
          </button>

          <button
            className="card"
            onClick={(e) => {
              e.preventDefault();
              setSearchTerm("Diploma in Marketing");
              setSearchText("Diploma in Marketing");
            }}
          >
            Diploma in Marketing
          </button>
        </div>
      </div>

      <>
        <h1>Project list ({filteredProjects.length})</h1>
        <div className="homePage">
          {filteredProjects.map((project) => (
            <div className="project" key={project.id}>
              <Link to={`/project/${project.id}`}>
                <div className="projectHeader">
                  <div className="title">
                    <h2 className="">{project.title}</h2>
                  </div>
                </div>
                <div className="topDetails">
                  <h6>by {project.studentName}</h6>
                  <h6>{project.year}</h6>
                </div>
                <div className="projectTextContainer">
                  {project.projectText}
                </div>
              </Link>
              <div className="buttomDetails">
                <div className="supervisor-tag">
                  <Icon
                    icon="material-symbols:supervisor-account"
                    className="Icon"
                  />
                  <h3> {project.supervisor}</h3>
                </div>
                <br />
                <>
                  <div className="grade">
                    <CircularProgressbar
                      value={project.projectGrade}
                      text={`${project.projectGrade}`}
                      strokeWidth={10}
                      styles={{
                        root: { width: "auto", height: "auto",marginTop:"10px" },
                        path: { stroke: `var(--clr, #535484)` },
                        trail: { stroke: "transparent" },
                        text: {
                          fill: `var(--clr, #003147)`,
                          fontSize: "40px", // Adjust the font size
                        },
                      }}
                    />
                  </div>
                </>
              </div>
            </div>
          ))}
        </div>
      </>
    </div>
  );
};

// const deleteProject = async (project) => {
//   if (project.fileRef) {
//     const fileRef = ref(storage, project.fileRef);
//     await deleteObject(fileRef);
//   }

//   const projectDoc = doc(db, "project", project.id);
//   await deleteDoc(projectDoc);

//   // Update the projectList state to remove the deleted project
//   setProjectLists((prevProjectLists) =>
//     prevProjectLists.filter((p) => p.id !== project.id)
//   );
// };
export default Home;
