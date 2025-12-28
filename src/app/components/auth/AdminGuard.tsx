/**
 * Admin Guard Component
 *
 * Protects routes by requiring admin role.
 * Redirects to home page if user is not an admin.
 */

import { type ReactNode, useEffect } from 'react';

import { Loader2, ShieldAlert } from 'lucide-react';
import { Navigate } from 'react-router-dom';

import { useAuthStore, selectIsAdmin, selectIsAuthenticated } from '../../../services/auth';
import { Card } from '../ui/card';

interface AdminGuardProps {
  children: ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { initialize, isInitialized, isLoading } = useAuthStore();
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const isAdmin = useAuthStore(selectIsAdmin);

  // Initialize auth on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Show loading spinner while initializing
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate replace to="/login" />;
  }

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 bg-gray-800/50 border-white/10 backdrop-blur-sm text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 mb-4">
            <ShieldAlert className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400 mb-6">
            You don't have permission to access this page. Admin privileges are required.
          </p>
          <a
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium transition-all"
            href="/"
          >
            Return to Dashboard
          </a>
        </Card>
      </div>
    );
  }

  // Render children if admin
  return <>{children}</>;
}
