import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getWorldById, updateWorld } from "../services/worldService";
import SectionPanel from "../components/SectionPanel";
import FloatingControls from "../components/FloatingControls";
import Spinner from "../components/ui/Spinner";
import { useToast } from "../context/ToastContext";
import WorldAttributesPanel from "../components/WorldAttributesPanel";

export default function WorldOverviewPage() {
  const { worldId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [world, setWorld] = useState(null);
  const [isEditingWorld, setIsEditingWorld] = useState(false);
  const [editedAttributes, setEditedAttributes] = useState({});

  // ---------------- Fetch World ----------------
  useEffect(() => {
    const fetchWorld = async () => {
      try {
        const data = await getWorldById(worldId);
        setWorld(data);
      } catch (err) {
        console.error("Failed to fetch world:", err);
        addToast({ message: "Failed to load world.", type: "error" });
      }
    };
    if (worldId) fetchWorld();
  }, [worldId]);

  // ---------------- World Controls ----------------
  const handleEditWorld = () => {
    setIsEditingWorld(true);
    setEditedAttributes(world?.attributes || {});
  };

  const handleSaveWorld = async () => {
    const updatedWorld = { ...world, attributes: editedAttributes };
    try {
      await updateWorld(worldId, updatedWorld);
      setWorld(updatedWorld);             // sync frontend
      setIsEditingWorld(false);
      addToast({ message: "World saved successfully.", type: "success" });
    } catch (err) {
      console.error("Failed to save world:", err);
      addToast({ message: "Failed to save world.", type: "error" });
    }
  };

  const handleCancelEdit = () => {
    setIsEditingWorld(false);
    setEditedAttributes(world?.attributes || {}); // revert changes
  };

  if (!world) return <Spinner />;

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

      <WorldAttributesPanel
        attributes={editedAttributes}
        editable={isEditingWorld}
        onChange={setEditedAttributes}
      />

      {world && (
        <FloatingControls
          pageType="worldOverview"
          worldId={worldId}
          world={world} // always defined here
          isEditingProp={isEditingWorld}
          onEdit={handleEditWorld}
          onSave={handleSaveWorld}
          onCancelEdit={() => setIsEditingWorld(false)}
        />
      )}
    </div>
  );
}
// TODO: WorldOverview Panel State
// - Implement frontend-only state tracking for collapsible panels (stats & entities)
// - Ensure UI updates when panels are opened/closed
// - Connect panel state to backend/state sync later
// - Test with loading spinners, empty states, and entity list updates
// TODO: fetchWorld failure toast – Confirm behavior after WorldOverview state syncing is fully implemented