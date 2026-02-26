import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { getWorldById } from "../services/worldService";
import EntityCard from "../components/EntityCard";
import SectionPanel from "../components/SectionPanel";
import FloatingControls from "../components/FloatingControls";

export default function WorldContentPage() {
  const { worldId } = useParams();
  const location = useLocation();
  const initialSelected = location.state?.selectedEntity || null;

  const [world, setWorld] = useState(null);
  const [selectedEntity, setSelectedEntity] = useState(initialSelected);

  // ---------------- Fetch World ----------------
  useEffect(() => {
    const fetchWorld = async () => {
      try {
        const data = await getWorldById(worldId);
        setWorld(data);

        // Auto-select first entity if none selected
        if (!selectedEntity) {
          const firstEntity =
            data.locations?.[0] ||
            data.factions?.[0] ||
            data.characters?.[0] ||
            data.items?.[0] ||
            null;
          setSelectedEntity(firstEntity);
        }
      } catch (err) {
        console.error("Failed to fetch world:", err);
      }
    };

    if (worldId) fetchWorld();
  }, [worldId]);

  // ---------------- Add / Update / Delete ----------------
  const handleAddEntity = (newEntity) => {
    setWorld(prev => {
      const updatedWorld = { ...prev };
      const type = newEntity.entityType;
      if (!type) return prev;

      const arrName = type.toLowerCase() + "s";
      updatedWorld[arrName] = [...(prev[arrName] || []), newEntity];

      return updatedWorld;
    });
  };

  const handleUpdateEntity = (updatedEntity) => {
    setWorld(prev => {
      const updatedWorld = { ...prev };
      const type = updatedEntity.entityType;
      if (!type) return prev;

      const arrName = type.toLowerCase() + "s";
      updatedWorld[arrName] = (prev[arrName] || []).map(e =>
        e.id === updatedEntity.id ? updatedEntity : e
      );

      // Keep selected entity in sync
      if (selectedEntity?.id === updatedEntity.id) setSelectedEntity(updatedEntity);

      return updatedWorld;
    });
  };

  const handleDeleteEntity = async () => {
    try {
      const data = await getWorldById(worldId); // refetch world
      setWorld(data);
      setSelectedEntity(null);
    } catch (err) {
      console.error("Failed to refresh world after deletion:", err);
    }
  };

  // ---------------- World Controls ----------------
  const handleEdit = () => console.log("Edit clicked", selectedEntity);
  const handleSave = () => console.log("Save clicked", selectedEntity);
  const handleDelete = () => console.log("Delete clicked", selectedEntity);

  if (!world) return <div>Loading world...</div>;

  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      <SectionPanel
        world={world}
        onSelectEntity={(entity) =>
          setSelectedEntity({ ...entity, entityType: entity.entityType || entity.type })
        }
      />

      <div>
        {selectedEntity ? (
          <EntityCard entity={selectedEntity} world={world} />
        ) : (
          <div>Select an entity from the panel</div>
        )}
      </div>

      <FloatingControls
        pageType="worldContent"
        worldId={world.id}
        worldData={world}
        selectedEntity={selectedEntity}
        onAddEntity={handleAddEntity}
        onUpdateEntity={handleUpdateEntity}
        onDeleteEntity={handleDeleteEntity}
        onEdit={handleEdit}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}