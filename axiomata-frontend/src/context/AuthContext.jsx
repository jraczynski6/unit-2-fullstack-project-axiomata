import { createContext, useContext, useState, useEffect } from "react";

// create context
const AuthContext = createContext(null);

// Provider component wraps the app and provides auth state
export function AuthProvider({ children }) {
  // initialize token from localStorage if present
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

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
  const value = { token, login, logout, isAuthenticated };

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

// TODO: Remove console logs before production
// TODO: Add isLoading state to prevent auth race conditions on app initialization
// TODO: Move token handling to internal implementation and expose user instead of token
// TODO: Add token expiration check during initialization
// TODO: Support role-based authorization in context
// TODO: Handle automatic logout on 401 responses from API layer
// TODO: Prevent logging full JWT tokens for security reasons
// TODO: Add optional refresh token support for future scalability
// TODO: Create dev-only logging guard using import.meta.env.DEV
// TODO: Add user profile fetch on login for domain-driven auth state