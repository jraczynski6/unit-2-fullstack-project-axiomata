import { useState, useEffect } from "react";
import { getWorldById } from "../services/worldService";

export default function AddEntityModal({ worldId, onClose, onSubmit }) {
  if (!worldId) return null; // safety guard

  const [entityType, setEntityType] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [locationType, setLocationType] = useState("");
  const [parentRegionId, setParentRegionId] = useState("");
  const [itemLocationId, setItemLocationId] = useState("");
  const [regions, setRegions] = useState([]);

  // fetch regions if adding a Location
  useEffect(() => {
    if (worldId && entityType === "Location") {
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

    const entityData = {
      name,
      description,
      world_id: worldId,
    };

    if (entityType === "Location") {
      entityData.type = locationType || "Region";
      if (locationType === "Sub-location" && parentRegionId) {
        entityData.region_id = parentRegionId;
      }
    } else if (entityType === "Faction") {
      entityData.type = "Default"; // can be extended later if needed
    } else if (entityType === "Character") {
      // nothing extra needed
    } else if (entityType === "Item") {
      if (itemLocationId) entityData.location_id = itemLocationId;
    }

    onSubmit(entityData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Add New Entity</h2>
        <form className="modal-form" onSubmit={handleSubmit}>
          {/* Entity Type Selection */}
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

          {entityType && (
            <>
              {/* Common fields */}
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

              {/* Location-specific fields */}
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

              {/* Item-specific location assignment */}
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
                  Create
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