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

      console.log("FETCH WORLD ATTRIBUTES:", data.attributes);

      setWorld({ ...data, attributesObj: data.attributes || {} });
      setEditedAttributes(data.attributes || {});
      console.log("STATE SET: world.attributesObj & editedAttributes", data.attributes || {});
    } catch (err) {
      console.error("Failed to fetch world:", err);
      addToast({ message: "Failed to load world.", type: "error" });
    }
  };

  useEffect(() => {
    if (worldId) fetchWorld();
  }, [worldId, location.key]);

  // ---------------- World Controls ----------------
  const handleEditWorld = () => {
    if (!world) return;
    setIsEditingWorld(true);
    setEditedName(world.name || "");
    setEditedDescription(world.description || "");
    setEditedAttributes(world.attributesObj || {});
  };

  const handleCancelEditWorld = () => {
    if (!world) return;
    setEditedName(world.name || "");
    setEditedDescription(world.description || "");
    setEditedAttributes(world.attributesObj || {});
    setIsEditingWorld(false);
  };

  const handleSaveWorld = async () => {
    if (!world) return;

    const updatedWorld = {
      ...world,
      name: editedName,
      description: editedDescription,
      attributes: editedAttributes, // <-- now an object
    };

    try {
      const savedWorld = await updateWorld(worldId, updatedWorld);
      setWorld({ ...savedWorld, attributesObj: editedAttributes });
      setIsEditingWorld(false);
      addToast({ message: "World saved successfully.", type: "success" });
    } catch (err) {
      console.error(err);
      addToast({ message: "Failed to save world.", type: "error" });
    }
  };

  const handleDeleteWorld = async () => {
    try {
      await deleteWorld(worldId);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      addToast({ message: "Failed to delete world.", type: "error" });
    }
  };

  const handleAddEntity = async (entityType) => {
    navigate(`/world-content/${worldId}`);
  };

  if (!world) return <Spinner />;

  return (
    <div>
      {/* Editable Name & Description */}
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

      {/* Section Panel */}
      <SectionPanel
        world={world}
        onSelectEntity={(entity) =>
          navigate(`/world-content/${worldId}`, { state: { selectedEntity: entity } })
        }
      />

      {/* World Attributes Panel */}
      <WorldAttributesPanel
        attributes={isEditingWorld ? editedAttributes : world?.attributesObj || {}}
        editable={isEditingWorld}
        onChange={(updatedAttributes) => setEditedAttributes(updatedAttributes)}
      />

      {/* Floating Controls */}
      <FloatingControls
        pageType="worldOverview"
        worldId={worldId}
        world={world}
        isEditingProp={isEditingWorld}
        onEdit={handleEditWorld}
        onSave={handleSaveWorld}
        onCancelEdit={handleCancelEditWorld}
        onAddEntity={handleAddEntity}
        onDeleteWorld={handleDeleteWorld}
      />
    </div>
  );
}