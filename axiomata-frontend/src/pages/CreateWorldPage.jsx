import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateWorld } from "../services/protoWorldService";
import { createWorld } from "../services/worldService";
import ExpandablePassPanel from "../components/ExpandablePassPanel";
import Spinner from "../components/ui/Spinner";
import { useToast } from "../context/ToastContext";

// ------------------ Helper: Normalize Attributes ------------------
// Keeps original keys, only recursively ensures nested objects are normalized
const normalizeAttributes = (attrs) => {
  const normalized = {};
  Object.entries(attrs || {}).forEach(([key, value]) => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      normalized[key] = normalizeAttributes(value); // recursively normalize nested objects
    } else {
      normalized[key] = value;
    }
  });
  return normalized;
};

export default function CreateWorldPage() {
  const [protoWorld, setProtoWorld] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { addToast } = useToast();
  const navigate = useNavigate();

  // ------------------ Generate ProtoWorld ------------------
  const handleGenerateWorld = async () => {
    setGenerating(true);
    try {
      const generated = await generateWorld();
      const normalized = normalizeAttributes(generated.attributes || {});

      // ------------------ Assign Attributes to Passes ------------------
      const passes = {
        Geological: {
          TECTONIC_ACTIVITY: normalized.TECTONIC_ACTIVITY,
          WORLD_SIZE: normalized.WORLD_SIZE,
          DOMINANT_RESOURCE: normalized.DOMINANT_RESOURCE,
          RESOURCE_POOL: normalized.RESOURCE_POOL,
        },
        Biological: {
          DOMINANT_SPECIES: normalized.DOMINANT_SPECIES,
          SPECIES_POOL: normalized.SPECIES_POOL,
        },
        Cultural: {
          RELIGION_OR_BELIEF_SYSTEM: normalized.RELIGION_OR_BELIEF_SYSTEM,
          TECHNOLOGICAL_LEVEL: normalized.TECHNOLOGICAL_LEVEL,
          CONFLICT_TENDENCY: normalized.CONFLICT_TENDENCY,
          DOMINANT_CULTURE: normalized.DOMINANT_CULTURE,
          SOCIAL_STRUCTURE: normalized.SOCIAL_STRUCTURE,
        },
      };

      setProtoWorld({ ...generated, attributes: passes });

      // Pre-fill name & description
      setName(generated.worldName);
      setDescription(generated.description);

      addToast({ message: "World generated successfully!", type: "success" });
    } catch (err) {
      console.error("World generation failed:", err);
      addToast({ message: "World generation failed.", type: "error" });
    } finally {
      setGenerating(false);
    }
  };

  // ------------------ Update Pass ------------------
  const handlePassChange = (passKey, updatedAttributes) => {
    setProtoWorld({
      ...protoWorld,
      attributes: {
        ...protoWorld.attributes,
        [passKey]: normalizeAttributes(updatedAttributes),
      },
    });
  };

  // ------------------ Save World ------------------
  const handleSaveWorld = async (e) => {
    e.preventDefault();
    if (!protoWorld) return;

    setLoading(true);
    try {
      const payload = {
        name,
        description,
        attributes: protoWorld.attributes,
      };
      const savedWorld = await createWorld(payload);
      addToast({ message: `World "${savedWorld.name}" saved successfully!`, type: "success" });
      navigate(`/world-overview/${savedWorld.id}`);
    } catch (err) {
      console.error("Failed to save world:", err);
      addToast({ message: "Failed to save world. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-world-page">
      <h1>Create World</h1>

      {/* ------------------ World Form ------------------ */}
      <form onSubmit={handleSaveWorld} className="world-form">
        <div>
          <label>World Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter World Name"
            disabled={generating}
          />
        </div>
        <div>
          <label>Description (optional):</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            disabled={generating}
          />
        </div>

        {/* ------------------ Generate Button ------------------ */}
        <button
          type="button"
          onClick={handleGenerateWorld}
          disabled={generating || loading}
          style={{ marginTop: "1rem" }}
        >
          {generating ? "Generating..." : "Generate World"}
        </button>

        {generating && (
          <div className="generator-loading">
            <Spinner />
            <p>Generating world...</p>
          </div>
        )}

        {/* ------------------ Save World Button ------------------ */}
        <button
          type="submit"
          disabled={generating || loading}
          style={{ marginTop: "1rem" }}
        >
          {loading ? "Saving..." : "Save World"}
        </button>
      </form>

      {/* ------------------ Display Passes ------------------ */}
      {protoWorld && !generating && (
        <div className="pass-panels" style={{ marginTop: "1.5rem" }}>
          {["Geological", "Biological", "Cultural"].map((pass) => (
            <ExpandablePassPanel
              key={pass}
              title={`${pass} Pass`}
              attributes={protoWorld.attributes[pass] || {}}
              editable
              onChange={(updated) => handlePassChange(pass, updated)}
            />
          ))}
        </div>
      )}
    </div>
  );
}