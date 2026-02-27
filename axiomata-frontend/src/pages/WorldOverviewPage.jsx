import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getWorldById, updateWorld, deleteWorld } from "../services/worldService";
import SectionPanel from "../components/SectionPanel";
import FloatingControls from "../components/FloatingControls";
import Spinner from "../components/ui/Spinner";
import { useToast } from "../context/ToastContext";
import WorldAttributesPanel from "../components/WorldAttributesPanel";

export default function WorldOverviewPage() {
  const { worldId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();

  const [world, setWorld] = useState(null);

  // Editing state
  const [isEditingWorld, setIsEditingWorld] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedAttributes, setEditedAttributes] = useState({});

  // ---------------- Fetch World ----------------
  const fetchWorld = async () => {
    try {
      const data = await getWorldById(worldId);

      // parse attributes safely
      let parsedAttributes = {};
      if (data.attributes) {
        try {
          parsedAttributes = JSON.parse(data.attributes);
        } catch {
          parsedAttributes = {};
        }
      }

      setWorld({ ...data, attributesObj: parsedAttributes });
      setEditedAttributes(parsedAttributes);
    } catch (err) {
      console.error("Failed to fetch world:", err);
      addToast({ message: "Failed to load world.", type: "error" });
    }
  };

  // Refetch on mount
  useEffect(() => {
    if (worldId) fetchWorld();
  }, [worldId, location.key]);


  // ---------------- World Controls ----------------

  // Edit World
  const handleEditWorld = () => {
    if (!world) return;
    setIsEditingWorld(true);
    setEditedName(world.name || "");
    setEditedDescription(world.description || "");
    setEditedAttributes(world.attributesObj || {});
  };

  // Save World
  const handleSaveWorld = async () => {
    if (!world) return;

    const safeAttributes =
      typeof editedAttributes === "object" && editedAttributes !== null
        ? editedAttributes
        : {};

    const updatedWorld = {
      ...world,
      name: editedName,
      description: editedDescription,
      attributes: JSON.stringify(safeAttributes),
    };

    try {
      const savedWorld = await updateWorld(worldId, updatedWorld);

      setWorld({
        ...savedWorld,
        attributesObj: safeAttributes,
      });
      setIsEditingWorld(false);
      addToast({ message: "World saved successfully.", type: "success" });
    } catch (err) {
      console.error(err);
      addToast({ message: "Failed to save world.", type: "error" });
    }
  };

  // Delete World
  const handleDeleteWorld = async () => {
    try {
      await deleteWorld(worldId);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      addToast({ message: "Failed to delete world.", type: "error" });
    }
  };

  // ---------------- Entity Controls ----------------

  // Add Entity
  const handleAddEntity = async (entityType) => {
    // Navigate immediately to content page to create entity
    navigate(`/world-content/${worldId}`);
  };

  if (!world) return <Spinner />;


  return (
    <div>
      {/* ---------------- Editable Name & Description ---------------- */}
      {isEditingWorld ? (
        <>
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            placeholder="World Name"
          />
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            placeholder="World Description"
          />
        </>
      ) : (
        <>
          <h1>{world.name || "Unnamed World"}</h1>
          <p>{world.description || "High-level view of a world."}</p>
        </>
      )}

      {/* ---------------- Section Panel ---------------- */}
      <SectionPanel
        world={world}
        onSelectEntity={(entity) =>
          navigate(`/world-content/${worldId}`, { state: { selectedEntity: entity } })
        }
      />

      {/* ---------------- World Attributes Panel ---------------- */}
      <WorldAttributesPanel
        attributes={isEditingWorld ? editedAttributes : world?.attributesObj || {}}
        editable={isEditingWorld}
        onChange={(updatedAttributes) => setEditedAttributes(updatedAttributes)}
      />

      {/* ---------------- Floating Controls ---------------- */}
      <FloatingControls
        pageType="worldOverview"
        worldId={worldId}
        world={world}
        isEditingProp={isEditingWorld}
        onEdit={handleEditWorld}
        onSave={handleSaveWorld}
        onCancelEdit={() => setIsEditingWorld(false)}
        onAddEntity={handleAddEntity}
        onDeleteWorld={handleDeleteWorld}
      />
    </div>
  );
}

// TODO: WorldOverview Panel State
// - Implement frontend-only state tracking for collapsible panels (stats & entities)
// - Ensure UI updates when panels are opened/closed
// - Connect panel state to backend/state sync later
// - Test with loading spinners, empty states, and entity list updates
// TODO: fetchWorld failure toast – Confirm behavior after WorldOverview state syncing is fully implemented