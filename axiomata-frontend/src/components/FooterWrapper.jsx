import { useAuth } from "../context/AuthContext";
import AuthFooter from "./AuthFooter";
import PublicFooter from "./PublicFooter";

export default function FooterWrapper() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <AuthFooter /> : <PublicFooter />;
}