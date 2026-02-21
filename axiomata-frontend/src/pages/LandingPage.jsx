import { useNavigate } from "react-router-dom";

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Welcome to Axiomata</h1>
            <p>Your world-building adventure starts here</p>
            <button onClick={() => navigate("/auth")}>Start Today</button>
        </div>
    );
}