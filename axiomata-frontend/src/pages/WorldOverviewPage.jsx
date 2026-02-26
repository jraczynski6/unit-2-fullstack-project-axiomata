import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getWorldById } from "../services/worldService";
import SectionPanel from "../components/SectionPanel";
import FloatingControls from "../components/FloatingControls";

export default function WorldOverviewPage() {
  const { worldId } = useParams();
  const navigate = useNavigate();
  const [world, setWorld] = useState(null);

  // ---------------- Fetch World ----------------
  useEffect(() => {
    const fetchWorld = async () => {
      try {
        const data = await getWorldById(worldId);
        setWorld(data);
      } catch (err) {
        console.error("Failed to fetch world:", err);
      }
    };
    fetchWorld();
  }, [worldId]);

  // ---------------- Add / Update / Delete ----------------
  const handleAddEntity = (newEntity) => {
    if (!newEntity?.entityType) return;

    setWorld(prev => ({
      ...prev,
      [newEntity.entityType.toLowerCase() + "s"]: [
        ...(prev[newEntity.entityType.toLowerCase() + "s"] || []),
        newEntity,
      ],
    }));
  };

  const handleUpdateEntity = (updatedEntity) => {
    if (!updatedEntity?.entityType) return;

    const arrName = updatedEntity.entityType.toLowerCase() + "s";
    setWorld(prev => ({
      ...prev,
      [arrName]: prev[arrName]?.map(e => e.id === updatedEntity.id ? updatedEntity : e),
    }));
  };

  const handleDeleteEntity = async () => {
    try {
      // refetch world to get updated state after deletion
      const data = await getWorldById(worldId);
      setWorld(data);
    } catch (err) {
      console.error("Failed to refresh world after deletion:", err);
    }
  };

  // ---------------- World Controls ----------------
  const handleEditWorld = () => console.log("Edit world clicked");
  const handleSaveWorld = () => console.log("Save world clicked");
  const handleDeleteWorld = () => navigate("/dashboard");

  if (!world) return <div>Loading world...</div>;

  return (
    <div>
      <h1>{world.name || "Unnamed World"}</h1>
      <p>{world.description || "High-level view of a world."}</p>

      <SectionPanel
        world={world}
        onSelectEntity={(entity) =>
          navigate(`/world-content/${worldId}`, { state: { selectedEntity: entity } })
        }
      />

      <FloatingControls
        pageType="worldOverview"
        worldId={worldId}
        worldData={world}
        onAddEntity={handleAddEntity}
        onUpdateEntity={handleUpdateEntity}
        onDeleteEntity={handleDeleteEntity}
        onEdit={handleEditWorld}
        onSave={handleSaveWorld}
        onDelete={handleDeleteWorld}
      />
    </div>
  );
}