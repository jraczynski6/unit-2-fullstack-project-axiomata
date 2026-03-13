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
    }

    setLoading(false);
  }, []);

  // update localStorage whenever token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // login function stores the JWT token
  const login = (newToken) => {
    setToken(newToken); // store token in state
  };

  // logout clears token
  const logout = () => {
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