import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../../firebase-config";
import {
  deleteObject,
  getStorage,
  ref,
} from "firebase/storage";
import "./adminProject.css";
import { Icon } from "@iconify/react";

const AdminProjectList = ({
  isAuth,
  searchTerm,
  setSearchTerm,
  setSearchText,
}) => {
  const [projectList, setProjectList] = useState([]);
  const [online, setOnline] = useState(navigator.onLine);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const storage = getStorage(); // Add this line to get the storage instance

  const projectCollectionRef = collection(db, "project");

  useEffect(() => {
    const getProject = async () => {
      const data = await getDocs(projectCollectionRef);
      setProjectList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getProject();
  });

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

  const deleteProject = async (projectId) => {
    try {
      const project = projectList.find((project) => project.id === projectId);

      if (project.fileRef) {
        const fileRef = ref(storage, project.fileRef);
        await deleteObject(fileRef);
      }

      const projectRef = doc(db, "project", projectId);
      await deleteDoc(projectRef);

      // Remove the deleted project from the list
      setProjectList((prevList) =>
        prevList.filter((project) => project.id !== projectId)
      );
    } catch (error) {
      console.error("Error deleting project:", error);
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
      {showDeleteConfirmation && (
        <div className="modalBackground">
          <div className="modalContainer">
            <div className="titleCloseBtn">
              <button onClick={() => setShowDeleteConfirmation(false)}>
                <Icon icon="mingcute:close-fill" />
              </button>
            </div>
            <div className="title">
              <h1>Are You Sure You Want to Delete?</h1>
            </div>

            <div className="footer">
              <button onClick={confirmDeleteProject}>Yes</button>
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                id="cancelBtn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <h1>Project list</h1>

      <div className="AdminPage">
        <div>
          <ul className="project-list">
            {filteredProjects.map((project) => (
              <li className="project" key={project.id}>
                <Link to={`/project/${project.id}`}>
                  <div className="Project-container">
                    <div className="projectHeader">
                      <div className="title">
                        <h2>{project.title}</h2>
                      </div>
                    </div>
                    <div className="details">
                      <table className="project-details">
                        <tbody>
                          <tr>
                            <td>By:</td>
                            <td>
                              <i>{project.studentName}</i>
                            </td>
                          </tr>
                          <tr>
                            <td>Supervisor: </td>
                            <td>
                              <i>{project.supervisor}</i>
                            </td>
                          </tr>
                          <tr>
                            <td>Year:</td>
                            <td>{project.year}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </Link>
                <div>
                  <div className="buttons">
                    <button className="edit-button" onClick={() => project.id}>
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => {
                        setProjectToDelete(project.id);
                        setShowDeleteConfirmation(true);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminProjectList;
