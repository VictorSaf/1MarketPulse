/**
 * User Service
 *
 * Business logic for user management operations.
 */

import { query, queryOne } from '../../config/database';
import { hashPassword } from '../auth/passwordService';
import type {
  User,
  UserResponse,
  CreateUserRequest,
  UpdateUserRequest,
  UserRole,
  Pagination,
} from '../../types/auth.types';

/**
 * Map database user to API response format
 */
export function mapUserToResponse(user: User): UserResponse {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    displayName: user.display_name,
    avatarUrl: user.avatar_url,
    avatarEmoji: user.avatar_emoji,
    bio: user.bio,
    isActive: user.is_active,
    isVerified: user.is_verified,
    lastLoginAt: user.last_login_at?.toISOString() || null,
    createdAt: user.created_at.toISOString(),
    updatedAt: user.updated_at.toISOString(),
  };
}

/**
 * Get all users with pagination and filtering
 */
export async function getUsers(options: {
  page?: number;
  limit?: number;
  role?: UserRole;
  search?: string;
  includeInactive?: boolean;
}): Promise<{ users: UserResponse[]; pagination: Pagination }> {
  const page = options.page || 1;
  const limit = Math.min(options.limit || 20, 100);
  const offset = (page - 1) * limit;

  // Build WHERE clause
  const conditions: string[] = [];
  const params: any[] = [];
  let paramIndex = 1;

  if (!options.includeInactive) {
    conditions.push(`is_active = true`);
  }

  if (options.role) {
    conditions.push(`role = $${paramIndex++}`);
    params.push(options.role);
  }

  if (options.search) {
    conditions.push(`(email ILIKE $${paramIndex} OR display_name ILIKE $${paramIndex})`);
    params.push(`%${options.search}%`);
    paramIndex++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Get total count
  const countResult = await queryOne<{ count: string }>(
    `SELECT COUNT(*) as count FROM users ${whereClause}`,
    params
  );
  const total = parseInt(countResult?.count || '0', 10);

  // Get users
  const users = await query<User>(
    `SELECT id, email, role, display_name, avatar_url, avatar_emoji,
            bio, is_active, is_verified, last_login_at, created_at, updated_at
     FROM users ${whereClause}
     ORDER BY created_at DESC
     LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
    [...params, limit, offset]
  );

  return {
    users: users.map(mapUserToResponse),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get a single user by ID
 */
export async function getUserById(id: string): Promise<UserResponse | null> {
  const user = await queryOne<User>(
    `SELECT id, email, role, display_name, avatar_url, avatar_emoji,
            bio, is_active, is_verified, last_login_at, created_at, updated_at
     FROM users WHERE id = $1`,
    [id]
  );

  return user ? mapUserToResponse(user) : null;
}

/**
 * Get a user by email (for login)
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  return queryOne<User>(
    `SELECT id, email, password_hash, role, display_name, avatar_url, avatar_emoji,
            bio, is_active, is_verified, last_login_at, created_at, updated_at
     FROM users WHERE email = $1`,
    [email.toLowerCase()]
  );
}

/**
 * Create a new user
 */
export async function createUser(data: CreateUserRequest): Promise<UserResponse> {
  // Check if email already exists
  const existing = await queryOne<{ id: string }>(
    'SELECT id FROM users WHERE email = $1',
    [data.email.toLowerCase()]
  );

  if (existing) {
    throw new Error('Email already exists');
  }

  // Hash password
  const passwordHash = await hashPassword(data.password);

  // Insert user
  const user = await queryOne<User>(
    `INSERT INTO users (email, password_hash, role, display_name)
     VALUES ($1, $2, $3, $4)
     RETURNING id, email, role, display_name, avatar_url, avatar_emoji,
               bio, is_active, is_verified, last_login_at, created_at, updated_at`,
    [
      data.email.toLowerCase(),
      passwordHash,
      data.role || 'user',
      data.displayName || null,
    ]
  );

  if (!user) {
    throw new Error('Failed to create user');
  }

  return mapUserToResponse(user);
}

/**
 * Update a user
 */
export async function updateUser(id: string, data: UpdateUserRequest): Promise<UserResponse> {
  // Build SET clause dynamically
  const updates: string[] = [];
  const params: any[] = [];
  let paramIndex = 1;

  // Map camelCase to snake_case
  const fieldMap: Record<keyof UpdateUserRequest, string> = {
    email: 'email',
    role: 'role',
    displayName: 'display_name',
    avatarEmoji: 'avatar_emoji',
    isActive: 'is_active',
    isVerified: 'is_verified',
  };

  for (const [key, dbField] of Object.entries(fieldMap)) {
    if (key in data && data[key as keyof UpdateUserRequest] !== undefined) {
      let value = data[key as keyof UpdateUserRequest];

      // Lowercase email
      if (key === 'email' && typeof value === 'string') {
        value = value.toLowerCase();
      }

      updates.push(`${dbField} = $${paramIndex++}`);
      params.push(value);
    }
  }

  if (updates.length === 0) {
    throw new Error('No valid fields to update');
  }

  // Add updated_at
  updates.push(`updated_at = NOW()`);

  // Add user ID as last parameter
  params.push(id);

  const user = await queryOne<User>(
    `UPDATE users SET ${updates.join(', ')}
     WHERE id = $${paramIndex}
     RETURNING id, email, role, display_name, avatar_url, avatar_emoji,
               bio, is_active, is_verified, last_login_at, created_at, updated_at`,
    params
  );

  if (!user) {
    throw new Error('User not found');
  }

  return mapUserToResponse(user);
}

/**
 * Deactivate a user (soft delete)
 */
export async function deactivateUser(id: string): Promise<void> {
  const result = await queryOne<{ id: string }>(
    `UPDATE users SET is_active = false, updated_at = NOW()
     WHERE id = $1 RETURNING id`,
    [id]
  );

  if (!result) {
    throw new Error('User not found');
  }
}

/**
 * Reactivate a user
 */
export async function reactivateUser(id: string): Promise<UserResponse> {
  const user = await queryOne<User>(
    `UPDATE users SET is_active = true, updated_at = NOW()
     WHERE id = $1
     RETURNING id, email, role, display_name, avatar_url, avatar_emoji,
               bio, is_active, is_verified, last_login_at, created_at, updated_at`,
    [id]
  );

  if (!user) {
    throw new Error('User not found');
  }

  return mapUserToResponse(user);
}

/**
 * Reset user password
 */
export async function resetUserPassword(id: string, newPassword: string): Promise<void> {
  const passwordHash = await hashPassword(newPassword);

  const result = await queryOne<{ id: string }>(
    `UPDATE users SET password_hash = $1, updated_at = NOW()
     WHERE id = $2 RETURNING id`,
    [passwordHash, id]
  );

  if (!result) {
    throw new Error('User not found');
  }
}

/**
 * Update last login timestamp
 */
export async function updateLastLogin(id: string): Promise<void> {
  await query(
    `UPDATE users SET last_login_at = NOW(), updated_at = NOW() WHERE id = $1`,
    [id]
  );
}

/**
 * Get user stats
 */
export async function getUserStats(): Promise<{
  total: number;
  active: number;
  admins: number;
  users: number;
  moderators: number;
}> {
  const stats = await queryOne<{
    total: string;
    active: string;
    admins: string;
    users: string;
    moderators: string;
  }>(`
    SELECT
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE is_active = true) as active,
      COUNT(*) FILTER (WHERE role = 'admin') as admins,
      COUNT(*) FILTER (WHERE role = 'user') as users,
      COUNT(*) FILTER (WHERE role = 'moderator') as moderators
    FROM users
  `);

  return {
    total: parseInt(stats?.total || '0', 10),
    active: parseInt(stats?.active || '0', 10),
    admins: parseInt(stats?.admins || '0', 10),
    users: parseInt(stats?.users || '0', 10),
    moderators: parseInt(stats?.moderators || '0', 10),
  };
}
