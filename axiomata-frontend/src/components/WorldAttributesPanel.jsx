import { useState, useEffect, useRef } from "react";

export default function WorldAttributesPanel({
  attributes,
  editable = false,
  onChange,
  onValidationChange,
}) {
  // Internal state with stable IDs
  // Each attribute: { key, value, tempKey? }
  const [localAttributes, setLocalAttributes] = useState({}); // { id: { key, value, tempKey } }
  const [collapsed, setCollapsed] = useState(false);
  const idMapRef = useRef({}); // maps original keys → stable IDs

  // --------------------- Sync with props ---------------------
  useEffect(() => {
    // Convert { key: value } → { id: { key, value } }
    const mapped = {};
    Object.entries(attributes || {}).forEach(([k, v]) => {
      let id = idMapRef.current[k];
      if (!id) {
        id = `attr_${Object.keys(idMapRef.current).length + 1}`;
        idMapRef.current[k] = id;
      }
      mapped[id] = { key: k, value: v };
    });
    setLocalAttributes(mapped);
    validateAttributes(mapped);
  }, [attributes]);

  // -------------- Validate Attributes ------------------
  const validateAttributes = (attrs) => {
    const errors = {};
    Object.entries(attrs).forEach(([id, attr]) => {
      const keyToCheck = attr.tempKey ?? attr.key;
      errors[keyToCheck] =
        !keyToCheck?.trim() || !attr.value?.trim()
          ? "Key and Value required"
          : null;
    });
    onValidationChange?.(errors);
  };

  // --------------------- Helpers to flatten -----------------
  const flattenAttributes = (attrs) => {
    const flat = {};
    Object.values(attrs).forEach((attr) => {
      const keyToUse = attr.key;
      if (keyToUse) flat[keyToUse] = attr.value;
    });
    return flat;
  };

  // --------------------- Update value ---------------------
  const handleChangeValue = (id, value) => {
    const updatedAttributes = {
      ...localAttributes,
      [id]: { ...localAttributes[id], value },
    };
    setLocalAttributes(updatedAttributes);
    onChange?.(flattenAttributes(updatedAttributes));
    validateAttributes(updatedAttributes);
  };

  // --------------------- Update key -----------------------
  // Use tempKey to allow smooth editing
  const handleChangeKey = (id, tempKey) => {
    const updatedAttributes = {
      ...localAttributes,
      [id]: { ...localAttributes[id], tempKey },
    };
    setLocalAttributes(updatedAttributes);
    validateAttributes(updatedAttributes);
  };

  const handleKeyBlur = (id) => {
    const attr = localAttributes[id];
    const newKey = attr.tempKey?.trim();
    if (!newKey || newKey === attr.key) {
      // discard tempKey if empty or unchanged
      setLocalAttributes((prev) => ({
        ...prev,
        [id]: { ...prev[id], tempKey: undefined },
      }));
      return;
    }

    const updatedAttributes = {
      ...localAttributes,
      [id]: { key: newKey, value: attr.value },
    };

    // Update idMapRef so future syncs keep the same ID
    idMapRef.current[newKey] = id;

    setLocalAttributes(updatedAttributes);
    onChange?.(flattenAttributes(updatedAttributes));
    validateAttributes(updatedAttributes);
  };

  // --------------------- Add attribute --------------------
  const handleAddAttribute = () => {
    const id = `attr_${Date.now()}`;
    const newKey = `attribute_${Object.keys(localAttributes).length + 1}`;
    const updatedAttributes = {
      ...localAttributes,
      [id]: { key: newKey, value: "" },
    };
    setLocalAttributes(updatedAttributes);
    onChange?.(flattenAttributes(updatedAttributes));
    validateAttributes(updatedAttributes);
  };

  // --------------------- Remove attribute -----------------
  const handleRemoveAttribute = (id) => {
    const updatedAttributes = { ...localAttributes };
    delete updatedAttributes[id];
    setLocalAttributes(updatedAttributes);
    onChange?.(flattenAttributes(updatedAttributes));
    validateAttributes(updatedAttributes);
  };

  // --------------------- Display -------------------------
  const toggleCollapse = () => setCollapsed(!collapsed);

  const attributeEntries = Object.entries(localAttributes);
  if (attributeEntries.length === 0)
    return <p className="world-attributes-empty">No attributes yet.</p>;

  return (
    <div className="world-attributes-panel">
      <button className="attribute-toggle" onClick={toggleCollapse}>
        {collapsed ? "Show Attributes" : "Hide Attributes"}
      </button>

      {!collapsed &&
        attributeEntries.map(([id, attr]) => (
          <div key={id} className="attribute-row">
            {editable ? (
              <>
                <input
                  className="attribute-key"
                  value={attr.tempKey ?? attr.key}
                  onChange={(e) => handleChangeKey(id, e.target.value)}
                  onBlur={() => handleKeyBlur(id)}
                />
                <input
                  className="attribute-value"
                  value={attr.value}
                  onChange={(e) => handleChangeValue(id, e.target.value)}
                  placeholder="Value"
                />
                <button onClick={() => handleRemoveAttribute(id)}>&times;</button>
                {(!attr.key?.trim() || !attr.value?.trim()) && (
                  <span className="error-text">Key and Value required</span>
                )}
              </>
            ) : (
              <>
                <span className="attribute-key">{attr.key}:</span>
                <span className="attribute-value">{attr.value}</span>
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