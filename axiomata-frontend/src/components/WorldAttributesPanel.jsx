import { useState, useEffect, useRef } from "react";
import '../assets/css/world-overview.css';

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
  const idMapRef = useRef({});

  // ----------------- Initialize -----------------
  useEffect(() => {
    if (!attributes) return;

    const mapped = {};
    Object.entries(attributes).forEach(([category, categoryObj]) => {
      Object.entries(categoryObj).forEach(([key, value]) => {
        const id =
          idMapRef.current[`${category}_${key}`] ||
          `attr_${Object.keys(idMapRef.current).length + 1}`;
        idMapRef.current[`${category}_${key}`] = id;
        mapped[id] = { category, key, value };
      });
    });

    setLocalAttributes(mapped);
    validateAttributes(mapped);
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
    const structured = {};

    Object.values(updated).forEach(({ category, key, value }) => {
      if (!structured[category]) structured[category] = {};
      structured[category][key] = value;
    });

    onChange?.(structured);
    validateAttributes(updated);
  };

  // ----------------- Handlers -----------------
  const handleChangeKey = (id, newTempKey) => {
    setLocalAttributes((prev) => ({
      ...prev,
      [id]: { ...prev[id], tempKey: newTempKey },
    }));
  };

  const handleKeyBlur = (id) => {
    setLocalAttributes((prev) => {
      const attr = prev[id];
      if (!attr) return prev;
      const newKey = attr.tempKey?.trim();
      if (!newKey || newKey === attr.key)
        return { ...prev, [id]: { ...attr, tempKey: undefined } };

      const updated = { ...prev, [id]: { ...attr, key: denormalizeKey(newKey), tempKey: undefined } };
      triggerChange(updated);
      return updated;
    });
  };

  const updateValue = (id, newValue) => {
    setLocalAttributes((prev) => {
      const attr = prev[id];
      if (!attr || typeof attr.value === "object") return prev;
      const updated = { ...prev, [id]: { ...attr, value: newValue } };
      triggerChange(updated);
      return updated;
    });
  };

  const addAttribute = () => {
    const id = `attr_${Date.now()}`;
    const newKey = `ATTRIBUTE_${Object.keys(localAttributes).length + 1}`;
    triggerChange({
      ...localAttributes,
      [id]: { category: "Misc", key: newKey, value: "" },
    });
  };

  const removeAttribute = (id) => {
    const updated = { ...localAttributes };
    delete updated[id];
    triggerChange(updated);
  };

  // ----------------- Nested Readonly Panel -----------------
  const renderNestedPanel = (title, obj) => (
    <div className="nested-readonly-panel" key={title}>
      <h4>{normalizeKey(title)}</h4>
      {Object.entries(obj).map(([k, v]) => (
        <div key={`${title}_${k}`} className="attribute-row">
          <span className="attribute-key">{normalizeKey(k)}:</span>
          <span className="attribute-value">
            {typeof v === "string" ? v.charAt(0).toUpperCase() + v.slice(1) : "[Object]"}
          </span>
        </div>
      ))}
    </div>
  );

  if (!attributes || Object.keys(localAttributes).length === 0)
    return <p className="attributes-empty">No attributes yet.</p>;

  // ----------------- Editable Cards -----------------
  const editableAttrs = Object.entries(localAttributes)
    .filter(([_, attr]) => !["RESOURCE_POOL", "SPECIES_POOL"].includes(attr.key));

  return (
    <div className="attributes-panel">
      <button className="attribute-toggle-btn" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? "Show Attributes" : "Hide Attributes"}
      </button>

      {!collapsed && (
        <>
          {/* Editable attributes as individual cards first */}
          {editableAttrs.map(([id, attr], idx) => (
            <div
              key={id}
              className={`editable-attribute-card ${editable ? "editing" : "readonly"}`}
              style={{ backgroundColor: idx % 2 === 0 ? "#FDF1D5" : "#F5E6C0" }}
            >
              {editable ? (
                <>
                  <div className="attribute-header">
                    <button
                      className="attribute-remove-btn"
                      onClick={() => removeAttribute(id)}
                    >
                      &times;
                    </button>
                  </div>
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
                  {(!attr.key?.trim() || String(attr.value)?.trim() === "") && (
                    <span className="error-text">Key and Value required</span>
                  )}
                </>
              ) : (
                <>
                  <div className="attribute-key">{normalizeKey(attr.key)}:</div>
                  <div className="attribute-value">{attr.value}</div>
                </>
              )}
            </div>
          ))}

          {attributes.Geological?.RESOURCE_POOL &&
            renderNestedPanel("Resource Pool", attributes.Geological.RESOURCE_POOL)}
          {attributes.Biological?.SPECIES_POOL &&
            renderNestedPanel("Species Pool", attributes.Biological.SPECIES_POOL)}

          {editable && editableAttrs.length > 0 && (
            <button className="attribute-add-btn" onClick={addAttribute}>
              + Add Attribute
            </button>
          )}
        </>
      )}
    </div>
  );
}