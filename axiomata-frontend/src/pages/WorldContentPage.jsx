import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getWorldById, updateLocation, updateFaction, updateCharacter, updateItem } from "../services/worldService";
import EntityCard from "../components/EntityCard";
import SectionPanel from "../components/SectionPanel";
import FloatingControls from "../components/FloatingControls";
import Spinner from "../components/ui/Spinner";
import { useToast } from "../context/ToastContext";

export default function WorldContentPage() {
  const { addToast } = useToast();
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

      // Attach category to each entity for frontend use
      const withCategory = {
        ...data,
        locations: data.locations?.map((loc) => ({ ...loc, category: "Location" })) || [],
        factions: data.factions?.map((f) => ({ ...f, category: "Faction" })) || [],
        characters: data.characters?.map((c) => ({ ...c, category: "Character" })) || [],
        items: data.items?.map((i) => ({ ...i, category: "Item" })) || []
      };

      setWorld(withCategory);

      const preSelected = location.state?.selectedEntity;
      const firstItem =
        preSelected ||
        withCategory.locations?.[0] ||
        withCategory.factions?.[0] ||
        withCategory.characters?.[0] ||
        withCategory.items?.[0];

      if (firstItem) {
        setSelectedItem(firstItem);
        setSelectedCategory(firstItem.category);
      }
    };

    if (worldId) fetchWorld();
  }, [worldId, location.state]);

  // ----- Add / Update / Delete -----
  const handleAddItem = (newItem, category) => {
    if (!category) return;
    const itemWithCategory = { ...newItem, category };
    setWorld((prev) => {
      const updatedWorld = { ...prev };
      const key = category.toLowerCase() + "s";
      updatedWorld[key] = [...(prev[key] || []), itemWithCategory];
      return updatedWorld;
    });
    setSelectedItem(itemWithCategory);
    setSelectedCategory(category);

    // Toast
    addToast({ message: `${category} created successfully!`, type: "success" });
  };

  const handleUpdateItem = (updatedItem, category) => {
    const itemWithCategory = { ...updatedItem, category };
    setWorld((prev) => {
      const updatedWorld = { ...prev };
      const key = category.toLowerCase() + "s";
      if (updatedWorld[key]) {
        updatedWorld[key] = updatedWorld[key].map((i) =>
          i.id === itemWithCategory.id ? itemWithCategory : i
        );
      }
      return updatedWorld;
    });

    // Refresh selectedItem
    setSelectedItem(itemWithCategory);
    setDraftEntity(itemWithCategory);
  };

  const handleDeleteItem = async () => {
    try {
      const data = await getWorldById(worldId);
      const refreshed = {
        ...data,
        locations: data.locations?.map((loc) => ({ ...loc, category: "Location" })) || [],
        factions: data.factions?.map((f) => ({ ...f, category: "Faction" })) || [],
        characters: data.characters?.map((c) => ({ ...c, category: "Character" })) || [],
        items: data.items?.map((i) => ({ ...i, category: "Item" })) || []
      };
      setWorld(refreshed);

      setSelectedItem(null);
      setSelectedCategory(null);
      setDraftEntity(null);
      setIsEditing(false);
      addToast({
        message: `${selectedCategory} deleted successfully!`,
        type: "error"
      });
    } catch (err) {
      console.error("Failed to refresh world after deletion:", err);
      addToast({
        message: `Failed to delete ${selectedCategory}.`,
        type: "error"
      });
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

      // Toast success
      addToast({ message: `${selectedCategory} saved successfully!`, type: "success" });
    } catch (err) {
      console.error("Failed to save entity:", err);

      // Toast error instead of alert
      addToast({ message: `Failed to save ${selectedCategory}.`, type: "error" });
    }
  };

  const handleCancelEdit = () => {
    setDraftEntity(null);
    setIsEditing(false);

    // Optional toast for cancel
    addToast({ message: `${selectedCategory} edit canceled.`, type: "info" });
  };

  if (!world) return <Spinner />;

  return (
    <div className="world-content-page">
      <div className="world-panel-container">
        <SectionPanel
          world={world}
          onSelectEntity={(entity) => {
            setSelectedItem(entity);
            setSelectedCategory(entity.category);
            setIsEditing(false);
            setDraftEntity(null);
          }}
        />
      </div>

      <div className="entity-card-container">
        {selectedItem ? (
          <EntityCard
            item={draftEntity || selectedItem}
            category={selectedCategory}
            world={world}
            isEditingProp={isEditing}
            onChange={setDraftEntity}
          />
        ) : (
          <div className="select-placeholder">Select an item from the panel</div>
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