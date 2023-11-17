import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db, auth } from "../../firebase-config";
import { collection, getDocs, query, where } from "firebase/firestore";
import "./bookmark.css";
import { Icon } from "@iconify/react";
import "react-circular-progressbar/dist/styles.css";

const Bookmark = ({ searchTerm }) => {
  const [projectList, setProjectLists] = useState([]);
  const [online, setOnline] = useState(navigator.onLine);
  const currentUserUid = auth.currentUser.uid;

  useEffect(() => {
    const getProject = async () => {
      const projectsQuery = query(
        collection(db, "project"),
        where("checkedBy", "array-contains", currentUserUid)
      );

      const data = await getDocs(projectsQuery);
      setProjectLists(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getProject();
  }, [currentUserUid]);

  // Filter projects based on searchTerm
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
        <div className="NoProject"></div>
        <h1>No Bookmarked project</h1>
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
    <div className="bookmarkPageView">
      <h1>Bookmark list ({filteredProjects.length})</h1>
      <>
        <div className="bookmarkPage">
          {filteredProjects.map((project) => (
            <div className="project" key={project.id}>
              <Link to={`/project/${project.id}`}>
                <div className="projectHeader">
                  <div className="title">
                    <h2 className="">{project.title}</h2>
                  </div>
                </div>
                <div className="topDetails">
                  <div>
                    <h6>
                      <b>by</b> {project.studentName}
                    </h6>
                  </div>
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
              </div>
            </div>
          ))}
        </div>
      </>
    </div>
  );
};

export default Bookmark;
