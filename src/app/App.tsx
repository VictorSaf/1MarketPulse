/**
 * Application Root Component
 *
 * Sets up routing, authentication, and global providers.
 * Handles navigation between public and protected routes.
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AdminGuard } from './components/auth/AdminGuard';
import { AuthGuard } from './components/auth/AuthGuard';
import { AuthProvider } from './components/auth/AuthProvider';
import { LoginForm } from './components/auth/LoginForm';
import { SignupForm } from './components/auth/SignupForm';
import { Toaster } from './components/ui/sonner';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminSettings } from './pages/AdminSettings';
import { Dashboard } from './pages/Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster />
        <Routes>
          {/* Public Routes */}
          <Route element={<LoginForm />} path="/login" />
          <Route element={<SignupForm />} path="/signup" />

          {/* Protected Routes - Require Authentication */}
          <Route
            element={
              <AuthGuard>
                <Dashboard />
              </AuthGuard>
            }
            path="/"
          />

          {/* Admin Routes - Require Admin Role */}
          <Route
            element={
              <AdminGuard>
                <AdminDashboard />
              </AdminGuard>
            }
            path="/admin"
          />
          <Route
            element={
              <AdminGuard>
                <AdminSettings />
              </AdminGuard>
            }
            path="/admin/settings"
          />
          {/* Admin sub-routes - redirect to settings with appropriate tab */}
          <Route
            element={<Navigate replace to="/admin/settings?tab=users" />}
            path="/admin/users"
          />
          <Route
            element={<Navigate replace to="/admin/settings?tab=health" />}
            path="/admin/health"
          />

          {/* Catch-all redirect to home */}
          <Route element={<Navigate replace to="/" />} path="*" />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
