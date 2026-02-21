export default function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div>
      <p>{message || "Are you sure?"}</p>
      <button onClick={onConfirm}>Confirm</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
}