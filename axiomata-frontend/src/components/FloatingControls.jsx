import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddEntityModal from "./AddEntityModal";
import ConfirmModal from "./ConfirmModal";
import {
  createLocation,
  createFaction,
  createCharacter,
  createItem,
  deleteLocation,
  deleteFaction,
  deleteCharacter,
  deleteItem,
  deleteWorld
} from "../services/worldService";
import { useToast } from "../context/ToastContext";


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
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false); // for entity deletion
  const [confirmDeleteWorld, setConfirmDeleteWorld] = useState(false); // for world deletion

  // ==========================
  // Add / Create Entity
  // ==========================
  const handleAddClick = () => {
    if (pageType === "worldOverview") {
      // Navigate immediately to content page to create entity
      navigate(`/world-content/${worldId}`);
    } else {
      setModalOpen(true);
    }
  };

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

      const entityWithCategory = { ...result, category: entityType };
      onAddEntity?.(entityWithCategory, entityType);
    } catch (err) {
      console.error("Failed to create entity:", err);
      alert(`Failed to create entity: ${err.message}`);
    } finally {
      setModalOpen(false);
    }
  };

  // ==========================
  // Entity Delete (ContentPage only)
  // ==========================
  const requestDeleteEntity = () => selectedEntity && setConfirmOpen(true);
  const handleCancelDelete = () => setConfirmOpen(false);

  const handleConfirmDeleteEntity = async () => {
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
      onDeleteEntity?.();
      addToast({ message: `${category} deleted successfully.`, type: "success" });
    } catch (err) {
      console.error("Failed to delete entity:", err);
      addToast({ message: "Failed to delete entity.", type: "error" });
    } finally {
      setConfirmOpen(false);
    }
  };


  // ==========================
  // World Actions (Overview only)
  // ==========================
  const handleDeleteWorld = async () => {
    try {
      await deleteWorld(worldId);
      addToast({ message: "World deleted successfully.", type: "success" });
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      addToast({ message: "Failed to delete world.", type: "error" });
    } finally {
      setConfirmDeleteWorld(false);
    }
  };

  const handleEditWorld = () => onEdit?.();
  const handleSaveWorld = () => onSave?.();


  return (
    <div className="floating-controls">
      {/* ---------- World Overview Controls ---------- */}
      {pageType === "worldOverview" && (
        <>
          <button className="control-button" onClick={handleEditWorld} disabled={isEditingProp}>
            Edit World
          </button>
          {isEditingProp && (
            <button className="control-button" onClick={handleSaveWorld}>
              Save World
            </button>
          )}
          <button className="control-button" onClick={() => setConfirmDeleteWorld(true)}>
            Delete World
          </button>
        </>
      )}

      {/* ---------- Content Page Entity Controls ---------- */}
      {pageType !== "worldOverview" && (
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

      {pageType !== "worldOverview" && (
        <button
          className="control-button"
          onClick={() => navigate(`/world-overview/${worldId}`)}
          disabled={isEditingProp}
        >
          Back to Overview
        </button>
      )}

      {/* ---------- Add New (WorldContent/Overview) ---------- */}
      <button className="control-button" onClick={handleAddClick} disabled={isEditingProp}>
        Add New
      </button>

      {/* ---------- Modals ---------- */}
      {modalOpen && pageType !== "worldOverview" && (
        <AddEntityModal
          worldId={worldId}
          world={world}
          onClose={() => setModalOpen(false)}
          onSubmit={handleModalSubmit}
        />
      )}

      {/* Confirm deletion modals */}
      {confirmOpen && selectedEntity && (
        <ConfirmModal
          message={`Deleting this ${selectedEntity.category}${selectedEntity.children?.length
            ? ` and its ${selectedEntity.children.length} child entities`
            : ""
            } will remove everything. Are you sure?`}
          onConfirm={handleConfirmDeleteEntity}
          onCancel={handleCancelDelete}
        />
      )}

      {confirmDeleteWorld && (
        <ConfirmModal
          message="Deleting this world will remove everything. Are you sure?"
          onConfirm={handleDeleteWorld}
          onCancel={() => setConfirmDeleteWorld(false)}
        />
      )}
    </div>
  );
}

// FloatingControls.jsx
// TODO: handleSaveWorld – Test toast after WorldOverview state syncing is implemented
// TODO: handleDeleteWorld – Test toast after WorldOverview state syncing is implemented

// ==========================
// FloatingControls.jsx / NON MVP
// ==========================
// - Multi-select delete/edit for entities
// - Bulk assign items or characters to a location/faction
// - Frontend validation for missing required fields on create/edit
// - Improved UI feedback for CRUD operations: loading, success, error states
// - Inline editing confirmation before save
// - Debounced auto-save for entity edits (optional optimization)