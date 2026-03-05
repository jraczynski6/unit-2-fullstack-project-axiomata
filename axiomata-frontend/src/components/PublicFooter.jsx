import { Link } from "react-router-dom";
import './../assets/css/public-footer.css';

export default function PublicFooter() {
  return (
    <footer className="footer-container">
      <div className="footer-links" aria-label="Footer navigation links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/auth">Login/Register</Link>
      </div>
      <div className="footer-info">
        <p>&copy; {new Date().getFullYear()} Axiomata. All rights reserved.</p>
      </div>
    </footer>
  );
}