import { useState, useEffect } from "react";

export default function WorldAttributesPanel({ attributes, editable = false, onChange }) {
  // Convert JSON string to object if necessary
  const [localAttributes, setLocalAttributes] = useState({});

  useEffect(() => {
    if (!attributes) {
      setLocalAttributes({});
    } else if (typeof attributes === "string") {
      try {
        setLocalAttributes(JSON.parse(attributes));
      } catch {
        setLocalAttributes({});
      }
    } else if (typeof attributes === "object") {
      setLocalAttributes(attributes);
    }
  }, [attributes]);

  // Handle updates to a single key
  const handleChange = (key, value) => {
    const updatedAttributes = { ...localAttributes, [key]: value };
    setLocalAttributes(updatedAttributes);
    onChange?.(updatedAttributes);
  };

  // Add a new attribute
  const handleAddAttribute = () => {
    const newKey = `attribute_${Object.keys(localAttributes).length + 1}`;
    const updatedAttributes = { ...localAttributes, [newKey]: "" };
    setLocalAttributes(updatedAttributes);
    onChange?.(updatedAttributes);
  };

  // Remove an attribute
  const handleRemoveAttribute = (key) => {
    const updatedAttributes = { ...localAttributes };
    delete updatedAttributes[key];
    setLocalAttributes(updatedAttributes);
    onChange?.(updatedAttributes);
  };

  // Convert object to entries for display
  const attributeEntries = Object.entries(localAttributes);

  if (attributeEntries.length === 0) return <p className="world-attributes-empty">No attributes yet.</p>;

  return (
    <div className="world-attributes-panel">
      {Object.entries(localAttributes).length === 0 && <p>No attributes yet.</p>}

      {Object.entries(localAttributes).map(([key, value]) => (
        <div key={key} className="attribute-row">
          {editable ? (
            <>
              <input className="attribute-key" value={key} disabled />
              <input
                className="attribute-value"
                value={value}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder="Value"
              />
              <button onClick={() => handleRemoveAttribute(key)}>&times;</button>
            </>
          ) : (
            <>
              <span className="attribute-key">{key}:</span>
              <span className="attribute-value">{value}</span>
            </>
          )}
        </div>
      ))}

      {editable && (
        <button className="attribute-add" onClick={handleAddAttribute}>
          + Add Attribute
        </button>
      )}
    </div>
  );
}

// ==========================
// WorldAttributesPanel.jsx / TODO
// ==========================
// - Add grid-based layout in future for multiple attributes
// - Style key/value inputs and add/remove buttons to match Axiomata theme
// - Integrate with FloatingControls Save button for backend persistence later