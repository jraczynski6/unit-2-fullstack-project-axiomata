export default function ConfirmModal({ open, message, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <p>{message || "Are you sure?"}</p>
        <div className="modal-actions">
          <button type="button" onClick={onConfirm}>Confirm</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}