/**
 * Authentication Store (Zustand)
 *
 * Global state management for authentication.
 * Provides user state, loading states, and auth actions.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import * as authService from './authService';

import type { User } from './authService';

interface AuthState {
  // State
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isLoading: false,
      isInitialized: false,
      error: null,

      // Initialize auth state
      initialize: async () => {
        if (get().isInitialized) {return;}

        set({ isLoading: true });

        try {
          const user = await authService.getCurrentUser();
          set({ user, isInitialized: true, isLoading: false });

          // Setup auth state listener (Supabase only)
          authService.onAuthStateChange((user) => {
            set({ user });
          });
        } catch (error) {
          console.error('Auth initialization failed:', error);
          set({ user: null, isInitialized: true, isLoading: false });
        }
      },

      // Login action
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        const response = await authService.login(email, password);

        if (response.error) {
          set({ error: response.error, isLoading: false });
          return false;
        }

        set({ user: response.user, isLoading: false, error: null });
        return true;
      },

      // Signup action
      signup: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        const response = await authService.signup(email, password);

        if (response.error) {
          set({ error: response.error, isLoading: false });
          return false;
        }

        set({ user: response.user, isLoading: false, error: null });
        return true;
      },

      // Logout action
      logout: async () => {
        set({ isLoading: true });

        const { error } = await authService.logout();

        if (error) {
          console.error('Logout error:', error);
        }

        set({ user: null, isLoading: false, error: null });
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },

      // Set user (for external updates)
      setUser: (user: User | null) => {
        set({ user });
      },
    }),
    {
      name: 'pulse-auth-storage',
      partialize: (state) => ({
        user: state.user, // Only persist user
      }),
    }
  )
);

// Computed selectors
export const selectIsAuthenticated = (state: AuthState) => state.user !== null;
export const selectIsAdmin = (state: AuthState) => state.user?.role === 'admin';
export const selectUserEmail = (state: AuthState) => state.user?.email;
