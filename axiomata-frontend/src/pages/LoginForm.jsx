import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

// LoginForm receives onSuccess prop to handle post-login navigation
export default function LoginForm({ onSuccess }) {
  const { login } = useAuth(); // access auth context
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  // handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting login form...", { username, password });

      // call backend login endpoint
      const response = await api.post("/auth/login", { username, password });

      const { token } = response.data;
      console.log("Token received:", token);

      login(token); // store token in AuthContext + localStorage
      console.log("AuthContext login called with token:", token);

      if (onSuccess) {
        onSuccess(); // trigger redirect to dashboard
        console.log("onSuccess called, redirecting...");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}