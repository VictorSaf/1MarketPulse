/**
 * Database Types for 1MarketPulse
 *
 * Auto-generated type definitions matching the PostgreSQL schema.
 * Use with Supabase client for type-safe database operations.
 *
 * @version 1.0.0
 * @date 2025-12-28
 */

// ============================================================================
// ENUMS
// ============================================================================

export type UserRole = 'admin' | 'user' | 'moderator';
export type TradingExperience = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type RiskTolerance = 'conservative' | 'moderate' | 'aggressive';
export type SkillStatus = 'locked' | 'available' | 'in_progress' | 'completed';
export type VocabularyStatus = 'new' | 'learning' | 'known' | 'mastered';
export type VocabularyDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type ChallengeType = 'detective' | 'prediction' | 'speed' | 'analysis' | 'pattern' | 'quiz';
export type ChallengeDifficulty = 'easy' | 'medium' | 'hard' | 'extreme';
export type ChallengeStatus = 'available' | 'in_progress' | 'completed' | 'failed' | 'expired';
export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type TribeRole = 'member' | 'elder' | 'moderator' | 'leader';
export type ActivityLevel = 'low' | 'medium' | 'high';
export type AssetType = 'stock' | 'crypto' | 'etf' | 'index' | 'forex' | 'commodity' | 'option';
export type PredictionDirection = 'bullish' | 'bearish' | 'neutral';
export type PredictionOutcome = 'pending' | 'correct' | 'incorrect' | 'expired' | 'cancelled';
export type VoteType = 'agree' | 'disagree';
export type MentorshipStatus = 'pending' | 'active' | 'paused' | 'completed' | 'rejected';
export type PositionSide = 'long' | 'short';
export type CloseReason = 'manual' | 'stop_loss' | 'take_profit' | 'liquidation' | 'expired';
export type Theme = 'dark' | 'light' | 'system';
export type LeaderboardType = 'global' | 'monthly' | 'weekly' | 'tribe';

// ============================================================================
// CORE TABLES
// ============================================================================

export interface User {
  id: string;
  email: string;
  role: UserRole;
  display_name: string | null;
  avatar_url: string | null;
  avatar_emoji: string;
  bio: string | null;
  is_active: boolean;
  is_verified: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  level: number;
  total_xp: number;
  current_streak: number;
  longest_streak: number;
  streak_last_date: string | null;
  title: string;
  timezone: string;
  country_code: string | null;
  trading_experience: TradingExperience;
  risk_tolerance: RiskTolerance;
  preferred_assets: string[];
  onboarding_completed: boolean;
  onboarding_step: number;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  user_id: string;
  token_hash: string;
  user_agent: string | null;
  ip_address: string | null;
  device_type: string | null;
  is_active: boolean;
  expires_at: string;
  last_activity_at: string;
  created_at: string;
}

// ============================================================================
// LEARNING & GAMIFICATION
// ============================================================================

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  layer: number;
  xp_required: number;
  benefit: string | null;
  content_url: string | null;
  quiz_id: string | null;
  prerequisites: string[];
  unlocks: string[];
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserSkillProgress {
  id: string;
  user_id: string;
  skill_id: string;
  status: SkillStatus;
  progress_pct: number;
  xp_earned: number;
  started_at: string | null;
  completed_at: string | null;
  last_activity_at: string;
  attempts: number;
  quiz_score: number | null;
  created_at: string;
  updated_at: string;
}

