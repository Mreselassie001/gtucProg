import React, { useState, useEffect } from "react";
import { addDoc, collection, updateDoc, doc } from "firebase/firestore";
import { db, auth } from "../../firebase-config";
import { useNavigate } from "react-router-dom";
import { storage } from "../../firebase-config";
import { ref, uploadBytesResumable } from "firebase/storage";
import { v4 } from "uuid";
import "./createproject.css";
import { courseOptions, supervisorOptions } from "./Options.js";

const FileUploadInput = ({ onFileSelect }) => (
  <label class="custum-file-upload" for="file">
    <div class="icon">
      <svg xmlns="http://www.w3.org/2000/svg" fill="" viewBox="0 0 24 24">
        <g stroke-width="0" id="SVGRepo_bgCarrier"></g>
        <g
          stroke-linejoin="round"
          stroke-linecap="round"
          id="SVGRepo_tracerCarrier"
        ></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            fill=""
            d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z"
            clip-rule="evenodd"
            fill-rule="evenodd"
          ></path>{" "}
        </g>
      </svg>
    </div>
    <div class="Text">
      <span>Click to upload image</span>
    </div>
    <input
      type="file"
      onChange={(event) => {
        onFileSelect(event.target.files[0]);
      }}
    />
  </label>
);

const FormIncompleteModal = ({ isOpen, onClose }) => {
  return isOpen ? (
    <div className="form-incomplete-modal">
      <div className="modal-container">
        <h5 className="modal-text">
          Please fill in all required fields before submitting.
        </h5>
        <button className="modal-Button" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  ) : null;
};

