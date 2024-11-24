import React from "react";
import "./deleteModel.css"; 

const Modal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal-content">
        <div style={{fontSize:"18px", color:"white"}}>{message}</div>
        <div className="delete-modal-actions">
          <button onClick={onClose} className="cancel-btn">
            Cancel
          </button>
          <button onClick={onConfirm} className="confirm-btn">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