export interface VocabularyTerm {
  id: string;
  term: string;
  definition: string;
  example: string | null;
  category: string;
  difficulty: VocabularyDifficulty;
  related_terms: string[];
  tags: string[];
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserVocabularyProgress {
  id: string;
  user_id: string;
  term_id: string;
  status: VocabularyStatus;
  ease_factor: number;
  interval_days: number;
  repetitions: number;
  next_review_at: string | null;
  last_reviewed_at: string | null;
  correct_count: number;
  incorrect_count: number;
  created_at: string;
  updated_at: string;
}

export interface ChallengeTemplate {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: ChallengeType;
  difficulty: ChallengeDifficulty;
  xp_reward: number;
  time_limit_minutes: number | null;
  category: string | null;
  content: Record<string, unknown>;
  correct_answer: Record<string, unknown> | null;
  hints: string[];
  prerequisites: Record<string, unknown> | null;
  is_active: boolean;
  is_daily: boolean;
  is_weekly: boolean;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserChallenge {
  id: string;
  user_id: string;
  challenge_id: string;
  status: ChallengeStatus;
  progress_pct: number;
  started_at: string | null;
  completed_at: string | null;
  time_spent_seconds: number;
  answer: Record<string, unknown> | null;
  is_correct: boolean | null;
  xp_earned: number;
  streak_bonus_applied: boolean;
  challenge_date: string;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: AchievementRarity;
  xp_reward: number;
  category: string | null;
  criteria: Record<string, unknown>;
  story_title: string | null;
  story_narrative: string | null;
  story_meaning: string | null;
  reward_description: string | null;
  is_secret: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
  stats: Record<string, unknown> | null;
  is_featured: boolean;
  created_at: string;
}

// ============================================================================
// SOCIAL FEATURES
// ============================================================================

export interface Tribe {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string;
  cover_image_url: string | null;
  focus: string | null;
  is_public: boolean;
  is_official: boolean;
  max_members: number;
  rules: string[];
  tags: string[];
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface TribeMember {
  id: string;
  tribe_id: string;
  user_id: string;
  role: TribeRole;
  rank_position: number | null;
  joined_at: string;
  prediction_accuracy: number;
  predictions_count: number;
  streak: number;
  xp_contributed: number;
  is_active: boolean;
  muted_until: string | null;
  created_at: string;
  updated_at: string;
}

export interface TribeStats {
  tribe_id: string;
  member_count: number;
  active_member_count: number;
  avg_accuracy: number;
  total_predictions: number;
  correct_predictions: number;
  activity_level: ActivityLevel;
  top_performer_id: string | null;
  last_calculated_at: string;
}

export interface Prediction {
  id: string;
  user_id: string;
  tribe_id: string | null;
  symbol: string;
  asset_type: AssetType;
  direction: PredictionDirection;
  prediction_text: string;
  target_price: number | null;
  target_date: string | null;
  confidence: number | null;
  reasoning: string | null;
  tags: string[];
  is_public: boolean;
  outcome: PredictionOutcome;
  outcome_determined_at: string | null;
  actual_price: number | null;
  price_at_prediction: number | null;
  agree_count: number;
  disagree_count: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
}

export interface PredictionVote {
  id: string;
  prediction_id: string;
  user_id: string;
  vote: VoteType;
  created_at: string;
}

export interface PredictionComment {
  id: string;
  prediction_id: string;
  user_id: string;
  parent_id: string | null;
  content: string;
  is_edited: boolean;
  edited_at: string | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface Mentorship {
  id: string;
  mentor_id: string;
  mentee_id: string;
  status: MentorshipStatus;
  specialty: string | null;
  goals: string | null;
  started_at: string | null;
  ended_at: string | null;
  rating: number | null;
  feedback: string | null;
  created_at: string;
  updated_at: string;
}

export interface MentorProfile {
  user_id: string;
  is_accepting_mentees: boolean;
  max_mentees: number;
  current_mentees: number;
  specialty: string | null;
  monthly_return_avg: number | null;
  years_experience: number | null;
  teaching_style: string | null;
  availability: string | null;
  requirements: string | null;
  total_mentees: number;
  avg_rating: number;
  created_at: string;
  updated_at: string;
}

export interface MentorMessage {
  id: string;
  mentorship_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

// ============================================================================
// TRADING FEATURES
// ============================================================================

export interface PaperPortfolio {
  id: string;
  user_id: string;
  name: string;
  initial_balance: number;
  current_balance: number;
  buying_power: number;
  total_value: number;
  total_pnl: number;
  total_pnl_pct: number;
  win_rate: number;
  total_trades: number;
  winning_trades: number;
  is_active: boolean;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaperPosition {
  id: string;
  portfolio_id: string;
  user_id: string;
  symbol: string;
  asset_type: AssetType;
  side: PositionSide;
  quantity: number;
  entry_price: number;
  current_price: number;
  stop_loss: number | null;
  take_profit: number | null;
  pnl: number;
  pnl_pct: number;
  notes: string | null;
  opened_at: string;
  last_price_update: string;
  created_at: string;
  updated_at: string;
}

export interface PaperPositionHistory {
  id: string;
  portfolio_id: string;
  user_id: string;
  symbol: string;
  asset_type: string;
  side: string;
  quantity: number;
  entry_price: number;
  exit_price: number;
  pnl: number;
  pnl_pct: number;
  duration_seconds: number | null;
  close_reason: CloseReason | null;
  notes: string | null;
  opened_at: string;
  closed_at: string;
  created_at: string;
}

export interface Watchlist {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  icon: string;
  color: string | null;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface WatchlistItem {
  id: string;
  watchlist_id: string;
  symbol: string;
  asset_type: AssetType;
  notes: string | null;
  alert_price_above: number | null;
  alert_price_below: number | null;
  alert_enabled: boolean;
  sort_order: number;
  added_at: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// SETTINGS
// ============================================================================

export interface UserSettings {
  user_id: string;
  api_keys_encrypted: string | null;
  // Polling intervals (ms)
  polling_stock_quote: number;
  polling_crypto_price: number;
  polling_news: number;
  polling_fear_greed: number;
  polling_market_index: number;
  // Cache settings
  cache_enabled: boolean;
  cache_stock_quote_ttl: number;
  cache_crypto_price_ttl: number;
  cache_news_ttl: number;
  cache_fear_greed_ttl: number;
  cache_max_entries: number;
  // Display settings
  default_tab: string;
  theme: Theme;
  decimal_places: number;
  compact_numbers: boolean;
  show_animations: boolean;
  language: string;
  // Feature flags
  ai_enabled: boolean;
  ai_analysis: boolean;
  ai_morning_brief: boolean;
  ai_sentiment: boolean;
  demo_mode: boolean;
  real_data_enabled: boolean;
  // Tab visibility
  tab_overview: boolean;
  tab_heartbeat: boolean;
  tab_weather: boolean;
  tab_dna: boolean;
  tab_stories: boolean;
  tab_patterns: boolean;
  tab_advanced: boolean;
  tab_learning: boolean;
  // Notifications
  email_notifications: boolean;
  email_daily_digest: boolean;
  email_weekly_summary: boolean;
  email_achievement_unlocked: boolean;
  email_challenge_reminder: boolean;
  email_prediction_result: boolean;
  push_notifications: boolean;
  push_price_alerts: boolean;
  push_prediction_result: boolean;
  prediction_reminders: boolean;
  challenge_reminders: boolean;
  // Privacy
  profile_public: boolean;
  show_predictions: boolean;
  show_achievements: boolean;
  show_stats: boolean;
  allow_mentorship_requests: boolean;
  created_at: string;
  updated_at: string;
}

export interface FeatureFlag {
  id: string;
  name: string;
  description: string | null;
  is_enabled: boolean;
  enabled_for_roles: string[];
  enabled_for_users: string[];
  percentage_rollout: number;
  metadata: Record<string, unknown>;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiKey {
  id: string;
  user_id: string;
  service_name: string;
  key_encrypted: string;
  key_hint: string | null;
  is_active: boolean;
  last_used_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// AUDIT & ANALYTICS
// ============================================================================

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  resource_type: string | null;
  resource_id: string | null;
  details: Record<string, unknown>;
  ip_address: string | null;
  user_agent: string | null;
  session_id: string | null;
  success: boolean;
  error_message: string | null;
  duration_ms: number | null;
  created_at: string;
}

export interface UserActivity {
  id: string;
  user_id: string;
  activity_date: string;
  sessions_count: number;
  total_time_seconds: number;
  first_session_at: string | null;
  last_session_at: string | null;
  challenges_attempted: number;
  challenges_completed: number;
  predictions_made: number;
  vocabulary_reviews: number;
  trades_opened: number;
  trades_closed: number;
  skills_completed: number;
  pages_viewed: number;
  actions_taken: number;
  xp_earned: number;
  predictions_votes_cast: number;
  comments_posted: number;
  tribe_messages: number;
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  user_id: string;
  total_sessions: number;
  total_time_seconds: number;
  total_challenges_completed: number;
  total_predictions: number;
  correct_predictions: number;
  total_trades: number;
  winning_trades: number;
  total_xp_earned: number;
  total_achievements: number;
  total_vocabulary_mastered: number;
  total_skills_completed: number;
  prediction_accuracy: number;
  trade_win_rate: number;
  avg_session_minutes: number;
  avg_daily_xp: number;
  current_streak: number;
  longest_streak: number;
  streak_start_date: string | null;
  global_rank: number | null;
  global_rank_pct: number | null;
  monthly_rank: number | null;
  weekly_rank: number | null;
  most_active_hour: number | null;
  most_active_day: number | null;
  days_active: number;
  first_activity_date: string | null;
  last_activity_date: string | null;
  last_calculated_at: string;
  created_at: string;
  updated_at: string;
}

export interface EngagementMetrics {
  id: string;
  metric_date: string;
  daily_active_users: number;
  weekly_active_users: number;
  monthly_active_users: number;
  new_users: number;
  returning_users: number;
  churned_users: number;
  total_sessions: number;
  avg_session_duration_seconds: number;
  median_session_duration_seconds: number;
  total_session_time_hours: number;
  total_page_views: number;
  avg_pages_per_session: number;
  bounce_rate: number;
  challenges_started: number;
  challenges_completed: number;
  predictions_made: number;
  predictions_correct: number;
  trades_opened: number;
  trades_closed: number;
  vocabulary_reviews: number;
  achievements_unlocked: number;
  new_tribe_members: number;
  prediction_votes: number;
  comments_posted: number;
  mentorship_requests: number;
  d1_retention: number;
  d7_retention: number;
  d14_retention: number;
  d30_retention: number;
  revenue: number;
  arpu: number;
  arppu: number;
  created_at: string;
}

export interface LeaderboardSnapshot {
  id: string;
  snapshot_date: string;
  leaderboard_type: LeaderboardType;
  tribe_id: string | null;
  user_id: string;
  rank_position: number;
  score: number;
  metric_values: Record<string, unknown>;
  created_at: string;
}

// ============================================================================
// DATABASE SCHEMA TYPE (for Supabase client)
// ============================================================================

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at'>>;
      };
      user_profiles: {
        Row: UserProfile;
        Insert: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserProfile, 'id' | 'user_id' | 'created_at'>>;
      };
      sessions: {
        Row: Session;
        Insert: Omit<Session, 'id' | 'created_at'>;
        Update: Partial<Omit<Session, 'id' | 'created_at'>>;
      };
      skill_nodes: {
        Row: SkillNode;
        Insert: Omit<SkillNode, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SkillNode, 'id' | 'created_at'>>;
      };
      user_skill_progress: {
        Row: UserSkillProgress;
        Insert: Omit<UserSkillProgress, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserSkillProgress, 'id' | 'created_at'>>;
      };
      vocabulary_terms: {
        Row: VocabularyTerm;
        Insert: Omit<VocabularyTerm, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<VocabularyTerm, 'id' | 'created_at'>>;
      };
      user_vocabulary_progress: {
        Row: UserVocabularyProgress;
        Insert: Omit<UserVocabularyProgress, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserVocabularyProgress, 'id' | 'created_at'>>;
      };
      challenge_templates: {
        Row: ChallengeTemplate;
        Insert: Omit<ChallengeTemplate, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ChallengeTemplate, 'id' | 'created_at'>>;
      };
      user_challenges: {
        Row: UserChallenge;
        Insert: Omit<UserChallenge, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserChallenge, 'id' | 'created_at'>>;
      };
      achievements: {
        Row: Achievement;
        Insert: Omit<Achievement, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Achievement, 'id' | 'created_at'>>;
      };
      user_achievements: {
        Row: UserAchievement;
        Insert: Omit<UserAchievement, 'id' | 'created_at'>;
        Update: Partial<Omit<UserAchievement, 'id' | 'created_at'>>;
      };
      tribes: {
        Row: Tribe;
        Insert: Omit<Tribe, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Tribe, 'id' | 'created_at'>>;
      };
      tribe_members: {
        Row: TribeMember;
        Insert: Omit<TribeMember, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<TribeMember, 'id' | 'created_at'>>;
      };
      tribe_stats: {
        Row: TribeStats;
        Insert: TribeStats;
        Update: Partial<TribeStats>;
      };
      predictions: {
        Row: Prediction;
        Insert: Omit<Prediction, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Prediction, 'id' | 'created_at'>>;
      };
      prediction_votes: {
        Row: PredictionVote;
        Insert: Omit<PredictionVote, 'id' | 'created_at'>;
        Update: Partial<Omit<PredictionVote, 'id' | 'created_at'>>;
      };
      prediction_comments: {
        Row: PredictionComment;
        Insert: Omit<PredictionComment, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<PredictionComment, 'id' | 'created_at'>>;
      };
      mentorships: {
        Row: Mentorship;
        Insert: Omit<Mentorship, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Mentorship, 'id' | 'created_at'>>;
      };
      mentor_profiles: {
        Row: MentorProfile;
        Insert: Omit<MentorProfile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<MentorProfile, 'user_id' | 'created_at'>>;
      };
      mentor_messages: {
        Row: MentorMessage;
        Insert: Omit<MentorMessage, 'id' | 'created_at'>;
        Update: Partial<Omit<MentorMessage, 'id' | 'created_at'>>;
      };
      paper_portfolios: {
        Row: PaperPortfolio;
        Insert: Omit<PaperPortfolio, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<PaperPortfolio, 'id' | 'created_at'>>;
      };
      paper_positions: {
        Row: PaperPosition;
        Insert: Omit<PaperPosition, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<PaperPosition, 'id' | 'created_at'>>;
      };
      paper_position_history: {
        Row: PaperPositionHistory;
        Insert: Omit<PaperPositionHistory, 'id' | 'created_at'>;
        Update: never;
      };
      watchlists: {
        Row: Watchlist;
        Insert: Omit<Watchlist, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Watchlist, 'id' | 'created_at'>>;
      };
      watchlist_items: {
        Row: WatchlistItem;
        Insert: Omit<WatchlistItem, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<WatchlistItem, 'id' | 'created_at'>>;
      };
      user_settings: {
        Row: UserSettings;
        Insert: Omit<UserSettings, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserSettings, 'user_id' | 'created_at'>>;
      };
      feature_flags: {
        Row: FeatureFlag;
        Insert: Omit<FeatureFlag, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<FeatureFlag, 'id' | 'created_at'>>;
      };
      api_keys: {
        Row: ApiKey;
        Insert: Omit<ApiKey, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ApiKey, 'id' | 'created_at'>>;
      };
      audit_logs: {
        Row: AuditLog;
        Insert: Omit<AuditLog, 'id' | 'created_at'>;
        Update: never;
      };
      user_activity: {
        Row: UserActivity;
        Insert: Omit<UserActivity, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserActivity, 'id' | 'created_at'>>;
      };
      user_stats: {
        Row: UserStats;
        Insert: Omit<UserStats, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserStats, 'user_id' | 'created_at'>>;
      };
      engagement_metrics: {
        Row: EngagementMetrics;
        Insert: Omit<EngagementMetrics, 'id' | 'created_at'>;
        Update: never;
      };
      leaderboard_snapshots: {
        Row: LeaderboardSnapshot;
        Insert: Omit<LeaderboardSnapshot, 'id' | 'created_at'>;
        Update: never;
      };
    };
  };
}
