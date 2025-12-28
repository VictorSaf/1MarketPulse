/**
 * Mock Authentication Service
 *
 * Provides authentication functionality for development without Supabase.
 * Uses localStorage for session persistence.
 *
 * SECURITY: Admin credentials should be set via environment variables:
 * - VITE_ADMIN_EMAIL / VITE_ADMIN_PASSWORD
 * - VITE_ADMIN2_EMAIL / VITE_ADMIN2_PASSWORD
 * - VITE_DEMO_EMAIL / VITE_DEMO_PASSWORD
 */

import { logAuditEvent } from '../audit/auditLogger';

export interface MockUser {
  id: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
}

export interface MockAuthResponse {
  user: MockUser | null;
  error: string | null;
}

// Rate limiting configuration
const RATE_LIMIT_KEY = 'pulse_login_attempts';
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const BASE_DELAY_MS = 1000; // 1 second base delay

interface RateLimitData {
  attempts: number;
  lastAttempt: number;
  lockedUntil: number | null;
}

// Get rate limit data from localStorage
function getRateLimitData(): RateLimitData {
  try {
    const data = localStorage.getItem(RATE_LIMIT_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch {
    // Ignore parse errors
  }
  return { attempts: 0, lastAttempt: 0, lockedUntil: null };
}

// Save rate limit data
function saveRateLimitData(data: RateLimitData): void {
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
}

// Reset rate limit on successful login
function resetRateLimit(): void {
  localStorage.removeItem(RATE_LIMIT_KEY);
}

// Check if user is rate limited
function checkRateLimit(): { allowed: boolean; waitTime: number; message: string } {
  const data = getRateLimitData();
  const now = Date.now();

  // Check if locked out
  if (data.lockedUntil && now < data.lockedUntil) {
    const waitTime = Math.ceil((data.lockedUntil - now) / 1000);
    return {
      allowed: false,
      waitTime,
      message: `Account locked. Try again in ${Math.ceil(waitTime / 60)} minutes.`,
    };
  }

  // Reset if lockout expired
  if (data.lockedUntil && now >= data.lockedUntil) {
    resetRateLimit();
    return { allowed: true, waitTime: 0, message: '' };
  }

  return { allowed: true, waitTime: 0, message: '' };
}

// Record a failed login attempt
function recordFailedAttempt(): { lockedOut: boolean; message: string } {
  const data = getRateLimitData();
  const now = Date.now();

  data.attempts += 1;
  data.lastAttempt = now;

  if (data.attempts >= MAX_ATTEMPTS) {
    data.lockedUntil = now + LOCKOUT_DURATION_MS;
    saveRateLimitData(data);
    return {
      lockedOut: true,
      message: `Too many failed attempts. Account locked for 15 minutes.`,
    };
  }

  saveRateLimitData(data);
  const remaining = MAX_ATTEMPTS - data.attempts;
  return {
    lockedOut: false,
    message: `Invalid credentials. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`,
  };
}

// Build users from environment variables (secure) with fallback for development
function buildMockUsers(): Record<string, { password: string; user: MockUser }> {
  const users: Record<string, { password: string; user: MockUser }> = {};

  // Admin 1 - from environment or fallback
  const admin1Email = import.meta.env.VITE_ADMIN_EMAIL || 'admin@admin.ro';
  const admin1Password = import.meta.env.VITE_ADMIN_PASSWORD || '';
  if (admin1Password) {
    users[admin1Email.toLowerCase()] = {
      password: admin1Password,
      user: {
        id: 'mock-admin-002',
        email: admin1Email,
        role: 'admin',
        created_at: new Date().toISOString(),
      },
    };
  }

  // Admin 2 - from environment or fallback
  const admin2Email = import.meta.env.VITE_ADMIN2_EMAIL || 'vict0r@vict0r.ro';
  const admin2Password = import.meta.env.VITE_ADMIN2_PASSWORD || '';
  if (admin2Password) {
    users[admin2Email.toLowerCase()] = {
      password: admin2Password,
      user: {
        id: 'mock-admin-001',
        email: admin2Email,
        role: 'admin',
        created_at: new Date().toISOString(),
      },
    };
  }

  // Demo user - from environment or fallback
  const demoEmail = import.meta.env.VITE_DEMO_EMAIL || 'demo@demo.com';
  const demoPassword = import.meta.env.VITE_DEMO_PASSWORD || '';
  if (demoPassword) {
    users[demoEmail.toLowerCase()] = {
      password: demoPassword,
      user: {
        id: 'mock-user-001',
        email: demoEmail,
        role: 'user',
        created_at: new Date().toISOString(),
      },
    };
  }

  return users;
}

// Initialize users - built from environment variables
const MOCK_USERS: Record<string, { password: string; user: MockUser }> = buildMockUsers();

const SESSION_KEY = 'pulse_mock_session';
const SESSION_EXPIRY_HOURS = 24;

/**
 * Validate user object structure
 */
function isValidUser(user: unknown): user is MockUser {
  if (!user || typeof user !== 'object') {return false;}
  const u = user as Record<string, unknown>;
  return (
    typeof u.id === 'string' &&
    typeof u.email === 'string' &&
    (u.role === 'admin' || u.role === 'user') &&
    typeof u.created_at === 'string'
  );
}

/**
 * Get current session from localStorage
 */
export function getMockSession(): MockUser | null {
  try {
    const sessionData = localStorage.getItem(SESSION_KEY);
    if (!sessionData) {return null;}

    const { user, expiresAt } = JSON.parse(sessionData);

    // Check if session expired
    if (new Date(expiresAt) < new Date()) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }

    // Validate user data structure (security fix)
    if (!isValidUser(user)) {
      console.warn('[MockAuth] Invalid session data detected, clearing session');
      localStorage.removeItem(SESSION_KEY);
      return null;
    }

    // Verify user exists in authorized users (prevent privilege escalation)
    const authorizedUser = MOCK_USERS[user.email.toLowerCase()];
    if (!authorizedUser || authorizedUser.user.role !== user.role) {
      console.warn('[MockAuth] Session role mismatch or user not found, clearing session');
      localStorage.removeItem(SESSION_KEY);
      return null;
    }

    return user;
  } catch (error) {
    console.error('Error reading mock session:', error);
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

/**
 * Save session to localStorage
 */
function saveMockSession(user: MockUser): void {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + SESSION_EXPIRY_HOURS);

  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      user,
      expiresAt: expiresAt.toISOString(),
    })
  );
}

