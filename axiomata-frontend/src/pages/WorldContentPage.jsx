import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getWorldById } from "../services/worldService";
import EntityCard from "../components/EntityCard";
import SectionPanel from "../components/SectionPanel";
import FloatingControls from "../components/FloatingControls";

export default function WorldContentPage() {
  const { worldId } = useParams();
  const [world, setWorld] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // ---------------- Fetch World ----------------
  useEffect(() => {
    const fetchWorld = async () => {
      try {
        const data = await getWorldById(worldId);
        setWorld(data);

        // Auto-select first item if any exists
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
      } catch (err) {
        console.error("Failed to fetch world:", err);
      }
    };

    if (worldId) fetchWorld();
  }, [worldId]);

  // ---------------- Add / Update / Delete ----------------
  const handleAddItem = (newItem, category) => {
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
        onSelectItem={(item, category) => {
          setSelectedItem(item);
          setSelectedCategory(category);
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
        worldData={world}
        selectedItem={selectedItem}
        selectedCategory={selectedCategory}
        onAddItem={handleAddItem}
        onUpdateItem={handleUpdateItem}
        onDeleteItem={handleDeleteItem}
        onEdit={handleEdit}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}