const CreateProject = ({ isAuth }) => {
  const [title, setTitle] = useState("");
  const [projectText, setProjectText] = useState("");
  const [projectGrade, setProjectGrade] = useState("");
  const [supervisor, setSupervisor] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [studentName, setStudentName] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [fileUpload, setFileUpload] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [Checked, setChecked] = useState(false);
  const [agreedToSubmit, setAgreedToSubmit] = useState(false);
  const [isFormComplete, setIsFormComplete] = useState(true); // State to check form completion
  const navigate = useNavigate();
  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
  };

  const handleSupervisorChange = (event) => {
    setSupervisor(event.target.value);
  };

  const [isFormIncompleteModalOpen, setIsFormIncompleteModalOpen] =
    useState(false);

  const handleCreateProject = async () => {
    if (!validateForm()) {
      setIsFormIncompleteModalOpen(true);

      return;
    }

    setIsSubmitting(true);
  };
  const [showButtons, setShowButtons] = useState(true);

  const handleAgreeSubmit = async () => {
    // Update state to hide buttons and show "Submitting..."
    setShowButtons(false);
    const projectId = await createProject();
    if (projectId) {
      await uploadFile(projectId);
      setShowModal(false);
      setAgreedToSubmit(true);
      // Navigate to the newly created project's details page
      navigate(`/project/${projectId}`);
    }
  };

  const validateForm = () => {
    if (
      title.trim() === "" ||
      projectText.trim() === "" ||
      projectGrade.trim() === "" ||
      supervisor === "" ||
      selectedCourse === "" ||
      studentName.trim() === ""
    ) {
      // Set the form completion state to false
      setIsFormComplete(false);
      return false;
    }
    // Set the form completion state to true
    setIsFormComplete(true);

    return true;
  };

  const createProject = async () => {
    try {
      const projectRef = await addDoc(collection(db, "project"), {
        title,
        projectText,
        projectGrade,
        supervisor,
        studentName,
        year,
        Checked,
        selectedCourse,
        author: {
          name: auth.currentUser.displayName,
          id: auth.currentUser.uid,
          image: auth.currentUser.photoURL,
          email: auth.currentUser.email,
        },
      });
      return projectRef.id;
    } catch (error) {
      console.error("Error creating project:", error);
      return null;
    }
  };

  const uploadFile = async (projectId) => {
    if (!fileUpload) return;

    const fileRef = ref(storage, `files/${fileUpload.name + v4()}`);
    const uploadTask = uploadBytesResumable(fileRef, fileUpload);

    setChecked(false);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Error uploading file:", error);
      },
      async () => {
        await updateDoc(doc(db, "project", projectId), {
          fileRef: fileRef.fullPath,
        });
      }
    );
  };

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuth) {
      navigate("/login");
    }
  }, [isAuth, navigate]);

  return (
    <div className="createProjectPage">
      <div className="cpContainer">
        <h1>Upload Project</h1>
        <form>
          <label htmlFor="course">Select your Course:</label>
          <select
            id="course"
            name="course"
            value={selectedCourse}
            onChange={handleCourseChange}
            required
          >
            <option value="">Select a course...</option>
            {courseOptions.map((course, index) => (
              <option key={index} value={course}>
                {course}
              </option>
            ))}
          </select>

          <label>Title</label>
          <br />
          <input
            placeholder="title.."
            onChange={(event) => {
              setTitle(event.target.value);
            }}
            required
          />

          <label>Abstract</label>
          <textarea
            placeholder="paste abstract here.."
            onChange={(event) => {
              setProjectText(event.target.value);
            }}
            required
          ></textarea>

          <div className="flex">
            <div className="flexInput">
              <label>Grade</label>
              <input
                type="number"
                placeholder="grade.."
                min="1"
                max="100"
                onChange={(event) => {
                  setProjectGrade(event.target.value);
                }}
                required
              />
            </div>
            <div className="flexInput">
              <label>Year</label>
              <input
                type="text"
                placeholder={new Date().getFullYear()}
                pattern="\d{4}"
                maxLength="4"
                onChange={(event) => {
                  const value = event.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                  setYear(value);
                }}
                required
              />
            </div>
          </div>

          <label>Student</label>
          <input
            type="text"
            placeholder="student 1 & student 2"
            onChange={(event) => {
              setStudentName(event.target.value);
            }}
            required
          ></input>

          <label>Supervisor</label>
          <select
            id="supervisor"
            name="supervisor"
            value={supervisor}
            onChange={handleSupervisorChange}
            required
          >
            <option value="">Select a supervisor...</option>
            {supervisorOptions.map((supervisor, index) => (
              <option key={index} value={supervisor}>
                {supervisor}
              </option>
            ))}
          </select>

          <FileUploadInput className="file" onFileSelect={setFileUpload} />
          <br />
          <br />
          <br />
        </form>
        <button
          className={`downloadButton ${isSubmitting ? "disabled" : ""}`}
          onClick={() => {
            // Check form completion before showing the modal
            if (validateForm()) {
              setShowModal(true);
              // handleCreateProject()
            } else {
              // Show the form-incomplete modal
              setIsFormIncompleteModalOpen(true);
            }
          }}
          disabled={isSubmitting}
        >
          Submit
        </button>
        {/* Form-incomplete modal */}
      </div>
      <FormIncompleteModal
        isOpen={isFormIncompleteModalOpen}
        onClose={() => setIsFormIncompleteModalOpen(false)}
      />
      {showModal && !agreedToSubmit && (
        <div className="CPmodalBackground">
          <div className="CPmodalContainer">
            <div className="title">
              <h1>Project Submission Agreement</h1>
            </div>
            <div className="body">
              <p className="text">
                By submitting your project or documentation, you confirm
                ownership and grant the platform permission to share it within
                the community. You agree to the accuracy and authenticity of
                your work, acknowledging the public accessibility. While
                retaining removal rights, it's crucial to align with
                collaborators, adhere to guidelines, and accept that the process
                may take time.
                <br />
                <br />
                Proceed only if you agree; contact us with any queries.
                Non-agreement implies refraining from submission. For questions
                or concerns, reach out to administrators before clicking
                "Submit."
              </p>
            </div>
            <div className="footer">
              {showButtons ? (
                <>
                  <button onClick={handleAgreeSubmit}>I Agree</button>
                  <button id="cancelBtn" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                </>
              ) : (
                <p>Submitting...</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateProject;
