export default function ExpandablePassPanel({ title, children, isOpen, onToggle }) {
  return (
    <div>
      <h4 onClick={onToggle}>{title} {isOpen ? "▲" : "▼"}</h4>
      {isOpen && <div>{children}</div>}
    </div>
  );
}