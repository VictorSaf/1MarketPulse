-- ============================================================================
-- Migration 006: Audit & Analytics Tables
-- Creates: audit_logs, user_activity, user_stats, engagement_metrics
-- ============================================================================

-- ============================================================================
-- AUDIT_LOGS TABLE
-- Comprehensive audit logging
-- ============================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id VARCHAR(255),
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    duration_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create a partitioned version for production (optional)
-- This can be enabled for high-volume deployments
-- CREATE TABLE audit_logs_partitioned (
--     LIKE audit_logs INCLUDING ALL
-- ) PARTITION BY RANGE (created_at);

-- ============================================================================
-- USER_ACTIVITY TABLE
-- Daily user activity tracking
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity_date DATE NOT NULL DEFAULT CURRENT_DATE,

    -- Session data
    sessions_count INTEGER DEFAULT 0 CHECK (sessions_count >= 0),
    total_time_seconds INTEGER DEFAULT 0 CHECK (total_time_seconds >= 0),
    first_session_at TIMESTAMPTZ,
    last_session_at TIMESTAMPTZ,

    -- Feature usage
    challenges_attempted INTEGER DEFAULT 0 CHECK (challenges_attempted >= 0),
    challenges_completed INTEGER DEFAULT 0 CHECK (challenges_completed >= 0),
    predictions_made INTEGER DEFAULT 0 CHECK (predictions_made >= 0),
    vocabulary_reviews INTEGER DEFAULT 0 CHECK (vocabulary_reviews >= 0),
    trades_opened INTEGER DEFAULT 0 CHECK (trades_opened >= 0),
    trades_closed INTEGER DEFAULT 0 CHECK (trades_closed >= 0),
    skills_completed INTEGER DEFAULT 0 CHECK (skills_completed >= 0),

    -- Engagement metrics
    pages_viewed INTEGER DEFAULT 0 CHECK (pages_viewed >= 0),
    actions_taken INTEGER DEFAULT 0 CHECK (actions_taken >= 0),
    xp_earned INTEGER DEFAULT 0 CHECK (xp_earned >= 0),

    -- Social engagement
    predictions_votes_cast INTEGER DEFAULT 0 CHECK (predictions_votes_cast >= 0),
    comments_posted INTEGER DEFAULT 0 CHECK (comments_posted >= 0),
    tribe_messages INTEGER DEFAULT 0 CHECK (tribe_messages >= 0),

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, activity_date)
);

