import { useState, useEffect, useRef } from "react";

// --------------------- Helper ---------------------
// SCREAMING_SNAKE_CASE → Title Case with spaces
export const normalizeKey = (key) =>
  key
    .toLowerCase()
    .replace(/_/g, " ") // underscores → spaces
    .replace(/\b\w/g, (c) => c.toUpperCase()); // capitalize each word

export default function WorldAttributesPanel({
  attributes,
  editable = false,
  onChange,
  onValidationChange,
}) {
  const [localAttributes, setLocalAttributes] = useState({});
  const [collapsed, setCollapsed] = useState(false);
  const idMapRef = useRef({}); // stable IDs for keys

  // --------------------- Sync with props ---------------------
  useEffect(() => {
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

  // --------------------- Validation -------------------------
  const validateAttributes = (attrs) => {
    const errors = {};

    const checkValue = (value) => {
      if (typeof value === "string") return !value.trim() ? "Key and Value required" : null;
      if (typeof value === "object" && value !== null) {
        const nestedErrors = {};
        Object.entries(value).forEach(([k, v]) => {
          const err = checkValue(v);
          if (err) nestedErrors[k] = err;
        });
        return Object.keys(nestedErrors).length > 0 ? nestedErrors : null;
      }
      return null;
    };

    Object.entries(attrs).forEach(([id, attr]) => {
      const keyToCheck = attr.tempKey ?? attr.key;
      errors[keyToCheck] = checkValue(attr.value);
    });

    onValidationChange?.(errors);
  };

  // --------------------- Flatten for onChange ----------------
  const flattenAttributes = (attrs) => {
    const flat = {};
    Object.values(attrs).forEach((attr) => {
      flat[attr.key] = attr.value;
    });
    return flat;
  };

  // --------------------- Update value -----------------------
  const handleChangeValue = (id, value) => {
    const updatedAttributes = { ...localAttributes, [id]: { ...localAttributes[id], value } };
    setLocalAttributes(updatedAttributes);
    onChange?.(flattenAttributes(updatedAttributes));
    validateAttributes(updatedAttributes);
  };

  // --------------------- Update key -------------------------
  const handleChangeKey = (id, tempKey) => {
    const updatedAttributes = { ...localAttributes, [id]: { ...localAttributes[id], tempKey } };
    setLocalAttributes(updatedAttributes);
    validateAttributes(updatedAttributes);
  };

  const handleKeyBlur = (id) => {
    const attr = localAttributes[id];
    const newKey = attr.tempKey?.trim();
    if (!newKey || newKey === attr.key) {
      setLocalAttributes((prev) => ({ ...prev, [id]: { ...prev[id], tempKey: undefined } }));
      return;
    }
    const updatedAttributes = { ...localAttributes, [id]: { key: newKey, value: attr.value } };
    idMapRef.current[newKey] = id;
    setLocalAttributes(updatedAttributes);
    onChange?.(flattenAttributes(updatedAttributes));
    validateAttributes(updatedAttributes);
  };

  // --------------------- Add/Remove attribute ----------------
  const handleAddAttribute = () => {
    const id = `attr_${Date.now()}`;
    const newKey = `attribute_${Object.keys(localAttributes).length + 1}`;
    const updatedAttributes = { ...localAttributes, [id]: { key: newKey, value: "" } };
    setLocalAttributes(updatedAttributes);
    onChange?.(flattenAttributes(updatedAttributes));
    validateAttributes(updatedAttributes);
  };

  const handleRemoveAttribute = (id) => {
    const updatedAttributes = { ...localAttributes };
    delete updatedAttributes[id];
    setLocalAttributes(updatedAttributes);
    onChange?.(flattenAttributes(updatedAttributes));
    validateAttributes(updatedAttributes);
  };

  // --------------------- Render nested attributes recursively ----------------
  const renderAttribute = (attr, id) => {
    if (typeof attr.value === "object" && attr.value !== null) {
      return (
        <div key={id} className="attribute-nested">
          <span className="attribute-key">{normalizeKey(attr.tempKey ?? attr.key)}:</span>
          <div className="nested-attributes">
            {Object.entries(attr.value).map(([subKey, subValue]) =>
              renderAttribute({ key: subKey, value: subValue }, `${id}_${subKey}`)
            )}
          </div>
        </div>
      );
    }

    return (
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
            {(!attr.key?.trim() || !String(attr.value)?.trim()) && (
              <span className="error-text">Key and Value required</span>
            )}
          </>
        ) : (
          <>
            <span className="attribute-key">{normalizeKey(attr.key)}:</span>
            <span className="attribute-value">{attr.value}</span>
          </>
        )}
      </div>
    );
  };

  // --------------------- Display -----------------------------
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
        attributeEntries.map(([id, attr]) => renderAttribute(attr, id))}

      {editable && !collapsed && (
        <button className="attribute-add" onClick={handleAddAttribute}>
          + Add Attribute
        </button>
      )}
    </div>
  );
}