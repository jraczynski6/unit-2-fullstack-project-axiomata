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

  const handleSelect = (entity) => {
    onSelectEntity?.(entity);
  };

  return (
    <div className="section-panel">
      {Object.entries(sections).map(([section, list]) => (
        <div key={section}>
          <div
            style={{ cursor: "pointer", fontWeight: "bold", marginTop: "1rem", outline: "none" }}
            onClick={() => toggleSection(section)}
            tabIndex={-1} // prevents focus highlight
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
                        <li key={region.id} tabIndex={-1} style={{ outline: "none" }}>
                          <div
                            style={{ fontWeight: "bold", cursor: "pointer", outline: "none" }}
                            onClick={() => handleSelect(region)}
                            tabIndex={-1}
                          >
                            {region.name}
                          </div>
                          <ul>
                            {nonRegions
                              .filter((loc) => loc.regionId === region.id)
                              .map((loc) => (
                                <li
                                  key={loc.id}
                                  style={{ cursor: "pointer", outline: "none" }}
                                  onClick={() => handleSelect(loc)}
                                  tabIndex={-1}
                                >
                                  {loc.name}
                                </li>
                              ))}
                          </ul>
                        </li>
                      ))}

                      {nonRegions
                        .filter((loc) => !loc.regionId)
                        .map((loc) => (
                          <li
                            key={loc.id}
                            style={{ cursor: "pointer", outline: "none" }}
                            onClick={() => handleSelect(loc)}
                            tabIndex={-1}
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
                    onClick={() => handleSelect(entity)}
                    style={{ cursor: "pointer", outline: "none" }}
                    tabIndex={-1}
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