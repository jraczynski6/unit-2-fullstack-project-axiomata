import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { getWorldById } from "../services/worldService";
import EntityCard from "../components/EntityCard";
import SectionPanel from "../components/SectionPanel";
import FloatingControls from "../components/FloatingControls";

export default function WorldContentPage() {
  const location = useLocation();
  const { worldId } = useParams();
  const [world, setWorld] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // ---------------- Fetch World ----------------
  useEffect(() => {
    const fetchWorld = async () => {
      const data = await getWorldById(worldId);
      setWorld(data);

      // Check if navigating with preselected entity
      const preSelected = location.state?.selectedEntity;
      if (preSelected) {
        setSelectedItem(preSelected);
        setSelectedCategory(preSelected.category);
        return;
      }

      // Otherwise auto-select first item
      const firstItem =
        data.locations?.[0] ||
        data.factions?.[0] ||
        data.characters?.[0] ||
        data.items?.[0];

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

  // ---------------- Add / Update / Delete ----------------
  const handleAddItem = (newItem, category) => {
    if (!category) {
      console.error("handleAddItem called with undefined category", newItem);
      return;
    }

    setWorld((prev) => {
      const updatedWorld = { ...prev };
      const key = category.toLowerCase() + "s";
      updatedWorld[key] = [...(prev[key] || []), newItem];
      return updatedWorld;
    });
  };

  const handleUpdateItem = (updatedItem, category) => {
    setWorld((prev) => {
      const updatedWorld = { ...prev };
      const key = category.toLowerCase() + "s";
      if (updatedWorld[key]) {
        updatedWorld[key] = updatedWorld[key].map((i) =>
          i.id === updatedItem.id ? updatedItem : i
        );
      }
      if (selectedItem?.id === updatedItem.id) setSelectedItem(updatedItem);
      return updatedWorld;
    });
  };

  const handleDeleteItem = async () => {
    try {
      const data = await getWorldById(worldId); // refetch world
      setWorld(data);
      setSelectedItem(null);
      setSelectedCategory(null);
    } catch (err) {
      console.error("Failed to refresh world after deletion:", err);
    }
  };

  // ---------------- World Controls ----------------
  const handleEdit = () => console.log("Edit clicked", selectedItem);
  const handleSave = () => console.log("Save clicked", selectedItem);
  const handleDelete = () => console.log("Delete clicked", selectedItem);

  if (!world) return <div>Loading world...</div>;

  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      <SectionPanel
        world={world}
        onSelectEntity={(entity) => {
          setSelectedItem(entity);
          setSelectedCategory(entity.category);
        }}
      />

      <div>
        {selectedItem ? (
          <EntityCard item={selectedItem} category={selectedCategory} world={world} />
        ) : (
          <div>Select an item from the panel</div>
        )}
      </div>

      <FloatingControls
        pageType="worldContent"
        worldId={world.id}
        world={world}
        selectedEntity={selectedItem}
        onAddEntity={handleAddItem}
        onUpdateEntity={handleUpdateItem}
        onDeleteEntity={handleDeleteItem}
        onEdit={handleEdit}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}