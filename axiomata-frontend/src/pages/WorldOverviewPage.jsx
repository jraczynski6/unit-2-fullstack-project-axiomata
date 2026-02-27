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
    if (worldId) fetchWorld();
  }, [worldId]);

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
        onEdit={handleEditWorld}
        onSave={handleSaveWorld}
        onDelete={handleDeleteWorld}
      />
    </div>
  );
}

// TODO: WorldOverview Panel State
// - Implement frontend-only state tracking for collapsible panels (stats & entities)
// - Ensure UI updates when panels are opened/closed
// - Connect panel state to backend/state sync later
// - Test with loading spinners, empty states, and entity list updates