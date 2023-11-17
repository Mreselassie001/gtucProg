import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { auth, db } from "../../firebase-config";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
} from "firebase/storage";
import { Icon } from "@iconify/react";
import "./project.css";
import { useCopyToClipboard } from "usehooks-ts";

const Project = ({ projectCollectionRef }) => {
  const Navigate = useNavigate();
  const location = useLocation();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeletingModal, setShowDeletingModal] = useState(false);
  const [showDeletedModal, setShowDeletedModal] = useState(false);
  const [isChecked, setIsChecked] = useState(false); // State for the checkbox
  const [value, copy] = useCopyToClipboard();
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [isAuth] = useState(localStorage.getItem("isAuth"));
  const [isAdminAuth] = useState(localStorage.getItem("isAdminAuth"));
  const storage = getStorage();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectDocRef = doc(db, "project", projectId);
        const projectDocSnap = await getDoc(projectDocRef);

        if (projectDocSnap.exists()) {
          const projectData = projectDocSnap.data();
          setProject({ ...projectData, id: projectDocSnap.id });

          // Check if the current user's UID is in the `checkedBy` array
          if (isAuth && auth.currentUser.uid) {
            setIsChecked(projectData.checkedBy.includes(auth.currentUser.uid));
          }
        } else {
          console.log("Project not found");
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };

    fetchProject();
  }, [projectId, projectCollectionRef, isAuth]);

  const toggleCheckbox = async () => {
    const projectDocRef = doc(db, "project", projectId);

    if (isAuth && auth.currentUser.uid) {
      try {
        const projectDocSnap = await getDoc(projectDocRef);

        if (projectDocSnap.exists()) {
          const projectData = projectDocSnap.data();
          let updatedCheckedBy = projectData.checkedBy || [];

          // Toggle the current user's UID in the `checkedBy` array
          if (isChecked) {
            updatedCheckedBy = updatedCheckedBy.filter(
              (uid) => uid !== auth.currentUser.uid
            );
          } else {
            updatedCheckedBy.push(auth.currentUser.uid);
          }

          await updateDoc(projectDocRef, { checkedBy: updatedCheckedBy });
          setIsChecked(!isChecked);
        }
      } catch (error) {
        console.error("Error toggling checkbox:", error);
      }
    }
  };

  if (!project) {
    return (
      <div className="loaderContainer">
        <div className="loader"></div>
      </div>
    );
  }

  const handleDownload = async () => {
    try {
      const fileRef = ref(storage, project.fileRef);
      const downloadURL = await getDownloadURL(fileRef);

      const link = document.createElement("a");
      link.href = downloadURL;
      link.download = "filename";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error getting download URL:", error);
    }
  };
  const copyProjectDetails = () => {
    // Create a text string containing the project details and the current page URL
    const projectDetailsText = `${project.title}, ${project.studentName}, ${project.year}, GCTUProg,
${window.location.href}`;

    // Use the `copy` function from useCopyToClipboard to copy the text to the clipboard
    copy(projectDetailsText);
    alert("Reference copied to clipboard");
  };

  const showDeleteConfirmation = () => {
    setShowDeleteModal(true);
  };

  const hideDeleteConfirmation = () => {
    setShowDeleteModal(false);
  };

  const showDeletingMessage = () => {
    setShowDeletingModal(true);
  };

  const hideDeletingMessage = () => {
    setShowDeletingModal(false);
  };

  const showDeletedMessage = () => {
    setShowDeletedModal(true);
  };

  const hideDeletedMessage = () => {
    setShowDeletedModal(false);
  };

  const deleteProject = async () => {
    setIsDeleting(true);
    showDeletingMessage(); // Show the "deleting" modal

    if (project.fileRef) {
      const fileRef = ref(storage, project.fileRef);
      await deleteObject(fileRef);
    }

    const projectDoc = doc(db, "project", project.id);
    await deleteDoc(projectDoc);

    setIsDeleting(false);
    showDeletedMessage(); // Show the "Project deleted successfully" modal

    setTimeout(() => {
      hideDeletedMessage();
      hideDeleteConfirmation();
      // Redirect to the home page after a delay
      Navigate("/home");
    }, 2000); // Delay in milliseconds
  };
  const handleGoBack = () => {
    const previousPageURL = location.state && location.state.from;

    if (isAuth) {
      // If user is authenticated, navigate to the standard user home page
      Navigate("/home");
    } else if (isAdminAuth) {
      // If user is an admin, navigate to the admin home page
      Navigate("/AdminProjectList");
    } else if (previousPageURL === window.location.origin + "/createProject") {
      // If the previous URL is /createProject, navigate to the standard URL
      Navigate("/home");
    } else {
      // Navigate to the previous page's URL
      Navigate(previousPageURL || "/home");
    }
  };

  return (
    <div className="projectPage">
      <button className="navBtn" onClick={handleGoBack}>
        <Icon icon="ic:twotone-arrow-back-ios" /> Go back
      </button>
      <div className="project">
        {isAuth && (
          <div className="bookmark-check">
            <input
              id="checkboxInput"
              type="checkbox"
              checked={isChecked}
              onChange={toggleCheckbox}
            />
            <label htmlFor="checkboxInput" className="bookmark">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 384 512"
                className="svgIcon"
              >
                <path d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z"></path>
              </svg>
            </label>
          </div>
        )}
        <div className="projectHeader">
          <div className="title">
            <h1>{project.title}</h1>
          </div>
        </div>
        <div className="projectTextContainer">{project.projectText}</div>
        <table>
          <tbody>
            <tr>
              <td>Supervisor:</td>
              <td>{project.supervisor}</td>
            </tr>
            <tr>
              <td>Grade:</td>
              <td>{project.projectGrade}</td>
            </tr>
            <tr>
              <td>Year:</td>
              <td>{project.year}</td>
            </tr>
            <tr>
              <td>Course:</td>
              <td>{project.selectedCourse}</td>
            </tr>
            <tr>
              <td>By:</td>
              <td>{project.studentName}</td>
            </tr>
          </tbody>
        </table>
        <div className="reference">
          <p>
            {project.studentName}, {project.title}, {project.year}, GCTUProg,
            {window.location.href}`
          </p>
          <button className="downloadButton" onClick={copyProjectDetails}>
            <div className="copy">
              <Icon icon="solar:copy-line-duotone" />
            </div>{" "}
            Copy
          </button>
        </div>

        <div className="details-flex">
          {" "}
          <img className="profileimg" src={project.author.image} />{" "}
          <h3> {project.author.name}</h3>
        </div>

        <br />

        {isAuth && project.fileRef && (
          <div className="button-container">
            <button className="downloadButton" onClick={handleDownload}>
              <span className="button-content">View PDF</span>
            </button>

            {project.author.id === auth.currentUser.uid && (
              <button className="deleteButton" onClick={showDeleteConfirmation}>
                <span className="button-text"></span>
                <span className="animation">
                  <span className="paper-wrapper">
                    <span className="paper"></span>
                  </span>
                  <span className="shredded-wrapper">
                    <span className="shredded"></span>
                  </span>
                  <span className="lid"></span>
                  <span className="can">
                    <span className="filler"></span>
                  </span>
                </span>
              </button>
            )}
          </div>
        )}
      </div>

      {showDeleteModal && (
        <div className="delete-confirmation-modal">
          <div className="modal-content">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete this project?</p>
            <div className="modal-buttons">
              <button
                className="delete-confirm-button"
                onClick={() => {
                  deleteProject();
                  hideDeleteConfirmation();
                }}
              >
                Yes
              </button>
              <button
                className="delete-cancel-button"
                onClick={hideDeleteConfirmation}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeletingModal && (
        <div className="deleting-modal">
          <div className="modal-content">
            <h2>Deleting</h2>
            <div className="loader"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Project;
