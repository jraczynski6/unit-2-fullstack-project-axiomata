import { createContext, useContext, useState, useEffect } from "react";

// create context
const AuthContext = createContext(null);

// Provider component wraps the app and provides auth state
export function AuthProvider({ children }) {
  // token state (hydrated on mount)
  const [token, setToken] = useState(null);

  // loading state to prevent ProtectedRoute flicker
  const [loading, setLoading] = useState(true);

  // hydrate token from localStorage on initial mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
      console.log("Token restored from localStorage:", storedToken);
    }

    setLoading(false);
  }, []);

  // update localStorage whenever token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      console.log("Token stored in AuthContext and localStorage:", token);
    } else {
      localStorage.removeItem("token");
      console.log("Token removed from AuthContext and localStorage");
    }
  }, [token]);

  // login function stores the JWT token
  const login = (newToken) => {
    console.log("AuthContext login called with token:", newToken);
    setToken(newToken); // store token in state
  };

  // logout clears token
  const logout = () => {
    console.log("AuthContext logout called");
    setToken(null);
  };

  // derived state to easily check authentication
  const isAuthenticated = !!token;

  // context value provided to consumers
  const value = { token, login, logout, isAuthenticated, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// hook to consume auth context easily
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// ----- Auth / (Non-MVP) -----
// TODO: Move token handling to internal implementation and expose user instead of token
// TODO: Prevent logging full JWT tokens for security reasons
// TODO: Avoid direct localStorage manipulation inside API layer