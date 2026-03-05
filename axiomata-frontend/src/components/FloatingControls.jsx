import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddEntityModal from "./AddEntityModal";
import ConfirmModal from "./ConfirmModal";
import {
  createLocation, createFaction, createCharacter, createItem,
  deleteLocation, deleteFaction, deleteCharacter, deleteItem,
  deleteWorld
} from "../services/worldService";
import { useToast } from "../context/ToastContext";

export default function FloatingControls({
  pageType,
  worldId,
  world,
  selectedEntity,
  isEditingProp,
  hasErrors,
  onAddEntity,
  onEdit,
  onSave,
  onCancelEdit
}) {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmDeleteWorld, setConfirmDeleteWorld] = useState(false);

  // --------------------- Add / Create Entity ---------------------
  const handleAddClick = () => {
    if (pageType === "worldOverview") {
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
      onAddEntity?.({ ...result, category: entityType }, entityType);
    } catch (err) {
      console.error("Failed to create entity:", err);
      addToast({ message: `Failed to create ${entityType}.`, type: "error" });
    } finally {
      setModalOpen(false);
    }
  };

  // --------------------- Delete Entity ---------------------
  const requestDeleteEntity = () => selectedEntity && setConfirmOpen(true);
  const handleCancelDelete = () => setConfirmOpen(false);

  const handleConfirmDeleteEntity = async () => {
    if (!selectedEntity) return;
    const { category, id } = selectedEntity;
    if (!category || !id) return;

    try {
      switch (category) {
        case "Location": await deleteLocation(id); break;
        case "Faction": await deleteFaction(id); break;
        case "Character": await deleteCharacter(id); break;
        case "Item": await deleteItem(id); break;
        default: throw new Error(`Unknown category: ${category}`);
      }
      addToast({ message: `${category} deleted successfully.`, type: "success" });
      onAddEntity?.(); // refresh
    } catch (err) {
      console.error("Failed to delete entity:", err);
      addToast({ message: "Failed to delete entity.", type: "error" });
    } finally {
      setConfirmOpen(false);
    }
  };

  // --------------------- Delete World ---------------------
  const handleDeleteWorld = async () => {
    console.log("handleDeleteWorld triggered"); // <- track
    try {
      await deleteWorld(worldId);
      console.log("World deleted successfully");       // <- track
      addToast({ message: "World deleted successfully.", type: "success" });
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to delete world:", err);
      addToast({ message: "Failed to delete world.", type: "error" });
    } finally {
      setConfirmDeleteWorld(false);
    }
  };

  // --------------------- Render ---------------------
  return (
    <div className="floating-controls">
      {/* ---------- World Overview Controls ---------- */}
      {pageType === "worldOverview" && (
        <>
          <button className="control-button" onClick={onEdit} disabled={isEditingProp}>
            Edit World
          </button>

          {isEditingProp && (
            <>
              <button className="control-button" onClick={onSave} disabled={hasErrors}>
                Save World
              </button>
              <button className="control-button" onClick={onCancelEdit}>
                Cancel
              </button>
            </>
          )}

          {/* Delete World always enabled */}
          <button
            className="control-button delete-world-btn"
            onClick={() => {
              console.log("Delete World clicked");
              setConfirmDeleteWorld(true);
            }}
          >
            Delete World
          </button>
        </>
      )}

      {/* ---------- Content Page Controls ---------- */}
      {pageType !== "worldOverview" && (
        <>
          <button className="control-button" onClick={onEdit} disabled={!selectedEntity || isEditingProp}>
            Edit
          </button>
          <button className="control-button" onClick={requestDeleteEntity} disabled={!selectedEntity || isEditingProp}>
            Delete
          </button>

          {isEditingProp && (
            <>
              <button className="control-button" onClick={onSave} disabled={!selectedEntity}>
                Save
              </button>
              <button className="control-button" onClick={onCancelEdit}>
                Cancel
              </button>
            </>
          )}

          <button
            className="control-button"
            onClick={() => navigate(`/world-overview/${worldId}`)}
            disabled={isEditingProp}
          >
            Back to Overview
          </button>
        </>
      )}

      {/* ---------- Add New ---------- */}
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

      {confirmOpen && selectedEntity && (
        <ConfirmModal
          message={`Deleting this ${selectedEntity.category}${selectedEntity.children?.length
            ? ` and its ${selectedEntity.children.length} child entities`
            : ""} will remove everything. Are you sure?`}
          onConfirm={handleConfirmDeleteEntity}
          onCancel={handleCancelDelete}
        />
      )}

      {confirmDeleteWorld && (
        <ConfirmModal
          open={confirmDeleteWorld}
          message="Deleting this world will remove everything. Are you sure?"
          onConfirm={handleDeleteWorld}
          onCancel={() => setConfirmDeleteWorld(false)}
        />
      )}
    </div>
  );
}