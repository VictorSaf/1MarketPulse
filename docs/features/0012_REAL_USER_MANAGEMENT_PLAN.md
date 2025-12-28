# Feature Plan: Real User Management System

**Plan ID**: 0012
**Created**: 2024-12-28
**Status**: Implementation Ready
**Priority**: Critical

---

## 1. Executive Summary

Replace mock authentication with a real database-backed user management system. This includes:
- Real user registration with bcrypt password hashing
- Secure login with JWT token generation
- Session management with database-stored sessions
- Backend API routes for authentication
- Frontend integration with real backend

---

## 2. Current State Analysis

### What Exists
1. **Database Schema** (`database/migrations/001_create_core_tables.sql`)
   - `users` table with email, role, display_name, avatar, etc.
   - `user_profiles` table with gamification data (XP, level, streaks)
   - `sessions` table for tracking active sessions
   - Row Level Security (RLS) policies
   - Triggers for auto-profile creation

2. **Frontend Auth Layer** (`src/services/auth/`)
   - `authService.ts` - Unified auth service (Supabase or mock)
   - `authStore.ts` - Zustand store for auth state
   - `mockAuthService.ts` - Mock auth with hardcoded env users
   - `supabaseClient.ts` - Supabase client (currently unused)

3. **Auth Components** (`src/app/components/auth/`)
   - `LoginForm.tsx` - Login UI
   - `SignupForm.tsx` - Registration UI
   - `AuthProvider.tsx` - Auth context provider
   - `AuthGuard.tsx` / `AdminGuard.tsx` - Route protection

4. **Backend Server** (`server/`)
   - Hono framework on port 3001
   - Existing routes: market, news, sentiment, crypto, health
   - No auth routes currently

### What Needs to Change
1. Add PostgreSQL connection to backend
2. Create auth API routes (register, login, logout, me)
3. Implement password hashing with bcrypt
4. Implement JWT token generation/validation
5. Replace mock auth with real API calls
6. Remove hardcoded demo credentials

---

## 3. Technical Design

### 3.1 Backend Architecture

```
server/src/
├── config/
│   └── database.ts          # PostgreSQL connection pool
├── services/
│   ├── auth/
│   │   ├── authService.ts   # Auth business logic
│   │   ├── passwordService.ts # bcrypt hashing
│   │   └── jwtService.ts    # JWT token management
│   └── user/
│       └── userRepository.ts # Database queries
├── routes/
│   └── auth.ts              # Auth API endpoints
├── middleware/
│   └── authMiddleware.ts    # JWT validation middleware
└── types/
    └── auth.types.ts        # TypeScript types
```

### 3.2 API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Create new user | No |
| POST | `/api/auth/login` | Login, get JWT | No |
| POST | `/api/auth/logout` | Invalidate session | Yes |
| GET | `/api/auth/me` | Get current user | Yes |
| POST | `/api/auth/refresh` | Refresh JWT token | Yes |
| PUT | `/api/auth/profile` | Update profile | Yes |

### 3.3 Database Queries

```sql
-- Register user (password hashed in code)
INSERT INTO users (email, password_hash, role, display_name)
VALUES ($1, $2, 'user', $3)
RETURNING id, email, role, display_name, created_at;

-- Login lookup
SELECT id, email, password_hash, role, display_name, is_active
FROM users WHERE email = $1 AND is_active = true;

-- Create session
INSERT INTO sessions (user_id, token_hash, expires_at, user_agent, ip_address)
VALUES ($1, $2, $3, $4, $5)
RETURNING id;

-- Validate session
SELECT s.id, s.expires_at, u.id as user_id, u.email, u.role
FROM sessions s
JOIN users u ON s.user_id = u.id
WHERE s.token_hash = $1 AND s.is_active = true AND s.expires_at > NOW();
```

### 3.4 Security Implementation

1. **Password Hashing**: bcrypt with cost factor 12
2. **JWT Tokens**:
   - Access token: 15 minutes expiry
   - Refresh token: 7 days expiry
   - Stored as httpOnly cookies
3. **Session Tracking**: Database-stored with IP and user agent
4. **Rate Limiting**: Already exists in backend (100 req/min)

### 3.5 JWT Token Structure

```typescript
// Access Token Payload
{
  sub: string;      // user.id
  email: string;    // user.email
  role: string;     // user.role
  iat: number;      // issued at
  exp: number;      // expiration (15 min)
}

// Refresh Token Payload
{
  sub: string;      // user.id
  sid: string;      // session.id
  iat: number;      // issued at
  exp: number;      // expiration (7 days)
}
```

---

## 4. Implementation Phases

### Phase 1: Backend Database Setup (30 min)
**Files to create/modify:**
- `server/src/config/database.ts` - PostgreSQL connection pool
- `server/.env` - Add DATABASE_URL

**Tasks:**
1. Install pg package
2. Create connection pool with SSL support
3. Add health check for database connection
4. Update environment configuration

### Phase 2: Backend Auth Services (45 min)
**Files to create:**
- `server/src/services/auth/passwordService.ts`
- `server/src/services/auth/jwtService.ts`
- `server/src/services/auth/authService.ts`
- `server/src/services/user/userRepository.ts`
- `server/src/types/auth.types.ts`

**Tasks:**
1. Implement bcrypt password hashing/verification
2. Implement JWT sign/verify with jsonwebtoken
3. Create user repository with CRUD operations
4. Create auth service orchestrating login/register flow

