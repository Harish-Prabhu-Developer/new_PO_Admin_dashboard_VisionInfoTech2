// src/App.jsx
import { useEffect } from "react";
import Layout from "./pages/Layout";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import ApprovalDetailsPage from "./pages/ApprovalDetailsPage";
import ViewDetailPage from "./pages/ViewDetailPage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useNavigate,
} from "react-router-dom";

/* -------------------- Route Guards -------------------- */

function ProtectedRoute() {
  const token = localStorage.getItem("tbgs_access_token");

  if (!token || token === "null" || token.trim() === "") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function PublicRoute() {
  const token = localStorage.getItem("tbgs_access_token");

  return token ? <Navigate to="/dashboard" replace /> : <Outlet />;
}

/* -------------------- App -------------------- */

const App=()=> {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard">
              <Route index element={<DashboardPage />} />
              <Route path=":approvalType" element={<ApprovalDetailsPage />} />
              <Route path=":approvalType/:id" element={<ViewDetailPage />} />
            </Route>
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}
export default App;
