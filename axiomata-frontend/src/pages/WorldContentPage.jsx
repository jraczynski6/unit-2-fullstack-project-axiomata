import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import SectionPanel from "../components/SectionPanel";
import EntityCard from "../components/EntityCard";
import FloatingControls from "../components/FloatingControls";
import AddEntityModal from "../components/AddEntityModal";
import Spinner from "../components/ui/Spinner";
import {
  getWorldById,
  createLocation,
  createFaction,
  createCharacter,
  createItem,
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
  const [modalOpen, setModalOpen] = useState(false);

  // ------------------- Entity selection -------------------
  const handleSelectEntity = (entity) => {
    setIsPanelOpen(false);
    setSelectedItem(entity);
    setSelectedCategory(entity.category);
    setIsEditing(false);
  };

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

        // --------- Handle Add New modal on navigation ---------
        if (location.state?.openAddModal) {
          console.log("Opening modal due to location.state.openAddModal");
          setModalOpen(true);
          // clear the state
          navigate(location.pathname, { replace: true, state: {} });
        }
      } catch (err) {
        addToast({ message: "Failed to load world.", type: "error" });
        navigate("/dashboard");
      }
    };

    fetchWorld();
  }, [worldId, location.state, addToast, navigate, location.pathname]);

  // ------------------- Sync draft with selected item -------------------
  useEffect(() => {
    if (selectedItem) {
      setDraftEntity(selectedItem);
    }
  }, [selectedItem]);

  // ------------------- CRUD handlers -------------------
  const handleAddEntity = (newItem, category) => {
    console.log("handleAddEntity fired");
    console.log("Raw newItem:", newItem, "Category:", category);

    if (!category) {
      console.error("No category provided for handleAddEntity");
      return;
    }

    // Ensure category is a string
    const categoryStr = typeof category === "string" ? category : category?.name || "Entity";
    const key = categoryStr.toLowerCase() + "s";

    // Build item with category
    const itemWithCategory = { ...newItem, category: categoryStr };

    setWorld((prev) => {
      console.log("Previous world state:", prev);

      // Ensure array exists
      const updatedList = [...(prev[key] || []), itemWithCategory];

      const newState = { ...prev, [key]: updatedList };
      console.log(`New world state after adding ${categoryStr}:`, newState);
      return newState;
    });

    // Set selection immediately
    setSelectedItem(itemWithCategory);
    setSelectedCategory(categoryStr);

    console.log(`Added ${categoryStr}:`, itemWithCategory);
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

      handleAddEntity({ ...result, category: entityType }, entityType);

      addToast({
        message: `${entityType} created successfully!`,
        type: "success",
      });

    } catch (err) {
      console.error(err);
      addToast({
        message: `Failed to create ${entityType}.`,
        type: "error",
      });
    } finally {
      setModalOpen(false);
    }
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

  const handleDeleteEntity = (entity) => {
    if (!entity) return;

    const { id, category } = entity;
    if (!id || !category) return;

    const key = category.toLowerCase() + "s";

    setWorld((prev) => ({
      ...prev,
      [key]: prev[key]?.filter((i) => i.id !== id) || [],
    }));

    setSelectedItem(null);
    setSelectedCategory(null);
    setDraftEntity(null);
    setIsEditing(false);

    addToast({ message: `${category} deleted successfully!`, type: "success" });
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
      {/* ===== SectionPanel ===== */}
      {typeof document !== "undefined" && (
        <SectionPanel
          world={world}
          isOpen={isPanelOpen}
          setIsOpen={setIsPanelOpen}
          onSelectEntity={handleSelectEntity}
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

        {/* Floating controls hidden when modal is open */}
        <div className={`floating-controls-wrapper ${modalOpen ? "hidden" : ""}`}>
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
            onOpenModal={() => setModalOpen(true)}
          />
        </div>

        {modalOpen && (
          <AddEntityModal
            worldId={worldId}
            world={world}
            onClose={() => setModalOpen(false)}
            onSubmit={handleModalSubmit}
          />
        )}

        {/* Mobile toggle button */}
        <button
          className="section-panel-toggle"
          onClick={() => setIsPanelOpen(!isPanelOpen)}
        >
          {isPanelOpen ? "Close" : "Sections"}
        </button>
      </div>
    </div>
  );
}