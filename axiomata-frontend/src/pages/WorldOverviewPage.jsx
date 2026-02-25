import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getWorldById } from "../services/worldService";
import { getWorldEntities } from "../services/worldService";
import SectionPanel from "../components/SectionPanel";
import FloatingControls from "../components/FloatingControls";

export default function WorldOverviewPage() {
  const { worldId } = useParams();
  const navigate = useNavigate();
  const [world, setWorld] = useState(null);
  const [entities, setEntities] = useState([]);

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

  useEffect(() => {
    const fetchEntities = async () => {
      const data = await getWorldEntities(worldId);
      setEntities(data);
    };
    fetchEntities();
  }, [worldId]);

  if (!world) return <div>Loading...</div>


  return (
    <div>
      <h1>{world.name || "Unnamed World"}</h1>
      <p>{world.description || "High-level view of a world."}</p>

      {/* side panel */}
      <SectionPanel
        world={world}
        onSelectEntity={(entity) => {
          // Navigate to world content page for this entity
          navigate(`/world-content/${worldId}`, { state: { selectedEntity: entity } });
        }}
      />
      {/* Floating Controls */}
      {world && (
        <FloatingControls
          pageType="worldOverview"
          worldId={world.id}
          onAddEntity={(entity) => console.log("New entity:", entity)}
          onEdit={() => console.log("Edit world")}
          onSave={() => console.log("Save world")}
          onDelete={() => console.log("Delete world")}
        />
      )}
    </div>
  );
}
// ----- WorldOverviewPage.jsx -----
// TODO: List all worlds accessible to the user
// TODO: Clicking a world navigates to /world-content/:worldId
