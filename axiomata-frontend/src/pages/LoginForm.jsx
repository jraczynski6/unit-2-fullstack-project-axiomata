import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

// LoginForm receives onSuccess prop to handle post-login navigation
export default function LoginForm({ onSuccess }) {
  const { login } = useAuth(); // access auth context
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const validate = () => {
    if (!username.trim()) return "Username cannot be blank";
    if (username.length < 3) return "Username must be at least 3 characters";
    if (!password) return "Password cannot be blank";
    if (password.length < 6) return "Password must be at least 6 characters";
    return null;
  };

  // handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const response = await api.post("/auth/login", { username, password });
      const { token } = response.data;
      login(token); // store token in AuthContext + localStorage
      onSuccess?.(); // redirect to dashboard if provided
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        className="login-input login-username"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="login-input login-password"
      />
      <button type="submit" className="login-button">
        Login
      </button>
      {error && <p className="login-error">{error}</p>}
    </form>
  );
}