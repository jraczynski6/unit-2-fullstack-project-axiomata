import { useState } from "react";
import AddEntityModal from "./AddEntityModal";
import ConfirmModal from "./ConfirmModal";
import {
  updateWorld,
  deleteWorld,
  createLocation,
  deleteLocation,
  createFaction,
  deleteFaction,
  updateFaction,
  deleteCharacter,
  createCharacter,
  updateCharacter,
  deleteItem,
  createItem,
  updateItem,
} from "../services/worldService";

export default function FloatingControls({
  pageType,
  worldId,
  worldData,
  selectedEntity,
  onAddEntity,
  onDeleteEntity,
  onEdit,
  onSave,
  onDelete,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [entityToEdit, setEntityToEdit] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // ---------------- Add / Edit ----------------
  const handleAddClick = () => {
    setEntityToEdit(null);
    setModalOpen(true);
  };

  const handleEditEntity = () => {
    if (!selectedEntity) return;
    setEntityToEdit(selectedEntity);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEntityToEdit(null);
  };

  const handleModalSubmit = async (typeCategory, data) => {
    if (!typeCategory) {
      console.error("No entity type provided", data);
      alert("Entity type is required.");
      return;
    }

    const payload = { ...data, worldId }; // worldId always included

    let result;

    if (entityToEdit) {
      switch (typeCategory) {
        case "Location":
          result = await updateLocation(entityToEdit.id, payload);
          break;
        case "Faction":  // fix: handle faction update
          result = await updateFaction(entityToEdit.id, payload);
          break;
        case "Character":
          result = await updateCharacter(entityToEdit.id, payload);
          break;
        case "Item":
          result = await updateItem(entityToEdit.id, payload);
          break;
        default:
          throw new Error(`Unknown entity type: ${typeCategory}`);
      }
      onAddEntity?.(result);
    } else {
      switch (typeCategory) {
        case "Location":
          result = await createLocation(payload);
          break;
        case "Faction":  // fix: handle faction creation
          if (!payload.type || !payload.type.trim()) {
            alert("Faction type is required.");
            return;
          }
          result = await createFaction(payload);
          break;
        case "Character":
          result = await createCharacter(payload);
          break;
        case "Item":
          result = await createItem(payload);
          break;
        default:
          throw new Error(`Unknown entity type: ${typeCategory}`);
      }
      onAddEntity?.(result);
    }

    setModalOpen(false);
    setEntityToEdit(null);
  };

  // ---------------- Delete ----------------
  const requestDeleteEntity = () => {
    if (!selectedEntity) return;
    setConfirmOpen(true);
  };

  const handleCancelDelete = () => setConfirmOpen(false);

  const handleConfirmDelete = async () => {
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
          throw new Error(`Unknown category: ${selectedEntity.category}`);
      }

      onDeleteEntity?.();
    } catch (err) {
      console.error("Failed to delete entity:", err);
      alert("Failed to delete entity. Check console for details.");
    } finally {
      setConfirmOpen(false);
    }
  };

  // ---------------- World Actions ----------------
  const handleEditWorld = () => onEdit?.();
  const handleSaveWorld = async () => {
    try {
      await updateWorld(worldId, worldData);
      onSave?.();
    } catch (err) {
      console.error("Failed to save world:", err);
    }
  };

  const handleDeleteWorld = async () => {
    if (!confirm("Delete this world?")) return;
    try {
      await deleteWorld(worldId);
      onDelete?.();
    } catch (err) {
      console.error("Failed to delete world:", err);
    }
  };

  // ---------------- Render ----------------
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
          <button className="control-button" onClick={handleEditEntity} disabled={!selectedEntity}>Edit</button>
          <button className="control-button" onClick={requestDeleteEntity} disabled={!selectedEntity}>Delete</button>
        </>
      )}

      <button className="control-button" onClick={handleAddClick}>Add New</button>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <AddEntityModal
          worldId={worldId}
          world={worldData}   // pass the world data for location dropdowns
          entityToEdit={entityToEdit}
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
        />
      )}

      {/* Delete Confirm Modal */}
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