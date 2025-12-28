-- ============================================================================
-- Migration 003: Social Feature Tables
-- Creates: tribes, tribe_members, tribe_stats, predictions, prediction_votes,
--          prediction_comments, mentorships, mentor_profiles, mentor_messages
-- ============================================================================

-- ============================================================================
-- TRIBES TABLE
-- Trading community tribes
-- ============================================================================
CREATE TABLE IF NOT EXISTS tribes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(10) DEFAULT '👥',
    cover_image_url TEXT,
    focus VARCHAR(100),
    is_public BOOLEAN DEFAULT TRUE,
    is_official BOOLEAN DEFAULT FALSE,
    max_members INTEGER DEFAULT 10000 CHECK (max_members > 0),
    rules TEXT[],
    tags TEXT[],
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TRIBE_MEMBERS TABLE
-- Tribe membership
-- ============================================================================
CREATE TABLE IF NOT EXISTS tribe_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tribe_id UUID NOT NULL REFERENCES tribes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('member', 'elder', 'moderator', 'leader')),
    rank_position INTEGER,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    prediction_accuracy DECIMAL(5,2) DEFAULT 0 CHECK (prediction_accuracy >= 0 AND prediction_accuracy <= 100),
    predictions_count INTEGER DEFAULT 0 CHECK (predictions_count >= 0),
    streak INTEGER DEFAULT 0 CHECK (streak >= 0),
    xp_contributed INTEGER DEFAULT 0 CHECK (xp_contributed >= 0),
    is_active BOOLEAN DEFAULT TRUE,
    muted_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tribe_id, user_id)
);

-- ============================================================================
-- TRIBE_STATS TABLE
-- Aggregated tribe statistics (updated by triggers)
-- ============================================================================
CREATE TABLE IF NOT EXISTS tribe_stats (
    tribe_id UUID PRIMARY KEY REFERENCES tribes(id) ON DELETE CASCADE,
    member_count INTEGER DEFAULT 0,
    active_member_count INTEGER DEFAULT 0,
    avg_accuracy DECIMAL(5,2) DEFAULT 0,
    total_predictions INTEGER DEFAULT 0,
    correct_predictions INTEGER DEFAULT 0,
    activity_level VARCHAR(20) DEFAULT 'low' CHECK (activity_level IN ('low', 'medium', 'high')),
    top_performer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    last_calculated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PREDICTIONS TABLE
-- Community predictions
-- ============================================================================
CREATE TABLE IF NOT EXISTS predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tribe_id UUID REFERENCES tribes(id) ON DELETE SET NULL,
    symbol VARCHAR(20) NOT NULL,
    asset_type VARCHAR(20) NOT NULL CHECK (asset_type IN ('stock', 'crypto', 'index', 'forex', 'commodity')),
    direction VARCHAR(10) NOT NULL CHECK (direction IN ('bullish', 'bearish', 'neutral')),
    prediction_text TEXT NOT NULL,
    target_price DECIMAL(20,8),
    target_date DATE,
    confidence INTEGER CHECK (confidence >= 1 AND confidence <= 10),
    reasoning TEXT,
    tags TEXT[],
    is_public BOOLEAN DEFAULT TRUE,
    outcome VARCHAR(20) DEFAULT 'pending' CHECK (outcome IN ('pending', 'correct', 'incorrect', 'expired', 'cancelled')),
    outcome_determined_at TIMESTAMPTZ,
    actual_price DECIMAL(20,8),
    price_at_prediction DECIMAL(20,8),
    agree_count INTEGER DEFAULT 0 CHECK (agree_count >= 0),
    disagree_count INTEGER DEFAULT 0 CHECK (disagree_count >= 0),
    comment_count INTEGER DEFAULT 0 CHECK (comment_count >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PREDICTION_VOTES TABLE
-- Votes on predictions
-- ============================================================================
CREATE TABLE IF NOT EXISTS prediction_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prediction_id UUID NOT NULL REFERENCES predictions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vote VARCHAR(10) NOT NULL CHECK (vote IN ('agree', 'disagree')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(prediction_id, user_id)
);

-- ============================================================================
-- PREDICTION_COMMENTS TABLE
-- Comments on predictions
-- ============================================================================
CREATE TABLE IF NOT EXISTS prediction_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prediction_id UUID NOT NULL REFERENCES predictions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES prediction_comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_edited BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMPTZ,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- MENTORSHIPS TABLE
-- Mentor-mentee relationships
-- ============================================================================
CREATE TABLE IF NOT EXISTS mentorships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mentee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'paused', 'completed', 'rejected')),
    specialty VARCHAR(100),
    goals TEXT,
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(mentor_id, mentee_id),
    CHECK (mentor_id != mentee_id)
);

