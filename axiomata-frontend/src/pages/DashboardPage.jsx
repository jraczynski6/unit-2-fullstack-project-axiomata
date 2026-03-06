import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWorldsForUser } from "../services/worldService";
import WorldCard from "../components/WorldCard";
import './../assets/css/dashboard-page.css';

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
  };

  if (loading) return <div className="page-container"><p className="text-secondary">Loading Worlds...</p></div>;

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <button className="btn btn-confirm" onClick={handleCreateWorld}>
          Create New World
        </button>
        {worlds.length > 0 && <h1 className="page-title">Your Worlds</h1>}
      </div>

      {worlds.length === 0 ? (
        <p className="text-secondary">No worlds found. Click "Create New World" to start.</p>
      ) : (
        <div className="worlds-list">
          {worlds.map((world) => (
            <WorldCard key={world.id} world={world} />
          ))}
        </div>
      )}
    </div>
  );
}