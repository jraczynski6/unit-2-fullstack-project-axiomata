import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import '../assets/css/add-entity-modal.css';

export default function AddEntityModal({ worldId, entityToEdit, onClose, onSubmit, world }) {
  // ---------------- State ----------------
  const [typeCategory, setTypeCategory] = useState(entityToEdit?.entityType || "Location");
  const [name, setName] = useState(entityToEdit?.name || "");
  const [description, setDescription] = useState(entityToEdit?.description || "");
  const [subType, setSubType] = useState(
    entityToEdit?.type || (entityToEdit?.entityType === "Location" ? "Region" : "")
  );
  const [parentRegionId, setParentRegionId] = useState(entityToEdit?.regionId ?? "");

  // ---------------- Options ----------------
  const locationTypes = ["Region", "City", "Dungeon"];
  const factionTypes = ["Faction", "Guild", "Clan", "Order"];
  const regions = world?.locations?.filter((loc) => loc.type === "Region") || [];

  // ---------------- Initialize when editing ----------------
  useEffect(() => {
    if (entityToEdit) {
      setTypeCategory(entityToEdit.entityType || "Location");
      setName(entityToEdit.name || "");
      setDescription(entityToEdit.description || "");
      setSubType(entityToEdit.type || (entityToEdit.entityType === "Location" ? "Region" : ""));
      setParentRegionId(entityToEdit.regionId ?? "");
    } else if (typeCategory === "Location") {
      setSubType("Region");
      setParentRegionId("");
    }
  }, [entityToEdit, typeCategory]);

  // ---------------- Console log for debug ----------------
  console.log("AddEntityModal rendered", { typeCategory, name, description });

  // ---------------- Handlers ----------------
  const handleSubmit = () => {
    if (!name || !name.trim()) {
      alert("Name is required.");
      return;
    }

    const data = {
      name: name.trim(),
      description: description.trim(),
      worldId,
    };

    // ---------------- Location ----------------
    if (typeCategory === "Location") {
      if (!subType || !subType.trim()) {
        alert("Location type is required.");
        return;
      }
      data.type = subType.trim();
      data.regionId = subType === "City" ? parentRegionId || null : null;
    }

    // ---------------- Faction ----------------
    if (typeCategory === "Faction") {
      if (!subType || !subType.trim()) {
        alert("Faction type is required.");
        return;
      }
      data.type = subType.trim();
    }

    // ---------------- Call parent submit ----------------
    onSubmit(typeCategory, data);
    onClose();
  };

  // ---------------- Modal JSX ----------------
  const modalContent = (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{entityToEdit ? `Edit ${typeCategory}` : `Add New ${typeCategory}`}</h2>

        {/* Type selection (only when adding) */}
        {!entityToEdit && (
          <div className="form-group">
            <label>Type:</label>
            <select value={typeCategory} onChange={(e) => setTypeCategory(e.target.value)}>
              <option value="Location">Location</option>
              <option value="Faction">Faction</option>
              <option value="Character">Character</option>
              <option value="Item">Item</option>
            </select>
          </div>
        )}

        {/* Name / Description */}
        <div className="form-group">
          <label>Name:</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        {/* Location Fields */}
        {typeCategory === "Location" && (
          <>
            <div className="form-group">
              <label>Location Type:</label>
              <select value={subType} onChange={(e) => setSubType(e.target.value)}>
                {locationTypes.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Parent Region:</label>
              <select
                value={parentRegionId}
                onChange={(e) => setParentRegionId(e.target.value ? Number(e.target.value) : "")}
                disabled={subType === "Region"}
              >
                <option value="">-- None --</option>
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
          </>
        )}

        {/* Faction Fields */}
        {typeCategory === "Faction" && (
          <div className="form-group">
            <label>Faction Type:</label>
            <select value={subType} onChange={(e) => setSubType(e.target.value)}>
              <option value="">-- Select Type --</option>
              {factionTypes.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        )}

        {/* Actions */}
        <div className="modal-actions">
          <button onClick={handleSubmit}>{entityToEdit ? "Save" : "Add"}</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );

  // ---------------- Render via portal ----------------
  return createPortal(modalContent, document.body);
}