import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

// RegisterForm receives onSuccess prop to handle post-register navigation
export default function RegisterForm({ onSuccess }) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const validate = () => {
    if (!username.trim()) return "Username cannot be blank";
    if (username.length < 3 || username.length > 50)
      return "Username must be between 3 and 50 characters";
    if (!email.trim()) return "Email cannot be blank";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Email must be valid";
    if (!password) return "Password cannot be blank";
    if (password.length < 6 || password.length > 100)
      return "Password must be between 6 and 100 characters";
    if (password !== confirmPassword) return "Passwords do not match";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      console.log("Submitting register form...", { username, email, password });

      // call backend register endpoint
      const response = await api.post("/auth/register", { username, email, password });
      console.log("API response:", response.data);

      const { token } = response.data;
      console.log("Token received:", token);

      login(token); // store token in AuthContext + localStorage
      console.log("AuthContext login called with token:", token);

      if (onSuccess) {
        onSuccess(); // trigger redirect to dashboard
        console.log("handleSuccess called, navigating to /dashboard");
      }
    } catch (err) {
      console.error("Registration failed:", err);
      setError(err.response?.data?.message || "Registration failed");
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
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Register</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}