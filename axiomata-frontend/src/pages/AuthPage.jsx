import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function AuthPage() {
  const [mode, setMode] = useState("login"); // default to login
  const navigate = useNavigate();

  // called when login/register succeeds
  const handleSuccess = () => {
    navigate("/dashboard"); // redirect to protected page
    console.log("handleSuccess called, navigating to /dashboard");
  };

  return (
    <div>
      {/* show current form based on mode */}
      {mode === "login" ? (
        <LoginForm onSuccess={handleSuccess} />
      ) : (
        <RegisterForm onSuccess={handleSuccess} />
      )}

      {/* toggle login/register */}
      <button onClick={() => setMode(mode === "login" ? "register" : "login")}>
        {mode === "login" ? "Go to Register" : "Go to Login"}
      </button>
    </div>
  );
}