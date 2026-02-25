import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getWorldById } from "../services/worldService";

export default function WorldOverviewPage() {
  const { worldId } = useParams();
  const [world, setWorld] = useState(null);

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

  if (!world) return <div>Loading...</div>


  return (
    <div>
      <h1>{world?.name || "Unnamed World"}</h1>
      <p>{world?.description || "High-level view of a world."}</p>
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