-- ============================================================================
-- MENTOR_PROFILES TABLE
-- Mentor-specific profile data
-- ============================================================================
CREATE TABLE IF NOT EXISTS mentor_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    is_accepting_mentees BOOLEAN DEFAULT TRUE,
    max_mentees INTEGER DEFAULT 5 CHECK (max_mentees > 0),
    current_mentees INTEGER DEFAULT 0 CHECK (current_mentees >= 0),
    specialty VARCHAR(100),
    monthly_return_avg DECIMAL(5,2),
    years_experience INTEGER CHECK (years_experience >= 0),
    teaching_style TEXT,
    availability TEXT,
    requirements TEXT,
    total_mentees INTEGER DEFAULT 0,
    avg_rating DECIMAL(2,1) DEFAULT 0 CHECK (avg_rating >= 0 AND avg_rating <= 5),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- MENTOR_MESSAGES TABLE
-- Private messages in mentorship
-- ============================================================================
CREATE TABLE IF NOT EXISTS mentor_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentorship_id UUID NOT NULL REFERENCES mentorships(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_tribes_slug ON tribes(slug);
CREATE INDEX IF NOT EXISTS idx_tribes_is_public ON tribes(is_public);
CREATE INDEX IF NOT EXISTS idx_tribes_focus ON tribes(focus);

CREATE INDEX IF NOT EXISTS idx_tribe_members_tribe_id ON tribe_members(tribe_id);
CREATE INDEX IF NOT EXISTS idx_tribe_members_user_id ON tribe_members(user_id);
CREATE INDEX IF NOT EXISTS idx_tribe_members_role ON tribe_members(role);
CREATE INDEX IF NOT EXISTS idx_tribe_members_rank ON tribe_members(rank_position);

CREATE INDEX IF NOT EXISTS idx_predictions_user_id ON predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_predictions_tribe_id ON predictions(tribe_id);
CREATE INDEX IF NOT EXISTS idx_predictions_symbol ON predictions(symbol);
CREATE INDEX IF NOT EXISTS idx_predictions_asset_type ON predictions(asset_type);
CREATE INDEX IF NOT EXISTS idx_predictions_direction ON predictions(direction);
CREATE INDEX IF NOT EXISTS idx_predictions_outcome ON predictions(outcome);
CREATE INDEX IF NOT EXISTS idx_predictions_created_at ON predictions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_predictions_is_public ON predictions(is_public);

CREATE INDEX IF NOT EXISTS idx_prediction_votes_prediction_id ON prediction_votes(prediction_id);
CREATE INDEX IF NOT EXISTS idx_prediction_votes_user_id ON prediction_votes(user_id);

CREATE INDEX IF NOT EXISTS idx_prediction_comments_prediction_id ON prediction_comments(prediction_id);
CREATE INDEX IF NOT EXISTS idx_prediction_comments_user_id ON prediction_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_prediction_comments_parent_id ON prediction_comments(parent_id);

CREATE INDEX IF NOT EXISTS idx_mentorships_mentor_id ON mentorships(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentorships_mentee_id ON mentorships(mentee_id);
CREATE INDEX IF NOT EXISTS idx_mentorships_status ON mentorships(status);

CREATE INDEX IF NOT EXISTS idx_mentor_messages_mentorship_id ON mentor_messages(mentorship_id);
CREATE INDEX IF NOT EXISTS idx_mentor_messages_is_read ON mentor_messages(is_read);

-- ============================================================================
-- TRIGGERS
-- ============================================================================
CREATE TRIGGER tr_tribes_updated_at
    BEFORE UPDATE ON tribes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_tribe_members_updated_at
    BEFORE UPDATE ON tribe_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_predictions_updated_at
    BEFORE UPDATE ON predictions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_prediction_comments_updated_at
    BEFORE UPDATE ON prediction_comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_mentorships_updated_at
    BEFORE UPDATE ON mentorships
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_mentor_profiles_updated_at
    BEFORE UPDATE ON mentor_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create tribe stats
CREATE OR REPLACE FUNCTION create_tribe_stats()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO tribe_stats (tribe_id)
    VALUES (NEW.id)
    ON CONFLICT (tribe_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_create_tribe_stats
    AFTER INSERT ON tribes
    FOR EACH ROW EXECUTE FUNCTION create_tribe_stats();

-- Update prediction vote counts
CREATE OR REPLACE FUNCTION update_prediction_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE predictions
        SET
            agree_count = CASE WHEN NEW.vote = 'agree' THEN agree_count + 1 ELSE agree_count END,
            disagree_count = CASE WHEN NEW.vote = 'disagree' THEN disagree_count + 1 ELSE disagree_count END
        WHERE id = NEW.prediction_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE predictions
        SET
            agree_count = CASE WHEN OLD.vote = 'agree' THEN agree_count - 1 ELSE agree_count END,
            disagree_count = CASE WHEN OLD.vote = 'disagree' THEN disagree_count - 1 ELSE disagree_count END
        WHERE id = OLD.prediction_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_update_prediction_votes
    AFTER INSERT OR DELETE ON prediction_votes
    FOR EACH ROW EXECUTE FUNCTION update_prediction_vote_counts();

-- Update prediction comment counts
CREATE OR REPLACE FUNCTION update_prediction_comment_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE predictions SET comment_count = comment_count + 1
        WHERE id = NEW.prediction_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE predictions SET comment_count = comment_count - 1
        WHERE id = OLD.prediction_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_update_prediction_comments
    AFTER INSERT OR DELETE ON prediction_comments
    FOR EACH ROW EXECUTE FUNCTION update_prediction_comment_counts();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
ALTER TABLE tribes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tribe_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tribe_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE prediction_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE prediction_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentorships ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_messages ENABLE ROW LEVEL SECURITY;

-- Tribes: public can view public tribes
CREATE POLICY tribes_select_public ON tribes
    FOR SELECT USING (is_public = TRUE);

CREATE POLICY tribes_select_member ON tribes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM tribe_members tm
            WHERE tm.tribe_id = tribes.id
            AND tm.user_id = current_setting('app.current_user_id', true)::uuid
        )
    );

CREATE POLICY tribes_insert_authenticated ON tribes
    FOR INSERT WITH CHECK (
        current_setting('app.current_user_id', true) IS NOT NULL
    );

CREATE POLICY tribes_update_leader ON tribes
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM tribe_members tm
            WHERE tm.tribe_id = tribes.id
            AND tm.user_id = current_setting('app.current_user_id', true)::uuid
            AND tm.role IN ('leader', 'moderator')
        )
    );

