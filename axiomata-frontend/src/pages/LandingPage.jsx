import { useNavigate } from "react-router-dom";
import '../assets/css/landing-page.css';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div
      className="page-container landing-page"
      role="img"
      aria-label="Medieval castle with knights standing in front, sunset light casts long shadows"
    >
      <div className="hero-box">
        <h1 className="page-title">Axiomata</h1>
        <h2 className="hero-tagline">Chaos yields to design</h2>
        <p className="text-body">
          Lost in the tangle of rules and notes? Bring order and make it whole.
        </p>
        <button className="btn btn-confirm" onClick={() => navigate("/auth")}>
          Start Today
        </button>
      </div>
    </div>
  );
}