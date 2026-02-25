export default function SectionPanel({ title, children, isOpen, onToggle }) {
  return (
    <div>
      <div onClick={onToggle}>
        <span>{isOpen ? "▼" : "►"}</span>
        <h4>{title || "Section Panel"}</h4>
      </div>

      {isOpen && <div>{children}</div>}
    </div>
  );
}