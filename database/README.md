# 1MarketPulse Database

This directory contains the complete PostgreSQL database schema for the 1MarketPulse platform.

## Directory Structure

```
database/
├── migrations/           # SQL migration files (run in order)
│   ├── 001_create_core_tables.sql
│   ├── 002_create_learning_tables.sql
│   ├── 003_create_social_tables.sql
│   ├── 004_create_trading_tables.sql
│   ├── 005_create_settings_tables.sql
│   ├── 006_create_audit_tables.sql
│   └── 007_schema_fixes.sql      # Code review fixes
├── seeds/               # Seed data for development
│   └── 001_seed_data.sql
└── README.md            # This file
```

## Prerequisites

- PostgreSQL 15+ (or Supabase)
- pgcrypto extension (for encryption)
- uuid-ossp extension (for UUIDs)

## Quick Start

### Option 1: Supabase (Recommended)

1. Create a new Supabase project at https://supabase.com
2. Go to SQL Editor
3. Run each migration file in order (001 through 006)
4. Run the seed file for development data

### Option 2: Local PostgreSQL

```bash
# Create database
createdb marketpulse

# Set connection string
export DATABASE_URL="postgresql://localhost/marketpulse"

# Run migrations
for file in database/migrations/*.sql; do
    psql $DATABASE_URL -f "$file"
done

# Run seeds (development only)
psql $DATABASE_URL -f database/seeds/001_seed_data.sql
```

### Option 3: Docker

```bash
# Start PostgreSQL
docker run -d \
  --name marketpulse-db \
  -e POSTGRES_DB=marketpulse \
  -e POSTGRES_PASSWORD=yourpassword \
  -p 5432:5432 \
  postgres:15

# Run migrations
docker exec -i marketpulse-db psql -U postgres -d marketpulse < database/migrations/001_create_core_tables.sql
# ... repeat for other files
```

## Migration Files

### 001_create_core_tables.sql
- **users** - Primary user accounts
- **user_profiles** - Extended profile with XP, streaks, level
- **sessions** - Session tracking

### 002_create_learning_tables.sql
- **skill_nodes** - Knowledge Tree skill definitions
- **user_skill_progress** - User progress through skills
- **vocabulary_terms** - Financial vocabulary database
- **user_vocabulary_progress** - Spaced repetition progress
- **challenge_templates** - Daily challenge definitions
- **user_challenges** - User challenge attempts
- **achievements** - Achievement definitions with stories
- **user_achievements** - Unlocked achievements

### 003_create_social_tables.sql
- **tribes** - Trading community groups
- **tribe_members** - Tribe membership
- **tribe_stats** - Aggregated tribe statistics
- **predictions** - Community predictions
- **prediction_votes** - Agree/disagree votes
- **prediction_comments** - Comments on predictions
- **mentorships** - Mentor-mentee relationships
- **mentor_profiles** - Mentor information
- **mentor_messages** - Private messages

### 004_create_trading_tables.sql
- **paper_portfolios** - Paper trading accounts
- **paper_positions** - Open positions
- **paper_position_history** - Closed positions
- **watchlists** - User watchlists
- **watchlist_items** - Items in watchlists

### 005_create_settings_tables.sql
- **user_settings** - User preferences and settings
- **feature_flags** - Global feature toggles
- **api_keys** - Encrypted API key storage

### 006_create_audit_tables.sql
- **audit_logs** - Comprehensive action logging
- **user_activity** - Daily activity tracking
- **user_stats** - Aggregated user statistics
- **engagement_metrics** - Platform-wide metrics
- **leaderboard_snapshots** - Historical rankings

### 007_schema_fixes.sql (Code Review Fixes)
- **RLS policy fixes** - Split feature_flags admin policy into INSERT/UPDATE/DELETE
- **Composite indexes** - Added for predictions leaderboard queries
- **Balance constraints** - CHECK constraints on paper_portfolios
- **Auth sync trigger** - Auto-create user record when signing up via Supabase Auth
- **Partial indexes** - Optimized audit_logs error queries
- **Leaderboard indexes** - Fixed unique constraint with partial indexes
- **Admin RLS policies** - Explicit admin access on all user progress tables
- **Mentorship indexes** - Optimized "find available mentors" queries

## Row Level Security (RLS)

All tables have RLS enabled for Supabase compatibility. Policies ensure:

- Users can only access their own data
- Public data (predictions, leaderboards) is readable by all
- Admin users have full access
- Tribe data is accessible to tribe members

## Key Features

### Automatic Triggers
- `updated_at` auto-updates on all tables
- User profile, settings, portfolio auto-created on user insert
- Vote/comment counts auto-update
- Portfolio values auto-calculate on position changes

### Helper Functions
- `calculate_level(xp)` - Calculate user level from XP
- `calculate_prediction_accuracy(user_id)` - Get prediction accuracy
- `is_feature_enabled(feature_id, user_id, role)` - Check feature flag
- `encrypt_api_key(key, secret)` / `decrypt_api_key(encrypted, secret)` - API key encryption

## Seed Data

The seed file includes:
- Admin users (admin@admin.ro, vict0r@vict0r.ro)
- Demo user (demo@demo.com)
- Complete skill tree (17 nodes)
- Vocabulary terms (24 terms)
- Challenge templates (8 challenges)
- Achievements (10 achievements)
- Sample tribes (4 tribes)
- Demo user progress data

## Environment Variables

For Supabase:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
```

For direct PostgreSQL:
```env
DATABASE_URL=postgresql://user:password@host:5432/database
```

## Schema Documentation

Full documentation available at:
- `/docs/DATABASE_SCHEMA.md` - Complete schema reference with ERD

## Maintenance

### Backup
```bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

### Restore
```bash
psql $DATABASE_URL < backup_20250101.sql
```

### Check Table Sizes
```sql
SELECT schemaname, tablename,
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## Troubleshooting

### "permission denied for schema public"
```sql
GRANT ALL ON SCHEMA public TO your_user;
```

### "extension does not exist"
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

### RLS blocking queries
Set the user context before queries:
```sql
SET app.current_user_id = 'your-user-uuid';
SET app.current_user_role = 'admin';
```

## Version History

- **1.0.1** (2025-12-28) - Code Review Fixes
  - Fixed RLS policy conflicts on feature_flags
  - Added composite indexes for predictions queries
  - Added Supabase auth.users sync trigger
  - Added partial indexes for audit_logs
  - Fixed leaderboard unique constraints
  - Added admin RLS policies on all tables
  - Added mentorship search indexes

- **1.0.0** (2025-12-28) - Initial schema release
  - Complete user system
  - Learning & gamification
  - Social features
  - Paper trading
  - Settings & audit

## Contact

Maintained by: Victor Saf (@VictorSaf)
Documentation: See `/docs/DATABASE_SCHEMA.md`
