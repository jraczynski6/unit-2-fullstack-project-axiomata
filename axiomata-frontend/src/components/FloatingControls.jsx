import { useState } from "react";
import AddEntityModal from "./AddEntityModal";
import ConfirmModal from "./ConfirmModal";
import {
  updateWorld,
  deleteWorld,
  createLocation,
  updateLocation,
  deleteLocation,
  createFaction,
  updateFaction,
  deleteFaction,
  createCharacter,
  updateCharacter,
  deleteCharacter,
  createItem,
  updateItem,
  deleteItem,
} from "../services/worldService";

export default function FloatingControls({
  pageType,
  worldId,
  worldData,
  selectedEntity,
  onAddEntity,
  onUpdateEntity,
  onDeleteEntity,
  onEdit,
  onSave,
  onDelete,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [entityToEdit, setEntityToEdit] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // ---------------- Delete Helper ----------------
  const deleteEntityByBackendType = async (entity) => {
    console.log("Deleting entity:", entity);  // <-- log entire entity
    if (!entity?.entityType) throw new Error("Entity missing entityType");
    console.log("Entity type:", entity.entityType);  // <-- log just the type

    switch (entity.entityType) {
      case "Location": return deleteLocation(entity.id);
      case "Faction": return deleteFaction(entity.id);
      case "Character": return deleteCharacter(entity.id);
      case "Item": return deleteItem(entity.id);
      default: throw new Error(`Unknown entity type: ${entity.entityType}`);
    }
  };

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

  const handleModalSubmit = async (entityType, entityData) => {
    try {
      let result;

      if (entityToEdit) {
        // Update existing entity
        switch (entityType) {
          case "Location": result = await updateLocation(entityToEdit.id, entityData); break;
          case "Faction": result = await updateFaction(entityToEdit.id, entityData); break;
          case "Character": result = await updateCharacter(entityToEdit.id, entityData); break;
          case "Item": result = await updateItem(entityToEdit.id, entityData); break;
          default: throw new Error(`Unknown entity type: ${entityType}`);
        }
        onUpdateEntity?.(result);
      } else {
        // Create new entity
        switch (entityType) {
          case "Location": result = await createLocation(entityData); break;
          case "Faction": result = await createFaction(entityData); break;
          case "Character": result = await createCharacter(entityData); break;
          case "Item": result = await createItem(entityData); break;
          default: throw new Error(`Unknown entity type: ${entityType}`);
        }
        onAddEntity?.(result);
      }
    } catch (err) {
      console.error("Failed to save entity:", err);
      alert("Failed to save entity. Check console for details.");
    } finally {
      setModalOpen(false);
      setEntityToEdit(null);
    }
  };

  const handleModalClose = () => {
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
      await deleteEntityByBackendType(selectedEntity);
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
          entityToEdit={entityToEdit}
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
        />
      )}

      {/* Delete Confirm Modal */}
      {confirmOpen && selectedEntity && (
        <ConfirmModal
          message={`Deleting this ${selectedEntity.entityType}${selectedEntity.children?.length ? ` and its ${selectedEntity.children.length} child entities` : ""} will remove everything. Are you sure?`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
}