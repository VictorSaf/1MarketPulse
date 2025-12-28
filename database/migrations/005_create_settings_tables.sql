-- ============================================================================
-- Migration 005: Settings & Preferences Tables
-- Creates: user_settings, feature_flags
-- ============================================================================

-- ============================================================================
-- USER_SETTINGS TABLE
-- User application settings
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_settings (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    -- API Settings (encrypted storage)
    api_keys_encrypted BYTEA,

    -- Polling intervals (milliseconds)
    polling_stock_quote INTEGER DEFAULT 15000 CHECK (polling_stock_quote >= 1000),
    polling_crypto_price INTEGER DEFAULT 10000 CHECK (polling_crypto_price >= 1000),
    polling_news INTEGER DEFAULT 300000 CHECK (polling_news >= 60000),
    polling_fear_greed INTEGER DEFAULT 3600000 CHECK (polling_fear_greed >= 300000),
    polling_market_index INTEGER DEFAULT 30000 CHECK (polling_market_index >= 5000),

    -- Cache settings
    cache_enabled BOOLEAN DEFAULT TRUE,
    cache_stock_quote_ttl INTEGER DEFAULT 15 CHECK (cache_stock_quote_ttl >= 5),
    cache_crypto_price_ttl INTEGER DEFAULT 10 CHECK (cache_crypto_price_ttl >= 5),
    cache_news_ttl INTEGER DEFAULT 300 CHECK (cache_news_ttl >= 60),
    cache_fear_greed_ttl INTEGER DEFAULT 3600 CHECK (cache_fear_greed_ttl >= 300),
    cache_max_entries INTEGER DEFAULT 500 CHECK (cache_max_entries >= 100),

    -- Display settings
    default_tab VARCHAR(50) DEFAULT 'overview',
    theme VARCHAR(20) DEFAULT 'dark' CHECK (theme IN ('dark', 'light', 'system')),
    decimal_places INTEGER DEFAULT 2 CHECK (decimal_places >= 0 AND decimal_places <= 8),
    compact_numbers BOOLEAN DEFAULT TRUE,
    show_animations BOOLEAN DEFAULT TRUE,
    language VARCHAR(10) DEFAULT 'en',

    -- Feature flags (user-specific overrides)
    ai_enabled BOOLEAN DEFAULT TRUE,
    ai_analysis BOOLEAN DEFAULT TRUE,
    ai_morning_brief BOOLEAN DEFAULT TRUE,
    ai_sentiment BOOLEAN DEFAULT TRUE,
    demo_mode BOOLEAN DEFAULT FALSE,
    real_data_enabled BOOLEAN DEFAULT TRUE,

    -- Tab visibility
    tab_overview BOOLEAN DEFAULT TRUE,
    tab_heartbeat BOOLEAN DEFAULT TRUE,
    tab_weather BOOLEAN DEFAULT TRUE,
    tab_dna BOOLEAN DEFAULT TRUE,
    tab_stories BOOLEAN DEFAULT TRUE,
    tab_patterns BOOLEAN DEFAULT TRUE,
    tab_advanced BOOLEAN DEFAULT TRUE,
    tab_learning BOOLEAN DEFAULT TRUE,

    -- Notification settings
    email_notifications BOOLEAN DEFAULT TRUE,
    email_daily_digest BOOLEAN DEFAULT FALSE,
    email_weekly_summary BOOLEAN DEFAULT TRUE,
    email_achievement_unlocked BOOLEAN DEFAULT TRUE,
    email_challenge_reminder BOOLEAN DEFAULT TRUE,
    email_prediction_result BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT FALSE,
    push_price_alerts BOOLEAN DEFAULT FALSE,
    push_prediction_result BOOLEAN DEFAULT FALSE,
    prediction_reminders BOOLEAN DEFAULT TRUE,
    challenge_reminders BOOLEAN DEFAULT TRUE,

    -- Privacy settings
    profile_public BOOLEAN DEFAULT TRUE,
    show_predictions BOOLEAN DEFAULT TRUE,
    show_achievements BOOLEAN DEFAULT TRUE,
    show_stats BOOLEAN DEFAULT TRUE,
    allow_mentorship_requests BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- FEATURE_FLAGS TABLE
-- Global feature flags (admin-managed)
-- ============================================================================
CREATE TABLE IF NOT EXISTS feature_flags (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    is_enabled BOOLEAN DEFAULT FALSE,
    enabled_for_roles TEXT[] DEFAULT '{}',
    enabled_for_users UUID[] DEFAULT '{}',
    percentage_rollout INTEGER DEFAULT 0 CHECK (percentage_rollout >= 0 AND percentage_rollout <= 100),
    metadata JSONB DEFAULT '{}',
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- API_KEYS TABLE
-- Encrypted API key storage
-- ============================================================================
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_name VARCHAR(50) NOT NULL,
    key_encrypted BYTEA NOT NULL,
    key_hint VARCHAR(10), -- Last 4 chars for display
    is_active BOOLEAN DEFAULT TRUE,
    last_used_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, service_name)
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_user_settings_theme ON user_settings(theme);
CREATE INDEX IF NOT EXISTS idx_user_settings_language ON user_settings(language);

CREATE INDEX IF NOT EXISTS idx_feature_flags_is_enabled ON feature_flags(is_enabled);

CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_service ON api_keys(service_name);
CREATE INDEX IF NOT EXISTS idx_api_keys_is_active ON api_keys(is_active);

-- ============================================================================
-- TRIGGERS
-- ============================================================================
CREATE TRIGGER tr_user_settings_updated_at
    BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_feature_flags_updated_at
    BEFORE UPDATE ON feature_flags
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_api_keys_updated_at
    BEFORE UPDATE ON api_keys
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create user settings
CREATE OR REPLACE FUNCTION create_user_settings()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_settings (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_create_user_settings
    AFTER INSERT ON users
    FOR EACH ROW EXECUTE FUNCTION create_user_settings();

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Check if feature is enabled for user
CREATE OR REPLACE FUNCTION is_feature_enabled(
    p_feature_id VARCHAR(100),
    p_user_id UUID,
    p_user_role VARCHAR(20)
)
RETURNS BOOLEAN AS $$
DECLARE
    v_flag feature_flags%ROWTYPE;
BEGIN
    SELECT * INTO v_flag FROM feature_flags WHERE id = p_feature_id;

    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;

    -- Check if globally enabled
    IF v_flag.is_enabled THEN
        RETURN TRUE;
    END IF;

    -- Check if enabled for user's role
    IF p_user_role = ANY(v_flag.enabled_for_roles) THEN
        RETURN TRUE;
    END IF;

    -- Check if enabled for specific user
    IF p_user_id = ANY(v_flag.enabled_for_users) THEN
        RETURN TRUE;
    END IF;

    -- Check percentage rollout (consistent per user)
    IF v_flag.percentage_rollout > 0 THEN
        RETURN (hashtext(p_user_id::text) % 100) < v_flag.percentage_rollout;
    END IF;

    RETURN FALSE;
END;
$$ LANGUAGE plpgsql STABLE;

-- Encrypt API key
CREATE OR REPLACE FUNCTION encrypt_api_key(
    p_key TEXT,
    p_secret TEXT
)
RETURNS BYTEA AS $$
BEGIN
    RETURN pgp_sym_encrypt(p_key, p_secret);
END;
$$ LANGUAGE plpgsql;

-- Decrypt API key
CREATE OR REPLACE FUNCTION decrypt_api_key(
    p_encrypted BYTEA,
    p_secret TEXT
)
RETURNS TEXT AS $$
BEGIN
    RETURN pgp_sym_decrypt(p_encrypted, p_secret);
EXCEPTION WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- User settings: user owns
CREATE POLICY user_settings_own ON user_settings
    FOR ALL USING (user_id = current_setting('app.current_user_id', true)::uuid);

-- Feature flags: read all, write admin only
CREATE POLICY feature_flags_select_all ON feature_flags
    FOR SELECT USING (TRUE);

CREATE POLICY feature_flags_admin_write ON feature_flags
    FOR ALL USING (current_setting('app.current_user_role', true) = 'admin');

-- API keys: user owns
CREATE POLICY api_keys_own ON api_keys
    FOR ALL USING (user_id = current_setting('app.current_user_id', true)::uuid);

-- Admin full access
CREATE POLICY admin_user_settings_full ON user_settings
    FOR ALL USING (current_setting('app.current_user_role', true) = 'admin');

CREATE POLICY admin_api_keys_full ON api_keys
    FOR ALL USING (current_setting('app.current_user_role', true) = 'admin');

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON TABLE user_settings IS 'User application settings and preferences';
COMMENT ON TABLE feature_flags IS 'Global feature flags with role/user targeting';
COMMENT ON TABLE api_keys IS 'Encrypted API key storage for external services';

COMMENT ON COLUMN user_settings.api_keys_encrypted IS 'Deprecated: Use api_keys table instead';
COMMENT ON COLUMN user_settings.polling_stock_quote IS 'Polling interval in milliseconds';
COMMENT ON COLUMN user_settings.cache_stock_quote_ttl IS 'Cache TTL in seconds';
COMMENT ON COLUMN feature_flags.percentage_rollout IS 'Percentage of users to enable (0-100)';
COMMENT ON COLUMN feature_flags.enabled_for_roles IS 'Array of roles to enable for';
COMMENT ON COLUMN api_keys.key_encrypted IS 'PGP encrypted API key';
COMMENT ON COLUMN api_keys.key_hint IS 'Last 4 characters for display';

-- ============================================================================
-- SEED DEFAULT FEATURE FLAGS
-- ============================================================================
INSERT INTO feature_flags (id, name, description, is_enabled)
VALUES
    ('ai_analysis', 'AI Analysis', 'Enable AI-powered market analysis', TRUE),
    ('ai_morning_brief', 'AI Morning Brief', 'Enable AI-generated morning briefings', TRUE),
    ('ai_sentiment', 'AI Sentiment Analysis', 'Enable AI sentiment analysis on news', TRUE),
    ('paper_trading', 'Paper Trading', 'Enable paper trading feature', TRUE),
    ('social_tribes', 'Social Tribes', 'Enable community tribes feature', TRUE),
    ('mentorship', 'Mentorship Program', 'Enable mentor-mentee matching', TRUE),
    ('leaderboards', 'Leaderboards', 'Enable global and tribe leaderboards', TRUE),
    ('achievements', 'Achievement System', 'Enable achievement unlocking', TRUE),
    ('daily_challenges', 'Daily Challenges', 'Enable daily challenges feature', TRUE),
    ('knowledge_tree', 'Knowledge Tree', 'Enable skill tree progression', TRUE),
    ('vocabulary_builder', 'Vocabulary Builder', 'Enable vocabulary learning', TRUE),
    ('beta_features', 'Beta Features', 'Access to experimental features', FALSE),
    ('admin_panel', 'Admin Panel', 'Access to admin dashboard', FALSE)
ON CONFLICT (id) DO NOTHING;

-- Enable admin_panel for admin role
UPDATE feature_flags
SET enabled_for_roles = ARRAY['admin']
WHERE id = 'admin_panel';

-- Enable beta_features for admin role
UPDATE feature_flags
SET enabled_for_roles = ARRAY['admin']
WHERE id = 'beta_features';
