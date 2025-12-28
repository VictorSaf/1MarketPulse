# 1MarketPulse Database Schema

**Version**: 1.0.0
**Last Updated**: 2025-12-28
**Database**: PostgreSQL 15+ (Supabase Compatible)
**Schema Version**: v1.0.0

---

## Table of Contents

1. [Overview](#overview)
2. [Entity Relationship Diagram](#entity-relationship-diagram)
3. [Table Relationships](#table-relationships)
4. [Supabase Setup](#supabase-setup)
5. [Migration Execution](#migration-execution)
6. [Core Tables](#core-tables)
7. [Learning & Gamification Tables](#learning--gamification-tables)
8. [Social Feature Tables](#social-feature-tables)
9. [Trading Feature Tables](#trading-feature-tables)
10. [Settings & Preferences Tables](#settings--preferences-tables)
11. [Audit & Analytics Tables](#audit--analytics-tables)
12. [Row Level Security Policies](#row-level-security-policies)
13. [Functions & Triggers](#functions--triggers)
14. [Common Queries](#common-queries)
15. [Backup & Restore](#backup--restore)
16. [Troubleshooting](#troubleshooting)

---

## Overview

This document describes the complete database schema for the 1MarketPulse platform. The schema is designed to:

1. Replace all mock data with real database-backed data
2. Support Supabase with Row Level Security (RLS)
3. Enable all gamification, social, and trading features
4. Provide comprehensive audit logging and analytics

**Database Requirements**:
- PostgreSQL 15+
- Extensions: `uuid-ossp`, `pgcrypto`
- Supabase-compatible RLS policies

---

## Entity Relationship Diagram

### Mermaid Diagram

```mermaid
erDiagram
    %% Core Tables
    users ||--o| user_profiles : has
    users ||--o| user_settings : has
    users ||--o| user_stats : has
    users ||--o{ sessions : has

    %% Learning Tables
    users ||--o{ user_skill_progress : tracks
    skill_nodes ||--o{ user_skill_progress : tracked_by
    users ||--o{ user_vocabulary_progress : tracks
    vocabulary_terms ||--o{ user_vocabulary_progress : tracked_by
    users ||--o{ user_challenges : attempts
    challenge_templates ||--o{ user_challenges : attempted_by
    users ||--o{ user_achievements : unlocks
    achievements ||--o{ user_achievements : unlocked_by

    %% Social Tables
    users ||--o{ tribes : creates
    tribes ||--o| tribe_stats : has
    tribes ||--o{ tribe_members : contains
    users ||--o{ tribe_members : joins
    users ||--o{ predictions : makes
    tribes ||--o{ predictions : contains
    predictions ||--o{ prediction_votes : receives
    predictions ||--o{ prediction_comments : has
    users ||--o{ prediction_votes : casts
    users ||--o{ prediction_comments : writes
    users ||--o{ mentorships : mentors
    users ||--o{ mentorships : mentees
    users ||--o| mentor_profiles : has
    mentorships ||--o{ mentor_messages : contains

    %% Trading Tables
    users ||--o{ paper_portfolios : owns
    paper_portfolios ||--o{ paper_positions : contains
    paper_portfolios ||--o{ paper_position_history : records
    users ||--o{ watchlists : owns
    watchlists ||--o{ watchlist_items : contains

    %% Audit Tables
    users ||--o{ audit_logs : generates
    users ||--o{ user_activity : tracks
    users ||--o{ leaderboard_snapshots : appears_in

    %% Settings
    users ||--o{ api_keys : stores
```

### ASCII Diagram

```
                                    ┌──────────────────┐
                                    │      users       │
                                    ├──────────────────┤
                                    │ id (PK, UUID)    │
                                    │ email            │
                                    │ role             │
                                    │ display_name     │
                                    │ avatar_url       │
                                    │ is_active        │
                                    │ created_at       │
                                    └────────┬─────────┘
                                             │
    ┌────────────────────────────────────────┼────────────────────────────────────────┐
    │                    │                   │                   │                    │
    ▼                    ▼                   ▼                   ▼                    ▼
┌────────────┐   ┌────────────────┐   ┌───────────┐   ┌─────────────┐   ┌────────────────┐
│user_profiles│   │ user_settings │   │ sessions  │   │ user_stats  │   │ user_activity  │
├────────────┤   ├────────────────┤   ├───────────┤   ├─────────────┤   ├────────────────┤
│ user_id FK │   │ user_id FK/PK │   │ user_id FK│   │ user_id PK  │   │ user_id FK     │
│ level      │   │ theme         │   │ token_hash│   │total_xp     │   │ activity_date  │
│ total_xp   │   │ language      │   │ expires_at│   │global_rank  │   │ xp_earned      │
│ streak     │   │ ai_enabled    │   │ ip_address│   │accuracy     │   │ actions_taken  │
└────────────┘   └────────────────┘   └───────────┘   └─────────────┘   └────────────────┘

    ┌────────────────────────────────────────┼────────────────────────────────────────┐
    │                    │                   │                   │                    │
    ▼                    ▼                   ▼                   ▼                    ▼
┌────────────────┐  ┌────────────────┐  ┌───────────┐  ┌─────────────┐  ┌────────────────┐
│ skill_progress │  │ vocab_progress │  │challenges │  │achievements │  │paper_positions │
├────────────────┤  ├────────────────┤  ├───────────┤  ├─────────────┤  ├────────────────┤
│ user_id FK     │  │ user_id FK     │  │ user_id FK│  │ user_id FK  │  │ portfolio_id FK│
│ skill_id FK    │  │ term_id FK     │  │ chall_id FK│ │ ach_id FK   │  │ symbol         │
│ status         │  │ status         │  │ status    │  │ unlocked_at │  │ quantity       │
│ xp_earned      │  │ ease_factor    │  │ xp_earned │  │             │  │ entry_price    │
└───────┬────────┘  └───────┬────────┘  └─────┬─────┘  └──────┬──────┘  └───────┬────────┘
        │                   │                 │               │                 │
        ▼                   ▼                 ▼               ▼                 ▼
┌────────────────┐  ┌────────────────┐  ┌───────────────┐  ┌─────────────┐  ┌────────────────┐
│  skill_nodes   │  │vocabulary_terms│  │ chall_templates│ │achievements │  │ portfolios     │
├────────────────┤  ├────────────────┤  ├───────────────┤  ├─────────────┤  ├────────────────┤
│ id (PK)        │  │ id (PK)        │  │ id (PK)       │  │ id (PK)     │  │ id (PK)        │
│ name           │  │ term           │  │ title         │  │ title       │  │ user_id FK     │
│ category       │  │ definition     │  │ type          │  │ rarity      │  │ balance        │
│ prerequisites[]│  │ difficulty     │  │ xp_reward     │  │ criteria    │  │ total_value    │
└────────────────┘  └────────────────┘  └───────────────┘  └─────────────┘  └────────────────┘

┌────────────────┐  ┌────────────────┐  ┌───────────────┐  ┌─────────────┐
│    tribes      │  │ tribe_members  │  │  predictions  │  │ mentorships │
├────────────────┤  ├────────────────┤  ├───────────────┤  ├─────────────┤
│ id (PK)        │  │ tribe_id FK    │  │ user_id FK    │  │ mentor_id FK│
│ slug           │  │ user_id FK     │  │ tribe_id FK   │  │ mentee_id FK│
│ name           │  │ role           │  │ symbol        │  │ status      │
│ is_public      │  │ rank_position  │  │ direction     │  │ rating      │
└───────┬────────┘  └────────────────┘  └───────┬───────┘  └──────┬──────┘
        │                                       │                 │
        ▼                                       ▼                 ▼
┌────────────────┐                     ┌───────────────────┐  ┌─────────────────┐
│  tribe_stats   │                     │ prediction_votes  │  │ mentor_messages │
├────────────────┤                     │ prediction_comments│ ├─────────────────┤
│ tribe_id FK/PK │                     └───────────────────┘  │ mentorship_id FK│
│ member_count   │                                            │ sender_id FK    │
│ avg_accuracy   │                                            │ content         │
└────────────────┘                                            └─────────────────┘

┌────────────────┐  ┌────────────────┐  ┌───────────────────┐
│   watchlists   │  │watchlist_items │  │    audit_logs     │
├────────────────┤  ├────────────────┤  ├───────────────────┤
│ id (PK)        │  │ watchlist_id FK│  │ user_id FK        │
│ user_id FK     │  │ symbol         │  │ action            │
│ name           │  │ asset_type     │  │ resource_type     │
│ is_primary     │  │ alert_enabled  │  │ details JSONB     │
└────────────────┘  └────────────────┘  └───────────────────┘
```

---

## Table Relationships

### One-to-One Relationships

| Parent Table | Child Table | Relationship | Notes |
|--------------|-------------|--------------|-------|
| `users` | `user_profiles` | 1:1 | Auto-created on user insert |
| `users` | `user_settings` | 1:1 | Auto-created on user insert |
| `users` | `user_stats` | 1:1 | Auto-created on user insert |
| `users` | `mentor_profiles` | 1:1 | Created when user becomes mentor |
| `tribes` | `tribe_stats` | 1:1 | Auto-created on tribe insert |

### One-to-Many Relationships

| Parent Table | Child Table | Foreign Key | Cascade Delete |
|--------------|-------------|-------------|----------------|
| `users` | `sessions` | `user_id` | Yes |
| `users` | `user_skill_progress` | `user_id` | Yes |
| `users` | `user_vocabulary_progress` | `user_id` | Yes |
| `users` | `user_challenges` | `user_id` | Yes |
| `users` | `user_achievements` | `user_id` | Yes |
| `users` | `predictions` | `user_id` | Yes |
| `users` | `prediction_votes` | `user_id` | Yes |
| `users` | `prediction_comments` | `user_id` | Yes |
| `users` | `paper_portfolios` | `user_id` | Yes |
| `users` | `watchlists` | `user_id` | Yes |
| `users` | `audit_logs` | `user_id` | SET NULL |
| `users` | `user_activity` | `user_id` | Yes |
| `users` | `api_keys` | `user_id` | Yes |
| `tribes` | `tribe_members` | `tribe_id` | Yes |
| `tribes` | `predictions` | `tribe_id` | SET NULL |
| `predictions` | `prediction_votes` | `prediction_id` | Yes |
| `predictions` | `prediction_comments` | `prediction_id` | Yes |
| `paper_portfolios` | `paper_positions` | `portfolio_id` | Yes |
| `paper_portfolios` | `paper_position_history` | `portfolio_id` | Yes |
| `watchlists` | `watchlist_items` | `watchlist_id` | Yes |
| `mentorships` | `mentor_messages` | `mentorship_id` | Yes |
| `skill_nodes` | `user_skill_progress` | `skill_id` | Yes |
| `vocabulary_terms` | `user_vocabulary_progress` | `term_id` | Yes |
| `challenge_templates` | `user_challenges` | `challenge_id` | Yes |
| `achievements` | `user_achievements` | `achievement_id` | Yes |

### Many-to-Many Relationships

| Relationship | Junction Table | Notes |
|--------------|----------------|-------|
| Users <-> Tribes | `tribe_members` | Includes role, rank, accuracy |
| Users <-> Skills | `user_skill_progress` | Includes progress, XP, status |
| Users <-> Vocabulary | `user_vocabulary_progress` | SM-2 spaced repetition |
| Users <-> Challenges | `user_challenges` | Per-day unique attempts |
| Users <-> Achievements | `user_achievements` | Includes unlock timestamp |
| Mentors <-> Mentees | `mentorships` | Includes status, rating |

---

## Supabase Setup

### Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new project with:
   - **Name**: `1marketpulse`
   - **Database Password**: (save this securely)
   - **Region**: Choose closest to your users

### Step 2: Get Connection Details

From Project Settings > Database:

```bash
# Connection String (direct)
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"

# For application use
SUPABASE_URL="https://[project-ref].supabase.co"
SUPABASE_ANON_KEY="eyJ..." # From Project Settings > API
SUPABASE_SERVICE_KEY="eyJ..." # From Project Settings > API (keep secret!)
```

### Step 3: Enable Required Extensions

In Supabase SQL Editor, run:

```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

### Step 4: Configure Authentication (Optional)

For Supabase Auth integration, configure in Dashboard:
1. Go to Authentication > Settings
2. Enable Email provider
3. Configure Site URL and Redirect URLs
4. Set password requirements

### Environment Variables

Create `.env` file:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# Direct Connection (for migrations)
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres

# API Key Encryption Secret
API_KEY_SECRET=your-32-character-secret-key
```

---

## Migration Execution

### Migration Files

| Order | File | Description | Tables Created |
|-------|------|-------------|----------------|
| 1 | `001_create_core_tables.sql` | Core user system | `users`, `user_profiles`, `sessions` |
| 2 | `002_create_learning_tables.sql` | Learning & gamification | `skill_nodes`, `user_skill_progress`, `vocabulary_terms`, `user_vocabulary_progress`, `challenge_templates`, `user_challenges`, `achievements`, `user_achievements` |
| 3 | `003_create_social_tables.sql` | Social features | `tribes`, `tribe_members`, `tribe_stats`, `predictions`, `prediction_votes`, `prediction_comments`, `mentorships`, `mentor_profiles`, `mentor_messages` |
| 4 | `004_create_trading_tables.sql` | Paper trading | `paper_portfolios`, `paper_positions`, `paper_position_history`, `watchlists`, `watchlist_items` |
| 5 | `005_create_settings_tables.sql` | Settings & preferences | `user_settings`, `feature_flags`, `api_keys` |
| 6 | `006_create_audit_tables.sql` | Audit & analytics | `audit_logs`, `user_activity`, `user_stats`, `engagement_metrics`, `leaderboard_snapshots` |
| 7 | `seeds/001_seed_data.sql` | Development seed data | (inserts demo data) |

### Option 1: Supabase Dashboard (Recommended for First Setup)

1. Go to SQL Editor in Supabase Dashboard
2. Run each migration file in order (001 through 006)
3. Run seed file for development data

```sql
-- Verify migrations succeeded
SELECT COUNT(*) AS tables FROM information_schema.tables
WHERE table_schema = 'public';
-- Expected: 27+ tables
```

### Option 2: Command Line (psql)

```bash
# Set connection string
export DATABASE_URL="postgresql://postgres:password@db.your-project.supabase.co:5432/postgres"

# Run migrations in order
for file in database/migrations/*.sql; do
    echo "Running: $file"
    psql $DATABASE_URL -f "$file"
done

# Run seeds (development only!)
psql $DATABASE_URL -f database/seeds/001_seed_data.sql
```

### Option 3: Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push

# Reset database (WARNING: deletes all data)
supabase db reset
```

### Option 4: Docker (Local Development)

```bash
# Start PostgreSQL container
docker run -d \
  --name marketpulse-db \
  -e POSTGRES_DB=marketpulse \
  -e POSTGRES_PASSWORD=localpassword \
  -p 5432:5432 \
  postgres:15

# Wait for startup
sleep 5

# Run migrations
for file in database/migrations/*.sql; do
    docker exec -i marketpulse-db psql -U postgres -d marketpulse < "$file"
done

# Run seeds
docker exec -i marketpulse-db psql -U postgres -d marketpulse < database/seeds/001_seed_data.sql
```

### Verify Migration Success

```sql
-- Check all tables exist
SELECT tablename FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Check row counts
SELECT 'users' as table_name, COUNT(*) FROM users
UNION ALL SELECT 'skill_nodes', COUNT(*) FROM skill_nodes
UNION ALL SELECT 'vocabulary_terms', COUNT(*) FROM vocabulary_terms
UNION ALL SELECT 'challenge_templates', COUNT(*) FROM challenge_templates
UNION ALL SELECT 'achievements', COUNT(*) FROM achievements
UNION ALL SELECT 'tribes', COUNT(*) FROM tribes
UNION ALL SELECT 'feature_flags', COUNT(*) FROM feature_flags;
```

---

## Core Tables

### users

Primary user authentication table.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL DEFAULT 'user'
        CHECK (role IN ('admin', 'user', 'moderator')),
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
```

**Indexes**: `email`, `role`, `created_at`, `is_active`

### user_profiles

Extended user profile with gamification data.

```sql
CREATE TABLE user_profiles (
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
    trading_experience VARCHAR(50) DEFAULT 'beginner'
        CHECK (trading_experience IN ('beginner', 'intermediate', 'advanced', 'expert')),
    risk_tolerance VARCHAR(20) DEFAULT 'moderate'
        CHECK (risk_tolerance IN ('conservative', 'moderate', 'aggressive')),
    preferred_assets TEXT[],
    onboarding_completed BOOLEAN DEFAULT FALSE,
    onboarding_step INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);
```

### sessions

User session tracking.

```sql
CREATE TABLE sessions (
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
```

---

## Learning & Gamification Tables

### skill_nodes

Knowledge Tree skill definitions.

| Column | Type | Description |
|--------|------|-------------|
| `id` | VARCHAR(50) PK | Unique skill identifier (e.g., 'basic-patterns') |
| `name` | VARCHAR(100) | Display name |
| `category` | VARCHAR(50) | Category (technical, macro, crypto, etc.) |
| `layer` | INTEGER | Tree depth level (1-10) |
| `xp_required` | INTEGER | XP needed to complete |
| `prerequisites` | TEXT[] | Array of required skill IDs |
| `unlocks` | TEXT[] | Array of skills this unlocks |

### user_skill_progress

User progress through skills.

| Column | Type | Description |
|--------|------|-------------|
| `status` | VARCHAR(20) | locked, available, in_progress, completed |
| `progress_pct` | INTEGER | 0-100 completion percentage |
| `xp_earned` | INTEGER | XP earned for this skill |
| `quiz_score` | INTEGER | Score on skill quiz (0-100) |

### vocabulary_terms

Financial vocabulary database with spaced repetition support.

| Column | Type | Description |
|--------|------|-------------|
| `term` | VARCHAR(100) | Vocabulary term (unique) |
| `definition` | TEXT | Full definition |
| `example` | TEXT | Usage example |
| `difficulty` | VARCHAR(20) | beginner, intermediate, advanced, expert |

### user_vocabulary_progress

SM-2 spaced repetition progress per user.

| Column | Type | Description |
|--------|------|-------------|
| `status` | VARCHAR(20) | new, learning, known, mastered |
| `ease_factor` | DECIMAL(3,2) | SM-2 ease factor (1.30-3.00) |
| `interval_days` | INTEGER | Days until next review |
| `next_review_at` | TIMESTAMPTZ | When to show next |

### challenge_templates

Daily/weekly challenge definitions.

| Column | Type | Description |
|--------|------|-------------|
| `type` | VARCHAR(50) | detective, prediction, speed, analysis, pattern, quiz |
| `difficulty` | VARCHAR(20) | easy, medium, hard, extreme |
| `content` | JSONB | Challenge-specific content |
| `correct_answer` | JSONB | Answer data for validation |

### achievements

Achievement definitions with narrative stories.

| Column | Type | Description |
|--------|------|-------------|
| `rarity` | VARCHAR(20) | common, rare, epic, legendary |
| `criteria` | JSONB | Unlock conditions |
| `story_title` | VARCHAR(200) | Achievement story title |
| `story_narrative` | TEXT | Achievement story text |

---

## Social Feature Tables

### tribes

Trading community groups.

| Column | Type | Description |
|--------|------|-------------|
| `slug` | VARCHAR(50) | URL-friendly unique identifier |
| `focus` | VARCHAR(100) | Trading focus (Tech/AI, Crypto, etc.) |
| `is_public` | BOOLEAN | Public or private tribe |
| `max_members` | INTEGER | Maximum allowed members |

### tribe_members

Membership with roles and stats.

| Column | Type | Description |
|--------|------|-------------|
| `role` | VARCHAR(20) | member, elder, moderator, leader |
| `rank_position` | INTEGER | Position in tribe leaderboard |
| `prediction_accuracy` | DECIMAL(5,2) | Accuracy percentage |

### predictions

User market predictions.

| Column | Type | Description |
|--------|------|-------------|
| `direction` | VARCHAR(10) | bullish, bearish, neutral |
| `confidence` | INTEGER | Confidence level (1-10) |
| `outcome` | VARCHAR(20) | pending, correct, incorrect, expired, cancelled |
| `price_at_prediction` | DECIMAL(20,8) | Price when prediction made |

### mentorships

Mentor-mentee relationships.

| Column | Type | Description |
|--------|------|-------------|
| `status` | VARCHAR(20) | pending, active, paused, completed, rejected |
| `rating` | INTEGER | Mentee's rating (1-5) |

---

## Trading Feature Tables

### paper_portfolios

Paper trading portfolios with balance tracking.

| Column | Type | Description |
|--------|------|-------------|
| `initial_balance` | DECIMAL(15,2) | Starting balance |
| `current_balance` | DECIMAL(15,2) | Current cash balance |
| `buying_power` | DECIMAL(15,2) | Available for trading |
| `total_value` | DECIMAL(15,2) | Cash + positions value |
| `win_rate` | DECIMAL(5,2) | Win percentage |

### paper_positions

Open paper trading positions.

| Column | Type | Description |
|--------|------|-------------|
| `side` | VARCHAR(10) | long, short |
| `quantity` | DECIMAL(20,8) | Position size |
| `entry_price` | DECIMAL(20,8) | Entry price |
| `stop_loss` | DECIMAL(20,8) | Stop loss price |
| `take_profit` | DECIMAL(20,8) | Take profit price |
| `pnl` | DECIMAL(15,2) | Current P&L (auto-calculated) |

### watchlist_items

Items in watchlists with alerts.

| Column | Type | Description |
|--------|------|-------------|
| `alert_price_above` | DECIMAL(20,8) | Alert when price exceeds |
| `alert_price_below` | DECIMAL(20,8) | Alert when price drops below |
| `alert_enabled` | BOOLEAN | Whether alerts are active |

---

## Settings & Preferences Tables

### user_settings

User application preferences.

| Category | Settings |
|----------|----------|
| Polling | `polling_stock_quote`, `polling_crypto_price`, `polling_news`, `polling_fear_greed` |
| Cache | `cache_enabled`, `cache_stock_quote_ttl`, `cache_news_ttl` |
| Display | `theme`, `language`, `decimal_places`, `compact_numbers` |
| Features | `ai_enabled`, `ai_analysis`, `demo_mode` |
| Tabs | `tab_overview`, `tab_heartbeat`, `tab_weather`, etc. |
| Notifications | `email_notifications`, `push_notifications`, etc. |

### feature_flags

Global feature toggles with targeting.

| Column | Type | Description |
|--------|------|-------------|
| `enabled_for_roles` | TEXT[] | Roles that have access |
| `enabled_for_users` | UUID[] | Specific users with access |
| `percentage_rollout` | INTEGER | Percentage rollout (0-100) |

### api_keys

Encrypted API key storage.

| Column | Type | Description |
|--------|------|-------------|
| `service_name` | VARCHAR(50) | Service identifier |
| `key_encrypted` | BYTEA | PGP encrypted key |
| `key_hint` | VARCHAR(10) | Last 4 chars for display |

---

## Audit & Analytics Tables

### audit_logs

Comprehensive action audit logging.

| Column | Type | Description |
|--------|------|-------------|
| `action` | VARCHAR(100) | Action performed |
| `resource_type` | VARCHAR(100) | Affected resource type |
| `resource_id` | VARCHAR(255) | Affected resource ID |
| `details` | JSONB | Action-specific details |
| `duration_ms` | INTEGER | Operation duration |

### user_activity

Daily per-user activity aggregation.

| Category | Metrics |
|----------|---------|
| Sessions | `sessions_count`, `total_time_seconds` |
| Features | `challenges_completed`, `predictions_made`, `trades_closed` |
| Engagement | `pages_viewed`, `actions_taken`, `xp_earned` |
| Social | `comments_posted`, `tribe_messages` |

### user_stats

Lifetime user statistics and rankings.

| Category | Metrics |
|----------|---------|
| Lifetime | `total_sessions`, `total_xp_earned`, `total_achievements` |
| Performance | `prediction_accuracy`, `trade_win_rate` |
| Rankings | `global_rank`, `monthly_rank`, `weekly_rank` |
| Patterns | `most_active_hour`, `most_active_day` |

### engagement_metrics

Platform-wide daily engagement metrics (admin dashboard).

| Category | Metrics |
|----------|---------|
| Users | `daily_active_users`, `new_users`, `churned_users` |
| Sessions | `total_sessions`, `avg_session_duration_seconds` |
| Features | `challenges_completed`, `predictions_made`, `trades_opened` |
| Retention | `d1_retention`, `d7_retention`, `d30_retention` |

---

## Row Level Security Policies

All tables have RLS enabled for Supabase compatibility.

### Policy Categories

| Category | Access Pattern |
|----------|----------------|
| Own Data | User can only access their own records |
| Public Read | Anyone can read, only owner can write |
| Tribe Access | Members can access tribe data |
| Admin Full | Admins have unrestricted access |

### Example Policies

```sql
-- Users can read their own data
CREATE POLICY users_select_own ON users
    FOR SELECT USING (id = current_setting('app.current_user_id', true)::uuid);

-- Public predictions are readable by everyone
CREATE POLICY predictions_select_public ON predictions
    FOR SELECT USING (is_public = TRUE OR user_id = auth.uid());

-- Tribe members can view tribe content
CREATE POLICY tribe_members_select_same_tribe ON tribe_members
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM tribe_members tm
            WHERE tm.tribe_id = tribe_members.tribe_id
            AND tm.user_id = auth.uid()
        )
    );

-- Admins have full access
CREATE POLICY admin_users_full_access ON users
    FOR ALL USING (
        current_setting('app.current_user_role', true) = 'admin'
    );
```

### Setting User Context

For RLS policies to work, set user context before queries:

```sql
-- Set user context for RLS
SET app.current_user_id = 'user-uuid-here';
SET app.current_user_role = 'user'; -- or 'admin', 'moderator'

-- Then run your queries
SELECT * FROM user_profiles;
```

---

## Functions & Triggers

### Auto-Update Functions

```sql
-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Auto-Create Functions

| Trigger | On Table | Creates |
|---------|----------|---------|
| `tr_create_user_profile` | `users` | `user_profiles` |
| `tr_create_user_settings` | `users` | `user_settings` |
| `tr_create_user_stats` | `users` | `user_stats` |
| `tr_create_default_portfolio` | `users` | `paper_portfolios` |
| `tr_create_default_watchlist` | `users` | `watchlists` |
| `tr_create_tribe_stats` | `tribes` | `tribe_stats` |

### Calculation Functions

```sql
-- Calculate user level from XP
CREATE OR REPLACE FUNCTION calculate_level(xp INTEGER)
RETURNS INTEGER AS $$
BEGIN
    RETURN GREATEST(1, FLOOR(SQRT(xp / 100.0)) + 1);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

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

    IF v_total = 0 THEN RETURN 0; END IF;
    RETURN (v_correct::DECIMAL / v_total) * 100;
END;
$$ LANGUAGE plpgsql STABLE;
```

### Position P&L Calculation

```sql
-- Auto-calculate position P&L on insert/update
CREATE OR REPLACE FUNCTION calculate_position_pnl()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.side = 'long' THEN
        NEW.pnl = (NEW.current_price - NEW.entry_price) * NEW.quantity;
    ELSE
        NEW.pnl = (NEW.entry_price - NEW.current_price) * NEW.quantity;
    END IF;
    NEW.pnl_pct = ((NEW.current_price - NEW.entry_price) / NEW.entry_price) * 100;
    IF NEW.side = 'short' THEN NEW.pnl_pct = -NEW.pnl_pct; END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Feature Flag Check

```sql
-- Check if feature is enabled for user
CREATE OR REPLACE FUNCTION is_feature_enabled(
    p_feature_id VARCHAR(100),
    p_user_id UUID,
    p_user_role VARCHAR(20)
)
RETURNS BOOLEAN AS $$
DECLARE v_flag feature_flags%ROWTYPE;
BEGIN
    SELECT * INTO v_flag FROM feature_flags WHERE id = p_feature_id;
    IF NOT FOUND THEN RETURN FALSE; END IF;
    IF v_flag.is_enabled THEN RETURN TRUE; END IF;
    IF p_user_role = ANY(v_flag.enabled_for_roles) THEN RETURN TRUE; END IF;
    IF p_user_id = ANY(v_flag.enabled_for_users) THEN RETURN TRUE; END IF;
    IF v_flag.percentage_rollout > 0 THEN
        RETURN (hashtext(p_user_id::text) % 100) < v_flag.percentage_rollout;
    END IF;
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql STABLE;
```

---

## Common Queries

### User Management

```sql
-- Get user with full profile
SELECT u.*, p.level, p.total_xp, p.current_streak, p.title
FROM users u
JOIN user_profiles p ON u.id = p.user_id
WHERE u.id = 'user-uuid';

-- Get user's active sessions
SELECT * FROM sessions
WHERE user_id = 'user-uuid'
AND is_active = TRUE
AND expires_at > NOW();

-- Get top users by XP
SELECT u.display_name, p.level, p.total_xp, s.global_rank
FROM users u
JOIN user_profiles p ON u.id = p.user_id
JOIN user_stats s ON u.id = s.user_id
ORDER BY p.total_xp DESC
LIMIT 10;
```

### Learning Progress

```sql
-- Get user's skill tree progress
SELECT sn.*, usp.status, usp.progress_pct, usp.xp_earned
FROM skill_nodes sn
LEFT JOIN user_skill_progress usp ON sn.id = usp.skill_id AND usp.user_id = 'user-uuid'
ORDER BY sn.layer, sn.sort_order;

-- Get vocabulary due for review
SELECT vt.*, uvp.status, uvp.next_review_at
FROM vocabulary_terms vt
JOIN user_vocabulary_progress uvp ON vt.id = uvp.term_id
WHERE uvp.user_id = 'user-uuid'
AND uvp.next_review_at <= NOW()
ORDER BY uvp.next_review_at
LIMIT 20;

-- Get today's challenges
SELECT ct.*, uc.status, uc.xp_earned
FROM challenge_templates ct
LEFT JOIN user_challenges uc ON ct.id = uc.challenge_id
    AND uc.user_id = 'user-uuid'
    AND uc.challenge_date = CURRENT_DATE
WHERE ct.is_active = TRUE AND ct.is_daily = TRUE;
```

### Trading

```sql
-- Get portfolio with positions
SELECT pp.*,
    COALESCE(SUM(pos.current_price * pos.quantity), 0) as positions_value,
    COALESCE(SUM(pos.pnl), 0) as unrealized_pnl
FROM paper_portfolios pp
LEFT JOIN paper_positions pos ON pp.id = pos.portfolio_id
WHERE pp.user_id = 'user-uuid' AND pp.is_primary = TRUE
GROUP BY pp.id;

-- Get position history with stats
SELECT symbol,
    COUNT(*) as total_trades,
    SUM(CASE WHEN pnl > 0 THEN 1 ELSE 0 END) as wins,
    AVG(pnl_pct) as avg_pnl_pct,
    SUM(pnl) as total_pnl
FROM paper_position_history
WHERE user_id = 'user-uuid'
GROUP BY symbol
ORDER BY total_pnl DESC;
```

### Social Features

```sql
-- Get tribe leaderboard
SELECT u.display_name, u.avatar_emoji, tm.role, tm.rank_position,
    tm.prediction_accuracy, tm.predictions_count
FROM tribe_members tm
JOIN users u ON tm.user_id = u.id
WHERE tm.tribe_id = 'tribe-uuid'
ORDER BY tm.rank_position
LIMIT 20;

-- Get recent public predictions
SELECT p.*, u.display_name, u.avatar_emoji,
    p.agree_count, p.disagree_count, p.comment_count
FROM predictions p
JOIN users u ON p.user_id = u.id
WHERE p.is_public = TRUE
ORDER BY p.created_at DESC
LIMIT 20;

-- Get prediction with votes
SELECT p.*,
    (SELECT vote FROM prediction_votes WHERE prediction_id = p.id AND user_id = 'current-user') as user_vote
FROM predictions p
WHERE p.id = 'prediction-uuid';
```

### Analytics

```sql
-- Get daily activity summary
SELECT activity_date,
    SUM(sessions_count) as sessions,
    SUM(xp_earned) as xp,
    SUM(challenges_completed) as challenges
FROM user_activity
WHERE user_id = 'user-uuid'
AND activity_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY activity_date
ORDER BY activity_date;

-- Get platform engagement metrics
SELECT * FROM engagement_metrics
ORDER BY metric_date DESC
LIMIT 7;

-- Get user retention cohort
SELECT
    DATE_TRUNC('week', created_at) as cohort_week,
    COUNT(*) as users,
    COUNT(*) FILTER (WHERE last_activity_date >= created_at + INTERVAL '7 days') as retained_d7
FROM user_stats us
JOIN users u ON us.user_id = u.id
WHERE u.created_at >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY cohort_week
ORDER BY cohort_week;
```

---

## Backup & Restore

### Manual Backup

```bash
# Full database backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Schema only
pg_dump $DATABASE_URL --schema-only > schema_backup.sql

# Data only
pg_dump $DATABASE_URL --data-only > data_backup.sql

# Specific tables
pg_dump $DATABASE_URL -t users -t user_profiles > users_backup.sql

# Compressed backup
pg_dump $DATABASE_URL | gzip > backup_$(date +%Y%m%d).sql.gz
```

### Automated Backup Script

```bash
#!/bin/bash
# backup.sh - Run daily via cron

BACKUP_DIR="/var/backups/marketpulse"
DATE=$(date +%Y%m%d)
RETENTION_DAYS=30

# Create backup
pg_dump $DATABASE_URL | gzip > "$BACKUP_DIR/backup_$DATE.sql.gz"

# Delete old backups
find $BACKUP_DIR -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete

# Upload to S3 (optional)
# aws s3 cp "$BACKUP_DIR/backup_$DATE.sql.gz" s3://your-bucket/backups/
```

### Restore

```bash
# Restore from SQL file
psql $DATABASE_URL < backup_20250101.sql

# Restore from compressed backup
gunzip -c backup_20250101.sql.gz | psql $DATABASE_URL

# Restore specific tables
psql $DATABASE_URL < users_backup.sql
```

### Supabase Backup

Supabase provides automatic daily backups. To restore:

1. Go to Project Settings > Database > Backups
2. Select a backup point
3. Click "Restore"

For PITR (Point-in-Time Recovery) on Pro plan:
```sql
-- Supabase CLI
supabase db restore --target-timestamp "2025-01-01T12:00:00Z"
```

### Verify Backup Integrity

```sql
-- After restore, verify counts
SELECT 'users' as table_name, COUNT(*) FROM users
UNION ALL SELECT 'user_profiles', COUNT(*) FROM user_profiles
UNION ALL SELECT 'predictions', COUNT(*) FROM predictions
UNION ALL SELECT 'paper_positions', COUNT(*) FROM paper_positions;

-- Check for orphaned records
SELECT COUNT(*) FROM user_profiles
WHERE user_id NOT IN (SELECT id FROM users);
```

---

## Troubleshooting

### Common Issues

#### Permission Denied for Schema Public

```sql
-- Grant permissions
GRANT ALL ON SCHEMA public TO your_user;
GRANT ALL ON ALL TABLES IN SCHEMA public TO your_user;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO your_user;
```

#### Extension Does Not Exist

```sql
-- Create required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

#### RLS Blocking Queries

```sql
-- Set user context before queries
SET app.current_user_id = 'your-user-uuid';
SET app.current_user_role = 'admin';

-- Or disable RLS temporarily (admin only)
SET row_security = off;
```

#### Duplicate Key Violation

```sql
-- Check for duplicates before insert
SELECT * FROM users WHERE email = 'test@example.com';

-- Use ON CONFLICT for upserts
INSERT INTO users (email, display_name)
VALUES ('test@example.com', 'Test')
ON CONFLICT (email) DO UPDATE SET display_name = EXCLUDED.display_name;
```

#### Foreign Key Constraint Violation

```sql
-- Check if referenced record exists
SELECT * FROM users WHERE id = 'referenced-user-id';

-- Insert parent before child
INSERT INTO users (id, email) VALUES ('uuid', 'email');
INSERT INTO user_profiles (user_id) VALUES ('uuid');
```

### Performance Issues

#### Slow Queries

```sql
-- Check slow queries
SELECT query, calls, mean_time, total_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Analyze table statistics
ANALYZE users;
ANALYZE predictions;

-- Check missing indexes
SELECT schemaname, tablename, indexname
FROM pg_indexes
WHERE tablename = 'predictions';
```

#### Table Bloat

```sql
-- Check table sizes
SELECT tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as table_size,
    pg_size_pretty(pg_indexes_size(schemaname||'.'||tablename)) as index_size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Vacuum tables
VACUUM ANALYZE users;
VACUUM ANALYZE predictions;
```

### Connection Issues

```sql
-- Check active connections
SELECT datname, usename, client_addr, state, query
FROM pg_stat_activity
WHERE datname = 'your_database';

-- Kill idle connections
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'your_database' AND state = 'idle';
```

### Data Integrity Checks

```sql
-- Check for orphaned user_profiles
SELECT p.* FROM user_profiles p
LEFT JOIN users u ON p.user_id = u.id
WHERE u.id IS NULL;

-- Check for missing profiles
SELECT u.* FROM users u
LEFT JOIN user_profiles p ON u.id = p.user_id
WHERE p.id IS NULL;

-- Fix missing profiles
INSERT INTO user_profiles (user_id)
SELECT id FROM users u
WHERE NOT EXISTS (SELECT 1 FROM user_profiles p WHERE p.user_id = u.id);
```

---

## Data Types Summary

| Type | PostgreSQL | Usage |
|------|------------|-------|
| UUID | UUID | Primary keys, foreign keys |
| Text | VARCHAR(n), TEXT | Names, descriptions, content |
| Numbers | INTEGER, DECIMAL | XP, prices, percentages |
| Boolean | BOOLEAN | Flags, toggles |
| Timestamps | TIMESTAMPTZ | created_at, updated_at |
| JSON | JSONB | Flexible data, metadata, criteria |
| Arrays | TEXT[], UUID[] | Tags, lists, roles |
| IP | INET | IP addresses |
| Binary | BYTEA | Encrypted data |

---

## Schema Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-12-28 | Initial schema release |

---

**Last Updated**: 2025-12-28
**Maintained By**: DOCUMENTER Agent
**Documentation**: See also `/database/README.md` for quick start guide
