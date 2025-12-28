/**
 * Auth Guard Component
 *
 * Protects routes by requiring authentication.
 * Redirects to login page if user is not authenticated.
 */

import { type ReactNode, useEffect } from 'react';

import { Loader2 } from 'lucide-react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuthStore, selectIsAuthenticated } from '../../../services/auth';

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const location = useLocation();
  const { initialize, isInitialized, isLoading } = useAuthStore();
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  // Initialize auth on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Show loading spinner while initializing
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  // Render children if authenticated
  return <>{children}</>;
}
