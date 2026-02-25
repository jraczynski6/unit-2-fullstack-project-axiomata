import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getWorldById } from "../services/worldService";
import { getWorldEntities } from "../services/worldService";
import SectionPanel from "../components/SectionPanel";

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
    </div>
  );
}
// TODO: Receive `world` as prop from route wrapper or parent container
// TODO: Display world name and description
// TODO: Parse world.attributes JSON string safely
// TODO: Map parsed attributes into badges or UI elements
// TODO: Add reroll button once world generation logic exists
// TODO: Ensure reroll triggers world state update in WorldContentPage
// TODO: Integrate side panel for navigation to child pages (Entities, Locations, Factions, etc.)
// TODO: Handle loading / empty world cases gracefully
// TODO: Style attribute badges and overview layout (no inline styles, use classes)