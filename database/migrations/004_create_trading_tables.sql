-- ============================================================================
-- Migration 004: Trading Feature Tables
-- Creates: paper_portfolios, paper_positions, paper_position_history,
--          watchlists, watchlist_items
-- ============================================================================

-- ============================================================================
-- PAPER_PORTFOLIOS TABLE
-- Paper trading portfolios
-- ============================================================================
CREATE TABLE IF NOT EXISTS paper_portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL DEFAULT 'Main Portfolio',
    initial_balance DECIMAL(15,2) NOT NULL DEFAULT 100000.00 CHECK (initial_balance > 0),
    current_balance DECIMAL(15,2) NOT NULL DEFAULT 100000.00,
    buying_power DECIMAL(15,2) NOT NULL DEFAULT 100000.00,
    total_value DECIMAL(15,2) NOT NULL DEFAULT 100000.00,
    total_pnl DECIMAL(15,2) DEFAULT 0,
    total_pnl_pct DECIMAL(8,4) DEFAULT 0,
    win_rate DECIMAL(5,2) DEFAULT 0 CHECK (win_rate >= 0 AND win_rate <= 100),
    total_trades INTEGER DEFAULT 0 CHECK (total_trades >= 0),
    winning_trades INTEGER DEFAULT 0 CHECK (winning_trades >= 0),
    is_active BOOLEAN DEFAULT TRUE,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PAPER_POSITIONS TABLE
