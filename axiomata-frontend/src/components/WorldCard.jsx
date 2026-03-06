import { useNavigate } from "react-router-dom";
import './../assets/css/dashboard-page.css';

export default function WorldCard({ world }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/world-overview/${world.id}`);
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