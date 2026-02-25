import { useNavigate } from "react-router-dom";

export default function WorldCard({ world }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/world-overview/${world.id}`);
    };

    let attributes = {};
    if (world?.attributes) {
        try {
            attributes = JSON.parse(world.attributes);
        } catch (err) {
            console.error("Failed to parse world attributes:", err);
        }
    }

    return (
        <div className="world-card">
            <h3>{world?.name || "Unnamed World"}</h3>
            <p>{world?.description || "No description provided."}</p>

            {Object.keys(attributes).length > 0 && (
                <div className="world-card-attributes">
                    {Object.entries(attributes).map(([key, value]) => (
                        <span key={key} className="attribute-badge">
                            {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                        </span>
                    ))}
                </div>
            )}

            <button className="world-card-button" onClick={handleClick}>
                Open World
            </button>
        </div>
    );
}