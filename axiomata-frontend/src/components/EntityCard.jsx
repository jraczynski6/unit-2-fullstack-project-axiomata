export default function EntityCard({ entity, world }) {
  if (!entity) return null;

  // Resolve type: some entities like Locations or Factions have type fields
  const type = entity.type || entity.entityType || "";

  // Resolve location name
  const location =
    world?.locations?.find((loc) => loc.id === entity.locationId)?.name || "";

  // Resolve faction names
  const factions =
    entity.factionIds?.map(
      (fid) => world?.factions?.find((f) => f.id === fid)?.name
    ).filter(Boolean) || [];

  return (
    <div className="entity-card">
      <h2>{entity.name || "(Unnamed)"}</h2>
      {entity.description && <p>{entity.description}</p>}

      <ul>
        {type && <li>Type: {type}</li>}
        {location && <li>Location: {location}</li>}
        {factions.length > 0 && <li>Factions: {factions.join(", ")}</li>}
      </ul>
    </div>
  );
}
// ----- EntityCard.jsx -----
// TODO: Display selected entity info: name, description, type, location, factions
// TODO: Implement dynamic state sync after entity creation
// TODO: Implement delete entity functionality and update state
// TODO: Implement edit/update flow and refresh panel display
// TODO: Review region hierarchy logic for sub-locations