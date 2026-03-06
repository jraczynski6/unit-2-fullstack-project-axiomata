import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import './../assets/css/auth-header.css';

export default function AuthHeader() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // -------------------- Logout Handler --------------------
  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <header className="app-header">
      <div className="header-inner">

        {/* -------------------- Logo / Branding -------------------- */}
        <div className="header-left">
          <h1 className="logo">Axiomata</h1>
        </div>

        {/* -------------------- Navigation -------------------- */}
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