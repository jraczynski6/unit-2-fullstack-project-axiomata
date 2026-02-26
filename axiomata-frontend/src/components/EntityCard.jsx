export default function EntityCard({ item, category, world }) {
  if (!item) return null;

  // For Locations, type is meaningful (Region, City, etc.)
  const locationType = category === "Location" ? item.type || "" : "";

  // Resolve location name if this item has a locationId (Characters, Items)
  const locationName =
    item.locationId && world?.locations?.find((loc) => loc.id === item.locationId)?.name;

  // Resolve faction names if this item has factionIds (Characters, Items)
  const factionNames =
    item.factionIds?.map((fid) => world?.factions?.find((f) => f.id === fid)?.name).filter(Boolean) || [];

  return (
    <div className="entity-card">
      <h2>{item.name || "(Unnamed)"}</h2>
      {item.description && <p>{item.description}</p>}

      <ul>
        {/* Only show type for Locations */}
        {locationType && <li>Type: {locationType}</li>}

        {locationName && <li>Location: {locationName}</li>}

        {factionNames.length > 0 && <li>Factions: {factionNames.join(", ")}</li>}
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