import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="header-left">
          <h1 className="logo">Axiomata</h1>
        </div>

        <nav className="header-nav">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>

              <Link to="/account" className="nav-link">
                Account
              </Link>

              <button onClick={handleLogout} className="nav-button">
                Logout
              </button>
            </>
          ) : (
            <Link to="/auth" className="nav-link">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}