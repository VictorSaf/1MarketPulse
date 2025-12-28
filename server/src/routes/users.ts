/**
 * Users Routes
 *
 * Admin-only routes for user management CRUD operations.
 */

import { Hono } from 'hono';
import { adminMiddleware } from '../middleware/authMiddleware';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deactivateUser,
  reactivateUser,
  resetUserPassword,
  getUserStats,
} from '../services/user/userService';
import { validatePasswordStrength } from '../services/auth/passwordService';
import type { UserRole, CreateUserRequest, UpdateUserRequest } from '../types/auth.types';

const users = new Hono();

// All routes require admin authentication
users.use('*', adminMiddleware);

/**
 * GET /api/users
 * List all users with pagination and filtering
 */
users.get('/', async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1', 10);
    const limit = parseInt(c.req.query('limit') || '20', 10);
    const role = c.req.query('role') as UserRole | undefined;
    const search = c.req.query('search');
    const includeInactive = c.req.query('includeInactive') === 'true';

    const result = await getUsers({ page, limit, role, search, includeInactive });

    return c.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('[Users] List error:', error);
    return c.json(
      {
        success: false,
        error: 'Failed to list users',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

/**
 * GET /api/users/stats
 * Get user statistics
 */
users.get('/stats', async (c) => {
  try {
    const stats = await getUserStats();
    return c.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('[Users] Stats error:', error);
    return c.json(
      {
        success: false,
        error: 'Failed to get user stats',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

/**
 * GET /api/users/:id
 * Get a single user by ID
 */
users.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const user = await getUserById(id);

    if (!user) {
      return c.json(
        {
          success: false,
          error: 'Not Found',
          message: 'User not found',
        },
        404
      );
    }

    return c.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    console.error('[Users] Get error:', error);
    return c.json(
      {
        success: false,
        error: 'Failed to get user',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

/**
 * POST /api/users
 * Create a new user
 */
users.post('/', async (c) => {
  try {
    const body = await c.req.json<CreateUserRequest>();

    // Validate required fields
    if (!body.email) {
      return c.json(
        {
          success: false,
          error: 'Validation Error',
          message: 'Email is required',
        },
        400
      );
    }

    if (!body.password) {
      return c.json(
        {
          success: false,
          error: 'Validation Error',
          message: 'Password is required',
        },
        400
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return c.json(
        {
          success: false,
          error: 'Validation Error',
          message: 'Invalid email format',
        },
        400
      );
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(body.password);
    if (!passwordValidation.valid) {
      return c.json(
        {
          success: false,
          error: 'Validation Error',
          message: passwordValidation.message,
        },
        400
      );
    }

    // Validate role if provided
    const validRoles: UserRole[] = ['admin', 'user', 'moderator'];
    if (body.role && !validRoles.includes(body.role)) {
      return c.json(
        {
          success: false,
          error: 'Validation Error',
          message: 'Invalid role. Must be admin, user, or moderator',
        },
        400
      );
    }

    const user = await createUser(body);
    const currentUser = c.get('user');

    // Audit log
    console.log('[Audit] USER_CREATED', {
      createdBy: currentUser.email,
      newUserId: user.id,
      newUserEmail: user.email,
      role: user.role,
      timestamp: new Date().toISOString(),
    });

    return c.json(
      {
        success: true,
        data: { user },
        message: 'User created successfully',
      },
      201
    );
  } catch (error) {
    console.error('[Users] Create error:', error);

    if (error instanceof Error && error.message === 'Email already exists') {
      return c.json(
        {
          success: false,
          error: 'Conflict',
          message: 'A user with this email already exists',
        },
        409
      );
    }

    return c.json(
      {
        success: false,
        error: 'Failed to create user',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

/**
 * PUT /api/users/:id
 * Update a user
 */
users.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json<UpdateUserRequest>();
    const currentUser = c.get('user');

    // Prevent self-demotion from admin
    if (id === currentUser.sub && body.role && body.role !== 'admin') {
      return c.json(
        {
          success: false,
          error: 'Forbidden',
          message: 'Cannot change your own role',
        },
        403
      );
    }

    // Prevent self-deactivation
    if (id === currentUser.sub && body.isActive === false) {
      return c.json(
        {
          success: false,
          error: 'Forbidden',
          message: 'Cannot deactivate your own account',
        },
        403
      );
    }

    // Validate email format if provided
    if (body.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.email)) {
        return c.json(
          {
            success: false,
            error: 'Validation Error',
            message: 'Invalid email format',
          },
          400
        );
      }
    }

    // Validate role if provided
    if (body.role) {
      const validRoles: UserRole[] = ['admin', 'user', 'moderator'];
      if (!validRoles.includes(body.role)) {
        return c.json(
          {
            success: false,
            error: 'Validation Error',
            message: 'Invalid role. Must be admin, user, or moderator',
          },
          400
        );
      }
    }

    const user = await updateUser(id, body);

    // Audit log
    console.log('[Audit] USER_UPDATED', {
      updatedBy: currentUser.email,
      targetUserId: id,
      changes: Object.keys(body),
      timestamp: new Date().toISOString(),
    });

    return c.json({
      success: true,
      data: { user },
      message: 'User updated successfully',
    });
  } catch (error) {
    console.error('[Users] Update error:', error);

    if (error instanceof Error && error.message === 'User not found') {
      return c.json(
        {
          success: false,
          error: 'Not Found',
          message: 'User not found',
        },
        404
      );
    }

    if (error instanceof Error && error.message === 'No valid fields to update') {
      return c.json(
        {
          success: false,
          error: 'Validation Error',
          message: 'No valid fields to update',
        },
        400
      );
    }

    return c.json(
      {
        success: false,
        error: 'Failed to update user',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

/**
 * DELETE /api/users/:id
 * Deactivate a user (soft delete)
 */
users.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const currentUser = c.get('user');

    // Prevent self-deletion
    if (id === currentUser.sub) {
      return c.json(
        {
          success: false,
          error: 'Forbidden',
          message: 'Cannot deactivate your own account',
        },
        403
      );
    }

    await deactivateUser(id);

    // Audit log
    console.log('[Audit] USER_DEACTIVATED', {
      deactivatedBy: currentUser.email,
      targetUserId: id,
      timestamp: new Date().toISOString(),
    });

    return c.json({
      success: true,
      message: 'User deactivated successfully',
    });
  } catch (error) {
    console.error('[Users] Delete error:', error);

    if (error instanceof Error && error.message === 'User not found') {
      return c.json(
        {
          success: false,
          error: 'Not Found',
          message: 'User not found',
        },
        404
      );
    }

    return c.json(
      {
        success: false,
        error: 'Failed to deactivate user',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

/**
 * POST /api/users/:id/reactivate
 * Reactivate a deactivated user
 */
users.post('/:id/reactivate', async (c) => {
  try {
    const id = c.req.param('id');
    const user = await reactivateUser(id);

    return c.json({
      success: true,
      data: { user },
      message: 'User reactivated successfully',
    });
  } catch (error) {
    console.error('[Users] Reactivate error:', error);

    if (error instanceof Error && error.message === 'User not found') {
      return c.json(
        {
          success: false,
          error: 'Not Found',
          message: 'User not found',
        },
        404
      );
    }

    return c.json(
      {
        success: false,
        error: 'Failed to reactivate user',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

/**
 * POST /api/users/:id/reset-password
 * Reset a user's password
 */
users.post('/:id/reset-password', async (c) => {
  try {
    const id = c.req.param('id');
    const { newPassword } = await c.req.json<{ newPassword: string }>();

    if (!newPassword) {
      return c.json(
        {
          success: false,
          error: 'Validation Error',
          message: 'New password is required',
        },
        400
      );
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.valid) {
      return c.json(
        {
          success: false,
          error: 'Validation Error',
          message: passwordValidation.message,
        },
        400
      );
    }

    await resetUserPassword(id, newPassword);

    return c.json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    console.error('[Users] Reset password error:', error);

    if (error instanceof Error && error.message === 'User not found') {
      return c.json(
        {
          success: false,
          error: 'Not Found',
          message: 'User not found',
        },
        404
      );
    }

    return c.json(
      {
        success: false,
        error: 'Failed to reset password',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

export default users;
