import { useState, useEffect } from "react";

// -------------------- EntityCard --------------------
export default function EntityCard({ item, category, world, isEditingProp, onChange }) {
  if (!item) return null;

  // ---------------- Edit Mode ----------------
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    if (typeof isEditingProp === "boolean") setIsEditing(isEditingProp);
  }, [isEditingProp]);

  // ---------------- Editable Fields ----------------
  const [editName, setEditName] = useState(item.name || "");
  const [editDescription, setEditDescription] = useState(item.description || "");
  const [editType, setEditType] = useState(item.type || "");
  const [editLocationId, setEditLocationId] = useState(item.locationId || "");

  // Update local fields when item changes
  useEffect(() => {
    setEditName(item.name || "");
    setEditDescription(item.description || "");
    setEditType(item.type || "");
    setEditLocationId(item.locationId || "");
  }, [item]);

  // ---------------- Helper for dropdowns ----------------
  const locationTypeOptions = ["Region", "City", "Dungeon", "Town"];
  const factionTypeOptions = ["Guild", "Tribe", "Order"]; // example, adjust to your backend types

  // ---------------- Notify parent of changes ----------------
  useEffect(() => {
    if (isEditing) {
      onChange?.({
        ...item,
        name: editName,
        description: editDescription,
        type: editType,
        locationId: editLocationId,
      });
    }
  }, [editName, editDescription, editType, editLocationId, isEditing]);

  // ---------------- Render ----------------
  if (isEditing) {
    return (
      <div className="entity-card editing">
        <input
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          placeholder="Name"
        />
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          placeholder="Description"
        />
        {category === "Location" && (
          <select value={editType} onChange={(e) => setEditType(e.target.value)}>
            <option value="">Select Type</option>
            {locationTypeOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        )}
        {category === "Faction" && (
          <select value={editType} onChange={(e) => setEditType(e.target.value)}>
            <option value="">Select Faction Type</option>
            {factionTypeOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        )}
      </div>
    );
  }

  // ---------------- View Mode ----------------
  const locationName =
    item.locationId && world?.locations?.find((loc) => loc.id === item.locationId)?.name;
  const locationType = category === "Location" ? item.type || "" : "";
  const factionType = category === "Faction" ? item.type || "" : "";

  return (
    <div className="entity-card">
      <h2>{item.name || "(Unnamed)"}</h2>
      {item.description && <p>{item.description}</p>}
      <ul>
        {locationType && <li>Type: {locationType}</li>}
        {factionType && <li>Faction Type: {factionType}</li>}
        {locationName && <li>Location: {locationName}</li>}
      </ul>
    </div>
  );
}

// ==========================
// EntityCard.jsx / non-MVP
// ==========================
// - Detect and warn when creating a new entity with duplicate name within same parent
// - Optionally merge duplicates
// - Extend edit fields for Character/Item location/faction (future enhancements)
// - Handle edge cases when changing types on entities with children
// - Lazy-load children for large worlds (optional optimization)