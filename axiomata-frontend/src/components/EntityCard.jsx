export default function EntityCard({ item, category, world }) {
  if (!item) return null;

  // For Locations, (Region, City, Dungeon, Town)
  const locationType = category === "Location" ? item.type || "" : "";

  // For Factions,
  const factionType = category === "Faction" ? item.type || "" : "";

  // location name if this item has a locationId
  const locationName =
    item.locationId && world?.locations?.find((loc) => loc.id === item.locationId)?.name;

  return (
    <div className="entity-card">
      <h2>{item.name || "(Unnamed)"}</h2>
      {item.description && <p>{item.description}</p>}

      <ul>
        {/* Show type for Locations */}
        {locationType && <li>Type: {locationType}</li>}

        {/* Show type for Factions */}
        {factionType && <li>Faction Type: {factionType}</li>}

        {/* Show location if exists */}
        {locationName && <li>Location: {locationName}</li>}
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