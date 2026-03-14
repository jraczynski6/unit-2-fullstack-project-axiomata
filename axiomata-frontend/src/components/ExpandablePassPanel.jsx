import { useState } from "react";
import "../assets/css/Create-World-Page.css";

// --------------------- Helper ---------------------
// SCREAMING_SNAKE_CASE -> Title Case with spaces
export const normalizeKey = (key) =>
  key
    .toLowerCase()
    .replace(/_/g, " ") // underscores -> spaces
    .replace(/\b\w/g, (c) => c.toUpperCase()); // capitalize first letter of each word

// --------------------- ExpandablePassPanel ---------------------
export default function ExpandablePassPanel({ title, attributes, editable = true, onChange }) {
  const [localAttributes, setLocalAttributes] = useState(attributes || {});

  // ---------------- Update attribute ----------------
  const handleChange = (key, value) => {
    const updated = { ...localAttributes, [key]: value };
    setLocalAttributes(updated);
    onChange?.(updated);
  };

  // ---------------- Render attribute ----------------
  // Handles nested objects
  const renderAttribute = (key, value) => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return (
        <div className="nested-attributes">
          {Object.entries(value).map(([subKey, subValue]) => (
            <div key={subKey} className="attribute-row nested">
              <span className="attribute-key">{normalizeKey(subKey)}:</span>
              {editable ? (
                <input
                  value={subValue}
                  onChange={(e) =>
                    handleChange(key, { ...value, [subKey]: e.target.value })
                  }
                />
              ) : (
                <span className="attribute-value">{subValue}</span>
              )}
            </div>
          ))}
        </div>
      );
    }

    return editable ? (
      <input value={value} onChange={(e) => handleChange(key, e.target.value)} />
    ) : (
      <span className="attribute-value">{value}</span>
    );
  };

  // ---------------- Render Panel ----------------
  return (
    <div className="expandable-pass-panel">
      <h3>{title}</h3>
      <div className="attributes-list">
        {Object.entries(localAttributes).map(([key, value]) => (
          <div key={key} className="attribute-row">
            <span className="attribute-key">{normalizeKey(key)}:</span>
            {renderAttribute(key, value)}
          </div>
        ))}
        {Object.keys(localAttributes).length === 0 && <p>No attributes available.</p>}
      </div>
    </div>
  );
}