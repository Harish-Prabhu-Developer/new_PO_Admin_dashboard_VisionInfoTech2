import Layout from './pages/Layout';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import ApprovalDetailsPage from './pages/ApprovalDetailsPage';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import ViewDetailPage from './pages/ViewDetailPage';

function ProtectedRoute() {
  const token = localStorage.getItem('tbgs_access_token');
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

function PublicRoute() {
  const token = localStorage.getItem('tbgs_access_token');
  return token ? <Navigate to="/" replace /> : <Outlet />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route for login, redirects if logged in */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Protected Layout wrapped with ProtectedRoute */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<DashboardPage />} />
            {/* Dynamic route with approval type parameter */}
            <Route path="/:approvalType" element={<ApprovalDetailsPage />} />
            <Route path="/:approvalType/:id" element={<ViewDetailPage />} />
            {/* Add more nested pages below */}
          </Route>
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;