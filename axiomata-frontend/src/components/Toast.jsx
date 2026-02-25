export default function Toast({ message, type }) {
  return (
    <div>
      <p>{type ? `${type}: ` : ""}{message || "Notification"}</p>
    </div>
  );
}