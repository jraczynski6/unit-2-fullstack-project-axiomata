import { useState } from "react";
import { createPortal } from "react-dom";

export default function SectionPanel({ world, isOpen, setIsOpen, onSelectEntity }) {
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
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSelect = (entity, section) => {
    setIsOpen(false);
    onSelectEntity?.({ ...entity, category: section.slice(0, -1) });
  };

  const regions = sections.Locations.filter(l => l.type === "Region");
  const nonRegions = sections.Locations.filter(l => l.type !== "Region");

  // ---------------- PANEL JSX ----------------
  const panelUI = (
    <>
      <div className={`section-panel-content ${isOpen ? "open" : ""}`}>
        {/* ===== Panel header ===== */}
        <div className="section-panel-header">
          <h2>World Explorer</h2>
        </div>

        {Object.entries(sections).map(([section, list]) => (
          <div key={section}>
            {/* Section header */}
            <div
              className={`section-header ${section === "Locations"
                  ? "locations"
                  : section === "Factions"
                    ? "factions"
                    : section === "Characters"
                      ? "characters"
                      : section === "Items"
                        ? "items"
                        : ""
                }`}
              onClick={() => toggleSection(section)}
              tabIndex={0} // Make tabbable
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") toggleSection(section);
              }}
            >
              {section} {openSections[section] ? "▼" : "►"}
            </div>

            {openSections[section] && (
              <ul>
                {section === "Locations" ? (
                  <>
                    {regions.length === 0 && nonRegions.length === 0 && <li>(No locations)</li>}
                    {regions.map(region => (
                      <li key={region.id}>
                        <div
                          style={{ fontWeight: "bold" }}
                          tabIndex={0} // tabbable
                          onClick={() => handleSelect(region, section)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") handleSelect(region, section);
                          }}
                        >
                          {region.name}
                        </div>
                        <ul>
                          {nonRegions.filter(loc => loc.regionId === region.id).map(loc => (
                            <li key={loc.id}>
                              <div
                                tabIndex={0}
                                onClick={() => handleSelect(loc, section)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") handleSelect(loc, section);
                                }}
                              >
                                {loc.name}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                    {nonRegions.filter(loc => !loc.regionId).map(loc => (
                      <li key={loc.id}>
                        <div
                          tabIndex={0}
                          onClick={() => handleSelect(loc, section)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") handleSelect(loc, section);
                          }}
                        >
                          {loc.name}
                        </div>
                      </li>
                    ))}
                  </>
                ) : list.length > 0 ? (
                  list.map(entity => (
                    <li key={entity.id}>
                      <div
                        tabIndex={0}
                        onClick={() => handleSelect(entity, section)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") handleSelect(entity, section);
                        }}
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

      {/* Mobile overlay */}
      {isOpen && (
        <div className="section-panel-overlay" onClick={() => setIsOpen(false)} />
      )}
    </>
  );

  // ---------------- PORTAL RENDER ----------------
  const portalRoot = document.getElementById("section-panel-root");
  if (!portalRoot) return null;

  return createPortal(panelUI, portalRoot);
}