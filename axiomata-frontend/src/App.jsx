import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/Dashboard";
import AccountPage from "./pages/AccountPage";
import CreateWorldPage from "./pages/CreateWorldPage";
import WorldOverview from "./pages/WorldOverview";
import WorldContent from "./pages/WorldContent";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/about" element={<AboutPage />} />

        {/* Protected Route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Layout>
                <AccountPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-world"
          element={
            <ProtectedRoute>
              <Layout>
                <CreateWorldPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/world-overview/:worldId"
          element={
            <ProtectedRoute>
              <Layout>
                <WorldOverview />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/world-content/:worldId"
          element={
            <ProtectedRoute>
              <Layout>
                <WorldContent />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App

// TODO: Verify Vite React app builds and runs
// TODO: Test Auth context: login, logout, token storage
// TODO: Confirm Protected routes redirect correctly when unauthenticated
// TODO: Ensure Axios instance injects tokens for API calls
// TODO: Confirm Register page redirects correctly after registration
