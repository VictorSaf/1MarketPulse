-- ============================================================================
-- Migration 001: Core Tables
-- Creates: users, user_profiles, sessions
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- USERS TABLE
-- Primary user table (extends Supabase auth.users)
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user', 'moderator')),
    display_name VARCHAR(100),
    avatar_url TEXT,
    avatar_emoji VARCHAR(10) DEFAULT '👤',
    bio TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- USER_PROFILES TABLE
-- Extended user profile information
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    level INTEGER DEFAULT 1,
    total_xp INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    streak_last_date DATE,
    title VARCHAR(100) DEFAULT 'Newcomer',
    timezone VARCHAR(50) DEFAULT 'UTC',
    country_code VARCHAR(3),
    trading_experience VARCHAR(50) DEFAULT 'beginner' CHECK (trading_experience IN ('beginner', 'intermediate', 'advanced', 'expert')),
    risk_tolerance VARCHAR(20) DEFAULT 'moderate' CHECK (risk_tolerance IN ('conservative', 'moderate', 'aggressive')),
    preferred_assets TEXT[],
    onboarding_completed BOOLEAN DEFAULT FALSE,
    onboarding_step INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- ============================================================================
-- SESSIONS TABLE
-- User session tracking
-- ============================================================================
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    user_agent TEXT,
    ip_address INET,
    device_type VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMPTZ NOT NULL,
    last_activity_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_level ON user_profiles(level);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_sessions_is_active ON sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_sessions_token_hash ON sessions(token_hash);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create user profile
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_profiles (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_create_user_profile
    AFTER INSERT ON users
    FOR EACH ROW EXECUTE FUNCTION create_user_profile();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY users_select_own ON users
    FOR SELECT USING (id = current_setting('app.current_user_id', true)::uuid);

-- Users can update their own profile
CREATE POLICY users_update_own ON users
    FOR UPDATE USING (id = current_setting('app.current_user_id', true)::uuid);

-- User profiles policies
CREATE POLICY user_profiles_select_own ON user_profiles
    FOR SELECT USING (user_id = current_setting('app.current_user_id', true)::uuid);

CREATE POLICY user_profiles_update_own ON user_profiles
    FOR UPDATE USING (user_id = current_setting('app.current_user_id', true)::uuid);

-- Sessions policies
CREATE POLICY sessions_select_own ON sessions
    FOR SELECT USING (user_id = current_setting('app.current_user_id', true)::uuid);

CREATE POLICY sessions_insert_own ON sessions
    FOR INSERT WITH CHECK (user_id = current_setting('app.current_user_id', true)::uuid);

CREATE POLICY sessions_delete_own ON sessions
    FOR DELETE USING (user_id = current_setting('app.current_user_id', true)::uuid);

-- Admin full access policies
CREATE POLICY admin_users_full_access ON users
    FOR ALL USING (
        current_setting('app.current_user_role', true) = 'admin'
    );

CREATE POLICY admin_user_profiles_full_access ON user_profiles
    FOR ALL USING (
        current_setting('app.current_user_role', true) = 'admin'
    );

CREATE POLICY admin_sessions_full_access ON sessions
    FOR ALL USING (
        current_setting('app.current_user_role', true) = 'admin'
    );

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON TABLE users IS 'Primary user accounts table';
COMMENT ON TABLE user_profiles IS 'Extended user profile with gamification data';
COMMENT ON TABLE sessions IS 'User session tracking for analytics';

COMMENT ON COLUMN users.role IS 'User role: admin, user, or moderator';
COMMENT ON COLUMN users.avatar_emoji IS 'Emoji avatar for users without profile picture';
COMMENT ON COLUMN user_profiles.total_xp IS 'Total experience points earned';
COMMENT ON COLUMN user_profiles.current_streak IS 'Current daily activity streak';
COMMENT ON COLUMN user_profiles.preferred_assets IS 'Array of preferred asset types';