-- Open paper trading positions
-- ============================================================================
CREATE TABLE IF NOT EXISTS paper_positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID NOT NULL REFERENCES paper_portfolios(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    symbol VARCHAR(20) NOT NULL,
    asset_type VARCHAR(20) NOT NULL CHECK (asset_type IN ('stock', 'crypto', 'etf', 'option')),
    side VARCHAR(10) NOT NULL CHECK (side IN ('long', 'short')),
    quantity DECIMAL(20,8) NOT NULL CHECK (quantity > 0),
    entry_price DECIMAL(20,8) NOT NULL CHECK (entry_price > 0),
    current_price DECIMAL(20,8) NOT NULL CHECK (current_price > 0),
    stop_loss DECIMAL(20,8) CHECK (stop_loss > 0),
    take_profit DECIMAL(20,8) CHECK (take_profit > 0),
    pnl DECIMAL(15,2) DEFAULT 0,
    pnl_pct DECIMAL(8,4) DEFAULT 0,
    notes TEXT,
    opened_at TIMESTAMPTZ DEFAULT NOW(),
    last_price_update TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PAPER_POSITION_HISTORY TABLE
-- Closed paper trading positions
-- ============================================================================
CREATE TABLE IF NOT EXISTS paper_position_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID NOT NULL REFERENCES paper_portfolios(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    symbol VARCHAR(20) NOT NULL,
    asset_type VARCHAR(20) NOT NULL,
    side VARCHAR(10) NOT NULL,
    quantity DECIMAL(20,8) NOT NULL,
    entry_price DECIMAL(20,8) NOT NULL,
    exit_price DECIMAL(20,8) NOT NULL,
    pnl DECIMAL(15,2) NOT NULL,
    pnl_pct DECIMAL(8,4) NOT NULL,
    duration_seconds INTEGER CHECK (duration_seconds >= 0),
    close_reason VARCHAR(50) CHECK (close_reason IN ('manual', 'stop_loss', 'take_profit', 'liquidation', 'expired')),
    notes TEXT,
    opened_at TIMESTAMPTZ NOT NULL,
    closed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- WATCHLISTS TABLE
-- User watchlists
-- ============================================================================
CREATE TABLE IF NOT EXISTS watchlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL DEFAULT 'Main Watchlist',
    description TEXT,
    icon VARCHAR(10) DEFAULT '👀',
    color VARCHAR(20),
    is_primary BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- WATCHLIST_ITEMS TABLE
-- Items in watchlists
-- ============================================================================
CREATE TABLE IF NOT EXISTS watchlist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    watchlist_id UUID NOT NULL REFERENCES watchlists(id) ON DELETE CASCADE,
    symbol VARCHAR(20) NOT NULL,
    asset_type VARCHAR(20) NOT NULL CHECK (asset_type IN ('stock', 'crypto', 'etf', 'index', 'forex')),
    notes TEXT,
    alert_price_above DECIMAL(20,8) CHECK (alert_price_above > 0),
    alert_price_below DECIMAL(20,8) CHECK (alert_price_below > 0),
    alert_enabled BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    added_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(watchlist_id, symbol)
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_paper_portfolios_user_id ON paper_portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_paper_portfolios_is_active ON paper_portfolios(is_active);
CREATE INDEX IF NOT EXISTS idx_paper_portfolios_is_primary ON paper_portfolios(is_primary);

CREATE INDEX IF NOT EXISTS idx_paper_positions_portfolio_id ON paper_positions(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_paper_positions_user_id ON paper_positions(user_id);
CREATE INDEX IF NOT EXISTS idx_paper_positions_symbol ON paper_positions(symbol);
CREATE INDEX IF NOT EXISTS idx_paper_positions_asset_type ON paper_positions(asset_type);

CREATE INDEX IF NOT EXISTS idx_paper_position_history_portfolio_id ON paper_position_history(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_paper_position_history_user_id ON paper_position_history(user_id);
CREATE INDEX IF NOT EXISTS idx_paper_position_history_symbol ON paper_position_history(symbol);
CREATE INDEX IF NOT EXISTS idx_paper_position_history_closed_at ON paper_position_history(closed_at DESC);
CREATE INDEX IF NOT EXISTS idx_paper_position_history_pnl ON paper_position_history(pnl);

CREATE INDEX IF NOT EXISTS idx_watchlists_user_id ON watchlists(user_id);
CREATE INDEX IF NOT EXISTS idx_watchlists_is_primary ON watchlists(is_primary);

CREATE INDEX IF NOT EXISTS idx_watchlist_items_watchlist_id ON watchlist_items(watchlist_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_items_symbol ON watchlist_items(symbol);
CREATE INDEX IF NOT EXISTS idx_watchlist_items_alert_enabled ON watchlist_items(alert_enabled);

-- ============================================================================
-- TRIGGERS
-- ============================================================================
CREATE TRIGGER tr_paper_portfolios_updated_at
    BEFORE UPDATE ON paper_portfolios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_paper_positions_updated_at
    BEFORE UPDATE ON paper_positions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_watchlists_updated_at
    BEFORE UPDATE ON watchlists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_watchlist_items_updated_at
    BEFORE UPDATE ON watchlist_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Calculate position P&L
CREATE OR REPLACE FUNCTION calculate_position_pnl()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.side = 'long' THEN
        NEW.pnl = (NEW.current_price - NEW.entry_price) * NEW.quantity;
    ELSE
        NEW.pnl = (NEW.entry_price - NEW.current_price) * NEW.quantity;
    END IF;
    NEW.pnl_pct = ((NEW.current_price - NEW.entry_price) / NEW.entry_price) * 100;
    IF NEW.side = 'short' THEN
        NEW.pnl_pct = -NEW.pnl_pct;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_calculate_position_pnl
    BEFORE INSERT OR UPDATE ON paper_positions
    FOR EACH ROW EXECUTE FUNCTION calculate_position_pnl();

-- Update portfolio on position close
CREATE OR REPLACE FUNCTION update_portfolio_on_close()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE paper_portfolios
    SET
        total_trades = total_trades + 1,
        winning_trades = winning_trades + CASE WHEN NEW.pnl > 0 THEN 1 ELSE 0 END,
        total_pnl = total_pnl + NEW.pnl,
        current_balance = current_balance + NEW.pnl,
        buying_power = buying_power + (NEW.entry_price * NEW.quantity) + NEW.pnl,
        win_rate = CASE
            WHEN total_trades + 1 > 0 THEN
                ((winning_trades + CASE WHEN NEW.pnl > 0 THEN 1 ELSE 0 END)::DECIMAL / (total_trades + 1)) * 100
            ELSE 0
        END
    WHERE id = NEW.portfolio_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_update_portfolio_on_close
    AFTER INSERT ON paper_position_history
    FOR EACH ROW EXECUTE FUNCTION update_portfolio_on_close();

-- Update portfolio total value
CREATE OR REPLACE FUNCTION update_portfolio_value()
RETURNS TRIGGER AS $$
DECLARE
    positions_value DECIMAL(15,2);
BEGIN
    SELECT COALESCE(SUM(current_price * quantity), 0)
    INTO positions_value
    FROM paper_positions
    WHERE portfolio_id = COALESCE(NEW.portfolio_id, OLD.portfolio_id);

    UPDATE paper_portfolios
    SET
        total_value = current_balance + positions_value,
        total_pnl_pct = CASE
            WHEN initial_balance > 0 THEN
                ((current_balance + positions_value - initial_balance) / initial_balance) * 100
            ELSE 0
        END
    WHERE id = COALESCE(NEW.portfolio_id, OLD.portfolio_id);

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_update_portfolio_value_insert
    AFTER INSERT OR UPDATE OR DELETE ON paper_positions
    FOR EACH ROW EXECUTE FUNCTION update_portfolio_value();

-- Auto-create default portfolio
CREATE OR REPLACE FUNCTION create_default_portfolio()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO paper_portfolios (user_id, name, is_primary)
    VALUES (NEW.id, 'Main Portfolio', TRUE)
    ON CONFLICT DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_create_default_portfolio
    AFTER INSERT ON users
    FOR EACH ROW EXECUTE FUNCTION create_default_portfolio();

-- Auto-create default watchlist
CREATE OR REPLACE FUNCTION create_default_watchlist()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO watchlists (user_id, name, is_primary)
    VALUES (NEW.id, 'Main Watchlist', TRUE)
    ON CONFLICT DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_create_default_watchlist
    AFTER INSERT ON users
    FOR EACH ROW EXECUTE FUNCTION create_default_watchlist();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
ALTER TABLE paper_portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE paper_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE paper_position_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist_items ENABLE ROW LEVEL SECURITY;

-- Paper portfolios: user owns
CREATE POLICY paper_portfolios_own ON paper_portfolios
    FOR ALL USING (user_id = current_setting('app.current_user_id', true)::uuid);

-- Paper positions: user owns
CREATE POLICY paper_positions_own ON paper_positions
    FOR ALL USING (user_id = current_setting('app.current_user_id', true)::uuid);

-- Paper position history: user owns
CREATE POLICY paper_position_history_own ON paper_position_history
    FOR ALL USING (user_id = current_setting('app.current_user_id', true)::uuid);

-- Watchlists: user owns
CREATE POLICY watchlists_own ON watchlists
    FOR ALL USING (user_id = current_setting('app.current_user_id', true)::uuid);

-- Watchlist items: user owns watchlist
CREATE POLICY watchlist_items_own ON watchlist_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM watchlists w
            WHERE w.id = watchlist_items.watchlist_id
            AND w.user_id = current_setting('app.current_user_id', true)::uuid
        )
    );

-- Admin full access
CREATE POLICY admin_paper_portfolios_full ON paper_portfolios
    FOR ALL USING (current_setting('app.current_user_role', true) = 'admin');

CREATE POLICY admin_paper_positions_full ON paper_positions
    FOR ALL USING (current_setting('app.current_user_role', true) = 'admin');

CREATE POLICY admin_paper_position_history_full ON paper_position_history
    FOR ALL USING (current_setting('app.current_user_role', true) = 'admin');

CREATE POLICY admin_watchlists_full ON watchlists
    FOR ALL USING (current_setting('app.current_user_role', true) = 'admin');

CREATE POLICY admin_watchlist_items_full ON watchlist_items
    FOR ALL USING (current_setting('app.current_user_role', true) = 'admin');

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON TABLE paper_portfolios IS 'Paper trading portfolios with balance tracking';
COMMENT ON TABLE paper_positions IS 'Open paper trading positions';
COMMENT ON TABLE paper_position_history IS 'Closed paper trading positions history';
COMMENT ON TABLE watchlists IS 'User watchlists for tracking assets';
COMMENT ON TABLE watchlist_items IS 'Individual items in watchlists';

COMMENT ON COLUMN paper_portfolios.buying_power IS 'Available cash for new positions';
COMMENT ON COLUMN paper_portfolios.total_value IS 'Cash + positions market value';
COMMENT ON COLUMN paper_positions.side IS 'long or short position';
COMMENT ON COLUMN paper_position_history.close_reason IS 'Why position was closed';
COMMENT ON COLUMN watchlist_items.alert_enabled IS 'Whether price alerts are active';
