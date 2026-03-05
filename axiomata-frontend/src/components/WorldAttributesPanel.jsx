import { useState, useEffect, useRef } from "react";

// --------------------- Helpers ---------------------
export const normalizeKey = (key) =>
  key
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

export const denormalizeKey = (str) =>
  str.trim().replace(/\s+/g, "_").toUpperCase();

// --------------------- WorldAttributesPanel ---------------------
export default function WorldAttributesPanel({
  attributes,
  editable = false,
  onChange,
  onValidationChange,
}) {
  const [localAttributes, setLocalAttributes] = useState({});
  const [collapsed, setCollapsed] = useState(false);
  const idMapRef = useRef({}); // stable IDs for top-level

  // ----------------- Initialize -----------------
  useEffect(() => {
    const mapped = {};
    Object.entries(attributes || {}).forEach(([k, v]) => {
      const id = idMapRef.current[k] || `attr_${Object.keys(idMapRef.current).length + 1}`;
      idMapRef.current[k] = id;
      mapped[id] = { key: k, value: v };
    });
    setLocalAttributes(mapped);
    validateAttributes(mapped);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributes]);

  // ----------------- Validation -----------------
  const validateAttributes = (attrs) => {
    const errors = {};
    Object.values(attrs).forEach(({ key, value }) => {
      if (!key?.trim() || (typeof value !== "object" && String(value)?.trim() === "")) {
        errors[key] = "Key and Value required";
      }
    });
    onValidationChange?.(errors);
  };

  // ----------------- Trigger Change -----------------
  const triggerChange = (updated) => {
    setLocalAttributes(updated);
    const flat = {};
    Object.values(updated).forEach(({ key, value }) => (flat[key] = value));
    onChange?.(flat);
    validateAttributes(updated);
  };

  // ----------------- Key / Value Handlers -----------------
  const handleChangeKey = (id, newTempKey) => {
    setLocalAttributes((prev) => ({
      ...prev,
      [id]: { ...prev[id], tempKey: newTempKey } // only tempKey updates
    }));
  };

  const handleKeyBlur = (id) => {
    setLocalAttributes((prev) => {
      const attr = prev[id];
      if (!attr) return prev;
      const newKey = attr.tempKey?.trim();
      if (!newKey || newKey === attr.key) {
        // discard tempKey if empty or unchanged
        return { ...prev, [id]: { ...attr, tempKey: undefined } };
      }

      // commit new key
      const updated = { ...prev, [id]: { key: denormalizeKey(newKey), value: attr.value } };
      triggerChange(updated);
      return updated;
    });
  };

  const updateValue = (id, newValue) => {
    setLocalAttributes((prev) => {
      const attr = prev[id];
      if (!attr || typeof attr.value === "object") return prev; // nested maps not editable
      const updated = { ...prev, [id]: { ...attr, value: newValue } };
      triggerChange(updated);
      return updated;
    });
  };

  const addAttribute = () => {
    const id = `attr_${Date.now()}`;
    const newKey = `ATTRIBUTE_${Object.keys(localAttributes).length + 1}`;
    triggerChange({ ...localAttributes, [id]: { key: newKey, value: "" } });
  };

  const removeAttribute = (id) => {
    const updated = { ...localAttributes };
    delete updated[id];
    triggerChange(updated);
  };

  // ----------------- Render Nested Read-Only Panel -----------------
  const renderNestedPanel = (title, obj) => (
    <div className="nested-readonly-panel">
      <h4>{normalizeKey(title)}</h4>
      {Object.entries(obj).map(([k, v]) => (
        <div key={`${title}_${k}`} className="attribute-row">
          <span className="attribute-key">{normalizeKey(k)}:</span>
          <span className="attribute-value">
            {typeof v === "string"
              ? v.charAt(0).toUpperCase() + v.slice(1)
              : "[Object]"}
          </span>
        </div>
      ))}
    </div>
  );

  if (!attributes || Object.keys(localAttributes).length === 0)
    return <p className="attributes-empty">No attributes yet.</p>;

  return (
    <div className="attributes-panel">
      <button
        className="attribute-toggle-btn"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? "Show Attributes" : "Hide Attributes"}
      </button>

      {!collapsed && (
        <>
          {/* Nested read-only panels */}
          {attributes["RESOURCE_POOL"] &&
            renderNestedPanel("Resource Pool", attributes["RESOURCE_POOL"])}
          {attributes["SPECIES_POOL"] &&
            renderNestedPanel("Species Pool", attributes["SPECIES_POOL"])}

          {/* Editable primitives */}
          {Object.entries(localAttributes)
            .filter(
              ([, attr]) =>
                !["RESOURCE_POOL", "SPECIES_POOL"].includes(attr.key)
            )
            .map(([id, attr]) => (
              <div key={id} className="attribute-row">
                {editable ? (
                  <>
                    <input
                      className="attribute-key-input"
                      value={attr.tempKey ?? normalizeKey(attr.key)}
                      onChange={(e) => handleChangeKey(id, e.target.value)}
                      onBlur={() => handleKeyBlur(id)}
                    />
                    <input
                      className="attribute-value-input"
                      value={attr.value}
                      onChange={(e) => updateValue(id, e.target.value)}
                    />
                    <button
                      className="attribute-remove-btn"
                      onClick={() => removeAttribute(id)}
                    >
                      &times;
                    </button>
                    {(!attr.key?.trim() ||
                      String(attr.value)?.trim() === "") && (
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
            ))}

          {editable && (
            <button className="attribute-add-btn" onClick={addAttribute}>
              + Add Attribute
            </button>
          )}
        </>
      )}
    </div>
  );
}