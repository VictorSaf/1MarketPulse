/**
 * JWT Service
 *
 * Handles JWT token generation and verification.
 */

import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'pulse2-dev-secret-change-in-production-min-32-chars';
const ACCESS_TOKEN_EXPIRY = 15 * 60; // 15 minutes in seconds
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 days in seconds

/**
 * Access token payload structure
 */
export interface TokenPayload {
  sub: string;      // user ID
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * Refresh token payload structure
 */
export interface RefreshTokenPayload {
  sub: string;      // user ID
  sid: string;      // session ID
  iat?: number;
  exp?: number;
}

/**
 * Generate an access token
 */
export function generateAccessToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
}

/**
 * Generate a refresh token
 */
export function generateRefreshToken(payload: Omit<RefreshTokenPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
}

/**
 * Verify and decode a token
 */
export function verifyToken<T extends object>(token: string): T | null {
  try {
    return jwt.verify(token, JWT_SECRET) as T;
  } catch (error) {
    return null;
  }
}

/**
 * Decode a token without verification (for expired tokens)
 */
export function decodeToken<T extends object>(token: string): T | null {
  try {
    return jwt.decode(token) as T;
  } catch {
    return null;
  }
}

/**
 * Hash a token for secure storage
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Generate a random token (for session IDs, etc.)
 */
export function generateRandomToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}