### Phase 3: Backend Auth Routes (30 min)
**Files to create/modify:**
- `server/src/routes/auth.ts`
- `server/src/middleware/authMiddleware.ts`
- `server/src/routes/index.ts` (add auth routes)

**Tasks:**
1. Create POST /api/auth/register endpoint
2. Create POST /api/auth/login endpoint
3. Create POST /api/auth/logout endpoint
4. Create GET /api/auth/me endpoint
5. Create JWT validation middleware
6. Add routes to main router

### Phase 4: Frontend Integration (30 min)
**Files to modify:**
- `src/services/auth/authService.ts`
- `src/services/auth/index.ts`
- `src/config/backend.config.ts`

**Tasks:**
1. Create new backend auth client
2. Replace mock calls with real API calls
3. Handle JWT token storage (localStorage or cookies)
4. Update auth state management
5. Handle token refresh

### Phase 5: Cleanup & Testing (15 min)
**Files to modify:**
- `src/app/components/auth/LoginForm.tsx` - Remove mock hints
- `src/services/auth/mockAuthService.ts` - Keep for fallback
- `.env.example` - Update with new variables

**Tasks:**
1. Remove demo credential hints from UI
2. Update environment variable documentation
3. Test registration flow
4. Test login flow
5. Test session persistence
6. Test logout flow

---

## 5. File-by-File Implementation

### 5.1 `server/src/config/database.ts`

```typescript
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export async function query<T>(text: string, params?: any[]): Promise<T[]> {
  const result = await pool.query(text, params);
  return result.rows as T[];
}

export async function queryOne<T>(text: string, params?: any[]): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] || null;
}

export async function checkConnection(): Promise<boolean> {
  try {
    await pool.query('SELECT 1');
    return true;
  } catch {
    return false;
  }
}

export default pool;
```

### 5.2 `server/src/services/auth/passwordService.ts`

```typescript
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function validatePasswordStrength(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  return { valid: true };
}
```

### 5.3 `server/src/services/auth/jwtService.ts`

```typescript
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

export interface TokenPayload {
  sub: string;
  email: string;
  role: string;
}

export interface RefreshTokenPayload {
  sub: string;
  sid: string;
}

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
}

export function generateRefreshToken(payload: RefreshTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
}

export function verifyToken<T>(token: string): T | null {
  try {
    return jwt.verify(token, JWT_SECRET) as T;
  } catch {
    return null;
  }
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}
```

### 5.4 API Response Format

```typescript
// Success
{
  success: true,
  data: {
    user: { id, email, role, displayName },
    accessToken: string,
    refreshToken: string
  }
}

// Error
{
  success: false,
  error: string,
  message: string
}
```

---

## 6. Environment Variables

### Backend (`server/.env`)
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/pulse2

# JWT
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Existing variables...
PORT=3001
NODE_ENV=development
```

### Frontend (`.env`)
```env
# Backend URL
VITE_BACKEND_URL=http://localhost:3001

# Remove mock credentials - no longer needed
# VITE_ADMIN_EMAIL (remove)
# VITE_ADMIN_PASSWORD (remove)
# VITE_DEMO_EMAIL (remove)
# VITE_DEMO_PASSWORD (remove)
```

---

## 7. Database Schema Updates

Need to add `password_hash` column to users table:

```sql
-- Add password_hash column if not exists
ALTER TABLE users
ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

-- Make password_hash required for new users
-- (existing users will need password reset flow)
```

---

## 8. Security Checklist

- [ ] Passwords hashed with bcrypt (cost 12)
- [ ] JWT tokens with short expiry (15 min access)
- [ ] Refresh tokens stored in httpOnly cookies
- [ ] Session stored in database with IP/user-agent
- [ ] Rate limiting on auth endpoints
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (no raw HTML output)
- [ ] CORS properly configured
- [ ] HTTPS in production

---

## 9. Migration Path

### For Existing Mock Users
1. Keep mock auth as fallback (can be enabled via env flag)
2. Provide password reset flow for migrating users
3. First admin user created via database seed or special endpoint

### Initial Admin User
```sql
-- Create initial admin user (password: Admin123!)
INSERT INTO users (email, password_hash, role, display_name, is_verified)
VALUES (
  'admin@pulse2.com',
  '$2b$12$...',  -- bcrypt hash of password
  'admin',
  'Admin',
  true
);
```

---

## 10. Testing Plan

1. **Registration Tests**
   - Valid registration creates user
   - Duplicate email rejected
   - Weak password rejected
   - Profile auto-created

2. **Login Tests**
   - Valid credentials return tokens
   - Invalid email rejected
   - Invalid password rejected
   - Inactive user rejected

3. **Session Tests**
   - Access token validates
   - Expired token rejected
   - Refresh token generates new access token
   - Logout invalidates session

4. **Authorization Tests**
   - Protected routes require auth
   - Admin routes require admin role
   - User cannot access other user data

---

## 11. Dependencies to Add

### Backend (`server/package.json`)
```json
{
  "dependencies": {
    "pg": "^8.11.3",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2"
  },
  "devDependencies": {
    "@types/pg": "^8.10.9",
    "@types/bcrypt": "^5.0.2",
    "@types/jsonwebtoken": "^9.0.5"
  }
}
```

---

## 12. Success Criteria

1. Users can register with email/password
2. Users can login and receive JWT tokens
3. Protected routes validate JWT tokens
4. Sessions persist in database
5. Logout invalidates session
6. No hardcoded credentials in codebase
7. All passwords properly hashed
8. Frontend works with real backend auth

---

**Next Step**: Begin Phase 1 implementation - Backend Database Setup
