/**
 * User Management Hook
 *
 * Provides state management and API calls for user management.
 */

import { useState, useCallback } from 'react';
import { BACKEND_URL } from '../config/backend.config';

// Types
export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  displayName: string | null;
  avatarEmoji: string | null;
  isActive: boolean;
  isVerified: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UserFilters {
  page: number;
  limit: number;
  role?: 'admin' | 'user' | 'moderator';
  search?: string;
  includeInactive?: boolean;
}

export interface CreateUserData {
  email: string;
  password: string;
  role: 'admin' | 'user' | 'moderator';
  displayName?: string;
}

export interface UpdateUserData {
  email?: string;
  role?: 'admin' | 'user' | 'moderator';
  displayName?: string;
  avatarEmoji?: string;
  isActive?: boolean;
}

export interface UserStats {
  total: number;
  active: number;
  admins: number;
  users: number;
  moderators: number;
}

// Get auth token from localStorage
function getAuthToken(): string | null {
  try {
    const sessionData = localStorage.getItem('pulse_mock_session');
    if (!sessionData) return null;

    // For mock auth, we'll need to handle this differently
    // For now, we'll check if there's a real token
    const realToken = localStorage.getItem('pulse_access_token');
    return realToken;
  } catch {
    return null;
  }
}

// API helper
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string; message?: string }> {
  const token = getAuthToken();
  const url = `${BACKEND_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Request failed',
        message: data.message || `HTTP ${response.status}`,
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      error: 'Network Error',
      message: error instanceof Error ? error.message : 'Failed to connect to server',
    };
  }
}

/**
 * User Management Hook
 */
export function useUserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    limit: 20,
    includeInactive: true,
  });

  /**
   * Fetch users with current filters
   */
  const fetchUsers = useCallback(async (customFilters?: Partial<UserFilters>) => {
    setIsLoading(true);
    setError(null);

    const currentFilters = { ...filters, ...customFilters };

    // Build query string
    const params = new URLSearchParams();
    params.append('page', currentFilters.page.toString());
    params.append('limit', currentFilters.limit.toString());
    if (currentFilters.role) params.append('role', currentFilters.role);
    if (currentFilters.search) params.append('search', currentFilters.search);
    if (currentFilters.includeInactive) params.append('includeInactive', 'true');

    const result = await apiCall<{ users: User[]; pagination: Pagination }>(
      `/api/users?${params.toString()}`
    );

    if (result.success && result.data) {
      setUsers(result.data.users);
      setPagination(result.data.pagination);
    } else {
      setError(result.message || result.error || 'Failed to fetch users');
    }

    setIsLoading(false);
  }, [filters]);

  /**
   * Fetch user statistics
   */
  const fetchStats = useCallback(async () => {
    const result = await apiCall<UserStats>('/api/users/stats');

    if (result.success && result.data) {
      setStats(result.data);
    }
  }, []);

  /**
   * Create a new user
   */
  const createUser = useCallback(async (data: CreateUserData): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);

    const result = await apiCall<{ user: User }>('/api/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    setIsLoading(false);

    if (result.success) {
      // Refresh the list
      await fetchUsers();
      return { success: true };
    }

    const errorMsg = result.message || result.error || 'Failed to create user';
    setError(errorMsg);
    return { success: false, error: errorMsg };
  }, [fetchUsers]);

  /**
   * Update a user
   */
  const updateUser = useCallback(async (id: string, data: UpdateUserData): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);

    const result = await apiCall<{ user: User }>(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    setIsLoading(false);

    if (result.success) {
      // Update local state
      setUsers(prev => prev.map(u => u.id === id ? { ...u, ...result.data?.user } : u));
      return { success: true };
    }

    const errorMsg = result.message || result.error || 'Failed to update user';
    setError(errorMsg);
    return { success: false, error: errorMsg };
  }, []);

  /**
   * Deactivate a user
   */
  const deactivateUser = useCallback(async (id: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);

    const result = await apiCall(`/api/users/${id}`, {
      method: 'DELETE',
    });

    setIsLoading(false);

    if (result.success) {
      // Update local state
      setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: false } : u));
      return { success: true };
    }

    const errorMsg = result.message || result.error || 'Failed to deactivate user';
    setError(errorMsg);
    return { success: false, error: errorMsg };
  }, []);

  /**
   * Reactivate a user
   */
  const reactivateUser = useCallback(async (id: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);

    const result = await apiCall<{ user: User }>(`/api/users/${id}/reactivate`, {
      method: 'POST',
    });

    setIsLoading(false);

    if (result.success) {
      // Update local state
      setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: true } : u));
      return { success: true };
    }

    const errorMsg = result.message || result.error || 'Failed to reactivate user';
    setError(errorMsg);
    return { success: false, error: errorMsg };
  }, []);

  /**
   * Reset user password
   */
  const resetPassword = useCallback(async (id: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    const result = await apiCall(`/api/users/${id}/reset-password`, {
      method: 'POST',
      body: JSON.stringify({ newPassword }),
    });

    if (result.success) {
      return { success: true };
    }

    return { success: false, error: result.message || result.error || 'Failed to reset password' };
  }, []);

  /**
   * Update filters and refetch
   */
  const updateFilters = useCallback((newFilters: Partial<UserFilters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    fetchUsers(updated);
  }, [filters, fetchUsers]);

  /**
   * Go to page
   */
  const goToPage = useCallback((page: number) => {
    updateFilters({ page });
  }, [updateFilters]);

  return {
    // State
    users,
    pagination,
    stats,
    isLoading,
    error,
    filters,

    // Actions
    fetchUsers,
    fetchStats,
    createUser,
    updateUser,
    deactivateUser,
    reactivateUser,
    resetPassword,
    updateFilters,
    goToPage,
    clearError: () => setError(null),
  };
}
