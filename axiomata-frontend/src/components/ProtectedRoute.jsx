import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/auth" replace />;

  return children;
}

// ----- ProtectedRoute.jsx (non-MVP) -----
// TODO: Handle the case where children is undefined or not a valid React element
// TODO: Add loading guard to prevent redirect flicker before auth initializes
// TODO: Use isAuthenticated instead of direct token check for clarity
// TODO: Support optional requiredRole prop for role-based route protection
// TODO: Redirect to intended page after successful login
// TODO: Ensure component does not directly access localStorage
// TODO: Add fallback UI (spinner) while auth state is resolving