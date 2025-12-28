-- ============================================================================
-- Migration 002: Learning & Gamification Tables
-- Creates: skill_nodes, user_skill_progress, vocabulary_terms,
--          user_vocabulary_progress, challenge_templates, user_challenges,
--          achievements, user_achievements
-- ============================================================================

-- ============================================================================
-- SKILL_NODES TABLE
-- Master table of all skill nodes in the Knowledge Tree
-- ============================================================================
CREATE TABLE IF NOT EXISTS skill_nodes (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(10) DEFAULT '📊',
    category VARCHAR(50) NOT NULL,
    layer INTEGER NOT NULL DEFAULT 1 CHECK (layer >= 1 AND layer <= 10),
    xp_required INTEGER NOT NULL DEFAULT 100 CHECK (xp_required >= 0),
    benefit TEXT,
    content_url TEXT,
    quiz_id UUID,
    prerequisites TEXT[],
    unlocks TEXT[],
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- USER_SKILL_PROGRESS TABLE
-- User progress through the Knowledge Tree
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_skill_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_id VARCHAR(50) NOT NULL REFERENCES skill_nodes(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'locked' CHECK (status IN ('locked', 'available', 'in_progress', 'completed')),
    progress_pct INTEGER DEFAULT 0 CHECK (progress_pct >= 0 AND progress_pct <= 100),
    xp_earned INTEGER DEFAULT 0 CHECK (xp_earned >= 0),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    last_activity_at TIMESTAMPTZ DEFAULT NOW(),
    attempts INTEGER DEFAULT 0,
    quiz_score INTEGER CHECK (quiz_score >= 0 AND quiz_score <= 100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, skill_id)
);

-- ============================================================================
-- VOCABULARY_TERMS TABLE
-- Master vocabulary database
-- ============================================================================
CREATE TABLE IF NOT EXISTS vocabulary_terms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    term VARCHAR(100) NOT NULL UNIQUE,
    definition TEXT NOT NULL,
    example TEXT,
    category VARCHAR(50) NOT NULL,
    difficulty VARCHAR(20) DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'expert')),
    related_terms TEXT[],
    tags TEXT[],
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- USER_VOCABULARY_PROGRESS TABLE
-- User vocabulary learning progress with spaced repetition (SM-2)
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_vocabulary_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    term_id UUID NOT NULL REFERENCES vocabulary_terms(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'learning', 'known', 'mastered')),
    ease_factor DECIMAL(3,2) DEFAULT 2.50 CHECK (ease_factor >= 1.30 AND ease_factor <= 3.00),
    interval_days INTEGER DEFAULT 1 CHECK (interval_days >= 1),
    repetitions INTEGER DEFAULT 0 CHECK (repetitions >= 0),
    next_review_at TIMESTAMPTZ,
    last_reviewed_at TIMESTAMPTZ,
    correct_count INTEGER DEFAULT 0 CHECK (correct_count >= 0),
    incorrect_count INTEGER DEFAULT 0 CHECK (incorrect_count >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, term_id)
);

-- ============================================================================
-- CHALLENGE_TEMPLATES TABLE
-- Daily challenge templates
-- ============================================================================
CREATE TABLE IF NOT EXISTS challenge_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(10) DEFAULT '🎯',
    type VARCHAR(50) NOT NULL CHECK (type IN ('detective', 'prediction', 'speed', 'analysis', 'pattern', 'quiz')),
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard', 'extreme')),
    xp_reward INTEGER NOT NULL DEFAULT 10 CHECK (xp_reward > 0),
    time_limit_minutes INTEGER CHECK (time_limit_minutes > 0),
    category VARCHAR(50),
    content JSONB NOT NULL DEFAULT '{}',
    correct_answer JSONB,
    hints TEXT[],
    prerequisites JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    is_daily BOOLEAN DEFAULT FALSE,
    is_weekly BOOLEAN DEFAULT FALSE,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- USER_CHALLENGES TABLE
-- User challenge attempts and progress
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    challenge_id UUID NOT NULL REFERENCES challenge_templates(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'in_progress', 'completed', 'failed', 'expired')),
    progress_pct INTEGER DEFAULT 0 CHECK (progress_pct >= 0 AND progress_pct <= 100),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    time_spent_seconds INTEGER DEFAULT 0 CHECK (time_spent_seconds >= 0),
    answer JSONB,
    is_correct BOOLEAN,
    xp_earned INTEGER DEFAULT 0 CHECK (xp_earned >= 0),
    streak_bonus_applied BOOLEAN DEFAULT FALSE,
    challenge_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, challenge_id, challenge_date)
);

