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

  // Validation state
  const [validationErrors, setValidationErrors] = useState({
    name: null,
    description: null,
    attributes: {},
  });

  // ---------------- Fetch World ----------------
  const fetchWorld = async () => {
    try {
      const data = await getWorldById(worldId);
      setWorld({ ...data, attributesObj: data.attributes || {} });
      setEditedAttributes(data.attributes || {});
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
    setEditedAttributes({ ...world.attributesObj });
    setValidationErrors({
      name: world.name ? null : "Name is required",
      description: null,
      attributes: {},
    });
  };

  const handleCancelEditWorld = () => {
    if (!world) return;
    setEditedName(world.name || "");
    setEditedDescription(world.description || "");
    setEditedAttributes({ ...world.attributesObj });
    setIsEditingWorld(false);
    setValidationErrors({ name: null, description: null, attributes: {} });
  };

  const handleSaveWorld = async () => {
    if (!world) return;

    if (hasErrors) {
      addToast({ message: "Cannot save: fix invalid fields first.", type: "error" });
      return;
    }

    const updatedWorld = {
      ...world,
      name: editedName,
      description: editedDescription,
      attributes: editedAttributes,
    };

    try {
      const savedWorld = await updateWorld(worldId, updatedWorld);
      setWorld({ ...savedWorld, attributesObj: { ...editedAttributes } });
      setIsEditingWorld(false);
      addToast({ message: "World saved successfully.", type: "success" });
      setValidationErrors({ name: null, description: null, attributes: {} });
    } catch (err) {
      console.error(err);
      addToast({ message: "Failed to save world.", type: "error" });
    }
  };

  const handleDeleteWorld = async () => {
    try {
      await deleteWorld(worldId);
      addToast({ message: "World deleted successfully.", type: "success" });
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      addToast({ message: "Failed to delete world.", type: "error" });
    }
  };

  const handleAddEntity = (entityType) => {
    navigate(`/world-content/${worldId}`);
  };

  if (!world) return <Spinner />;

  // --------------------- Validation --------------------
  const hasErrors =
    Boolean(validationErrors.name) ||
    Boolean(validationErrors.description) ||
    Object.keys(validationErrors.attributes).some((k) => validationErrors.attributes[k]);

  return (
    <div className="world-overview-page">
      {/* Editable Name & Description */}
      <div className="world-header">
        {isEditingWorld ? (
          <div className="world-edit-fields">
            <input
              type="text"
              value={editedName}
              onChange={(e) => {
                setEditedName(e.target.value);
                setValidationErrors((prev) => ({
                  ...prev,
                  name: e.target.value.trim() ? null : "Name is required",
                }));
              }}
              placeholder="World Name"
              className="world-name-input"
            />
            {validationErrors.name && <span className="error-text">{validationErrors.name}</span>}

            <textarea
              value={editedDescription}
              onChange={(e) => {
                setEditedDescription(e.target.value);
                setValidationErrors((prev) => ({ ...prev, description: null }));
              }}
              placeholder="World Description"
              className="world-description-input"
            />
            {validationErrors.description && (
              <span className="error-text">{validationErrors.description}</span>
            )}
          </div>
        ) : (
          <div className="world-display">
            <h1 className="world-name">{world.name || "Unnamed World"}</h1>
            <p className="world-description">
              {world.description || "High-level view of a world."}
            </p>
          </div>
        )}
      </div>

      {/* Section Panel */}
      <div className="world-section-panel">
        <SectionPanel
          world={world}
          onSelectEntity={(entity) =>
            navigate(`/world-content/${worldId}`, { state: { selectedEntity: entity } })
          }
        />
      </div>

      {/* World Attributes Panel */}
      <div className="world-attributes-panel">
        <WorldAttributesPanel
          attributes={isEditingWorld ? editedAttributes : world.attributesObj || {}}
          editable={isEditingWorld}
          onChange={(updatedAttributes) => setEditedAttributes(updatedAttributes)}
          onValidationChange={(errors) =>
            setValidationErrors((prev) => ({ ...prev, attributes: errors }))
          }
        />
      </div>

      {/* Floating Controls */}
      <FloatingControls
        pageType="worldOverview"
        worldId={worldId}
        world={world}
        isEditingProp={isEditingWorld}
        hasErrors={hasErrors}
        onEdit={handleEditWorld}
        onSave={handleSaveWorld}
        onCancelEdit={handleCancelEditWorld}
        onAddEntity={handleAddEntity}
        onDeleteWorld={handleDeleteWorld}
      />
    </div>
  );
}