-- Tribe members
CREATE POLICY tribe_members_select_same_tribe ON tribe_members
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM tribe_members tm
            WHERE tm.tribe_id = tribe_members.tribe_id
            AND tm.user_id = current_setting('app.current_user_id', true)::uuid
        )
    );

CREATE POLICY tribe_members_insert_own ON tribe_members
    FOR INSERT WITH CHECK (user_id = current_setting('app.current_user_id', true)::uuid);

CREATE POLICY tribe_members_delete_own ON tribe_members
    FOR DELETE USING (user_id = current_setting('app.current_user_id', true)::uuid);

-- Tribe stats: readable by members
CREATE POLICY tribe_stats_select ON tribe_stats
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM tribe_members tm
            WHERE tm.tribe_id = tribe_stats.tribe_id
            AND tm.user_id = current_setting('app.current_user_id', true)::uuid
        ) OR EXISTS (
            SELECT 1 FROM tribes t
            WHERE t.id = tribe_stats.tribe_id AND t.is_public = TRUE
        )
    );

-- Predictions: public ones visible to all
CREATE POLICY predictions_select_public ON predictions
    FOR SELECT USING (is_public = TRUE);

CREATE POLICY predictions_select_own ON predictions
    FOR SELECT USING (user_id = current_setting('app.current_user_id', true)::uuid);

