import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/ui/Spinner";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Spinner />;

  if (!isAuthenticated) return <Navigate to="/auth" replace />;

  return children;
}

// ----- ProtectedRoute.jsx (non-MVP) -----
// TODO: Handle the case where children is undefined or not a valid React element
// TODO: Support optional requiredRole prop for role-based route protection