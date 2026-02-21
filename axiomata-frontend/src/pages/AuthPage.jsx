import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function AuthPage() {
  const [mode, setMode] = useState("login"); // login or register

  // Access login function from AuthContext
  const { login } = useAuth();

  // Function to handle successful login
  function handleLoginSuccess(receivedToken) {
    login(receivedToken); // sets token in context & localStorage
  }

  // Function to handle successful registration
  function handleRegisterSuccess(receivedToken) {
    login(receivedToken); // auto-login after register
  }

  return (
    <div>
      {/* show current form */}
      {mode === "login" ? (
        <LoginForm onSuccess={handleLoginSuccess} />
      ) : (
        <RegisterForm onSuccess={handleRegisterSuccess} />
      )}

      {/* Toggle register/login */}
      <button
        onClick={() => setMode(mode === "login" ? "register" : "login")}
      >
        {mode === "login" ? "Go to Register" : "Go to Login"}
      </button>
    </div>
  );
}