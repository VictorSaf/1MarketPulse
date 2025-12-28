/**
 * Auth Provider Component
 *
 * Wraps the application to initialize authentication state.
 * Handles session persistence and auto-refresh.
 */

import { type ReactNode, useEffect } from 'react';

import { useAuthStore } from '../../../services/auth';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { initialize } = useAuthStore();

  // Initialize auth state on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  return <>{children}</>;
}
