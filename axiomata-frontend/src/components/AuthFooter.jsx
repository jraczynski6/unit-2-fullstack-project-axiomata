import { Link } from "react-router-dom";
import './../assets/css/auth-footer.css';

export default function AuthFooter() {
  return (
    <footer className="footer-container">
      <div className="footer-links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </div>
      <div className="footer-info">
        <p>&copy; {new Date().getFullYear()} Axiomata. All rights reserved.</p>
      </div>
    </footer>
  );
}