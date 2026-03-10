import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import '../assets/css/add-entity-modal.css';

export default function AddEntityModal({ worldId, entityToEdit, onClose, onSubmit, world }) {
  // ---------------- State ----------------
  const [typeCategory, setTypeCategory] = useState(entityToEdit?.entityType || "Location");
  const [name, setName] = useState(entityToEdit?.name || "");
  const [description, setDescription] = useState(entityToEdit?.description || "");
  const [subType, setSubType] = useState(entityToEdit?.type || "");
  const [parentRegionId, setParentRegionId] = useState(entityToEdit?.regionId ?? null);
  const [errors, setErrors] = useState({});

  // ---------------- Options ----------------
  const locationTypes = ["Region", "City", "Town", "Dungeon", "Misc"];
  const factionTypes = ["Faction", "Guild", "Clan", "Order"];
  const regions = world?.locations?.filter((loc) => loc.type === "Region") || [];

  // ---------------- Reset subtype/parent when modal opens ----------------
  useEffect(() => {
    if (!entityToEdit) {
      setSubType((prev) => prev || (typeCategory === "Location" ? "Region" : ""));
      setParentRegionId((prev) => prev ?? null);
    }
  }, []);

  // ---------------- Console log for debug ----------------
  console.log("AddEntityModal rendered", { typeCategory, name, description, subType, parentRegionId });

  // ---------------- Handlers ----------------
  const handleSubmit = () => {

    //validation
    const newErrors = {};

    if (!name?.trim()) {
      newErrors.name = "Name is required.";
    }

    if (typeCategory === "Location" && !subType?.trim()) {
      newErrors.subType = "Location type is required.";
    }

    if (typeCategory === "Faction" && !subType?.trim()) {
      newErrors.subType = "Faction type is required.";
    }

    // if errors, return
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear old errors
    setErrors({});

    const entityData = {
      name: name.trim(),
      description: description.trim(),
      worldId,
    };

    if (typeCategory === "Location") {
      entityData.type = subType.trim();
      const parentId = parentRegionId && !isNaN(Number(parentRegionId))
        ? Number(parentRegionId) : null;

      entityData.regionId = subType === "Region" ? null : parentId;
    }

    if (typeCategory === "Faction") {
      entityData.type = subType.trim();
    }

    console.log("Calling onSubmit with:", typeCategory, entityData);

    try {
      onSubmit(typeCategory, entityData);
    } catch (err) {
      console.error("Error calling onSubmit:", err);
    }

    onClose();
  };

  // ---------------- Modal JSX ----------------
  const modalContent = (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{entityToEdit ? `Edit ${typeCategory}` : `Add New ${typeCategory}`}</h2>

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

        <div className="form-group">
          <label>Name:</label>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((prev) => ({ ...prev, name: null }));
            }}
          />
          {errors.name && <div className="form-error">{error.name}</div>}
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        {typeCategory === "Location" && (
          <>
            <div className="form-group">
              <label>Location Type:</label>
              <select value={subType} onChange={(e) => setSubType(e.target.value)}>
                {locationTypes.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Parent Region:</label>
              <select
                value={parentRegionId || ""}
                onChange={(e) => setParentRegionId(Number(e.target.value) || null)}
                disabled={subType === "Region"}
              >
                <option value="">-- None --</option>
                {regions.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
          </>
        )}

        {typeCategory === "Faction" && (
          <div className="form-group">
            <label>Faction Type:</label>
            <select value={subType} onChange={(e) => setSubType(e.target.value)}>
              <option value="">-- Select Type --</option>
              {factionTypes.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        )}

        <div className="modal-actions">
          <button onClick={handleSubmit}>{entityToEdit ? "Save" : "Add"}</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

// TODO: Add custom error messages for modal