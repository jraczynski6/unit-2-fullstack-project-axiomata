import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Wrap protected pages with this component to enforce auth
export default function ProtectedRoute({ children }) {
  const { token } = useAuth(); // get token from context

  console.log("ProtectedRoute token check: ", { token, actualToken: localStorage.getItem("token") });

  // if no token, redirect to login page
  if (!token) return <Navigate to="/auth" />;

  // otherwise, render the protected content
  return children;
}

// TODO: Handle the case where children is undefined or not a valid React element