-- ============================================================================
-- USER_STATS TABLE
-- Aggregated user statistics (updated by triggers/jobs)
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_stats (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,

    -- Lifetime stats
    total_sessions INTEGER DEFAULT 0 CHECK (total_sessions >= 0),
    total_time_seconds INTEGER DEFAULT 0 CHECK (total_time_seconds >= 0),
    total_challenges_completed INTEGER DEFAULT 0 CHECK (total_challenges_completed >= 0),
    total_predictions INTEGER DEFAULT 0 CHECK (total_predictions >= 0),
    correct_predictions INTEGER DEFAULT 0 CHECK (correct_predictions >= 0),
    total_trades INTEGER DEFAULT 0 CHECK (total_trades >= 0),
    winning_trades INTEGER DEFAULT 0 CHECK (winning_trades >= 0),
    total_xp_earned INTEGER DEFAULT 0 CHECK (total_xp_earned >= 0),
    total_achievements INTEGER DEFAULT 0 CHECK (total_achievements >= 0),
    total_vocabulary_mastered INTEGER DEFAULT 0 CHECK (total_vocabulary_mastered >= 0),
    total_skills_completed INTEGER DEFAULT 0 CHECK (total_skills_completed >= 0),

    -- Performance metrics (calculated)
    prediction_accuracy DECIMAL(5,2) DEFAULT 0 CHECK (prediction_accuracy >= 0 AND prediction_accuracy <= 100),
    trade_win_rate DECIMAL(5,2) DEFAULT 0 CHECK (trade_win_rate >= 0 AND trade_win_rate <= 100),
    avg_session_minutes INTEGER DEFAULT 0,
    avg_daily_xp DECIMAL(10,2) DEFAULT 0,

    -- Streak data
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    streak_start_date DATE,

    -- Rankings (updated periodically)
    global_rank INTEGER,
    global_rank_pct DECIMAL(5,2),
    monthly_rank INTEGER,
    weekly_rank INTEGER,

    -- Activity patterns
    most_active_hour INTEGER CHECK (most_active_hour >= 0 AND most_active_hour < 24),
    most_active_day INTEGER CHECK (most_active_day >= 0 AND most_active_day <= 6),
    days_active INTEGER DEFAULT 0,
    first_activity_date DATE,
    last_activity_date DATE,

    last_calculated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ENGAGEMENT_METRICS TABLE
-- Platform-wide engagement metrics (admin dashboard)
-- ============================================================================
CREATE TABLE IF NOT EXISTS engagement_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_date DATE NOT NULL DEFAULT CURRENT_DATE,

    -- User metrics
    daily_active_users INTEGER DEFAULT 0 CHECK (daily_active_users >= 0),
    weekly_active_users INTEGER DEFAULT 0 CHECK (weekly_active_users >= 0),
    monthly_active_users INTEGER DEFAULT 0 CHECK (monthly_active_users >= 0),
    new_users INTEGER DEFAULT 0 CHECK (new_users >= 0),
    returning_users INTEGER DEFAULT 0 CHECK (returning_users >= 0),
    churned_users INTEGER DEFAULT 0 CHECK (churned_users >= 0),

    -- Session metrics
    total_sessions INTEGER DEFAULT 0 CHECK (total_sessions >= 0),
    avg_session_duration_seconds INTEGER DEFAULT 0,
    median_session_duration_seconds INTEGER DEFAULT 0,
    total_session_time_hours DECIMAL(10,2) DEFAULT 0,

    -- Engagement metrics
    total_page_views INTEGER DEFAULT 0 CHECK (total_page_views >= 0),
    avg_pages_per_session DECIMAL(5,2) DEFAULT 0,
    bounce_rate DECIMAL(5,2) DEFAULT 0 CHECK (bounce_rate >= 0 AND bounce_rate <= 100),

    -- Feature usage
    challenges_started INTEGER DEFAULT 0,
    challenges_completed INTEGER DEFAULT 0,
    predictions_made INTEGER DEFAULT 0,
    predictions_correct INTEGER DEFAULT 0,
    trades_opened INTEGER DEFAULT 0,
    trades_closed INTEGER DEFAULT 0,
    vocabulary_reviews INTEGER DEFAULT 0,
    achievements_unlocked INTEGER DEFAULT 0,

    -- Social engagement
    new_tribe_members INTEGER DEFAULT 0,
    prediction_votes INTEGER DEFAULT 0,
    comments_posted INTEGER DEFAULT 0,
    mentorship_requests INTEGER DEFAULT 0,

    -- Retention cohorts
    d1_retention DECIMAL(5,2) DEFAULT 0 CHECK (d1_retention >= 0 AND d1_retention <= 100),
    d7_retention DECIMAL(5,2) DEFAULT 0 CHECK (d7_retention >= 0 AND d7_retention <= 100),
    d14_retention DECIMAL(5,2) DEFAULT 0 CHECK (d14_retention >= 0 AND d14_retention <= 100),
    d30_retention DECIMAL(5,2) DEFAULT 0 CHECK (d30_retention >= 0 AND d30_retention <= 100),

    -- Revenue metrics (if applicable)
    revenue DECIMAL(15,2) DEFAULT 0,
    arpu DECIMAL(10,2) DEFAULT 0,
    arppu DECIMAL(10,2) DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(metric_date)
);

-- ============================================================================
-- LEADERBOARD_SNAPSHOTS TABLE
-- Historical leaderboard snapshots
-- ============================================================================
CREATE TABLE IF NOT EXISTS leaderboard_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
    leaderboard_type VARCHAR(50) NOT NULL CHECK (leaderboard_type IN ('global', 'monthly', 'weekly', 'tribe')),
    tribe_id UUID REFERENCES tribes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rank_position INTEGER NOT NULL CHECK (rank_position > 0),
    score DECIMAL(15,2) NOT NULL,
    metric_values JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
    -- NOTE: Unique constraint handled via partial indexes in 007_schema_fixes.sql
);

-- ============================================================================
-- INDEXES
-- ============================================================================
-- Audit logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_success ON audit_logs(success);
CREATE INDEX IF NOT EXISTS idx_audit_logs_session_id ON audit_logs(session_id);

-- User activity
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_date ON user_activity(activity_date DESC);
CREATE INDEX IF NOT EXISTS idx_user_activity_user_date ON user_activity(user_id, activity_date DESC);

-- User stats
CREATE INDEX IF NOT EXISTS idx_user_stats_global_rank ON user_stats(global_rank);
CREATE INDEX IF NOT EXISTS idx_user_stats_monthly_rank ON user_stats(monthly_rank);
CREATE INDEX IF NOT EXISTS idx_user_stats_total_xp ON user_stats(total_xp_earned DESC);
CREATE INDEX IF NOT EXISTS idx_user_stats_prediction_accuracy ON user_stats(prediction_accuracy DESC);

-- Engagement metrics
CREATE INDEX IF NOT EXISTS idx_engagement_metrics_date ON engagement_metrics(metric_date DESC);

