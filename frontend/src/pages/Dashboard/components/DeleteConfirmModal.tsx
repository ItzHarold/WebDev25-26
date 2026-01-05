import React from "react";
import "./DeleteConfirmModal.css";

interface DeleteConfirmModalProps {
  eventTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  eventTitle,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="delete-modal-overlay" onClick={onCancel}>
      <div className="delete-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Delete Event</h2>
        <p>Are you sure you want to delete <strong>"{eventTitle}"</strong>?</p>
        <p className="warning">This action cannot be undone.</p>
        <div className="delete-modal-actions">
          <button className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-delete-confirm" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
