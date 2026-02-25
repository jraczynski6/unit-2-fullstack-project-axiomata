// FloatingControls.jsx
import { useState } from "react";
import AddEntityModal from "./AddEntityModal";

export default function FloatingControls({
  pageType,
  worldId,
  onAddEntity,
  onEdit,
  onSave,
  onDelete,
}) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleAddClick = () => setModalOpen(true);

  const handleModalSubmit = (entityData) => {
    onAddEntity(entityData);
    setModalOpen(false);
  };

  const handleModalClose = () => setModalOpen(false);

  return (
    <div className="floating-controls">
      {pageType === "worldOverview" ? (
        <>
          <button className="control-button" onClick={onEdit}>Edit World</button>
          <button className="control-button" onClick={onSave}>Save World</button>
          <button className="control-button" onClick={onDelete}>Delete World</button>
        </>
      ) : (
        <>
          <button className="control-button" onClick={onEdit}>Edit</button>
          <button className="control-button" onClick={onSave}>Save</button>
          <button className="control-button" onClick={onDelete}>Delete</button>
        </>
      )}

      {/* modal handles type selection */}
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