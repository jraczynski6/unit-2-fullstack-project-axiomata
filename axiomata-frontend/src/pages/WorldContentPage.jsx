import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getWorldById } from "../services/worldService";
import EntityCard from "../components/EntityCard";
import SectionPanel from "../components/SectionPanel";

export default function WorldContentPage() {
  const { worldId } = useParams();
  const location = useLocation();
  const [world, setWorld] = useState(null);
  const initialSelected = location.state?.selectedEntity || null;
  const [selectedEntity, setSelectedEntity] = useState(initialSelected);

  // Fetch world data
  useEffect(() => {
    const fetchWorld = async () => {
      try {
        const data = await getWorldById(worldId);
        setWorld(data);
      } catch (err) {
        console.error("Failed to fetch world:", err);
      }
    };
    if (worldId) fetchWorld();
  }, [worldId]);

  if (!world) return <div>Loading world...</div>;

  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      {/* SectionPanel updates selectedEntity on click */}
      <SectionPanel world={world} onSelectEntity={setSelectedEntity} />

      {/* EntityCard update when an entity is clicked */}
      <div>
        {selectedEntity ? (
          <EntityCard entity={selectedEntity} world={world} />
        ) : (
          <div>Select an entity from the panel</div>
        )}
      </div>
    </div>
  );
}
// ----- WorldContentPage.jsx -----
// TODO: Fetch world data using getWorldById(worldId)
// TODO: Show loading state while fetching
// TODO: Receive `world` as prop from route wrapper or parent container
// TODO: Pass world data to SectionPanel
// TODO: Ensure entity selection works on first click
// TODO: Remove breadcrumbs; header handles navigation
// TODO: Display world name and description
// TODO: Parse world.attributes JSON string safely
// TODO: Map parsed attributes into badges or UI elements
// TODO: Add reroll button once world generation logic exists
// TODO: Ensure reroll triggers world state update in WorldContentPage
// TODO: Handle loading / empty world cases gracefully