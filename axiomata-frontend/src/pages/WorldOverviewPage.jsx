import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SectionPanel from "../components/SectionPanel";
import WorldAttributesPanel from "../components/WorldAttributesPanel";
import FloatingControls from "../components/FloatingControls";
import { getWorldById, updateWorld } from "../services/worldService";
import { useToast } from "../context/ToastContext";
import "../assets/css/world-overview.css";
import "../assets/css/section-panel.css";

export default function WorldOverviewPage() {
  const { worldId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [world, setWorld] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedAttributes, setEditedAttributes] = useState({});
  const [hasErrors, setHasErrors] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // name/description limits 
  const NAME_LIMIT = 255;
  const DESC_LIMIT = 500;

  // name/description limit warning
  useEffect(() => {
    const errors = {};
    if (editedName.length > NAME_LIMIT) errors.name = `Name must be ≤ ${NAME_LIMIT} characters.`;
    if (editedDescription.length > DESC_LIMIT)
      errors.description = `Description must be ≤ ${DESC_LIMIT} characters.`;
    setHasErrors(Object.keys(errors).length > 0);
  }, [editedName, editedDescription]);

  useEffect(() => {
    const fetchWorld = async () => {
      try {
        const data = await getWorldById(worldId);
        setWorld(data);
        setEditedAttributes(data.attributes || {});
        setEditedName(data.name || "");
        setEditedDescription(data.description || "");
      } catch {
        addToast({ message: "Failed to load world.", type: "error" });
        navigate("/dashboard");
      }
    };
    fetchWorld();
  }, [worldId, addToast, navigate]);

  const handleEdit = () => setIsEditing(true);
  const handleCancelEdit = () => {
    setEditedAttributes(world.attributes || {});
    setEditedName(world.name || "");
    setEditedDescription(world.description || "");
    setIsEditing(false);
    setHasErrors(false);
  };

  const handleSave = async () => {
    if (hasErrors) return;
    try {
      const updated = await updateWorld(worldId, {
        ...world,
        name: editedName,
        description: editedDescription,
        attributes: editedAttributes,
      });
      setWorld(updated);
      setEditedAttributes(updated.attributes || {});
      setEditedName(updated.name);
      setEditedDescription(updated.description);
      setIsEditing(false);
      addToast({ message: "World updated successfully.", type: "success" });
    } catch {
      addToast({ message: "Failed to save world.", type: "error" });
    }
  };

  const handleAttributesChange = (attrs) => setEditedAttributes(attrs);
  const handleValidationChange = (errors) => setHasErrors(Object.keys(errors).length > 0);

  if (!world) return <p>Loading world...</p>;

  return (
    <div className="world-overview-page">
      {/* ===== SectionPanel via portal ===== */}
      {typeof document !== "undefined" && (
        <SectionPanel
          world={world}
          isOpen={isPanelOpen}
          setIsOpen={setIsPanelOpen}
          onSelectEntity={(entity) => {
            setIsPanelOpen(false);
            navigate(`/world-content/${worldId}`, { state: { selectedEntity: entity } });
          }}
        />
      )}

      {/* ===== Main Page Content ===== */}
      <div className="world-main">
        <div className="world-header-card">
          {isEditing ? (
            <>
              <div className="input-wrapper">
                <input
                  className="world-name-input"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  spellCheck={false}
                  maxLength={255}
                />
                <span className={`input-counter ${editedName.length > 255 ? "error" : ""}`}>
                  {editedName.length}/255
                </span>
              </div>

              <div className="input-wrapper">
                <textarea
                  className="world-desc-input"
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  spellCheck={false}
                  maxLength={500}
                />
                <span className={`input-counter ${editedDescription.length > 500 ? "error" : ""}`}>
                  {editedDescription.length}/500
                </span>
              </div>
            </>
          ) : (
            <>
              <h1 className="world-name">{world.name || "Unnamed World"}</h1>
              <p className="world-desc">{world.description || "No description available."}</p>
            </>
          )}
        </div>
      </div>

      {!isPanelOpen && (
        <div className="floating-controls-wrapper">
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
      )}

      <WorldAttributesPanel
        attributes={editedAttributes}
        editable={isEditing}
        onChange={handleAttributesChange}
        onValidationChange={handleValidationChange}
      />

      {/* Mobile toggle button */}
      <button
        className="section-panel-toggle"
        onClick={() => setIsPanelOpen(!isPanelOpen)}
      >
        {isPanelOpen ? "Close" : "Sections"}
      </button>
    </div>
  );
}