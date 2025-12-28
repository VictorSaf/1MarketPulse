/**
 * Authentication Types
 *
 * TypeScript types for authentication and user management.
 */

/**
 * User role type
 */
export type UserRole = 'admin' | 'user' | 'moderator';

/**
 * User from database
 */
export interface User {
  id: string;
  email: string;
  role: UserRole;
  display_name: string | null;
  avatar_url: string | null;
  avatar_emoji: string | null;
  bio: string | null;
  is_active: boolean;
  is_verified: boolean;
  last_login_at: Date | null;
  created_at: Date;
  updated_at: Date;
  password_hash?: string;
}

/**
 * User for API response (no sensitive data)
 */
export interface UserResponse {
  id: string;
  email: string;
  role: UserRole;
  displayName: string | null;
  avatarUrl: string | null;
  avatarEmoji: string | null;
  bio: string | null;
  isActive: boolean;
  isVerified: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create user request body
 */
export interface CreateUserRequest {
  email: string;
  password: string;
  role?: UserRole;
  displayName?: string;
}

/**
 * Update user request body
 */
export interface UpdateUserRequest {
  email?: string;
  role?: UserRole;
  displayName?: string;
  avatarEmoji?: string;
  isActive?: boolean;
  isVerified?: boolean;
}

/**
 * Login request body
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Auth response with tokens
 */
export interface AuthResponse {
  user: UserResponse;
  accessToken: string;
  refreshToken: string;
}

/**
 * Pagination info
 */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Paginated users response
 */
export interface PaginatedUsersResponse {
  users: UserResponse[];
  pagination: Pagination;
}

/**
 * Session from database
 */
export interface Session {
  id: string;
  user_id: string;
  token_hash: string;
  user_agent: string | null;
  ip_address: string | null;
  device_type: string | null;
  is_active: boolean;
  expires_at: Date;
  last_activity_at: Date;
  created_at: Date;
}

/**
 * API Error response
 */
export interface ApiError {
  success: false;
  error: string;
  message?: string;
}

/**
 * API Success response
 */
export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

/**
 * Generic API response
 */
export type ApiResponse<T> = ApiSuccess<T> | ApiError;
