import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getWorldById, updateLocation, updateFaction, updateCharacter, updateItem } from "../services/worldService";
import EntityCard from "../components/EntityCard";
import SectionPanel from "../components/SectionPanel";
import FloatingControls from "../components/FloatingControls";

export default function WorldContentPage() {
  const location = useLocation();
  const { worldId } = useParams();
  const [world, setWorld] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // ----- Edit State -----
  const [isEditing, setIsEditing] = useState(false);
  const [draftEntity, setDraftEntity] = useState(null);

  // ----- Fetch World -----
  useEffect(() => {
    const fetchWorld = async () => {
      const data = await getWorldById(worldId);
      setWorld(data);

      const preSelected = location.state?.selectedEntity;
      const firstItem = preSelected || data.locations?.[0] || data.factions?.[0] || data.characters?.[0] || data.items?.[0];

      if (firstItem) {
        setSelectedItem(firstItem);
        setSelectedCategory(
          data.locations?.includes(firstItem)
            ? "Location"
            : data.factions?.includes(firstItem)
              ? "Faction"
              : data.characters?.includes(firstItem)
                ? "Character"
                : "Item"
        );
      }
    };

    if (worldId) fetchWorld();
  }, [worldId, location.state]);

  // ----- Add / Update / Delete -----
  const handleAddItem = (newItem, category) => {
    if (!category) return;
    setWorld(prev => {
      const updatedWorld = { ...prev };
      const key = category.toLowerCase() + "s";
      updatedWorld[key] = [...(prev[key] || []), newItem];
      return updatedWorld;
    });
  };

  const handleUpdateItem = (updatedItem, category) => {
    setWorld(prev => {
      const updatedWorld = { ...prev };
      const key = category?.toLowerCase() + "s"; // safe check
      if (updatedWorld[key]) {
        updatedWorld[key] = updatedWorld[key].map(i => i.id === updatedItem.id ? updatedItem : i);
      }
      if (selectedItem?.id === updatedItem.id) setSelectedItem(updatedItem);
      setDraftEntity(updatedItem); // sync draft
      return updatedWorld;
    });
  };

  const handleDeleteItem = async () => {
    try {
      const data = await getWorldById(worldId);
      setWorld(data);
      setSelectedItem(null);
      setSelectedCategory(null);
      setDraftEntity(null);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to refresh world after deletion:", err);
    }
  };

  // ----- Edit / Save / Cancel -----
  const handleEdit = () => {
    if (!selectedItem) return;
    setDraftEntity(selectedItem);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!draftEntity) return;
    try {
      let updatedItem;
      switch (selectedCategory) {
        case "Location":
          updatedItem = await updateLocation(draftEntity.id, draftEntity);
          break;
        case "Faction":
          updatedItem = await updateFaction(draftEntity.id, draftEntity);
          break;
        case "Character":
          updatedItem = await updateCharacter(draftEntity.id, draftEntity);
          break;
        case "Item":
          updatedItem = await updateItem(draftEntity.id, draftEntity);
          break;
        default:
          throw new Error("Unknown category");
      }
      handleUpdateItem(updatedItem, selectedCategory);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to save entity:", err);
      alert("Save failed. Check console for details.");
    }
  };

  const handleCancelEdit = () => {
    setDraftEntity(null);
    setIsEditing(false);
  };

  if (!world) return <div>Loading world...</div>;

  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      <SectionPanel
        world={world}
        onSelectEntity={entity => {
          setSelectedItem(entity);
          setSelectedCategory(entity.category);
          setIsEditing(false);
          setDraftEntity(null);
        }}
      />

      <div>
        {selectedItem ? (
          <EntityCard
            item={draftEntity || selectedItem}
            category={selectedCategory}
            world={world}
            isEditingProp={isEditing}
            onChange={setDraftEntity}
          />
        ) : (
          <div>Select an item from the panel</div>
        )}
      </div>

      <FloatingControls
        pageType="worldContent"
        worldId={world.id}
        world={world}
        selectedEntity={selectedItem}
        isEditingProp={isEditing}
        onAddEntity={handleAddItem}
        onUpdateEntity={handleUpdateItem}
        onDeleteEntity={handleDeleteItem}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancelEdit={handleCancelEdit}
      />
    </div>
  );
}
// ==========================
// Non-MVP (Backlog / Future Enhancements)
// ==========================

// WorldContentPage.jsx
// - Handle children properly when changing Location type (Region → City → Town) without deleting them
// - Ensure Character and Item parent `locationId` updates correctly when parent Location changes
// - Cascade updates to linked entities when parent is renamed or moved
// - Refresh and resync world state after complex edits without full reload
// - Implement undo functionality for last entity deletion
// - Track changes to entities (name/type/description) with timestamps for optional revision history