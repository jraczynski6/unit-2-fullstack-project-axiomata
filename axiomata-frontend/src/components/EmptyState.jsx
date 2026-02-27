export default function EmptyState({ message }) {
  return (
    <div>
      <p>{message || "Nothing here yet."}</p>
    </div>
  );
}