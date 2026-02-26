import { useState, useEffect } from "react";
import { getWorldById } from "../services/worldService";

export default function AddEntityModal({ worldId, entityToEdit, onClose, onSubmit }) {
  if (!worldId) return null;

  const [entityType, setEntityType] = useState(entityToEdit?.entityType || entityToEdit?.type || "");
  const [name, setName] = useState(entityToEdit?.name || "");
  const [description, setDescription] = useState(entityToEdit?.description || "");
  const [locationType, setLocationType] = useState(entityToEdit?.locationType || "");
  const [parentRegionId, setParentRegionId] = useState(entityToEdit?.region_id || "");
  const [itemLocationId, setItemLocationId] = useState(entityToEdit?.location_id || "");
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    if (worldId && (entityType === "Location" || entityType === "Item")) {
      const fetchRegions = async () => {
        try {
          const world = await getWorldById(worldId);
          const regionList = (world.locations || []).filter((l) => l.type === "Region");
          setRegions(regionList);
        } catch (err) {
          console.error("Failed to fetch regions:", err);
        }
      };
      fetchRegions();
    }
  }, [worldId, entityType]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!entityType || !name) return;

    const entityData = { name, description, world_id: worldId };

    if (entityType === "Location") {
      if (locationType) entityData.type = locationType;
      if (locationType === "Sub-location" && parentRegionId) entityData.region_id = parentRegionId;
    } else if (entityType === "Item") {
      if (itemLocationId) entityData.location_id = itemLocationId;
    }

    onSubmit(entityData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">{entityToEdit ? "Edit Entity" : "Add New Entity"}</h2>
        <form className="modal-form" onSubmit={handleSubmit}>
          {!entityToEdit && (
            <label className="modal-label">
              Type:
              <select
                className="modal-select"
                value={entityType}
                onChange={(e) => setEntityType(e.target.value)}
                required
              >
                <option value="">Select type</option>
                <option value="Location">Location</option>
                <option value="Faction">Faction</option>
                <option value="Character">Character</option>
                <option value="Item">Item</option>
              </select>
            </label>
          )}

          {entityType && (
            <>
              <label className="modal-label">
                Name:
                <input
                  className="modal-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>

              <label className="modal-label">
                Description:
                <textarea
                  className="modal-textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </label>

              {entityType === "Location" && (
                <>
                  <label className="modal-label">
                    Location Type:
                    <select
                      className="modal-select"
                      value={locationType}
                      onChange={(e) => setLocationType(e.target.value)}
                      required
                    >
                      <option value="">Select type</option>
                      <option value="Region">Region</option>
                      <option value="Sub-location">Sub-location</option>
                    </select>
                  </label>

                  {locationType === "Sub-location" && (
                    <label className="modal-label">
                      Parent Region:
                      <select
                        className="modal-select"
                        value={parentRegionId}
                        onChange={(e) => setParentRegionId(e.target.value)}
                        required
                      >
                        <option value="">Select parent region</option>
                        {regions.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                </>
              )}

              {entityType === "Item" && regions.length > 0 && (
                <label className="modal-label">
                  Location:
                  <select
                    className="modal-select"
                    value={itemLocationId}
                    onChange={(e) => setItemLocationId(e.target.value)}
                  >
                    <option value="">None</option>
                    {regions.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <div className="modal-actions">
                <button type="submit" className="modal-button">
                  {entityToEdit ? "Save" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="modal-button modal-button-cancel"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}