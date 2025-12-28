/**
 * Authentication Middleware
 *
 * Middleware for JWT token validation and role-based access control.
 */

import { Context, Next } from 'hono';
import { verifyToken, TokenPayload } from '../services/auth/jwtService';

// Extend Hono's context to include user
declare module 'hono' {
  interface ContextVariableMap {
    user: TokenPayload;
  }
}

/**
 * Extract token from Authorization header
 */
function extractToken(c: Context): string | null {
  const authHeader = c.req.header('Authorization');

  if (!authHeader) {
    return null;
  }

  if (authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  return null;
}

/**
 * Authentication middleware - requires valid JWT token
 */
export async function authMiddleware(c: Context, next: Next) {
  const token = extractToken(c);

  if (!token) {
    return c.json(
      {
        success: false,
        error: 'Unauthorized',
        message: 'No authentication token provided',
      },
      401
    );
  }

  const payload = verifyToken<TokenPayload>(token);

  if (!payload) {
    return c.json(
      {
        success: false,
        error: 'Unauthorized',
        message: 'Invalid or expired token',
      },
      401
    );
  }

  // Set user in context
  c.set('user', payload);

  await next();
}

/**
 * Admin middleware - requires admin role
 */
export async function adminMiddleware(c: Context, next: Next) {
  const token = extractToken(c);

  if (!token) {
    return c.json(
      {
        success: false,
        error: 'Unauthorized',
        message: 'No authentication token provided',
      },
      401
    );
  }

  const payload = verifyToken<TokenPayload>(token);

  if (!payload) {
    return c.json(
      {
        success: false,
        error: 'Unauthorized',
        message: 'Invalid or expired token',
      },
      401
    );
  }

  if (payload.role !== 'admin') {
    return c.json(
      {
        success: false,
        error: 'Forbidden',
        message: 'Admin access required',
      },
      403
    );
  }

  // Set user in context
  c.set('user', payload);

  await next();
}

/**
 * Optional auth middleware - sets user if token present, but doesn't require it
 */
export async function optionalAuthMiddleware(c: Context, next: Next) {
  const token = extractToken(c);

  if (token) {
    const payload = verifyToken<TokenPayload>(token);
    if (payload) {
      c.set('user', payload);
    }
  }

  await next();
}
