import { Icon } from "@iconify/react";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import "react-circular-progressbar/dist/styles.css";
import { db } from "../../../firebase-config";
import "./adminhome.css";

const CourseModal = ({ selectedCourse, projectList, closeCourseModal }) => {
  // Filter topics with the same course
  const filteredTopics = projectList.filter(
    (project) => project.selectedCourse === selectedCourse
  );
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        // Call the closeCourseModal function when the Escape key is pressed
        closeCourseModal();
      }
    };

    // Add an event listener to the document for the "keydown" event
    document.addEventListener("keydown", handleEscapeKey);

    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="closeModal" onClick={closeCourseModal}>
          <Icon icon="fa:close" />
        </button>
        <h2>Topics with {selectedCourse} Course</h2>
        <table>
          <thead>
            <tr>
              <th>Topic</th>
            </tr>
          </thead>
          <tbody>
            {filteredTopics.map((topic) => (
              <tr key={topic.id}>
                <td>{topic.title}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminHome = ({ isAuth, searchTerm, setSearchTerm, setSearchText }) => {
  const [projectList, setProjectList] = useState([]);
  const [online, setOnline] = useState(navigator.onLine);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  // Define state for the selected course and modal visibility
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCourseModal, setShowCourseModal] = useState(false);

  // Function to handle clicks on insights
  const handleInsightClick = (course) => {
    setSelectedCourse(course);
    setShowCourseModal(true);
  };
  const closeCourseModal = () => {
    setShowCourseModal(false);
  };

  const projectCollectionRef = collection(db, "project");

  useEffect(() => {
    const getProject = async () => {
      const data = await getDocs(projectCollectionRef);
      setProjectList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getProject();
  }, []);

  const deleteProject = async (projectId) => {
    try {
      const projectRef = doc(db, "project", projectId);
      await deleteDoc(projectRef);
      setProjectList((prevList) =>
        prevList.filter((project) => project.id !== projectId)
      );
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const filteredProjects = projectList.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.supervisor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.projectText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.selectedCourse.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
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

  const confirmDeleteProject = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete);
      setProjectToDelete(null);
      setShowDeleteConfirmation(false);
    }
  };

  if (!online) {
    return (
      <div className="loaderContainer">
        <div className="NoProject"></div>
        <h1>No Project</h1>
      </div>
    );
  }

  if (filteredProjects.length === 0) {
    return (
      <div className="loaderContainer">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="home">
      <ul className="insights">
        <li onClick={() => handleInsightClick("")}>
          {" "}
          <i className="bx bx-show-alt">
            <h3>{filteredProjects.length}</h3>
          </i>
          <span className="info">
            <p>{/*number of projects with project.year*/}</p>
            <p>Available Projects</p>
          </span>
        </li>

        <li
          onClick={() =>
            handleInsightClick("BSc. Telecommunications Engineering")
          }
        >
          <i
            className="bx bx-calendar-check"
            onClick={() =>
              handleInsightClick("BSc. Telecommunications Engineering")
            }
          >
            <h3>
              {
                filteredProjects.filter(
                  (project) =>
                    project.selectedCourse ===
                    "BSc. Telecommunications Engineering"
                ).length
              }
            </h3>
          </i>
          <span className="info">
            <p>BSc. Telecommunications Engineering</p>
          </span>
        </li>

        <li onClick={() => handleInsightClick("BSc. Computer Engineering")}>
          <i className="bx bx-calendar-check">
            <h3>
              {
                filteredProjects.filter(
                  (project) =>
                    project.selectedCourse === "BSc. Computer Engineering"
                ).length
              }
            </h3>
          </i>
          <span className="info">
            <p>BSc. Computer Engineering</p>
          </span>
        </li>

        <li
          onClick={() =>
            handleInsightClick("BSc. Telecommunications Engineering")
          }
        >
          <i className="bx bx-calendar-check">
            <h3>
              {
                filteredProjects.filter(
                  (project) =>
                    project.selectedCourse ===
                    "BSc. Telecommunications Engineering"
                ).length
              }
            </h3>
          </i>
          <span className="info">
            <p>BSc. Telecommunications Engineering Projects</p>
          </span>
        </li>

        <li onClick={() => handleInsightClick("BS Mathematics")}>
          <i className="bx bx-calendar-check">
            <h3>
              {
                filteredProjects.filter(
                  (project) => project.selectedCourse === "BS Mathematics"
                ).length
              }
            </h3>
          </i>
          <span className="info">
            <p>BS Mathematics</p>
          </span>
        </li>

        <li
          onClick={() =>
            handleInsightClick("BSc. Electrical and Electronic Engineering")
          }
        >
          <i className="bx bx-calendar-check">
            <h3>
              {
                filteredProjects.filter(
                  (project) =>
                    project.selectedCourse ===
                    "BSc. Electrical and Electronic Engineering"
                ).length
              }
            </h3>
          </i>
          <span className="info">
            <p>BSc. Electrical and Electronic Engineering Projects</p>
          </span>
        </li>

        <li
          onClick={() =>
            handleInsightClick("Diploma in Telecommunications Engineering")
          }
        >
          <i className="bx bx-calendar-check">
            <h3>
              {
                filteredProjects.filter(
                  (project) =>
                    project.selectedCourse ===
                    "Diploma in Telecommunications Engineering"
                ).length
              }
            </h3>
          </i>
          <span className="info">
            <p>Diploma in Telecommunications Engineering Projects</p>
          </span>
        </li>

        <li
          onClick={() =>
            handleInsightClick("Diploma in Information Technology")
          }
        >
          <i className="bx bx-calendar-check">
            <h3>
              {
                filteredProjects.filter(
                  (project) =>
                    project.selectedCourse ===
                    "Diploma in Information Technology"
                ).length
              }
            </h3>
          </i>
          <span className="info">
            <p>Diploma in Information Technology Projects</p>
          </span>
        </li>

        <li
          onClick={() => handleInsightClick("BSc. Mobile Computing Projects")}
        >
          <i className="bx bx-calendar-check">
            <h3>
              {
                filteredProjects.filter(
                  (project) =>
                    project.selectedCourse === "BSc. Mobile Computing"
                ).length
              }
            </h3>
          </i>
          <span className="info">
            <p>BSc. Mobile Computing Projects</p>
          </span>
        </li>

        <li onClick={() => handleInsightClick("BSc. Software Engineering")}>
          <i className="bx bx-calendar-check">
            <h3>
              {
                filteredProjects.filter(
                  (project) =>
                    project.selectedCourse === "BSc. Software Engineering"
                ).length
              }
            </h3>
          </i>
          <span className="info">
            <p>BSc. Software Engineering</p>
          </span>
        </li>
        <li onClick={() => handleInsightClick("BSc. Information Systems")}>
          <i className="bx bx-calendar-check">
            <h3>
              {
                filteredProjects.filter(
                  (project) =>
                    project.selectedCourse === "BSc. Information Systems"
                ).length
              }
            </h3>
          </i>
          <span className="info">
            <p>BSc. Information Systems</p>
          </span>
        </li>
        <li
          onClick={() => handleInsightClick("BSc. Data Science and Analytics")}
        >
          <i className="bx bx-calendar-check">
            <h3>
              {
                filteredProjects.filter(
                  (project) =>
                    project.selectedCourse === "BSc. Data Science and Analytics"
                ).length
              }
            </h3>
          </i>
          <span className="info">
            <p>BSc. Data Science and Analytics</p>
          </span>
        </li>
        <li
          onClick={() =>
            handleInsightClick("Diploma in Data Science and Analytics")
          }
        >
          <i className="bx bx-calendar-check">
            <h3>
              {
                filteredProjects.filter(
                  (project) =>
                    project.selectedCourse ===
                    "Diploma in Data Science and Analytics"
                ).length
              }
            </h3>
          </i>
          <span className="info">
            <p>Diploma in Data Science and Analytics</p>
          </span>
        </li>
        <li
          onClick={() =>
            handleInsightClick("Diploma in Information Technology")
          }
        >
          <i className="bx bx-calendar-check">
            <h3>
              {
                filteredProjects.filter(
                  (project) =>
                    project.selectedCourse ===
                    "Diploma in Information Technology"
                ).length
              }
            </h3>
          </i>
          <span className="info">
            <p>Diploma in Information Technology</p>
          </span>
        </li>
        <li onClick={() => handleInsightClick("Diploma in Cyber Security")}>
          <i className="bx bx-calendar-check">
            <h3>
              {
                filteredProjects.filter(
                  (project) =>
                    project.selectedCourse === "Diploma in Cyber Security"
                ).length
              }
            </h3>
          </i>
          <span className="info">
            <p>Diploma in Cyber Security</p>
          </span>
        </li>
        <li onClick={() => handleInsightClick("Diploma in Computer Science")}>
          <i className="bx bx-calendar-check">
            <h3>
              {
                filteredProjects.filter(
                  (project) =>
                    project.selectedCourse === "Diploma in Computer Science"
                ).length
              }
            </h3>
          </i>
          <span className="info">
            <p>Diploma in Computer Science</p>
          </span>
        </li>
        <li
          onClick={() => handleInsightClick("Diploma in Multimedia Technology")}
        >
          <i className="bx bx-calendar-check">
            <h3>
              {
                filteredProjects.filter(
                  (project) =>
                    project.selectedCourse ===
                    "Diploma in Multimedia Technology"
                ).length
              }
            </h3>
          </i>
          <span className="info">
            <p>Diploma in Multimedia Technology</p>
          </span>
        </li>
        <li
          onClick={() =>
            handleInsightClick("Diploma in Web Application Development")
          }
        >
          <i className="bx bx-calendar-check">
            <h3>
              {
                filteredProjects.filter(
                  (project) =>
                    project.selectedCourse ===
                    "Diploma in Web Application Development"
                ).length
              }
            </h3>
          </i>
          <span className="info">
            <p>Diploma in Web Application Development</p>
          </span>
        </li>
        <li onClick={() => handleInsightClick("Business School")}>
          <i className="bx bx-calendar-check">
            <h3>
              {
                filteredProjects.filter(
                  (project) => project.selectedCourse === "Business School"
                ).length
              }
            </h3>
          </i>
          <span className="info">
            <p>Business School</p>
          </span>
        </li>
        <li
          onClick={() => handleInsightClick("BSc. Accounting with Computing")}
        >
          <i className="bx bx-calendar-check">
            <h3>
              {
                filteredProjects.filter(
                  (project) =>
                    project.selectedCourse === "BSc. Accounting with Computing"
                ).length
              }
            </h3>
          </i>
          <span className="info">
            <p>BSc. Accounting with Computing</p>
          </span>
        </li>
        <li
          onClick={() => handleInsightClick("BSc. Procurement and Logistics")}
        >
          <i className="bx bx-calendar-check">
            <h3>
              {
                filteredProjects.filter(
                  (project) =>
                    project.selectedCourse === "BSc. Procurement and Logistics"
                ).length
              }
            </h3>
          </i>
          <span className="info">
            <p>BSc. Procurement and Logistics</p>
          </span>
        </li>
        <li onClick={() => handleInsightClick("BSc. Economics")}>
          <i className="bx bx-calendar-check">
            <h3>
              {
                filteredProjects.filter(
                  (project) => project.selectedCourse === "BSc. Economics"
                ).length
              }
            </h3>
          </i>
          <span className="info">
            <p>BSc. Economics</p>
          </span>
        </li>
        <li
          onClick={() => handleInsightClick("BSc. Procurement and Logistics")}
        >
          <i className="bx bx-calendar-check">
            <h3>
              {
                filteredProjects.filter(
                  (project) => project.selectedCourse === ""
                ).length
              }
            </h3>
          </i>
          <span className="info">
            <p>BSc. Procurement and Logistics</p>
          </span>
        </li>
        <li onClick={() => handleInsightClick("BSc. Banking and Finance")}>
          <i className="bx bx-calendar-check">
            <h3>
              {
                filteredProjects.filter(
                  (project) =>
                    project.selectedCourse === "BSc. Banking and Finance"
                ).length
              }
            </h3>
          </i>
          <span className="info">
            <p>BSc. Banking and Finance</p>
          </span>
        </li>
        <li onClick={() => handleInsightClick("BSc. Business Administration")}>
          <i className="bx bx-calendar-check">
            <h3>
              {
                filteredProjects.filter(
                  (project) =>
                    project.selectedCourse === "BSc. Business Administration"
                ).length
              }
            </h3>
          </i>
          <span className="info">
            <p>BSc. Business Administration</p>
          </span>
        </li>
        <li onClick={() => handleInsightClick("Diploma in Public Relations")}>
          <i className="bx bx-calendar-check">
            <h3>
              {
                filteredProjects.filter(
                  (project) =>
                    project.selectedCourse === "Diploma in Public Relations"
                ).length
              }
            </h3>
          </i>
          <span className="info">
            <p>Diploma in Public Relations</p>
          </span>
        </li>
        <li onClick={() => handleInsightClick("Diploma in Public Relations")}>
          <i className="bx bx-calendar-check">
            <h3>
              {
                filteredProjects.filter(
                  (project) => project.selectedCourse === ""
                ).length
              }
            </h3>
          </i>
          <span className="info">
            <p>Diploma in Public Relations</p>
          </span>
        </li>
        <li onClick={() => handleInsightClick("Diploma in Management")}>
          <i className="bx bx-calendar-check">
            <h3>
              {
                filteredProjects.filter(
                  (project) =>
                    project.selectedCourse === "Diploma in Management"
                ).length
              }
            </h3>
          </i>
          <span className="info">
            <p>Diploma in Management</p>
          </span>
        </li>
        <li onClick={() => handleInsightClick("Diploma in Accounting")}>
          <i className="bx bx-calendar-check">
            <h3>
              {
                filteredProjects.filter(
                  (project) =>
                    project.selectedCourse === "Diploma in Accounting"
                ).length
              }
            </h3>
          </i>
          <span className="info">
            <p>Diploma in Accounting</p>
          </span>
        </li>
        <li onClick={() => handleInsightClick("Diploma in Marketing")}>
          <i className="bx bx-calendar-check">
            <h3>
              {
                filteredProjects.filter(
                  (project) => project.selectedCourse === "Diploma in Marketing"
                ).length
              }
            </h3>
          </i>
          <span className="info">
            <p>Diploma in Marketing</p>
          </span>
        </li>
      </ul>
      {showCourseModal && (
        <CourseModal
          selectedCourse={selectedCourse}
          projectList={projectList}
          closeCourseModal={closeCourseModal}
        />
      )}
    </div>
  );
};

export default AdminHome;

//either i just make it that adn=min can only have two page that is the home page and the edit page
// no analytics charle
// just see number of projects
// delete project
// and edit
// if i get time then ill add the reported project
