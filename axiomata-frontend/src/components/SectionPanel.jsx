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

  return (
    <div>
      {Object.entries(sections).map(([section, list]) => (
        <div key={section}>
          <div
            style={{ cursor: "pointer", fontWeight: "bold" }}
            onClick={() => toggleSection(section)}
          >
            {section} {openSections[section] ? "▼" : "►"}
          </div>

          {openSections[section] && (
            <ul>
              {list.length > 0 ? (
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