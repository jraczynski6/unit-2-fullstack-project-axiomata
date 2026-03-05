import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import './../assets/css/login-form.css';

// RegisterForm receives onSuccess prop to handle post-register navigation
export default function RegisterForm({ onSuccess }) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
      // call backend register endpoint
      const response = await api.post("/auth/register", { username, email, password });
      const { token } = response.data;
      login(token); // store token in AuthContext + localStorage
      if (onSuccess) {
        onSuccess(); // trigger redirect to dashboard
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container register-form">
      <div className="form-field">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="input-primary"
        />
      </div>

      <div className="form-field">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input-primary"
        />
      </div>

      <div className="form-field">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input-primary"
        />
      </div>

      <div className="form-field">
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="input-primary"
        />
      </div>

      <button type="submit" className="btn btn-confirm">
        Register
      </button>

      {error && <p className="error-text">{error}</p>}
    </form>
  );
}