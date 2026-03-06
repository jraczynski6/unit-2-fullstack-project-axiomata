import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import SectionPanel from "../components/SectionPanel";
import EntityCard from "../components/EntityCard";
import FloatingControls from "../components/FloatingControls";
import Spinner from "../components/ui/Spinner";
import {
  getWorldById,
  updateLocation,
  updateFaction,
  updateCharacter,
  updateItem,
} from "../services/worldService";
import { useToast } from "../context/ToastContext";
import "../assets/css/world-content.css";
import "../assets/css/section-panel.css";

export default function WorldContentPage() {
  const { worldId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();

  const [world, setWorld] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [draftEntity, setDraftEntity] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // ------------------- Fetch world -------------------
  useEffect(() => {
    if (!worldId) return;

    const fetchWorld = async () => {
      try {
        const data = await getWorldById(worldId);

        const withCategory = {
          ...data,
          locations: data.locations?.map((l) => ({ ...l, category: "Location" })) || [],
          factions: data.factions?.map((f) => ({ ...f, category: "Faction" })) || [],
          characters: data.characters?.map((c) => ({ ...c, category: "Character" })) || [],
          items: data.items?.map((i) => ({ ...i, category: "Item" })) || [],
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
      } catch (err) {
        addToast({ message: "Failed to load world.", type: "error" });
        navigate("/dashboard");
      }
    };

    fetchWorld();
  }, [worldId, location.state, addToast, navigate]);

  // ------------------- CRUD handlers -------------------
  const handleAddEntity = (newItem, category) => {
    if (!category) return;

    const key = category.toLowerCase() + "s";
    const itemWithCategory = { ...newItem, category };

    setWorld((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), itemWithCategory],
    }));

    setSelectedItem(itemWithCategory);
    setSelectedCategory(category);

    addToast({ message: `${category} created successfully!`, type: "success" });
  };

  const handleUpdateEntity = (updatedItem, category) => {
    const key = category.toLowerCase() + "s";
    const itemWithCategory = { ...updatedItem, category };

    setWorld((prev) => ({
      ...prev,
      [key]: prev[key]?.map((i) => (i.id === itemWithCategory.id ? itemWithCategory : i)) || [],
    }));

    setSelectedItem(itemWithCategory);
    setDraftEntity(itemWithCategory);
  };

  const handleDeleteEntity = async () => {
    if (!selectedItem) return;

    try {
      const data = await getWorldById(worldId);
      const refreshed = {
        ...data,
        locations: data.locations?.map((l) => ({ ...l, category: "Location" })) || [],
        factions: data.factions?.map((f) => ({ ...f, category: "Faction" })) || [],
        characters: data.characters?.map((c) => ({ ...c, category: "Character" })) || [],
        items: data.items?.map((i) => ({ ...i, category: "Item" })) || [],
      };

      setWorld(refreshed);
      setSelectedItem(null);
      setSelectedCategory(null);
      setDraftEntity(null);
      setIsEditing(false);

      addToast({ message: `${selectedCategory} deleted successfully!`, type: "error" });
    } catch (err) {
      console.error(err);
      addToast({ message: `Failed to delete ${selectedCategory}.`, type: "error" });
    }
  };

  const handleEdit = () => setIsEditing(true);
  const handleCancelEdit = () => {
    setDraftEntity(selectedItem);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!draftEntity) return;

    try {
      let updated;
      switch (selectedCategory) {
        case "Location":
          updated = await updateLocation(draftEntity.id, draftEntity);
          break;
        case "Faction":
          updated = await updateFaction(draftEntity.id, draftEntity);
          break;
        case "Character":
          updated = await updateCharacter(draftEntity.id, draftEntity);
          break;
        case "Item":
          updated = await updateItem(draftEntity.id, draftEntity);
          break;
        default:
          throw new Error("Unknown category");
      }

      handleUpdateEntity(updated, selectedCategory);
      setIsEditing(false);
      addToast({ message: `${selectedCategory} saved successfully!`, type: "success" });
    } catch (err) {
      console.error(err);
      addToast({ message: `Failed to save ${selectedCategory}.`, type: "error" });
    }
  };

  if (!world) return <Spinner />;

  return (
    <div className="world-content-page">
      {/* ===== SectionPanel via portal ===== */}
      {typeof document !== "undefined" && (
        <SectionPanel
          world={world}
          isOpen={isPanelOpen}
          setIsOpen={setIsPanelOpen}
          onSelectEntity={(entity) => handleSelectEntity(entity)}
        />
      )}

      {/* ===== Main content ===== */}
      <div className="world-main">
        <div className="entity-card-wrapper">
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
          worldId={worldId}
          world={world}
          selectedEntity={selectedItem}
          isEditingProp={isEditing}
          onAddEntity={handleAddEntity}
          onUpdateEntity={handleUpdateEntity}
          onDeleteEntity={handleDeleteEntity}
          onEdit={handleEdit}
          onSave={handleSave}
          onCancelEdit={handleCancelEdit}
        />
      </div>

      {/* Mobile toggle button */}
      <button
        className="section-panel-toggle"
        onClick={() => setIsPanelOpen(!isPanelOpen)}
      >
        {isPanelOpen ? "Close" : "Sections"}
      </button>
    </div>
  );
}