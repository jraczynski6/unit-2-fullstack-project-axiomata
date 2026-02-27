import { useAuth } from "../context/AuthContext";
import AuthHeader from "./AuthHeader";
import PublicHeader from "./PublicHeader";

export default function HeaderWrapper() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <AuthHeader /> : <PublicHeader />;
}