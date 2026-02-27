import { useState } from "react";
import AddEntityModal from "./AddEntityModal";
import ConfirmModal from "./ConfirmModal";
import {
  updateWorld,
  deleteWorld,
  createLocation,
  createFaction,
  createCharacter,
  createItem,
  deleteLocation,
  deleteFaction,
  deleteCharacter,
  deleteItem
} from "../services/worldService";

export default function FloatingControls({
  pageType,
  worldId,
  world,
  selectedEntity,
  isEditingProp,
  onAddEntity,
  onDeleteEntity,
  onEdit,
  onSave,
  onCancelEdit
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // ----- Add / Edit -----
  const handleAddClick = () => setModalOpen(true);
  const requestDeleteEntity = () => selectedEntity && setConfirmOpen(true);
  const handleCancelDelete = () => setConfirmOpen(false);

  // ----- Delete -----
  const handleConfirmDelete = async () => {
    if (!selectedEntity) return;

    const { category, id } = selectedEntity;
    if (!category || !id) {
      console.error("Cannot delete entity: category or id is undefined", selectedEntity);
      return;
    }

    try {
      switch (category) {
        case "Location": await deleteLocation(id); break;
        case "Faction": await deleteFaction(id); break;
        case "Character": await deleteCharacter(id); break;
        case "Item": await deleteItem(id); break;
        default:
          console.error("Unknown category:", category, selectedEntity);
          return;
      }

      // Update parent state
      onDeleteEntity?.();

    } catch (err) {
      console.error("Failed to delete entity:", err);
      alert("Failed to delete entity. Check console for details.");
    } finally {
      setConfirmOpen(false);
    }
  };

  // ----- AddEntityModal submit -----
  const handleModalSubmit = async (entityType, data) => {
    try {
      let result;
      switch (entityType) {
        case "Location": result = await createLocation(data); break;
        case "Faction": result = await createFaction(data); break;
        case "Character": result = await createCharacter(data); break;
        case "Item": result = await createItem(data); break;
        default: throw new Error(`Unknown entity type: ${entityType}`);
      }
      // Update parent state immediately
      onAddEntity?.(result, entityType);
    } catch (err) {
      console.error("Failed to create entity:", err);
      alert(`Failed to create entity: ${err.message}`);
    } finally {
      setModalOpen(false);
    }
  };

  // ----- World Actions -----
  const handleEditWorld = () => console.log("Edit world clicked");
  const handleSaveWorld = async () => {
    try { await updateWorld(worldId, world); } catch (err) { console.error(err); }
  };
  const handleDeleteWorld = async () => {
    if (!confirm("Delete this world?")) return;
    try { await deleteWorld(worldId); } catch (err) { console.error(err); }
  };

  return (
    <div className="floating-controls">
      {pageType === "worldOverview" ? (
        <>
          <button className="control-button" onClick={handleEditWorld}>Edit World</button>
          <button className="control-button" onClick={handleSaveWorld}>Save World</button>
          <button className="control-button" onClick={handleDeleteWorld}>Delete World</button>
        </>
      ) : (
        <>
          <button
            className="control-button"
            onClick={onEdit}
            disabled={!selectedEntity || isEditingProp}
          >
            Edit
          </button>

          <button
            className="control-button"
            onClick={requestDeleteEntity}
            disabled={!selectedEntity || isEditingProp}
          >
            Delete
          </button>

          {isEditingProp && (
            <>
              <button
                className="control-button"
                onClick={onSave}
                disabled={!selectedEntity}
              >
                Save
              </button>
              <button className="control-button" onClick={onCancelEdit}>Cancel</button>
            </>
          )}
        </>
      )}

      <button className="control-button" onClick={handleAddClick} disabled={isEditingProp}>
        Add New
      </button>

      {modalOpen && (
        <AddEntityModal
          worldId={worldId}
          world={world}
          onClose={() => setModalOpen(false)}
          onSubmit={handleModalSubmit}
        />
      )}

      {confirmOpen && selectedEntity && (
        <ConfirmModal
          message={`Deleting this ${selectedEntity.category}${selectedEntity.children?.length ? ` and its ${selectedEntity.children.length} child entities` : ""} will remove everything. Are you sure?`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
}

// ==========================
// FloatingControls.jsx / NON MVP
// ==========================
// - Multi-select delete/edit for entities
// - Bulk assign items or characters to a location/faction
// - Frontend validation for missing required fields on create/edit
// - Improved UI feedback for CRUD operations: loading, success, error states
// - Inline editing confirmation before save
// - Debounced auto-save for entity edits (optional optimization)