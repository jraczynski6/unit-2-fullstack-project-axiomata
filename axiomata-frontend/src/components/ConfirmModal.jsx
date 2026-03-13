import { createPortal } from "react-dom";
import "../assets/css/add-entity-modal.css";

export default function ConfirmModal({ open, message, onConfirm, onCancel }) {
  if (!open) return null;

  return createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message || "Are you sure?"}</p>

        <div className="modal-actions">
          <button type="button" onClick={onConfirm}>Confirm</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>,
    document.body
  );
}