-- ============================================================================
-- ACHIEVEMENTS TABLE
-- Achievement definitions
-- ============================================================================
CREATE TABLE IF NOT EXISTS achievements (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(10) DEFAULT '🏆',
    rarity VARCHAR(20) NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
    xp_reward INTEGER DEFAULT 0 CHECK (xp_reward >= 0),
    category VARCHAR(50),
    criteria JSONB NOT NULL,
    story_title VARCHAR(200),
    story_narrative TEXT,
    story_meaning TEXT,
    reward_description TEXT,
    is_secret BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- USER_ACHIEVEMENTS TABLE
-- User unlocked achievements
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id VARCHAR(50) NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    stats JSONB,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_skill_nodes_category ON skill_nodes(category);
CREATE INDEX IF NOT EXISTS idx_skill_nodes_layer ON skill_nodes(layer);
CREATE INDEX IF NOT EXISTS idx_skill_nodes_is_active ON skill_nodes(is_active);

CREATE INDEX IF NOT EXISTS idx_user_skill_progress_user_id ON user_skill_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skill_progress_skill_id ON user_skill_progress(skill_id);
CREATE INDEX IF NOT EXISTS idx_user_skill_progress_status ON user_skill_progress(status);

CREATE INDEX IF NOT EXISTS idx_vocabulary_terms_category ON vocabulary_terms(category);
CREATE INDEX IF NOT EXISTS idx_vocabulary_terms_difficulty ON vocabulary_terms(difficulty);

CREATE INDEX IF NOT EXISTS idx_user_vocab_progress_user_id ON user_vocabulary_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_vocab_progress_next_review ON user_vocabulary_progress(next_review_at);
CREATE INDEX IF NOT EXISTS idx_user_vocab_progress_status ON user_vocabulary_progress(status);

CREATE INDEX IF NOT EXISTS idx_challenge_templates_type ON challenge_templates(type);
CREATE INDEX IF NOT EXISTS idx_challenge_templates_difficulty ON challenge_templates(difficulty);
CREATE INDEX IF NOT EXISTS idx_challenge_templates_is_active ON challenge_templates(is_active);

CREATE INDEX IF NOT EXISTS idx_user_challenges_user_id ON user_challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_challenges_date ON user_challenges(challenge_date);
CREATE INDEX IF NOT EXISTS idx_user_challenges_status ON user_challenges(status);

CREATE INDEX IF NOT EXISTS idx_achievements_rarity ON achievements(rarity);
CREATE INDEX IF NOT EXISTS idx_achievements_category ON achievements(category);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_unlocked_at ON user_achievements(unlocked_at);

-- ============================================================================
-- TRIGGERS
-- ============================================================================
CREATE TRIGGER tr_skill_nodes_updated_at
    BEFORE UPDATE ON skill_nodes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_user_skill_progress_updated_at
    BEFORE UPDATE ON user_skill_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_vocabulary_terms_updated_at
    BEFORE UPDATE ON vocabulary_terms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_user_vocab_progress_updated_at
    BEFORE UPDATE ON user_vocabulary_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_challenge_templates_updated_at
    BEFORE UPDATE ON challenge_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_user_challenges_updated_at
    BEFORE UPDATE ON user_challenges
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_achievements_updated_at
    BEFORE UPDATE ON achievements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
ALTER TABLE skill_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skill_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_vocabulary_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Public read access for master tables
CREATE POLICY skill_nodes_select_all ON skill_nodes
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY vocabulary_terms_select_all ON vocabulary_terms
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY challenge_templates_select_active ON challenge_templates
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY achievements_select_visible ON achievements
    FOR SELECT USING (is_active = TRUE AND (is_secret = FALSE OR EXISTS (
        SELECT 1 FROM user_achievements ua
        WHERE ua.achievement_id = achievements.id
        AND ua.user_id = current_setting('app.current_user_id', true)::uuid
    )));

-- User-specific progress tables
CREATE POLICY user_skill_progress_own ON user_skill_progress
    FOR ALL USING (user_id = current_setting('app.current_user_id', true)::uuid);

CREATE POLICY user_vocab_progress_own ON user_vocabulary_progress
    FOR ALL USING (user_id = current_setting('app.current_user_id', true)::uuid);

CREATE POLICY user_challenges_own ON user_challenges
    FOR ALL USING (user_id = current_setting('app.current_user_id', true)::uuid);

CREATE POLICY user_achievements_own ON user_achievements
    FOR ALL USING (user_id = current_setting('app.current_user_id', true)::uuid);

-- Admin full access
CREATE POLICY admin_skill_nodes_full ON skill_nodes
    FOR ALL USING (current_setting('app.current_user_role', true) = 'admin');

CREATE POLICY admin_vocabulary_terms_full ON vocabulary_terms
    FOR ALL USING (current_setting('app.current_user_role', true) = 'admin');

CREATE POLICY admin_challenge_templates_full ON challenge_templates
    FOR ALL USING (current_setting('app.current_user_role', true) = 'admin');

CREATE POLICY admin_achievements_full ON achievements
    FOR ALL USING (current_setting('app.current_user_role', true) = 'admin');

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON TABLE skill_nodes IS 'Master skill tree nodes for Knowledge Tree';
COMMENT ON TABLE user_skill_progress IS 'User progress through skill tree';
COMMENT ON TABLE vocabulary_terms IS 'Financial vocabulary database';
COMMENT ON TABLE user_vocabulary_progress IS 'Spaced repetition progress per user';
COMMENT ON TABLE challenge_templates IS 'Daily/weekly challenge definitions';
COMMENT ON TABLE user_challenges IS 'User challenge attempts and scores';
COMMENT ON TABLE achievements IS 'Achievement definitions with narrative stories';
COMMENT ON TABLE user_achievements IS 'User unlocked achievements';

COMMENT ON COLUMN user_vocabulary_progress.ease_factor IS 'SM-2 algorithm ease factor (1.3-3.0)';
COMMENT ON COLUMN user_vocabulary_progress.interval_days IS 'Days until next review';
COMMENT ON COLUMN challenge_templates.content IS 'JSON content specific to challenge type';
COMMENT ON COLUMN achievements.criteria IS 'JSON conditions required to unlock';
