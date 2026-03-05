import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import AccountPage from "./pages/AccountPage";
import CreateWorldPage from "./pages/CreateWorldPage";
import WorldOverviewPage from "./pages/WorldOverviewPage";
import WorldContentPage from "./pages/WorldContentPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import { ToastProvider } from "./context/ToastContext";
import ToastContainer from "./components/ui/ToastContainer";
import { useAuth } from "./context/AuthContext";

function AuthRedirect({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <ToastContainer />

        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Layout><LandingPage /></Layout>} />
          <Route
            path="/auth"
            element={
              <AuthRedirect>
                <Layout><AuthPage /></Layout>
              </AuthRedirect>
            }
          />
          <Route path="/about" element={<Layout><AboutPage /></Layout>} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout><DashboardPage /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Layout><AccountPage /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-world"
            element={
              <ProtectedRoute>
                <Layout><CreateWorldPage /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/world-overview/:worldId"
            element={
              <ProtectedRoute>
                <Layout><WorldOverviewPage /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/world-content/:worldId"
            element={
              <ProtectedRoute>
                <Layout><WorldContentPage /></Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;