import { Link } from "react-router-dom";
import '../assets/css/public-header.css';

export default function PublicHeader() {
  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="header-left">
          <h1 className="logo">Axiomata</h1>
        </div>
        <nav className="header-nav" aria-label="Main navigation">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/auth">Login/Register</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}