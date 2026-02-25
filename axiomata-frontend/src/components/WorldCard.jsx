import { useNavigate } from "react-router-dom";

export default function WorldCard({ world }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/world/${world.id}`);
    };

    return (
        <div className="world-card">
            <h3>{world?.name || "Unnamed World"}</h3>
            <p>{world?.description || "No description provided."}</p>
            <button className="world-card-button" onClick={handleClick}>
                Open World
            </button>
        </div>
    );
}