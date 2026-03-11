import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddEntityModal from "./AddEntityModal";
import ConfirmModal from "./ConfirmModal";
import { useToast } from "../context/ToastContext";
import {
  createLocation,
  createFaction,
  createCharacter,
  createItem,
  deleteLocation,
  deleteFaction,
  deleteCharacter,
  deleteItem,
  deleteWorld,
} from "../services/worldService";
import "../assets/css/floating-controls.css";

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
  onCancelEdit,
  onOpenModal,
}) {
  const navigate = useNavigate();
  const { addToast } = useToast();

  // Modal state only relevant for worldContent
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmDeleteWorld, setConfirmDeleteWorld] = useState(false);

  // ---------- Add New ----------
  const handleAddClick = () => {
    if (pageType === "worldOverview") {
      navigate(`/world-content/${worldId}`, { state: { openAddModal: true } });
    } else {
      onOpenModal?.();
    }
  };

  const handleModalSubmit = async (entityType, data) => {
    try {
      let result;
      switch (entityType) {
        case "Location":
          result = await createLocation(data);
          break;
        case "Faction":
          result = await createFaction(data);
          break;
        case "Character":
          result = await createCharacter(data);
          break;
        case "Item":
          result = await createItem(data);
          break;
        default:
          throw new Error(`Unknown entity type: ${entityType}`);
      }

      onAddEntity?.({ ...result, category: entityType }, entityType);
      addToast({ message: `${entityType} created successfully!`, type: "success" });
    } catch {
      addToast({ message: `Failed to create ${entityType}.`, type: "error" });
    } finally {
      setModalOpen(false);
    }
  };

  // ---------- Delete World ----------
  const handleDeleteWorld = async () => {
    try {
      await deleteWorld(worldId);
      addToast({ message: "World deleted successfully.", type: "success" });
      navigate("/dashboard");
    } catch {
      addToast({ message: "Failed to delete world.", type: "error" });
    } finally {
      setConfirmDeleteWorld(false);
    }
  };

  // ---------- Delete Entity ----------
  const handleConfirmDeleteEntity = async () => {
    if (!selectedEntity) return;

    try {
      switch (selectedEntity.category) {
        case "Location":
          await deleteLocation(selectedEntity.id);
          break;
        case "Faction":
          await deleteFaction(selectedEntity.id);
          break;
        case "Character":
          await deleteCharacter(selectedEntity.id);
          break;
        case "Item":
          await deleteItem(selectedEntity.id);
          break;
        default:
          throw new Error("Unknown category");
      }

      onDeleteEntity?.(selectedEntity);
    } catch (err) {
      console.error(err);
      addToast({ message: `Failed to delete ${selectedEntity.category}.`, type: "error" });
    } finally {
      setConfirmOpen(false);
    }
  };

  const handleCancelDelete = () => setConfirmOpen(false);
  const handleDeleteClick = () => setConfirmOpen(true);

  return (
    <div className="floating-controls">
      {/* ---------- Left group: Edit + Add ---------- */}
      <div className="controls-left">
        <button className="control-button" onClick={onEdit} disabled={isEditingProp}>
          Edit
        </button>
        <button className="control-button" onClick={handleAddClick} disabled={isEditingProp}>
          Add New
        </button>
      </div>

      {/* ---------- Right group: Delete + Back ---------- */}
      <div className="controls-right">
        {pageType !== "worldOverview" && (
          <button
            className="control-button delete-world-btn"
            onClick={handleDeleteClick}
            disabled={isEditingProp || !selectedEntity}
          >
            Delete
          </button>
        )}

        {pageType === "worldOverview" && (
          <button
            className="control-button delete-world-btn"
            onClick={() => setConfirmDeleteWorld(true)}
            disabled={isEditingProp}
          >
            Delete World
          </button>
        )}

        {pageType !== "worldOverview" && (
          <button
            className="control-button"
            onClick={() => navigate(`/world-overview/${worldId}`)}
            disabled={isEditingProp}
          >
            Back
          </button>
        )}

        {isEditingProp && (
          <>
            <button className="control-button" onClick={onSave}>
              Save
            </button>
            <button className="control-button" onClick={onCancelEdit}>
              Cancel
            </button>
          </>
        )}
      </div>

      {/* ---------- Modals (only for worldContent) ---------- */}
      {selectedEntity && confirmOpen && (
        <ConfirmModal
          open={confirmOpen}
          message={`Deleting this ${selectedEntity?.category}${selectedEntity?.children?.length
            ? ` and its ${selectedEntity.children.length} child entities`
            : ""
            } will remove everything. Are you sure?`}
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