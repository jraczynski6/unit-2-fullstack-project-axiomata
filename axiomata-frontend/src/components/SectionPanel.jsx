import { useState } from "react";

export default function SectionPanel({ world, onSelectEntity }) {
  const [openSections, setOpenSections] = useState({
    Locations: true,
    Factions: true,
    Characters: true,
    Items: true,
  });

  if (!world) return null;

  const sections = {
    Locations: world.locations || [],
    Factions: world.factions || [],
    Characters: world.characters || [],
    Items: world.items || [],
  };

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSelect = (entity, section) => {
    onSelectEntity?.({ ...entity, category: section.slice(0, -1) });
  };

  const regions = sections.Locations.filter((l) => l.type === "Region");
  const nonRegions = sections.Locations.filter((l) => l.type !== "Region");

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
            <ul style={{ paddingLeft: "1rem", margin: 0 }}>
              {section === "Locations" ? (
                <>
                  {regions.length === 0 && nonRegions.length === 0 && (
                    <li>(No locations)</li>
                  )}

                  {regions.map((region) => (
                    <li key={region.id}>
                      <div
                        style={{ fontWeight: "bold", cursor: "pointer" }}
                        onClick={() => handleSelect(region, section)}
                      >
                        {region.name}
                      </div>
                      <ul style={{ paddingLeft: "1rem", margin: 0 }}>
                        {nonRegions
                          .filter((loc) => loc.regionId === region.id)
                          .map((loc) => (
                            <li key={loc.id}>
                              <div
                                style={{ cursor: "pointer" }}
                                onClick={() => handleSelect(loc, section)}
                              >
                                {loc.name}
                              </div>
                            </li>
                          ))}
                      </ul>
                    </li>
                  ))}

                  {nonRegions
                    .filter((loc) => !loc.regionId)
                    .map((loc) => (
                      <li key={loc.id}>
                        <div
                          style={{ cursor: "pointer" }}
                          onClick={() => handleSelect(loc, section)}
                        >
                          {loc.name}
                        </div>
                      </li>
                    ))}
                </>
              ) : list.length > 0 ? (
                list.map((entity) => (
                  <li key={entity.id}>
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => handleSelect(entity, section)}
                    >
                      {entity.name}
                    </div>
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