import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getWorldById, getWorldEntities } from "../services/worldService";
import EntityCard from "../components/EntityCard";
import SectionPanel from "../components/SectionPanel";

export default function WorldContentPage() {
  const { id: worldId } = useParams();
  const [world, setWorld] = useState(null);
  const [entities, setEntities] = useState([]);
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

  // Fetch all entities for section panel
  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const data = await getWorldEntities(worldId);
        setEntities(data);
      } catch (err) {
        console.error("Failed to fetch world entities:", err);
      }
    };
    fetchEntities();
  }, [worldId]);

  if (!world) return <div>Loading world...</div>;


  return (
    <div>
      <SectionPanel
        entities={entities}
        onSelectEntity={setSelectedEntity}
      />

      <div>
        {selectedEntity ? (
          <EntityCard entity={selectedEntity} />
        ) : (
          <div>Select an entity from the panel</div>
        )}
      </div>
    </div>
  );
}