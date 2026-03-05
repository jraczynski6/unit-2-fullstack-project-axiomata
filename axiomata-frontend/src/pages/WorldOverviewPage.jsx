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

  console.log("WorldOverviewPage rendered", { worldId, isEditing });

  // ---------------- Load World ----------------
  useEffect(() => {
    const fetchWorld = async () => {
      console.log("Fetching world:", worldId);
      try {
        const data = await getWorldById(worldId);
        console.log("World loaded:", data);
        setWorld(data);
        setEditedAttributes(data.attributes || {});
      } catch (err) {
        console.error("Failed to fetch world:", err);
        addToast({ message: "Failed to load world.", type: "error" });
        navigate("/dashboard");
      }
    };
    fetchWorld();
  }, [worldId, addToast, navigate]);

  // ---------------- Edit / Save Handlers ----------------
  const handleEdit = () => {
    console.log("Edit clicked");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    console.log("Cancel edit");
    setEditedAttributes(world.attributes || {});
    setIsEditing(false);
    setHasErrors(false);
  };

  const handleSave = async () => {
    console.log("Save clicked", { editedAttributes, hasErrors });
    if (hasErrors) {
      console.log("Cannot save, validation errors exist");
      return;
    }
    try {
      const updated = await updateWorld(worldId, {
        ...world,
        attributes: editedAttributes,
      });
      console.log("World saved:", updated);
      setWorld(updated);
      setEditedAttributes(updated.attributes || {});
      setIsEditing(false);
      addToast({ message: "World updated successfully.", type: "success" });
    } catch (err) {
      console.error("Failed to save world:", err);
      addToast({ message: "Failed to save world.", type: "error" });
    }
  };

  const handleAttributesChange = (attrs) => {
    console.log("Attributes changed:", attrs);
    setEditedAttributes(attrs);
  };
  const handleValidationChange = (errors) => {
    console.log("Validation errors:", errors);
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