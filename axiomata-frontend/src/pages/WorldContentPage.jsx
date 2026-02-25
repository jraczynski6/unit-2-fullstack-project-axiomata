import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getWorldById } from "../services/worldService";
import EntityCard from "../components/EntityCard";
import SectionPanel from "../components/SectionPanel";

export default function WorldContentPage() {
  const { worldId } = useParams();
  const [world, setWorld] = useState(null);
  const [selectedEntity, setSelectedEntity] = useState(null);

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

  if (!world) return <div>Loading world...</div>;

  return (
    <div>
      {/* receive world */}
      <SectionPanel world={world} onSelectEntity={setSelectedEntity} />

      {/* Entity card */}
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