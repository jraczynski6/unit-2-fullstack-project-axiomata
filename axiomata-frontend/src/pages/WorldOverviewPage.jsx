// WorldOverviewPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getWorldById, getWorldEntities } from "../services/worldService";
import SectionPanel from "../components/SectionPanel";
import FloatingControls from "../components/FloatingControls";

export default function WorldOverviewPage() {
  const { worldId } = useParams();
  const navigate = useNavigate();
  const [world, setWorld] = useState(null);
  const [entities, setEntities] = useState([]);

  // Fetch world details
  useEffect(() => {
    const fetchWorld = async () => {
      try {
        const data = await getWorldById(worldId);
        setWorld(data);
      } catch (err) {
        console.error("Failed to fetch world:", err);
      }
    };
    fetchWorld();
  }, [worldId]);

  // Fetch world entities (flattened for SectionPanel)
  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const data = await getWorldEntities(worldId);
        setEntities(data);
      } catch (err) {
        console.error("Failed to fetch entities:", err);
      }
    };
    fetchEntities();
  }, [worldId]);

  if (!world) return <div>Loading world...</div>;

  /** Add new entity */
  const handleAddEntity = (newEntity) => {
    setWorld((prevWorld) => {
      let updatedWorld = { ...prevWorld };
      switch (newEntity.type) {
        case "Location":
          updatedWorld.locations = [...(prevWorld.locations || []), newEntity];
          break;
        case "Faction":
          updatedWorld.factions = [...(prevWorld.factions || []), newEntity];
          break;
        case "Character":
          updatedWorld.characters = [...(prevWorld.characters || []), newEntity];
          break;
        case "Item":
          updatedWorld.items = [...(prevWorld.items || []), newEntity];
          break;
        default:
          break;
      }

      // update flattened entities for SectionPanel
      setEntities([
        ...(updatedWorld.locations || []),
        ...(updatedWorld.factions || []),
        ...(updatedWorld.characters || []),
        ...(updatedWorld.items || []),
      ]);

      return updatedWorld;
    });
  };

  /** Update an existing entity */
  const handleUpdateEntity = (updatedEntity) => {
    setWorld((prevWorld) => {
      let updatedWorld = { ...prevWorld };
      const updateArray = (arrName) => {
        if (updatedWorld[arrName]) {
          updatedWorld[arrName] = updatedWorld[arrName].map((e) =>
            e.id === updatedEntity.id ? updatedEntity : e
          );
        }
      };
      switch (updatedEntity.type) {
        case "Location": updateArray("locations"); break;
        case "Faction": updateArray("factions"); break;
        case "Character": updateArray("characters"); break;
        case "Item": updateArray("items"); break;
      }

      setEntities([
        ...(updatedWorld.locations || []),
        ...(updatedWorld.factions || []),
        ...(updatedWorld.characters || []),
        ...(updatedWorld.items || []),
      ]);

      return updatedWorld;
    });
  };

  /** Delete an existing entity */
  const handleDeleteEntity = (deletedId, type) => {
    setWorld((prevWorld) => {
      let updatedWorld = { ...prevWorld };
      const deleteFromArray = (arrName) => {
        if (updatedWorld[arrName]) {
          updatedWorld[arrName] = updatedWorld[arrName].filter((e) => e.id !== deletedId);
        }
      };
      switch (type) {
        case "Location": deleteFromArray("locations"); break;
        case "Faction": deleteFromArray("factions"); break;
        case "Character": deleteFromArray("characters"); break;
        case "Item": deleteFromArray("items"); break;
      }

      setEntities([
        ...(updatedWorld.locations || []),
        ...(updatedWorld.factions || []),
        ...(updatedWorld.characters || []),
        ...(updatedWorld.items || []),
      ]);

      return updatedWorld;
    });
  };

  /** World controls */
  const handleEditWorld = () => console.log("Edit world clicked");
  const handleSaveWorld = () => console.log("Save world clicked");
  const handleDeleteWorld = () => navigate("/dashboard");

  return (
    <div>
      <h1>{world.name || "Unnamed World"}</h1>
      <p>{world.description || "High-level view of a world."}</p>

      {/* Side panel */}
      <SectionPanel
        world={world}
        onSelectEntity={(entity) =>
          navigate(`/world-content/${worldId}`, { state: { selectedEntity: entity } })
        }
      />

      {/* Floating controls */}
      <FloatingControls
        pageType="worldOverview"
        worldId={worldId}
        worldData={world}
        onAddEntity={handleAddEntity}
        onUpdateEntity={handleUpdateEntity}
        onDeleteEntity={handleDeleteEntity}
        onEdit={handleEditWorld}
        onSave={handleSaveWorld}
        onDelete={handleDeleteWorld}
      />
    </div>
  );
}

// TODO: List all worlds accessible to the user
// TODO: Clicking a world navigates to /world-content/:worldId