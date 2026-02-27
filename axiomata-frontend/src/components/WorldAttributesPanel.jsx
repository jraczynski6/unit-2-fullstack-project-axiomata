import { useState, useEffect } from "react";
import Spinner from "./ui/Spinner";

export default function WorldAttributesPanel({ world, editable = false, onChange }) {
  const [openPanels, setOpenPanels] = useState({});
  const [attributes, setAttributes] = useState({});

  // ---------------- Initialize attributes ----------------
  useEffect(() => {
    if (!world) return;
    try {
      const parsed = world.attributes ? JSON.parse(world.attributes) : {};
      setAttributes(parsed);
    } catch (err) {
      console.error("Failed to parse world.attributes:", err);
      setAttributes({});
    }
  }, [world]);

  // ---------------- Toggle collapsible ----------------
  const togglePanel = (key) =>
    setOpenPanels((prev) => ({ ...prev, [key]: !prev[key] }));

  // ---------------- Handle editable changes ----------------
  const handleAttributeChange = (key, value) => {
    setAttributes((prev) => {
      const updated = { ...prev, [key]: value };
      onChange?.(updated); // notify parent
      return updated;
    });
  };

  if (!world) return <Spinner />;

  const attributeKeys = Object.keys(attributes);
  if (attributeKeys.length === 0) return <p className="no-attributes">No world attributes yet.</p>;

  return (
    <div className="world-attributes-panel">
      {attributeKeys.map((key) => (
        <div key={key} className="attribute-card">
          <div
            className="attribute-header"
            onClick={() => togglePanel(key)}
          >
            {key} <span className="toggle-indicator">{openPanels[key] ? "▲" : "▼"}</span>
          </div>
          {openPanels[key] && (
            <div className="attribute-content">
              {editable ? (
                <input
                  type="text"
                  value={attributes[key]}
                  onChange={(e) => handleAttributeChange(key, e.target.value)}
                  className="attribute-input"
                />
              ) : (
                <span className="attribute-value">{attributes[key]}</span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
// TODO: WorldAttributesPanel
// - Display each attribute as key/value
// - Support inline editing in editable mode
// - Update parent world state via onChange
// - Graceful empty state (e.g., "No attributes yet")
// - Plan for future grid layout / styling