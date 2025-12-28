-- ============================================================================
-- Seed Data for 1MarketPulse Development
-- Run after all migrations are complete
-- ============================================================================

-- ============================================================================
-- ADMIN USERS
-- Note: In production, use Supabase Auth to create users
-- ============================================================================
INSERT INTO users (id, email, role, display_name, avatar_emoji, is_active, is_verified)
VALUES
    ('00000000-0000-0000-0000-000000000001', 'admin@admin.ro', 'admin', 'Admin', '👨‍💻', TRUE, TRUE),
    ('00000000-0000-0000-0000-000000000002', 'vict0r@vict0r.ro', 'admin', 'Victor', '🦊', TRUE, TRUE),
    ('00000000-0000-0000-0000-000000000003', 'demo@demo.com', 'user', 'Demo User', '👤', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;

-- Update profiles
UPDATE user_profiles
SET
    level = 12,
    total_xp = 1847,
    current_streak = 12,
    longest_streak = 15,
    title = 'Pattern Apprentice',
    trading_experience = 'intermediate',
    preferred_assets = ARRAY['stocks', 'crypto'],
    onboarding_completed = TRUE
WHERE user_id IN (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002'
);

-- ============================================================================
-- SKILL NODES (Knowledge Tree)
-- ============================================================================
INSERT INTO skill_nodes (id, name, description, icon, category, layer, xp_required, benefit, prerequisites)
VALUES
    -- Foundation (Layer 1)
    ('start', 'START', 'Welcome to your learning journey', '🎯', 'foundation', 1, 0, 'Access to basic features', NULL),

    -- Layer 2 - Basics
    ('basic-patterns', 'BASIC PATTERNS', 'Support, Resistance, Trend Lines', '📊', 'technical', 2, 100, 'Identify basic chart patterns', ARRAY['start']),
    ('volume-basics', 'VOLUME BASICS', 'Understanding volume and its importance', '📈', 'technical', 2, 100, 'Read volume patterns', ARRAY['start']),

    -- Layer 3 - Intermediate
    ('breakouts', 'BREAKOUTS', 'Breakout patterns and confirmation', '🚀', 'technical', 3, 200, 'Spot breakout opportunities', ARRAY['basic-patterns']),
    ('support-resistance', 'SUPPORT/RESISTANCE', 'Advanced S/R levels and zones', '🎯', 'technical', 3, 200, 'Identify key price levels', ARRAY['basic-patterns']),
    ('money-flow', 'MONEY FLOW', 'Institutional buying and selling', '💰', 'technical', 3, 250, 'See where big money is moving', ARRAY['volume-basics', 'basic-patterns']),

    -- Layer 4 - Advanced
    ('complex-patterns', 'COMPLEX PATTERNS', 'H&S, Cup & Handle, Wedges', '🔮', 'technical', 4, 400, 'Advanced pattern recognition', ARRAY['breakouts', 'support-resistance']),
    ('reversal-patterns', 'REVERSAL PATTERNS', 'Spotting trend reversals', '🔄', 'technical', 4, 400, 'Catch major trend changes', ARRAY['breakouts']),
    ('correlation-matrix', 'CORRELATION MATRIX', 'Asset correlations and divergences', '🕸️', 'analysis', 4, 500, 'Understand market relationships', ARRAY['money-flow']),

    -- Layer 5 - Expert
    ('options-basics', 'OPTIONS BASICS', 'Greeks, IV, and option strategies', '⚡', 'options', 5, 600, 'Understand options market', ARRAY['correlation-matrix']),
    ('spread-strategies', 'SPREAD STRATEGIES', 'Advanced option spreads', '🎲', 'options', 5, 800, 'Build complex positions', ARRAY['options-basics']),

    -- Crypto Branch
    ('crypto-fundamentals', 'CRYPTO FUNDAMENTALS', 'Blockchain, tokenomics, DeFi basics', '₿', 'crypto', 2, 100, 'Understand cryptocurrency basics', ARRAY['start']),
    ('defi-protocols', 'DEFI PROTOCOLS', 'Liquidity pools, yield farming, staking', '🌊', 'crypto', 3, 300, 'Navigate DeFi ecosystem', ARRAY['crypto-fundamentals']),
    ('on-chain-analysis', 'ON-CHAIN ANALYSIS', 'Reading blockchain data', '🔗', 'crypto', 4, 500, 'Analyze on-chain metrics', ARRAY['defi-protocols']),

    -- Macro Branch
    ('macro-basics', 'MACRO BASICS', 'Interest rates, inflation, GDP', '🌍', 'macro', 2, 100, 'Understand economic indicators', ARRAY['start']),
    ('fed-analysis', 'FED ANALYSIS', 'Federal Reserve policy analysis', '🏛️', 'macro', 3, 300, 'Interpret Fed decisions', ARRAY['macro-basics']),
    ('global-markets', 'GLOBAL MARKETS', 'International market dynamics', '🌐', 'macro', 4, 500, 'Trade global correlations', ARRAY['fed-analysis'])
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    xp_required = EXCLUDED.xp_required;

-- ============================================================================
-- VOCABULARY TERMS
-- ============================================================================
INSERT INTO vocabulary_terms (term, definition, example, category, difficulty)
VALUES
    ('VIX', 'The Volatility Index - measures expected market volatility over the next 30 days', 'VIX at 14.2 means low expected volatility (calm market)', 'volatility', 'beginner'),
    ('Support', 'A price level where buying pressure is strong enough to prevent further decline', 'NVDA found support at $480 - buyers stepped in at this level', 'technical', 'beginner'),
    ('Resistance', 'A price level where selling pressure is strong enough to prevent further rise', 'NVDA faces resistance at $500 - sellers active at this level', 'technical', 'beginner'),
    ('Breakout', 'When price moves above resistance or below support with increased volume', 'NVDA broke out above $485 on 2x volume - bullish signal', 'technical', 'beginner'),
    ('Dark Pool', 'Private exchanges where large institutional orders are executed away from public markets', 'Dark pool activity at 42% suggests institutional positioning', 'institutional', 'intermediate'),
    ('Gamma', 'The rate of change in an options delta relative to price movement', 'Positive gamma exposure means dealers will buy dips', 'options', 'advanced'),
    ('Delta', 'The rate of change of an options price relative to underlying asset price', 'A delta of 0.50 means the option moves $0.50 for every $1 move in the stock', 'options', 'intermediate'),
    ('Theta', 'Time decay - the rate at which an option loses value as expiration approaches', 'Selling options captures theta decay as income', 'options', 'intermediate'),
    ('IV', 'Implied Volatility - market''s expectation of future price movement priced into options', 'High IV before earnings makes options expensive', 'options', 'intermediate'),
    ('RSI', 'Relative Strength Index - momentum oscillator measuring speed of price changes (0-100)', 'RSI above 70 is overbought, below 30 is oversold', 'technical', 'beginner'),
    ('MACD', 'Moving Average Convergence Divergence - trend-following momentum indicator', 'MACD crossing above signal line is bullish', 'technical', 'intermediate'),
    ('EMA', 'Exponential Moving Average - weighted average giving more importance to recent prices', '50 EMA crossing above 200 EMA is a golden cross', 'technical', 'beginner'),
    ('P/E Ratio', 'Price-to-Earnings Ratio - stock price divided by earnings per share', 'A P/E of 25 means investors pay $25 for every $1 of earnings', 'fundamentals', 'beginner'),
    ('Market Cap', 'Total market value of a company''s outstanding shares', 'Apple''s $3T market cap makes it the largest company', 'fundamentals', 'beginner'),
    ('Float', 'Number of shares available for public trading', 'Low float stocks are more volatile due to limited supply', 'fundamentals', 'intermediate'),
    ('Short Interest', 'Percentage of shares sold short relative to float', '25% short interest indicates significant bearish bets', 'institutional', 'intermediate'),
    ('Put/Call Ratio', 'Ratio of put options to call options traded', 'High put/call ratio can signal fear or hedging', 'sentiment', 'intermediate'),
    ('Fear & Greed Index', 'CNN''s composite indicator measuring market sentiment (0-100)', 'Extreme fear readings often mark buying opportunities', 'sentiment', 'beginner'),
    ('DeFi', 'Decentralized Finance - financial services built on blockchain without intermediaries', 'DeFi protocols like Uniswap enable permissionless trading', 'crypto', 'intermediate'),
    ('TVL', 'Total Value Locked - amount of assets deposited in a DeFi protocol', 'Aave''s $10B TVL makes it a leading lending protocol', 'crypto', 'intermediate'),
    ('Halving', 'Bitcoin event where mining rewards are cut in half every 4 years', 'The 2024 halving reduced block rewards from 6.25 to 3.125 BTC', 'crypto', 'beginner'),
    ('FOMC', 'Federal Open Market Committee - Fed body that sets interest rates', 'FOMC meetings often cause market volatility', 'macro', 'beginner'),
    ('Yield Curve', 'Graph showing interest rates across different bond maturities', 'Inverted yield curve often predicts recession', 'macro', 'intermediate'),
    ('QE', 'Quantitative Easing - central bank buying assets to inject money into economy', 'QE programs inflated asset prices post-2008', 'macro', 'intermediate')
ON CONFLICT (term) DO UPDATE SET
    definition = EXCLUDED.definition,
    example = EXCLUDED.example;

-- ============================================================================
-- CHALLENGE TEMPLATES
-- ============================================================================
INSERT INTO challenge_templates (title, description, icon, type, difficulty, xp_reward, time_limit_minutes, category, is_active, is_daily)
VALUES
    ('DETECTIVE CHALLENGE', 'The VIX dropped 8% today but SPX only rose 0.3%. This is unusual. Find out why.', '🔍', 'detective', 'medium', 50, 30, 'analysis', TRUE, TRUE),
    ('PREDICTION CHALLENGE', 'FOMC minutes release at 14:00. Predict the SPX move: Up, Down, or Flat?', '🎯', 'prediction', 'hard', 30, NULL, 'prediction', TRUE, TRUE),
    ('SPEED ROUND', '5 questions, 10 seconds each. Topic: Bond-Stock correlation', '⚡', 'speed', 'easy', 20, 2, 'quiz', TRUE, TRUE),
    ('PATTERN MASTER', 'Identify 3 patterns in real market data. Accuracy matters.', '📊', 'pattern', 'medium', 40, 15, 'technical', TRUE, TRUE),
    ('MARKET DNA', 'Analyze today''s market DNA and predict tomorrow''s sentiment.', '🧬', 'analysis', 'hard', 60, 20, 'analysis', TRUE, FALSE),
    ('VOCABULARY QUIZ', 'Test your financial vocabulary knowledge. 10 terms, multiple choice.', '📚', 'quiz', 'easy', 15, 5, 'education', TRUE, TRUE),
    ('WEEKLY PREDICTION', 'Make your weekly market prediction. Checked on Friday close.', '📅', 'prediction', 'medium', 100, NULL, 'prediction', TRUE, FALSE),
    ('SECTOR ROTATION', 'Identify which sectors are showing strength/weakness this week.', '🔄', 'analysis', 'medium', 45, 20, 'analysis', TRUE, FALSE)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- ACHIEVEMENTS
-- ============================================================================
INSERT INTO achievements (id, title, description, icon, rarity, xp_reward, category, criteria, story_title, story_narrative, story_meaning)
VALUES
    ('contrarian', 'CONTRARIAN', 'Make a correct prediction against 70%+ of the community', '🎖️', 'epic', 100, 'prediction',
     '{"type": "prediction_against_crowd", "threshold": 70, "outcome": "correct"}',
     'Swimming against the current',
     'You predicted against the majority and were right. This requires courage and independent analysis.',
     'You don''t blindly follow the crowd. You think independently. You have potential as a contrarian investor.'),

    ('eagle-eye', 'EAGLE EYE', 'Successfully identify your first chart pattern', '🦅', 'rare', 50, 'patterns',
     '{"type": "pattern_identified", "count": 1, "correct": true}',
     'Your first pattern spotted',
     'On your fifth day, you spotted something others missed: a coiled spring forming. Your first pattern call. It was right.',
     'Pattern recognition is a skill that develops with practice. You have the eye.'),

    ('consistent', 'CONSISTENT', 'Maintain a 7-day activity streak', '📅', 'common', 25, 'engagement',
     '{"type": "streak", "days": 7}',
     'The habit forms',
     'You returned every morning. Rain or shine. Day 7. The streak was born. Consistency beats intensity.',
     'Success in markets is not about one big win. It''s about showing up every day.'),

    ('tribe-member', 'TRIBE MEMBER', 'Join a tribe and reach Elder status', '👥', 'rare', 75, 'social',
     '{"type": "tribe_rank", "rank": "elder"}',
     'Finding your people',
     'The tribe welcomed you. Alone we see patterns. Together we see the matrix.',
     'Community accelerates learning. You found yours.'),

    ('prophet', 'PROPHET', 'Predict a major market event 24 hours before it happens', '🔮', 'legendary', 500, 'prediction',
     '{"type": "major_event_prediction", "hours_before": 24}',
     'The impossible call',
     'You predicted a black swan event 24 hours before it happened. Less than 0.1% of traders achieve this.',
     'True market mastery. Your analysis went beyond data - you understood psychology.'),

    ('streak-master', 'STREAK MASTER', 'Maintain a 30-day activity streak', '🔥', 'epic', 200, 'engagement',
     '{"type": "streak", "days": 30}',
     'The unbroken chain',
     'Thirty days. Through volatility, through boredom, through doubt. You showed up.',
     'Discipline is the bridge between goals and accomplishment.'),

    ('vocab-scholar', 'VOCAB SCHOLAR', 'Master 50 vocabulary terms', '📖', 'rare', 75, 'education',
     '{"type": "vocabulary_mastered", "count": 50}',
     'Words become tools',
     'You''ve mastered the language of markets. These aren''t just terms - they''re lenses through which you see the market.',
     'Speaking the language of finance opens doors.'),

    ('tree-climber', 'TREE CLIMBER', 'Complete all skills in one branch of the Knowledge Tree', '🌳', 'epic', 150, 'education',
     '{"type": "skill_branch_complete", "branch": "any"}',
     'Branch mastery',
     'You''ve climbed to the top of a branch. The view from here is clearer.',
     'Specialization creates expertise. You''re becoming a specialist.'),

    ('paper-millionaire', 'PAPER MILLIONAIRE', 'Reach $1M in paper trading portfolio value', '💰', 'legendary', 300, 'trading',
     '{"type": "portfolio_value", "amount": 1000000}',
     'The first million',
     'One million dollars. Paper or not, you learned what it takes to grow capital 10x.',
     'The skills you developed are real, even if the money isn''t.'),

    ('first-trade', 'FIRST TRADE', 'Open your first paper trading position', '📈', 'common', 10, 'trading',
     '{"type": "trade_count", "count": 1}',
     'The journey begins',
     'Your first trade. Win or lose, you''ve taken the first step.',
     'Every expert was once a beginner.')
ON CONFLICT (id) DO UPDATE SET
    description = EXCLUDED.description,
    criteria = EXCLUDED.criteria;

-- ============================================================================
-- TRIBES
-- ============================================================================
INSERT INTO tribes (id, slug, name, description, icon, focus, is_public, is_official, max_members)
VALUES
    ('00000000-0000-0000-0000-000000000101', 'nvda-hunters', 'NVDA Hunters', 'Focused on semiconductor and AI stocks', '🎯', 'Tech/AI', TRUE, TRUE, 10000),
    ('00000000-0000-0000-0000-000000000102', 'crypto-warriors', 'Crypto Warriors', 'Bitcoin, Ethereum, and altcoin traders', '⚡', 'Crypto', TRUE, TRUE, 10000),
    ('00000000-0000-0000-0000-000000000103', 'macro-minds', 'Macro Minds', 'Global markets and economic trends', '🌍', 'Economics', TRUE, TRUE, 5000),
    ('00000000-0000-0000-0000-000000000104', 'options-elite', 'Options Elite', 'Advanced options strategies', '🎲', 'Options', TRUE, TRUE, 3000)
ON CONFLICT (id) DO NOTHING;

-- Add demo user to tribes
INSERT INTO tribe_members (tribe_id, user_id, role, rank_position, prediction_accuracy)
VALUES
    ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000002', 'elder', 12, 68.5),
    ('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000002', 'member', 156, 55.2)
ON CONFLICT (tribe_id, user_id) DO NOTHING;

-- ============================================================================
-- SAMPLE PREDICTIONS (for demo user)
-- ============================================================================
INSERT INTO predictions (user_id, tribe_id, symbol, asset_type, direction, prediction_text, confidence, price_at_prediction, is_public)
VALUES
    ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000101', 'NVDA', 'stock', 'bullish', 'NVDA breaks $500 this week. Accumulation complete, ready for next leg up.', 8, 481.50, TRUE),
    ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000102', 'BTC', 'crypto', 'bullish', 'BTC forming ascending triangle. Breakout imminent toward $48K.', 7, 44123.00, TRUE),
    ('00000000-0000-0000-0000-000000000002', NULL, 'SPY', 'index', 'neutral', 'SPX consolidation before next leg up. Watch 4800 support.', 6, 478.50, TRUE)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- DEMO USER PROGRESS
-- ============================================================================

-- Skill progress for demo user
INSERT INTO user_skill_progress (user_id, skill_id, status, xp_earned, completed_at)
VALUES
    ('00000000-0000-0000-0000-000000000002', 'start', 'completed', 0, NOW() - INTERVAL '30 days'),
    ('00000000-0000-0000-0000-000000000002', 'basic-patterns', 'completed', 100, NOW() - INTERVAL '25 days'),
    ('00000000-0000-0000-0000-000000000002', 'volume-basics', 'completed', 100, NOW() - INTERVAL '22 days'),
    ('00000000-0000-0000-0000-000000000002', 'breakouts', 'completed', 200, NOW() - INTERVAL '15 days'),
    ('00000000-0000-0000-0000-000000000002', 'support-resistance', 'completed', 200, NOW() - INTERVAL '12 days'),
    ('00000000-0000-0000-0000-000000000002', 'money-flow', 'available', 0, NULL),
    ('00000000-0000-0000-0000-000000000002', 'crypto-fundamentals', 'completed', 100, NOW() - INTERVAL '20 days'),
    ('00000000-0000-0000-0000-000000000002', 'macro-basics', 'in_progress', 50, NULL)
ON CONFLICT (user_id, skill_id) DO NOTHING;

-- Vocabulary progress for demo user
INSERT INTO user_vocabulary_progress (user_id, term_id, status, correct_count, last_reviewed_at)
SELECT
    '00000000-0000-0000-0000-000000000002',
    id,
    CASE
        WHEN difficulty = 'beginner' THEN 'known'
        WHEN difficulty = 'intermediate' THEN 'learning'
        ELSE 'new'
    END,
    CASE WHEN difficulty = 'beginner' THEN 5 ELSE 0 END,
    CASE WHEN difficulty IN ('beginner', 'intermediate') THEN NOW() - INTERVAL '2 days' ELSE NULL END
FROM vocabulary_terms
ON CONFLICT (user_id, term_id) DO NOTHING;

-- Achievements for demo user
INSERT INTO user_achievements (user_id, achievement_id, unlocked_at)
VALUES
    ('00000000-0000-0000-0000-000000000002', 'consistent', NOW() - INTERVAL '23 days'),
    ('00000000-0000-0000-0000-000000000002', 'eagle-eye', NOW() - INTERVAL '25 days'),
    ('00000000-0000-0000-0000-000000000002', 'tribe-member', NOW() - INTERVAL '18 days'),
    ('00000000-0000-0000-0000-000000000002', 'contrarian', NOW() - INTERVAL '13 days'),
    ('00000000-0000-0000-0000-000000000002', 'first-trade', NOW() - INTERVAL '28 days')
ON CONFLICT (user_id, achievement_id) DO NOTHING;

-- ============================================================================
-- SAMPLE PAPER TRADING DATA
-- ============================================================================

-- Get or create portfolio for demo user
INSERT INTO paper_portfolios (id, user_id, name, initial_balance, current_balance, buying_power, is_primary)
VALUES
    ('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000002', 'Main Portfolio', 100000.00, 101376.50, 94863.00, TRUE)
ON CONFLICT (id) DO NOTHING;

-- Sample positions
INSERT INTO paper_positions (portfolio_id, user_id, symbol, asset_type, side, quantity, entry_price, current_price, stop_loss, take_profit)
VALUES
    ('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000002', 'NVDA', 'stock', 'long', 10, 450.00, 481.50, 430.00, 520.00),
    ('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000002', 'BTC', 'crypto', 'long', 0.5, 42000.00, 44123.00, 40000.00, 50000.00)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SAMPLE WATCHLIST
-- ============================================================================
INSERT INTO watchlists (id, user_id, name, icon, is_primary)
VALUES
    ('00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000002', 'Main Watchlist', '👀', TRUE),
    ('00000000-0000-0000-0000-000000000302', '00000000-0000-0000-0000-000000000002', 'Crypto Watch', '₿', FALSE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO watchlist_items (watchlist_id, symbol, asset_type, notes)
VALUES
    ('00000000-0000-0000-0000-000000000301', 'NVDA', 'stock', 'AI leader, watching for breakout'),
    ('00000000-0000-0000-0000-000000000301', 'AAPL', 'stock', 'Tech bellwether'),
    ('00000000-0000-0000-0000-000000000301', 'MSFT', 'stock', 'Cloud growth play'),
    ('00000000-0000-0000-0000-000000000301', 'SPY', 'etf', 'Market proxy'),
    ('00000000-0000-0000-0000-000000000302', 'BTC', 'crypto', 'Digital gold'),
    ('00000000-0000-0000-0000-000000000302', 'ETH', 'crypto', 'Smart contracts'),
    ('00000000-0000-0000-0000-000000000302', 'SOL', 'crypto', 'High performance L1')
ON CONFLICT (watchlist_id, symbol) DO NOTHING;

-- ============================================================================
-- UPDATE TRIBE STATS
-- ============================================================================
UPDATE tribe_stats
SET
    member_count = (SELECT COUNT(*) FROM tribe_members WHERE tribe_id = tribe_stats.tribe_id),
    active_member_count = (SELECT COUNT(*) FROM tribe_members WHERE tribe_id = tribe_stats.tribe_id AND is_active = TRUE),
    avg_accuracy = (SELECT AVG(prediction_accuracy) FROM tribe_members WHERE tribe_id = tribe_stats.tribe_id),
    last_calculated_at = NOW()
WHERE tribe_id IN (
    '00000000-0000-0000-0000-000000000101',
    '00000000-0000-0000-0000-000000000102',
    '00000000-0000-0000-0000-000000000103',
    '00000000-0000-0000-0000-000000000104'
);

-- Add some mock tribe stats
UPDATE tribe_stats SET member_count = 2847, active_member_count = 1423, avg_accuracy = 68.2 WHERE tribe_id = '00000000-0000-0000-0000-000000000101';
UPDATE tribe_stats SET member_count = 4521, active_member_count = 2156, avg_accuracy = 61.5 WHERE tribe_id = '00000000-0000-0000-0000-000000000102';
UPDATE tribe_stats SET member_count = 1834, active_member_count = 912, avg_accuracy = 72.1 WHERE tribe_id = '00000000-0000-0000-0000-000000000103';
UPDATE tribe_stats SET member_count = 892, active_member_count = 445, avg_accuracy = 75.3 WHERE tribe_id = '00000000-0000-0000-0000-000000000104';

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Run these to verify seed data:
-- SELECT COUNT(*) AS users FROM users;
-- SELECT COUNT(*) AS skill_nodes FROM skill_nodes;
-- SELECT COUNT(*) AS vocabulary_terms FROM vocabulary_terms;
-- SELECT COUNT(*) AS challenges FROM challenge_templates;
-- SELECT COUNT(*) AS achievements FROM achievements;
-- SELECT COUNT(*) AS tribes FROM tribes;
-- SELECT COUNT(*) AS feature_flags FROM feature_flags;
