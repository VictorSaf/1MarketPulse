/**
 * Auth Routes
 *
 * Authentication endpoints for login, register, and token management.
 */

import { Hono } from 'hono';
import { authMiddleware } from '../middleware/authMiddleware';
import { getUserByEmail, createUser, updateLastLogin, mapUserToResponse } from '../services/user/userService';
import { verifyPassword, validatePasswordStrength } from '../services/auth/passwordService';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  hashToken,
  generateRandomToken,
  RefreshTokenPayload,
} from '../services/auth/jwtService';
import { query, queryOne } from '../config/database';
import type { LoginRequest, CreateUserRequest } from '../types/auth.types';

const auth = new Hono();

/**
 * POST /api/auth/login
 * Authenticate user and return tokens
 */
auth.post('/login', async (c) => {
  try {
    const { email, password } = await c.req.json<LoginRequest>();

    if (!email || !password) {
      return c.json(
        {
          success: false,
          error: 'Validation Error',
          message: 'Email and password are required',
        },
        400
      );
    }

    // Get user by email
    const user = await getUserByEmail(email);

    if (!user || !user.password_hash) {
      return c.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'Invalid email or password',
        },
        401
      );
    }

    // Check if user is active
    if (!user.is_active) {
      return c.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'Account is deactivated',
        },
        401
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password_hash);

    if (!isValid) {
      return c.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'Invalid email or password',
        },
        401
      );
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    // Create session
    const sessionId = generateRandomToken(16);
    const refreshToken = generateRefreshToken({
      sub: user.id,
      sid: sessionId,
    });

    // Store session in database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await query(
      `INSERT INTO sessions (id, user_id, token_hash, expires_at, user_agent, ip_address)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        sessionId,
        user.id,
        hashToken(refreshToken),
        expiresAt,
        c.req.header('User-Agent') || null,
        c.req.header('X-Forwarded-For')?.split(',')[0] || null,
      ]
    );

    // Update last login
    await updateLastLogin(user.id);

    return c.json({
      success: true,
      data: {
        user: mapUserToResponse(user),
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('[Auth] Login error:', error);
    return c.json(
      {
        success: false,
        error: 'Login Failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

/**
 * POST /api/auth/register
 * Register a new user account
 */
auth.post('/register', async (c) => {
  try {
    const body = await c.req.json<CreateUserRequest>();

    // Validate required fields
    if (!body.email || !body.password) {
      return c.json(
        {
          success: false,
          error: 'Validation Error',
          message: 'Email and password are required',
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

    // Create user (force role to 'user' for public registration)
    const user = await createUser({
      email: body.email,
      password: body.password,
      role: 'user', // Always user for public registration
      displayName: body.displayName,
    });

    // Generate tokens
    const accessToken = generateAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    const sessionId = generateRandomToken(16);
    const refreshToken = generateRefreshToken({
      sub: user.id,
      sid: sessionId,
    });

    // Store session
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await query(
      `INSERT INTO sessions (id, user_id, token_hash, expires_at, user_agent, ip_address)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        sessionId,
        user.id,
        hashToken(refreshToken),
        expiresAt,
        c.req.header('User-Agent') || null,
        c.req.header('X-Forwarded-For')?.split(',')[0] || null,
      ]
    );

    return c.json(
      {
        success: true,
        data: {
          user,
          accessToken,
          refreshToken,
        },
        message: 'Registration successful',
      },
      201
    );
  } catch (error) {
    console.error('[Auth] Register error:', error);

    if (error instanceof Error && error.message === 'Email already exists') {
      return c.json(
        {
          success: false,
          error: 'Conflict',
          message: 'An account with this email already exists',
        },
        409
      );
    }

    return c.json(
      {
        success: false,
        error: 'Registration Failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
auth.post('/refresh', async (c) => {
  try {
    const { refreshToken } = await c.req.json<{ refreshToken: string }>();

    if (!refreshToken) {
      return c.json(
        {
          success: false,
          error: 'Validation Error',
          message: 'Refresh token is required',
        },
        400
      );
    }

    // Verify refresh token
    const payload = verifyToken<RefreshTokenPayload>(refreshToken);

    if (!payload) {
      return c.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'Invalid or expired refresh token',
        },
        401
      );
    }

    // Verify session exists and is valid
    const session = await queryOne<{ id: string; user_id: string }>(
      `SELECT s.id, s.user_id
       FROM sessions s
       JOIN users u ON s.user_id = u.id
       WHERE s.id = $1 AND s.is_active = true AND s.expires_at > NOW() AND u.is_active = true`,
      [payload.sid]
    );

    if (!session) {
      return c.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'Session expired or invalidated',
        },
        401
      );
    }

    // Get user
    const user = await getUserByEmail(payload.sub);
    if (!user) {
      return c.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'User not found',
        },
        401
      );
    }

    // Generate new access token
    const accessToken = generateAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    // Update session last activity
    await query(
      `UPDATE sessions SET last_activity_at = NOW() WHERE id = $1`,
      [payload.sid]
    );

    return c.json({
      success: true,
      data: {
        accessToken,
      },
    });
  } catch (error) {
    console.error('[Auth] Refresh error:', error);
    return c.json(
      {
        success: false,
        error: 'Refresh Failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

/**
 * POST /api/auth/logout
 * Invalidate current session
 */
auth.post('/logout', authMiddleware, async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const refreshToken = (await c.req.json().catch(() => ({}))).refreshToken;

    if (refreshToken) {
      const payload = verifyToken<RefreshTokenPayload>(refreshToken);
      if (payload) {
        await query(
          `UPDATE sessions SET is_active = false WHERE id = $1`,
          [payload.sid]
        );
      }
    }

    return c.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('[Auth] Logout error:', error);
    return c.json(
      {
        success: false,
        error: 'Logout Failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
auth.get('/me', authMiddleware, async (c) => {
  try {
    const currentUser = c.get('user');

    const user = await getUserByEmail(currentUser.email);
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
      data: {
        user: mapUserToResponse(user),
      },
    });
  } catch (error) {
    console.error('[Auth] Me error:', error);
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

export default auth;
