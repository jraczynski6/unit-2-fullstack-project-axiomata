import { useState } from "react";
import AddEntityModal from "./AddEntityModal";
import {
  updateWorld,
  deleteWorld,
  createLocation,
  createFaction,
  createCharacter,
  createItem,
} from "../services/worldService";

export default function FloatingControls({
  pageType,
  worldId,
  worldData,
  onAddEntity,
  onEdit,
  onSave,
  onDelete,
}) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleAddClick = () => setModalOpen(true);

  const handleModalSubmit = async (entityData) => {
    try {
      let createdEntity;

      switch (entityData.type) {
        case "Location":
          createdEntity = await createLocation(entityData);
          break;
        case "Faction":
          createdEntity = await createFaction(entityData);
          break;
        case "Character":
          createdEntity = await createCharacter(entityData);
          break;
        case "Item":
          createdEntity = await createItem(entityData);
          break;
        default:
          throw new Error("Unknown entity type: " + entityData.type);
      }

      onAddEntity?.(createdEntity);
    } catch (err) {
      console.error("Failed to create entity:", err);
    } finally {
      setModalOpen(false);
    }
  };

  const handleModalClose = () => setModalOpen(false);


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

  return (
    <div className="floating-controls">
      {pageType === "worldOverview" ? (
        <>
          <button className="control-button" onClick={handleEditWorld}>
            Edit World
          </button>
          <button className="control-button" onClick={handleSaveWorld}>
            Save World
          </button>
          <button className="control-button" onClick={handleDeleteWorld}>
            Delete World
          </button>
        </>
      ) : (
        <>
          <button className="control-button" onClick={onEdit}>
            Edit
          </button>
          <button className="control-button" onClick={onSave}>
            Save
          </button>
          <button className="control-button" onClick={onDelete}>
            Delete
          </button>
        </>
      )}

      <button className="control-button" onClick={handleAddClick}>
        Add New
      </button>

      {modalOpen && (
        <AddEntityModal
          worldId={worldId}
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
}
// TODO: add custom confirm modal for delete actions