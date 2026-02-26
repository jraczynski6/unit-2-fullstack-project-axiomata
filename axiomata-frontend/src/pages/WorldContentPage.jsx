import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { getWorldById } from "../services/worldService";
import EntityCard from "../components/EntityCard";
import SectionPanel from "../components/SectionPanel";
import FloatingControls from "../components/FloatingControls";

export default function WorldContentPage() {
  const { worldId } = useParams();
  const location = useLocation();
  const initialSelected = location.state?.selectedEntity || null;

  const [world, setWorld] = useState(null);
  const [entities, setEntities] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState(initialSelected);

  // Fetch world
  useEffect(() => {
    const fetchWorld = async () => {
      try {
        const data = await getWorldById(worldId);
        setWorld(data);
        setEntities([
          ...(data.locations || []),
          ...(data.factions || []),
          ...(data.characters || []),
          ...(data.items || []),
        ]);

        // auto-select first entity if none selected
        if (!selectedEntity) {
          const firstEntity =
            (data.locations?.[0] ||
              data.factions?.[0] ||
              data.characters?.[0] ||
              data.items?.[0]) ||
            null;
          setSelectedEntity(firstEntity);
        }
      } catch (err) {
        console.error("Failed to fetch world:", err);
      }
    };
    if (worldId) fetchWorld();
  }, [worldId]);

  /** Add new entity */
  const handleAddEntity = (newEntity) => {
    setWorld((prevWorld) => {
      const updatedWorld = { ...prevWorld };
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
      }

      const updatedEntities = [
        ...(updatedWorld.locations || []),
        ...(updatedWorld.factions || []),
        ...(updatedWorld.characters || []),
        ...(updatedWorld.items || []),
      ];
      setEntities(updatedEntities);

      // do NOT overwrite selectedEntity
      return updatedWorld;
    });
  };

  /** Update existing entity */
  const handleUpdateEntity = (updatedEntity) => {
    setWorld((prevWorld) => {
      const updatedWorld = { ...prevWorld };
      const updateArray = (arrName) => {
        if (updatedWorld[arrName]) {
          updatedWorld[arrName] = updatedWorld[arrName].map((e) =>
            e.id === updatedEntity.id ? updatedEntity : e
          );
        }
      };
      switch (updatedEntity.type) {
        case "Location":
          updateArray("locations");
          break;
        case "Faction":
          updateArray("factions");
          break;
        case "Character":
          updateArray("characters");
          break;
        case "Item":
          updateArray("items");
          break;
      }

      const updatedEntities = [
        ...(updatedWorld.locations || []),
        ...(updatedWorld.factions || []),
        ...(updatedWorld.characters || []),
        ...(updatedWorld.items || []),
      ];
      setEntities(updatedEntities);

      // update selectedEntity if it's the one being updated
      if (selectedEntity?.id === updatedEntity.id) setSelectedEntity(updatedEntity);

      return updatedWorld;
    });
  };

  /** Delete entity */
  const handleDeleteEntity = (deletedId, type) => {
    setWorld((prevWorld) => {
      const updatedWorld = { ...prevWorld };
      const deleteFromArray = (arrName) => {
        if (updatedWorld[arrName]) {
          updatedWorld[arrName] = updatedWorld[arrName].filter((e) => e.id !== deletedId);
        }
      };
      switch (type) {
        case "Location":
          deleteFromArray("locations");
          break;
        case "Faction":
          deleteFromArray("factions");
          break;
        case "Character":
          deleteFromArray("characters");
          break;
        case "Item":
          deleteFromArray("items");
          break;
      }

      const updatedEntities = [
        ...(updatedWorld.locations || []),
        ...(updatedWorld.factions || []),
        ...(updatedWorld.characters || []),
        ...(updatedWorld.items || []),
      ];
      setEntities(updatedEntities);

      // reset selectedEntity if deleted
      if (selectedEntity?.id === deletedId) setSelectedEntity(null);

      return updatedWorld;
    });
  };

  // World-level placeholder actions
  const handleEdit = () => console.log("Edit entity/world clicked", selectedEntity);
  const handleSave = () => console.log("Save entity/world clicked", selectedEntity);
  const handleDelete = () => console.log("Delete entity/world clicked", selectedEntity);

  if (!world) return <div>Loading world...</div>;

  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      <SectionPanel world={world} onSelectEntity={setSelectedEntity} />

      <div>
        {selectedEntity ? (
          <EntityCard entity={selectedEntity} world={world} />
        ) : (
          <div>Select an entity from the panel</div>
        )}
      </div>

      <FloatingControls
        pageType="worldContent"
        worldId={world.id}
        worldData={world}
        selectedEntity={selectedEntity}
        onAddEntity={handleAddEntity}
        onUpdateEntity={handleUpdateEntity}
        onDeleteEntity={handleDeleteEntity}
        onEdit={handleEdit}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}