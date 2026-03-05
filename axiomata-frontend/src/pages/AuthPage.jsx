import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/dashboard");
    console.log("handleSuccess called, navigating to /dashboard");
  };

  return (
    <div className="page-container">
      {mode === "login" ? (
        <LoginForm onSuccess={handleSuccess} />
      ) : (
        <RegisterForm onSuccess={handleSuccess} />
      )}

      <button className="btn" onClick={() => setMode(mode === "login" ? "register" : "login")}>
        {mode === "login" ? "Go to Register" : "Go to Login"}
      </button>
    </div>
  );
}