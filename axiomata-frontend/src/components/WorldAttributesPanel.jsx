import { useState, useEffect } from "react";

export default function WorldAttributesPanel({ attributes, editable = false, onChange, onValidationChange }) {
  const [localAttributes, setLocalAttributes] = useState({});
  const [collapsed, setCollapsed] = useState(false);

  // --------------------- Sync with props ---------------------
  useEffect(() => {
    setLocalAttributes(attributes || {});
    validateAttributes(attributes || {});
  }, [attributes]);

  // --------------------- Validate Attributes ---------------------
  const validateAttributes = (attrs) => {
    const errors = {};
    Object.entries(attrs).forEach(([key, value]) => {
      errors[key] = (!key || !value || !value.trim()) ? "Key and Value required" : null;
    });
    onValidationChange?.(errors);
  };

  // --------------------- Update a value ---------------------
  const handleChangeValue = (key, value) => {
    const updatedAttributes = { ...localAttributes, [key]: value };
    setLocalAttributes(updatedAttributes);
    onChange?.(updatedAttributes);
    validateAttributes(updatedAttributes);
  };

  // --------------------- Update a key ---------------------
  const handleChangeKey = (oldKey, newKey) => {
    if (!newKey || oldKey === newKey) return;

    const updatedAttributes = { ...localAttributes };
    updatedAttributes[newKey] = updatedAttributes[oldKey];
    delete updatedAttributes[oldKey];

    setLocalAttributes(updatedAttributes);
    onChange?.(updatedAttributes);
    validateAttributes(updatedAttributes);
  };

  // --------------------- Add a new attribute ---------------------
  const handleAddAttribute = () => {
    const newKey = `attribute_${Object.keys(localAttributes).length + 1}`;
    const updatedAttributes = { ...localAttributes, [newKey]: "" };
    setLocalAttributes(updatedAttributes);
    onChange?.(updatedAttributes);
    validateAttributes(updatedAttributes);
  };

  // --------------------- Remove an attribute ---------------------
  const handleRemoveAttribute = (key) => {
    const updatedAttributes = { ...localAttributes };
    delete updatedAttributes[key];
    setLocalAttributes(updatedAttributes);
    onChange?.(updatedAttributes);
    validateAttributes(updatedAttributes);
  };

  // --------------------- Display ---------------------
  const attributeEntries = Object.entries(localAttributes);
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
                <input
                  className="attribute-key"
                  value={key}
                  onChange={(e) => handleChangeKey(key, e.target.value)}
                  placeholder="Key"
                />
                <input
                  className="attribute-value"
                  value={value}
                  onChange={(e) => handleChangeValue(key, e.target.value)}
                  placeholder="Value"
                />
                {(!key || !value || !value.trim()) && (
                  <span className="error-text">Key & Value required</span>
                )}
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

// WorldAttributesPanel.jsx / TODO
// TODO: Add grid-based layout in future for multiple attributes


