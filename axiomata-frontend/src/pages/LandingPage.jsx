import { useNavigate } from "react-router-dom";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div>
            <PublicHeader />
            <h1>Welcome to Axiomata</h1>
            <p>Your world-building adventure starts here</p>
            <button onClick={() => navigate("/auth")}>Start Today</button>
            <PublicFooter />
        </div>
    );
}