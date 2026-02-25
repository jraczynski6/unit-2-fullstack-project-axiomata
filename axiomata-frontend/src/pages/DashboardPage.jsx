import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWorldsForUser } from "../services/worldService";
import WorldCard from "../components/WorldCard";

export default function DashboardPage() {
    const [worlds, setWorlds] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWorlds = async () => {
            try {
                const data = await getWorldsForUser();
                console.log("Worlds fetched:", data);
                setWorlds(data);
            } catch (error) {
                console.log("Failed to fetch worlds:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWorlds();
    }, []);

    const handleCreateWorld = () => {
        navigate("/create-world");
    }
    
    if (loading) return <div>Loading Worlds...</div>
    if (worlds.length === 0) return <div>No worlds found.</div>

    return (
        <div>
            <button onClick={handleCreateWorld}>Create New World</button>
            <h1>Your Worlds</h1>
            {worlds.map((world) => (
                <WorldCard key={world.id} world={world} />
            ))}
        </div>
    );
}