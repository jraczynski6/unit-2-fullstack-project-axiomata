import { useState } from "react";

export default function SectionPanel({ world, onSelectEntity }) {
  const [openSections, setOpenSections] = useState({
    Locations: true,
    Factions: true,
    Characters: true,
    Items: true,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (!world) return null;

  const sections = {
    Locations: world.locations || [],
    Factions: world.factions || [],
    Characters: world.characters || [],
    Items: world.items || [],
  };

  const regions = sections.Locations.filter((l) => l.type === "Region");
  const nonRegions = sections.Locations.filter((l) => l.type !== "Region");

  return (
    <div>
      {Object.entries(sections).map(([section, list]) => (
        <div key={section}>
          <div
            style={{ cursor: "pointer", fontWeight: "bold", marginTop: "1rem" }}
            onClick={() => toggleSection(section)}
          >
            {section} {openSections[section] ? "▼" : "►"}
          </div>

          {openSections[section] && (
            <ul style={{ paddingLeft: "1rem" }}>
              {section === "Locations" ? (
                <>
                  {regions.length === 0 && nonRegions.length === 0 ? (
                    <li>(No locations)</li>
                  ) : (
                    <>
                      {regions.map((region) => (
                        <li key={region.id}>
                          <div
                            style={{ fontWeight: "bold", cursor: "pointer" }}
                            onClick={() => onSelectEntity?.(region)}
                          >
                            {region.name}
                          </div>
                          <ul>
                            {nonRegions
                              .filter((loc) => loc.regionId === region.id)
                              .map((loc) => (
                                <li
                                  key={loc.id}
                                  style={{ cursor: "pointer" }}
                                  onClick={() => onSelectEntity?.(loc)}
                                >
                                  {loc.name}
                                </li>
                              ))}
                          </ul>
                        </li>
                      ))}

                      {/* locations with no region */}
                      {nonRegions
                        .filter((loc) => !loc.regionId)
                        .map((loc) => (
                          <li
                            key={loc.id}
                            style={{ cursor: "pointer" }}
                            onClick={() => onSelectEntity?.(loc)}
                          >
                            {loc.name}
                          </li>
                        ))}
                    </>
                  )}
                </>
              ) : list.length > 0 ? (
                list.map((entity) => (
                  <li
                    key={entity.id}
                    onClick={() => onSelectEntity?.(entity)}
                    style={{ cursor: "pointer" }}
                  >
                    {entity.name}
                  </li>
                ))
              ) : (
                <li>(No {section.toLowerCase()})</li>
              )}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
// ----- SectionPanel.jsx -----
// TODO: Render sections: Locations, Factions, Characters, Items
// TODO: Locations section groups regions as subheaders
// TODO: Locations under a region are always visible
// TODO: Locations with no region appear at top level
// TODO: Clicking region or location selects entity for EntityCard
// TODO: Integrate side panel for navigation to child pages (Entities, Locations, Factions, etc.)