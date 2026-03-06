import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import './../assets/css/auth-page.css';

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/dashboard");
    console.log("handleSuccess called, navigating to /dashboard");
  };

  return (
    <main className="auth-main">
      <div className="page-container auth-page">
        <div className="form-wrapper">
          {mode === "login" ? (
            <LoginForm onSuccess={handleSuccess} />
          ) : (
            <RegisterForm onSuccess={handleSuccess} />
          )}
        </div>

        <button
          className="btn toggle-btn"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
        >
          {mode === "login" ? "Go to Register" : "Go to Login"}
        </button>
      </div>
    </main>
  );
}