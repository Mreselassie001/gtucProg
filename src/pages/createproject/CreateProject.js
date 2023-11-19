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
  <label className="custom-file-upload">
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

  const handleAgreeSubmit = async () => {
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
    if (!isAuth) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="createProjectPage">
      <div className="cpContainer">
        <h1>Submit a Project</h1>
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
            } else {
              // Show the form-incomplete modal
              setIsFormIncompleteModalOpen(true);
            }
          }}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="uploading">
              <div className="progress-bar-container">
                <progress
                  className="progress-bar"
                  value={uploadProgress}
                  max="100"
                  style={{
                    "--clr": "#003147",
                  }}
                />
              </div>
            </div>
          ) : (
            "Submit Project"
          )}
        </button>
        {/* Form-incomplete modal */}
      <FormIncompleteModal
        isOpen={isFormIncompleteModalOpen}
        onClose={() => setIsFormIncompleteModalOpen(false)}
      />
      </div>
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
              <button onClick={handleAgreeSubmit}>I Agree</button>
              <button id="cancelBtn" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateProject;
