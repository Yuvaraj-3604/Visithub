import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import Layout from './components/layout/Layout.jsx';

// Pages
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import ForgotPassword from './pages/auth/ForgotPassword.jsx';
import ResetPassword from './pages/auth/ResetPassword.jsx';
import Dashboard from './pages/Dashboard.jsx';
import LandingPage from './pages/LandingPage.jsx';

// Admin Pages
import Employees from './pages/admin/Employees.jsx';
import Users from './pages/admin/Users.jsx';
import Reports from './pages/admin/Reports.jsx';
import ActivityHistory from './pages/admin/ActivityHistory.jsx';

// Receptionist Pages
import RegisterVisitor from './pages/receptionist/RegisterVisitor.jsx';
import Visitors from './pages/receptionist/Visitors.jsx';
import VisitorHistory from './pages/receptionist/VisitorHistory.jsx';

// Employee Pages
import VisitorRequests from './pages/employee/VisitorRequests.jsx';

// Shared Pages
import Settings from './pages/Settings.jsx';
import HelpSupport from './pages/HelpSupport.jsx';
import SupportTicketsAdmin from './pages/admin/SupportTicketsAdmin.jsx';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Landing Home Page */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<LandingPage />} />

          {/* Public Auth Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/login/:roleType" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Secure App Dashboard & Portals */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />

            {/* Admin & Super Admin routes */}
            <Route
              path="employees"
              element={
                <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                  <Employees />
                </ProtectedRoute>
              }
            />
            <Route
              path="users"
              element={
                <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path="reports"
              element={
                <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                  <Reports />
                </ProtectedRoute>
              }
            />
            <Route
              path="activities"
              element={
                <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                  <ActivityHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="support-tickets"
              element={
                <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                  <SupportTicketsAdmin />
                </ProtectedRoute>
              }
            />

            {/* Receptionist only routes */}
            <Route
              path="register-visitor"
              element={
                <ProtectedRoute allowedRoles={['receptionist']}>
                  <RegisterVisitor />
                </ProtectedRoute>
              }
            />
            <Route
              path="visitors"
              element={
                <ProtectedRoute allowedRoles={['receptionist']}>
                  <Visitors />
                </ProtectedRoute>
              }
            />
            <Route
              path="visitor-history"
              element={
                <ProtectedRoute allowedRoles={['receptionist']}>
                  <VisitorHistory />
                </ProtectedRoute>
              }
            />

            {/* Employee only routes */}
            <Route
              path="requests"
              element={
                <ProtectedRoute allowedRoles={['employee']}>
                  <VisitorRequests />
                </ProtectedRoute>
              }
            />

            {/* Common Settings & Support routes for all authenticated users */}
            <Route path="settings" element={<Settings />} />
            <Route path="support" element={<HelpSupport />} />
          </Route>

          {/* Fallback redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
