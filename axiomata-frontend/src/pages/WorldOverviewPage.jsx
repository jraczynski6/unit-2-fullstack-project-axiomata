import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FloatingControls from "../components/FloatingControls";
import WorldAttributesPanel from "../components/WorldAttributesPanel";
import { getWorldById, updateWorld } from "../services/worldService";
import { useToast } from "../context/ToastContext";

export default function WorldOverviewPage() {
  const { worldId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [world, setWorld] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedAttributes, setEditedAttributes] = useState({});
  const [hasErrors, setHasErrors] = useState(false);

  // ---------------- Load World ----------------
  useEffect(() => {
    const fetchWorld = async () => {
      try {
        const data = await getWorldById(worldId);
        setWorld(data);
        setEditedAttributes(data.attributes || {});
      } catch (err) {
        addToast({ message: "Failed to load world.", type: "error" });
        navigate("/dashboard");
      }
    };
    fetchWorld();
  }, [worldId, addToast, navigate]);

  // ---------------- Edit / Save Handlers ----------------
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditedAttributes(world.attributes || {});
    setIsEditing(false);
    setHasErrors(false);
  };

  const handleSave = async () => {
    if (hasErrors) return;
    try {
      const updated = await updateWorld(worldId, {
        ...world,
        attributes: editedAttributes,
      });
      setWorld(updated);
      setEditedAttributes(updated.attributes || {});
      setIsEditing(false);
      addToast({ message: "World updated successfully.", type: "success" });
    } catch (err) {
      addToast({ message: "Failed to save world.", type: "error" });
    }
  };

  const handleAttributesChange = (attrs) => {
    setEditedAttributes(attrs);
  };

  const handleValidationChange = (errors) => {
    setHasErrors(Object.keys(errors).length > 0);
  };

  if (!world) return <p>Loading world...</p>;

  return (
    <div className="world-overview-page">
      <h1>{world.name || "Unnamed World"}</h1>
      <p>{world.description || "No description available."}</p>

      <WorldAttributesPanel
        attributes={editedAttributes}
        editable={isEditing}
        onChange={handleAttributesChange}
        onValidationChange={handleValidationChange}
      />

      <FloatingControls
        pageType="worldOverview"
        worldId={worldId}
        world={world}
        isEditingProp={isEditing}
        hasErrors={hasErrors}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancelEdit={handleCancelEdit}
      />
    </div>
  );
}