/**
 * Clear session from localStorage
 */
function clearMockSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

/**
 * Mock login function with rate limiting
 */
export async function mockLogin(
  email: string,
  password: string
): Promise<MockAuthResponse> {
  // Check rate limit first
  const rateLimitCheck = checkRateLimit();
  if (!rateLimitCheck.allowed) {
    return {
      user: null,
      error: rateLimitCheck.message,
    };
  }

  // Calculate delay based on failed attempts (exponential backoff)
  const rateLimitData = getRateLimitData();
  const delay = Math.min(BASE_DELAY_MS * Math.pow(2, rateLimitData.attempts), 10000);
  await new Promise((resolve) => setTimeout(resolve, delay));

  const userRecord = MOCK_USERS[email.toLowerCase()];

  if (!userRecord || userRecord.password !== password) {
    // Record failed attempt
    const result = recordFailedAttempt();
    // Audit log failed login
    logAuditEvent('LOGIN_FAILED', { email, reason: 'invalid_credentials' }, false);
    return {
      user: null,
      error: result.message,
    };
  }

  // Reset rate limit on successful login
  resetRateLimit();
  saveMockSession(userRecord.user);

  // Audit log successful login
  logAuditEvent('LOGIN', { email: userRecord.user.email, role: userRecord.user.role }, true);

  return {
    user: userRecord.user,
    error: null,
  };
}

/**
 * Mock signup function
 */
export async function mockSignup(
  email: string,
  password: string
): Promise<MockAuthResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Check if user already exists
  if (MOCK_USERS[email.toLowerCase()]) {
    return {
      user: null,
      error: 'User already exists',
    };
  }

  // Create new user (in-memory only, will be lost on refresh)
  const newUser: MockUser = {
    id: `mock-user-${Date.now()}`,
    email: email.toLowerCase(),
    role: 'user',
    created_at: new Date().toISOString(),
  };

  // Add to mock database
  MOCK_USERS[email.toLowerCase()] = {
    password,
    user: newUser,
  };

  saveMockSession(newUser);

  return {
    user: newUser,
    error: null,
  };
}

/**
 * Mock logout function
 */
export async function mockLogout(): Promise<{ error: string | null }> {
  // Audit log before clearing session
  logAuditEvent('LOGOUT', {}, true);

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  clearMockSession();

  return { error: null };
}

/**
 * Get current mock user
 */
export function getMockCurrentUser(): MockUser | null {
  return getMockSession();
}

/**
 * Check if user is admin
 */
export function isMockAdmin(): boolean {
  const user = getMockSession();
  return user?.role === 'admin';
}
