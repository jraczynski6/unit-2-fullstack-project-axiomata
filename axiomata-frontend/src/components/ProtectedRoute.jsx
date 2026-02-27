import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { token } = useAuth(); 

  console.log("ProtectedRoute token check: ", { token, actualToken: localStorage.getItem("token") });

  // redirect to login page
  if (!token) return <Navigate to="/auth" />;

  // render the protected content
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