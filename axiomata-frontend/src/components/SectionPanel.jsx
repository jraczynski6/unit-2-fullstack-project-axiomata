import { useState } from "react";

export default function SectionPanel({ world, onSelectEntity }) {
  const [openSections, setOpenSections] = useState({
    Locations: true,
    Factions: true,
    Characters: true,
    Items: true,
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  if (!world) return null;

  const sections = {
    Locations: world.locations || [],
    Factions: world.factions || [],
    Characters: world.characters || [],
    Items: world.items || [],
  };

  // Region -> city hierarchy
  const regions = sections.Locations.filter(l => l.type === "Region");
  const nonRegions = sections.Locations.filter(l => l.type !== "Region");

  const handleSelect = (entity) => {
    onSelectEntity?.(entity);
  };

  return (
    <div className="section-panel">
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
                      {regions.map(region => (
                        <li key={region.id}>
                          <div
                            style={{ fontWeight: "bold", cursor: "pointer" }}
                            onClick={() => handleSelect(region)}
                          >
                            {region.name}
                          </div>
                          <ul>
                            {nonRegions
                              .filter(loc => loc.regionId === region.id)
                              .map(loc => (
                                <li key={loc.id} style={{ cursor: "pointer" }} onClick={() => handleSelect(loc)}>
                                  {loc.name}
                                </li>
                              ))}
                          </ul>
                        </li>
                      ))}

                      {nonRegions
                        .filter(loc => !loc.regionId)
                        .map(loc => (
                          <li key={loc.id} style={{ cursor: "pointer" }} onClick={() => handleSelect(loc)}>
                            {loc.name}
                          </li>
                        ))}
                    </>
                  )}
                </>
              ) : list.length > 0 ? (
                list.map(e => (
                  <li key={e.id} style={{ cursor: "pointer" }} onClick={() => handleSelect(e)}>
                    {e.name}
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