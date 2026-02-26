import { useState, useEffect } from "react";

export default function AddEntityModal({ worldId, entityToEdit, onClose, onSubmit }) {
  // ---------------- State ----------------
  const [entityType, setEntityType] = useState(entityToEdit?.entityType || "Location");
  const [name, setName] = useState(entityToEdit?.name || "");
  const [description, setDescription] = useState(entityToEdit?.description || "");
  const [subtype, setSubtype] = useState(entityToEdit?.type || ""); // optional type field

  // ---------------- Initialize when editing ----------------
  useEffect(() => {
    if (entityToEdit) {
      setEntityType(entityToEdit.entityType || "Location");
      setName(entityToEdit.name || "");
      setDescription(entityToEdit.description || "");
      setSubtype(entityToEdit.type || "");
    }
  }, [entityToEdit]);

  // ---------------- Handlers ----------------
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Name is required.");
      return;
    }

    const entityData = {
      name: name.trim(),
      description: description.trim(),
      type: subtype.trim() || undefined, // optional
      entityType, // required for backend mapping in FloatingControls
    };

    onSubmit(entityType, entityData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{entityToEdit ? `Edit ${entityType}` : `Add New ${entityType}`}</h2>

        {!entityToEdit && (
          <div className="form-group">
            <label>Entity Type:</label>
            <select value={entityType} onChange={(e) => setEntityType(e.target.value)}>
              <option value="Location">Location</option>
              <option value="Faction">Faction</option>
              <option value="Character">Character</option>
              <option value="Item">Item</option>
            </select>
          </div>
        )}

        <div className="form-group">
          <label>Name:</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className="form-group">
          <label>{entityType} Type / Subtype (optional):</label>
          <input value={subtype} onChange={(e) => setSubtype(e.target.value)} />
        </div>

        <div className="modal-actions">
          <button onClick={handleSubmit}>{entityToEdit ? "Save" : "Add"}</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}


// ----- AddEntityModal.jsx -----
// TODO: Ensure Faction type input exists and maps to DTO
// TODO: Filter Parent Region dropdown strictly to valid regions only
// TODO: Add support for future Character fields in handleSubmit
// TODO: Add defensive guards for entityType, name, and required fields
// TODO: Add modal validation feedback for backend errors
