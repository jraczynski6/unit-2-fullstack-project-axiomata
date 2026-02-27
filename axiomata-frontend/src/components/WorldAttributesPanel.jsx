import { useState, useEffect } from "react";

export default function WorldAttributesPanel({ attributes, editable = false, onChange }) {
  const [localAttributes, setLocalAttributes] = useState({});
  const [collapsed, setCollapsed] = useState(false);

  // ==========================
  // Parse incoming attributes safely
  // ==========================
  useEffect(() => {
    console.log("Incoming attributes prop:", attributes);

    if (!attributes) {
      setLocalAttributes({});
    } else if (typeof attributes === "string") {
      try {
        const parsed = JSON.parse(attributes);
        console.log("Parsed string attributes:", parsed);
        setLocalAttributes(parsed);
      } catch (err) {
        console.error("Failed to parse attributes:", err);
        setLocalAttributes({});
      }
    } else if (typeof attributes === "object") {
      console.log("Attributes are object:", attributes);
      setLocalAttributes(attributes);
    }
  }, [attributes]);

  // ==========================
  // Update a single attribute
  // ==========================
  const handleChange = (key, value) => {
    const updatedAttributes = { ...localAttributes, [key]: value };
    console.log("Updating attribute:", key, "to value:", value);
    console.log("Before update localAttributes:", localAttributes);
    setLocalAttributes(updatedAttributes);
    onChange?.(updatedAttributes);
    console.log("After update localAttributes:", updatedAttributes);
  };

  // ==========================
  // Add a new attribute
  // ==========================
  const handleAddAttribute = () => {
    const newKey = `attribute_${Object.keys(localAttributes).length + 1}`;
    const updatedAttributes = { ...localAttributes, [newKey]: "" };
    console.log("Adding new attribute:", newKey);
    setLocalAttributes(updatedAttributes);
    onChange?.(updatedAttributes);
    console.log("After add localAttributes:", updatedAttributes);
  };

  // ==========================
  // Remove an attribute
  // ==========================
  const handleRemoveAttribute = (key) => {
    const updatedAttributes = { ...localAttributes };
    delete updatedAttributes[key];
    console.log("Removing attribute:", key);
    setLocalAttributes(updatedAttributes);
    onChange?.(updatedAttributes);
    console.log("After remove localAttributes:", updatedAttributes);
  };

  // ==========================
  // Convert object to entries for display
  // ==========================
  const attributeEntries = Object.entries(localAttributes);

  // ==========================
  // Collapsible toggle
  // ==========================
  const toggleCollapse = () => setCollapsed(!collapsed);

  if (attributeEntries.length === 0) return <p className="world-attributes-empty">No attributes yet.</p>;

  return (
    <div className="world-attributes-panel">
      <button className="attribute-toggle" onClick={toggleCollapse}>
        {collapsed ? "Show Attributes" : "Hide Attributes"}
      </button>

      {!collapsed &&
        attributeEntries.map(([key, value]) => (
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

      {editable && !collapsed && (
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
// - Panel is collapsible to reduce clutter