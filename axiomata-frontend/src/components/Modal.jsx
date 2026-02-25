export default function Modal({ title, children, onClose }) {
  return (
    <div>
      <div>
        <h3>{title || "Modal"}</h3>
        <button onClick={onClose}>Close</button>
        <div>{children}</div>
      </div>
    </div>
  );
}