import { useNavigate } from "react-router-dom";
import '../assets/css/landing-page.css';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="page-container landing-page">
      <h1 className="page-title">Welcome to Axiomata</h1>
      <p className="text-body">Your world-building adventure starts here</p>
      <button className="btn btn-confirm" onClick={() => navigate("/auth")}>
        Start Today
      </button>
    </div>
  );
}