-- Leaderboard snapshots
CREATE INDEX IF NOT EXISTS idx_leaderboard_snapshots_date ON leaderboard_snapshots(snapshot_date DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_snapshots_type ON leaderboard_snapshots(leaderboard_type);
CREATE INDEX IF NOT EXISTS idx_leaderboard_snapshots_tribe ON leaderboard_snapshots(tribe_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_snapshots_user ON leaderboard_snapshots(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_snapshots_rank ON leaderboard_snapshots(rank_position);

-- ============================================================================
-- TRIGGERS
-- ============================================================================
CREATE TRIGGER tr_user_activity_updated_at
    BEFORE UPDATE ON user_activity
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_user_stats_updated_at
    BEFORE UPDATE ON user_stats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create user stats
CREATE OR REPLACE FUNCTION create_user_stats()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_stats (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_create_user_stats
    AFTER INSERT ON users
    FOR EACH ROW EXECUTE FUNCTION create_user_stats();

-- ============================================================================
-- FUNCTIONS FOR STATS CALCULATION
-- ============================================================================

-- Update user stats from activity
CREATE OR REPLACE FUNCTION update_user_stats_from_activity()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE user_stats
    SET
        total_sessions = total_sessions + (NEW.sessions_count - COALESCE(OLD.sessions_count, 0)),
        total_time_seconds = total_time_seconds + (NEW.total_time_seconds - COALESCE(OLD.total_time_seconds, 0)),
        total_challenges_completed = total_challenges_completed + (NEW.challenges_completed - COALESCE(OLD.challenges_completed, 0)),
        total_predictions = total_predictions + (NEW.predictions_made - COALESCE(OLD.predictions_made, 0)),
        total_xp_earned = total_xp_earned + (NEW.xp_earned - COALESCE(OLD.xp_earned, 0)),
        last_activity_date = NEW.activity_date,
        days_active = (
            SELECT COUNT(DISTINCT activity_date)
            FROM user_activity
            WHERE user_id = NEW.user_id
        ),
        last_calculated_at = NOW()
    WHERE user_id = NEW.user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_update_user_stats_from_activity
    AFTER INSERT OR UPDATE ON user_activity
    FOR EACH ROW EXECUTE FUNCTION update_user_stats_from_activity();

-- Calculate prediction accuracy
CREATE OR REPLACE FUNCTION calculate_prediction_accuracy(p_user_id UUID)
RETURNS DECIMAL(5,2) AS $$
DECLARE
    v_total INTEGER;
    v_correct INTEGER;
BEGIN
    SELECT COUNT(*), COUNT(*) FILTER (WHERE outcome = 'correct')
    INTO v_total, v_correct
    FROM predictions
    WHERE user_id = p_user_id AND outcome IN ('correct', 'incorrect');

    IF v_total = 0 THEN
        RETURN 0;
    END IF;

    RETURN (v_correct::DECIMAL / v_total) * 100;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE engagement_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_snapshots ENABLE ROW LEVEL SECURITY;

-- Audit logs: admin only (with user seeing their own)
CREATE POLICY audit_logs_select_own ON audit_logs
    FOR SELECT USING (user_id = current_setting('app.current_user_id', true)::uuid);

CREATE POLICY audit_logs_admin_full ON audit_logs
    FOR ALL USING (current_setting('app.current_user_role', true) = 'admin');

-- User activity: own data
CREATE POLICY user_activity_own ON user_activity
    FOR ALL USING (user_id = current_setting('app.current_user_id', true)::uuid);

CREATE POLICY user_activity_admin ON user_activity
    FOR ALL USING (current_setting('app.current_user_role', true) = 'admin');

-- User stats: public read, own write
CREATE POLICY user_stats_select_all ON user_stats
    FOR SELECT USING (TRUE);

CREATE POLICY user_stats_update_own ON user_stats
    FOR UPDATE USING (user_id = current_setting('app.current_user_id', true)::uuid);

CREATE POLICY user_stats_admin ON user_stats
    FOR ALL USING (current_setting('app.current_user_role', true) = 'admin');

-- Engagement metrics: admin only
CREATE POLICY engagement_metrics_admin ON engagement_metrics
    FOR ALL USING (current_setting('app.current_user_role', true) = 'admin');

-- Leaderboard snapshots: public read
CREATE POLICY leaderboard_snapshots_select_all ON leaderboard_snapshots
    FOR SELECT USING (TRUE);

CREATE POLICY leaderboard_snapshots_admin ON leaderboard_snapshots
    FOR ALL USING (current_setting('app.current_user_role', true) = 'admin');

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON TABLE audit_logs IS 'Comprehensive action audit logging';
COMMENT ON TABLE user_activity IS 'Daily per-user activity aggregation';
COMMENT ON TABLE user_stats IS 'Lifetime user statistics and rankings';
COMMENT ON TABLE engagement_metrics IS 'Platform-wide daily engagement metrics';
COMMENT ON TABLE leaderboard_snapshots IS 'Historical leaderboard positions';

COMMENT ON COLUMN audit_logs.duration_ms IS 'Operation duration in milliseconds';
COMMENT ON COLUMN user_activity.activity_date IS 'Date of activity (partitioning key)';
COMMENT ON COLUMN user_stats.prediction_accuracy IS 'Percentage of correct predictions';
COMMENT ON COLUMN user_stats.global_rank_pct IS 'Percentile rank (0-100)';
COMMENT ON COLUMN engagement_metrics.d1_retention IS 'Day 1 retention percentage';
COMMENT ON COLUMN engagement_metrics.arpu IS 'Average revenue per user';
COMMENT ON COLUMN engagement_metrics.arppu IS 'Average revenue per paying user';
