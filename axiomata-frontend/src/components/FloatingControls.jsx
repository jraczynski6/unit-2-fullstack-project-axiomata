import { useState } from "react";
import AddEntityModal from "./AddEntityModal";
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

  const handleAddClick = () => {
    setEntityToEdit(null);
    setModalOpen(true);
  };

  const handleEditEntity = () => {
    if (!selectedEntity) return;
    setEntityToEdit(selectedEntity);
    setModalOpen(true);
  };

  const handleModalSubmit = async (entityData) => {
    try {
      let result;

      if (entityToEdit) {
        if (entityToEdit.id.startsWith("loc")) result = await updateLocation(entityToEdit.id, entityData);
        else if (entityToEdit.id.startsWith("fac")) result = await updateFaction(entityToEdit.id, entityData);
        else if (entityToEdit.id.startsWith("char")) result = await updateCharacter(entityToEdit.id, entityData);
        else if (entityToEdit.id.startsWith("item")) result = await updateItem(entityToEdit.id, entityData);

        onUpdateEntity?.(result);
      } else {
        if (entityData.type === "Location") result = await createLocation(entityData);
        else if (entityData.type === "Faction") result = await createFaction(entityData);
        else if (entityData.type === "Character") result = await createCharacter(entityData);
        else if (entityData.type === "Item") result = await createItem(entityData);

        onAddEntity?.(result);
      }
    } catch (err) {
      console.error("Failed to save entity:", err);
    } finally {
      setModalOpen(false);
      setEntityToEdit(null);
    }
  };

  const handleDeleteEntity = async () => {
    if (!selectedEntity) return;
    if (!confirm("Delete this entity?")) return;

    try {
      if (selectedEntity.id.startsWith("loc")) await deleteLocation(selectedEntity.id);
      else if (selectedEntity.id.startsWith("fac")) await deleteFaction(selectedEntity.id);
      else if (selectedEntity.id.startsWith("char")) await deleteCharacter(selectedEntity.id);
      else if (selectedEntity.id.startsWith("item")) await deleteItem(selectedEntity.id);

      onDeleteEntity?.(selectedEntity.id);
    } catch (err) {
      console.error("Failed to delete entity:", err);
    }
  };

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

  const handleModalClose = () => {
    setModalOpen(false);
    setEntityToEdit(null);
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
          <button className="control-button" onClick={handleEditEntity} disabled={!selectedEntity}>Edit</button>
          <button className="control-button" onClick={handleDeleteEntity} disabled={!selectedEntity}>Delete</button>
        </>
      )}

      <button className="control-button" onClick={handleAddClick}>Add New</button>

      {modalOpen && (
        <AddEntityModal
          worldId={worldId}
          entityToEdit={entityToEdit}
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
}