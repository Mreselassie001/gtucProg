import React from "react";
import "./Modal.css";

function Modal({ isOpen, onCancel, onConfirm }) {
  if (!isOpen) {
    return null; // Don't render anything if the modal is closed
  }

  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn">
          <button onClick={onCancel}>X</button>
        </div>
        <div className="title">
          <h1>Are You Sure You Want to Delete?</h1>
        </div>

        <div className="footer">
          <button onClick={onCancel} id="cancelBtn">
            Cancel
          </button>
          <button onClick={onConfirm}>Yes</button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
