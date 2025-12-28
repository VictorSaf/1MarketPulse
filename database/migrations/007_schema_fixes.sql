-- ============================================================================
-- Migration 007: Schema Fixes from Code Review
-- Based on: docs/features/0011_DATABASE_SCHEMA_REVIEW.md
-- Date: 2025-12-28
-- ============================================================================

-- ============================================================================
-- MAJOR FIX #1: RLS Policy Conflict on feature_flags
-- Problem: FOR ALL policy overlaps with SELECT policy
-- Solution: Split into separate INSERT/UPDATE/DELETE policies
-- ============================================================================

-- Drop the conflicting policy
DROP POLICY IF EXISTS feature_flags_admin_write ON feature_flags;

-- Create separate policies for each write operation
CREATE POLICY feature_flags_admin_insert ON feature_flags
    FOR INSERT
    WITH CHECK (current_setting('app.current_user_role', true) = 'admin');

CREATE POLICY feature_flags_admin_update ON feature_flags
    FOR UPDATE
    USING (current_setting('app.current_user_role', true) = 'admin')
    WITH CHECK (current_setting('app.current_user_role', true) = 'admin');

CREATE POLICY feature_flags_admin_delete ON feature_flags
    FOR DELETE
    USING (current_setting('app.current_user_role', true) = 'admin');

-- ============================================================================
-- MAJOR FIX #2: Missing Composite Indexes on predictions table
-- Problem: Missing indexes for common query patterns (leaderboards, analytics)
-- ============================================================================

-- For user leaderboard queries: "my correct predictions"
CREATE INDEX IF NOT EXISTS idx_predictions_user_outcome
ON predictions(user_id, outcome);

-- For tribe leaderboard queries: "tribe accuracy"
CREATE INDEX IF NOT EXISTS idx_predictions_tribe_outcome
ON predictions(tribe_id, outcome)
WHERE tribe_id IS NOT NULL;

-- For time-based analysis: "predictions this month"
CREATE INDEX IF NOT EXISTS idx_predictions_created_outcome
ON predictions(created_at DESC, outcome);

-- For combined user+time queries: "my predictions this week"
CREATE INDEX IF NOT EXISTS idx_predictions_user_created
ON predictions(user_id, created_at DESC);

-- ============================================================================
-- MAJOR FIX #3: Portfolio Balance Limits
-- Problem: No validation on balance calculations could cause overflow
-- Solution: Add CHECK constraints for reasonable limits
-- ============================================================================

-- Add balance constraints (allow negative for margin, but reasonable limits)
ALTER TABLE paper_portfolios
ADD CONSTRAINT check_current_balance_reasonable
CHECK (current_balance >= -1000000000 AND current_balance <= 1000000000000);

ALTER TABLE paper_portfolios
ADD CONSTRAINT check_buying_power_reasonable
CHECK (buying_power >= 0 AND buying_power <= 1000000000000);

ALTER TABLE paper_portfolios
ADD CONSTRAINT check_total_value_reasonable
CHECK (total_value >= 0 AND total_value <= 1000000000000);

-- ============================================================================
-- MAJOR FIX #4: Supabase auth.users Sync Trigger
-- Problem: No automatic user record creation when signing up via Supabase Auth
-- Solution: Add trigger on auth.users to create public.users record
-- ============================================================================