CREATE POLICY predictions_insert_own ON predictions
    FOR INSERT WITH CHECK (user_id = current_setting('app.current_user_id', true)::uuid);

CREATE POLICY predictions_update_own ON predictions
    FOR UPDATE USING (user_id = current_setting('app.current_user_id', true)::uuid);

CREATE POLICY predictions_delete_own ON predictions
    FOR DELETE USING (user_id = current_setting('app.current_user_id', true)::uuid);

-- Prediction votes
CREATE POLICY prediction_votes_select_all ON prediction_votes
    FOR SELECT USING (TRUE);

CREATE POLICY prediction_votes_insert_own ON prediction_votes
    FOR INSERT WITH CHECK (user_id = current_setting('app.current_user_id', true)::uuid);

CREATE POLICY prediction_votes_delete_own ON prediction_votes
    FOR DELETE USING (user_id = current_setting('app.current_user_id', true)::uuid);

-- Prediction comments
CREATE POLICY prediction_comments_select_all ON prediction_comments
    FOR SELECT USING (is_deleted = FALSE);

CREATE POLICY prediction_comments_insert_own ON prediction_comments
    FOR INSERT WITH CHECK (user_id = current_setting('app.current_user_id', true)::uuid);

CREATE POLICY prediction_comments_update_own ON prediction_comments
    FOR UPDATE USING (user_id = current_setting('app.current_user_id', true)::uuid);

-- Mentorships: visible to participants
CREATE POLICY mentorships_select_participant ON mentorships
    FOR SELECT USING (
        mentor_id = current_setting('app.current_user_id', true)::uuid OR
        mentee_id = current_setting('app.current_user_id', true)::uuid
    );

CREATE POLICY mentorships_insert_mentee ON mentorships
    FOR INSERT WITH CHECK (mentee_id = current_setting('app.current_user_id', true)::uuid);

CREATE POLICY mentorships_update_participant ON mentorships
    FOR UPDATE USING (
        mentor_id = current_setting('app.current_user_id', true)::uuid OR
        mentee_id = current_setting('app.current_user_id', true)::uuid
    );

-- Mentor profiles: public read
CREATE POLICY mentor_profiles_select_all ON mentor_profiles
    FOR SELECT USING (TRUE);

CREATE POLICY mentor_profiles_update_own ON mentor_profiles
    FOR UPDATE USING (user_id = current_setting('app.current_user_id', true)::uuid);

-- Mentor messages: visible to participants
CREATE POLICY mentor_messages_select_participant ON mentor_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM mentorships m
            WHERE m.id = mentor_messages.mentorship_id
            AND (m.mentor_id = current_setting('app.current_user_id', true)::uuid
                 OR m.mentee_id = current_setting('app.current_user_id', true)::uuid)
        )
    );

CREATE POLICY mentor_messages_insert_participant ON mentor_messages
    FOR INSERT WITH CHECK (
        sender_id = current_setting('app.current_user_id', true)::uuid AND
        EXISTS (
            SELECT 1 FROM mentorships m
            WHERE m.id = mentor_messages.mentorship_id
            AND m.status = 'active'
            AND (m.mentor_id = current_setting('app.current_user_id', true)::uuid
                 OR m.mentee_id = current_setting('app.current_user_id', true)::uuid)
        )
    );

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON TABLE tribes IS 'Trading community tribes/groups';
COMMENT ON TABLE tribe_members IS 'Tribe membership with roles and stats';
COMMENT ON TABLE tribe_stats IS 'Aggregated tribe statistics';
COMMENT ON TABLE predictions IS 'User market predictions';
COMMENT ON TABLE prediction_votes IS 'Agree/disagree votes on predictions';
COMMENT ON TABLE prediction_comments IS 'Comments on predictions';
COMMENT ON TABLE mentorships IS 'Mentor-mentee relationships';
COMMENT ON TABLE mentor_profiles IS 'Mentor-specific profile information';
COMMENT ON TABLE mentor_messages IS 'Private mentorship messages';

COMMENT ON COLUMN predictions.confidence IS 'Confidence level 1-10';
COMMENT ON COLUMN predictions.outcome IS 'Prediction outcome after target date';
COMMENT ON COLUMN mentorships.status IS 'Mentorship status: pending, active, paused, completed, rejected';
