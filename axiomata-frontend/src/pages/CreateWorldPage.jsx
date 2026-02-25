import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createWorld } from "../services/worldService";

export default function CreateWorldPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const newWorld = await createWorld({ name, description });
      console.log("World Created:", newWorld);
      navigate(`/world-overview/${newWorld.id}`);
    } catch (err) {
      console.error("Failed to create world:", err);
      setError("Failed to create world. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-world-page">
      <h1>Create World</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>World Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter World Name"
          />
        </div>

        <div>
          <label>Description (optional):</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
          />
        </div>

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create World"}
        </button>
      </form>
    </div>
  );
}