-- Function to handle new user creation from Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert into public.users table
    INSERT INTO public.users (
        id,
        email,
        role,
        display_name,
        avatar_emoji,
        is_active,
        is_verified,
        created_at
    )
    VALUES (
        NEW.id,
        NEW.email,
        'user',  -- Default role
        COALESCE(NEW.raw_user_meta_data->>'display_name', SPLIT_PART(NEW.email, '@', 1)),
        '🎯',    -- Default emoji
        TRUE,
        COALESCE((NEW.email_confirmed_at IS NOT NULL), FALSE),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        is_verified = EXCLUDED.is_verified,
        updated_at = NOW();

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail the auth transaction
        RAISE WARNING 'Failed to create user record for %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users (Supabase specific)
-- Note: This trigger must be created in Supabase SQL Editor as it references auth schema
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- Handle email verification updates
CREATE OR REPLACE FUNCTION public.handle_auth_user_updated()
RETURNS TRIGGER AS $$
BEGIN
    -- Update verification status when email is confirmed
    IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
        UPDATE public.users
        SET is_verified = TRUE, updated_at = NOW()
        WHERE id = NEW.id;
    END IF;

    -- Update email if changed
    IF NEW.email <> OLD.email THEN
        UPDATE public.users
        SET email = NEW.email, updated_at = NOW()
        WHERE id = NEW.id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
    AFTER UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_auth_user_updated();

-- ============================================================================
-- MINOR FIX #8: Partial Index for Audit Logs Errors
-- Problem: Error queries scan entire table
-- Solution: Create partial index for failed operations only
-- ============================================================================

-- Index only failed operations (much smaller, faster error queries)
CREATE INDEX IF NOT EXISTS idx_audit_logs_errors
ON audit_logs(created_at DESC, action, user_id)
WHERE success = FALSE;

-- Index for recent error analysis (common admin query)
CREATE INDEX IF NOT EXISTS idx_audit_logs_errors_by_action
ON audit_logs(action, created_at DESC)
WHERE success = FALSE;

-- ============================================================================
-- MINOR FIX #10: Leaderboard Unique Constraint with Partial Indexes
-- Problem: COALESCE with magic UUID is fragile
-- Solution: Use partial unique indexes instead
-- ============================================================================

-- Drop the existing constraint that uses COALESCE
ALTER TABLE leaderboard_snapshots
DROP CONSTRAINT IF EXISTS leaderboard_snapshots_snapshot_date_leaderboard_type_coalesc_key;

-- Create partial unique index for global leaderboards (no tribe)
CREATE UNIQUE INDEX IF NOT EXISTS idx_leaderboard_global_unique
ON leaderboard_snapshots(snapshot_date, leaderboard_type, user_id)
WHERE tribe_id IS NULL;

-- Create partial unique index for tribe leaderboards
CREATE UNIQUE INDEX IF NOT EXISTS idx_leaderboard_tribe_unique
ON leaderboard_snapshots(snapshot_date, leaderboard_type, tribe_id, user_id)
WHERE tribe_id IS NOT NULL;

-- ============================================================================
-- ADDITIONAL FIX: Missing Admin RLS Policies on User Progress Tables
-- Problem: Some tables rely on implicit admin access
-- Solution: Add explicit admin policies for clarity
-- ============================================================================

-- user_skill_progress admin access
CREATE POLICY admin_user_skill_progress_full_access ON user_skill_progress
    FOR ALL
    USING (current_setting('app.current_user_role', true) = 'admin')
    WITH CHECK (current_setting('app.current_user_role', true) = 'admin');

-- user_vocabulary_progress admin access
CREATE POLICY admin_user_vocabulary_progress_full_access ON user_vocabulary_progress
    FOR ALL
    USING (current_setting('app.current_user_role', true) = 'admin')
    WITH CHECK (current_setting('app.current_user_role', true) = 'admin');

-- user_challenges admin access
CREATE POLICY admin_user_challenges_full_access ON user_challenges
    FOR ALL
    USING (current_setting('app.current_user_role', true) = 'admin')
    WITH CHECK (current_setting('app.current_user_role', true) = 'admin');

-- user_achievements admin access
CREATE POLICY admin_user_achievements_full_access ON user_achievements
    FOR ALL
    USING (current_setting('app.current_user_role', true) = 'admin')
    WITH CHECK (current_setting('app.current_user_role', true) = 'admin');

-- tribes admin access
CREATE POLICY admin_tribes_full_access ON tribes
    FOR ALL
    USING (current_setting('app.current_user_role', true) = 'admin')
    WITH CHECK (current_setting('app.current_user_role', true) = 'admin');

-- predictions admin access
CREATE POLICY admin_predictions_full_access ON predictions
    FOR ALL
    USING (current_setting('app.current_user_role', true) = 'admin')
    WITH CHECK (current_setting('app.current_user_role', true) = 'admin');

-- ============================================================================
-- ADDITIONAL FIX: Missing Mentorship Index
-- Problem: No index for "find available mentors" query
-- ============================================================================

-- Index for finding active, available mentors
CREATE INDEX IF NOT EXISTS idx_mentorships_available_mentors
ON mentorships(mentor_id, status)
WHERE status = 'active';

-- Index for mentor profiles accepting mentees
CREATE INDEX IF NOT EXISTS idx_mentor_profiles_accepting
ON mentor_profiles(specialty, is_accepting_mentees)
WHERE is_accepting_mentees = TRUE;

-- ============================================================================
-- ADDITIONAL FIX: tribe_members leaderboard index
-- Problem: Missing index for tribe member accuracy leaderboard
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_tribe_members_leaderboard
ON tribe_members(tribe_id, prediction_accuracy DESC, xp_contributed DESC);

-- ============================================================================
-- ADDITIONAL FIX: user_activity date-only index for platform metrics
-- Problem: Missing index for date-only queries
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_user_activity_date
ON user_activity(activity_date DESC);

-- ============================================================================
-- DOCUMENTATION: Add comments for reserved UUIDs in development
-- ============================================================================

COMMENT ON TABLE users IS
'User accounts. Development seed data uses UUIDs starting with 00000000-0000-0000-0000-00000000000X - these are reserved for testing only.';

COMMENT ON TABLE tribes IS
'Trading community groups. Development seed data uses UUIDs starting with 11111111-1111-1111-1111-11111111111X - these are reserved for testing only.';

COMMENT ON TABLE achievements IS
'Achievement definitions. IDs are human-readable VARCHAR slugs (e.g., "contrarian", "eagle-eye") for easy reference in code.';

COMMENT ON TABLE skill_nodes IS
'Knowledge Tree skill definitions. IDs are human-readable VARCHAR slugs (e.g., "start", "basic-patterns") for easy reference in code.';

COMMENT ON TABLE feature_flags IS
'Global feature toggles. IDs are human-readable VARCHAR slugs (e.g., "ai_analysis", "paper_trading") for configuration management.';

-- ============================================================================
-- VERIFICATION QUERIES (Run after migration to verify fixes)
-- ============================================================================

-- Verify RLS policies on feature_flags
-- SELECT schemaname, tablename, policyname, cmd FROM pg_policies WHERE tablename = 'feature_flags';

-- Verify new indexes exist
-- SELECT indexname, indexdef FROM pg_indexes WHERE tablename IN ('predictions', 'audit_logs', 'leaderboard_snapshots', 'mentorships', 'mentor_profiles', 'tribe_members');

-- Verify constraints on paper_portfolios
-- SELECT conname, contype FROM pg_constraint WHERE conrelid = 'paper_portfolios'::regclass;

-- Verify auth trigger exists (Supabase only)
-- SELECT tgname FROM pg_trigger WHERE tgrelid = 'auth.users'::regclass;

-- ============================================================================
-- END OF MIGRATION 007
-- ============================================================================
