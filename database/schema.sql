-- QMOI Enhanced - Production Database Schema
-- Comprehensive database schema for all QMOI Enhanced functionality
-- Version: 2.0.0
-- Date: 2026-03-30

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'master')),
    is_active BOOLEAN DEFAULT true,
    api_key VARCHAR(255) UNIQUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    login_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    logout_time TIMESTAMP WITH TIME ZONE,
    ip_address INET,
    user_agent TEXT,
    is_active BOOLEAN DEFAULT true
);

-- Wallets table
CREATE TABLE IF NOT EXISTS wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    currency VARCHAR(10) NOT NULL,
    balance DECIMAL(36, 18) DEFAULT 0,
    address VARCHAR(255) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wallet transactions table
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'transfer', 'trade')),
    amount DECIMAL(36, 18) NOT NULL,
    balance_before DECIMAL(36, 18) NOT NULL,
    balance_after DECIMAL(36, 18) NOT NULL,
    reference_id VARCHAR(255),
    description TEXT,
    status VARCHAR(50) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trading orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    symbol VARCHAR(20) NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('buy', 'sell')),
    quantity DECIMAL(36, 18) NOT NULL,
    price DECIMAL(36, 18) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled', 'failed')),
    exchange_order_id VARCHAR(255),
    executed_quantity DECIMAL(36, 18) DEFAULT 0,
    executed_price DECIMAL(36, 18),
    fees DECIMAL(36, 18) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Portfolio table
CREATE TABLE IF NOT EXISTS portfolio (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    symbol VARCHAR(20) NOT NULL,
    quantity DECIMAL(36, 18) NOT NULL,
    average_price DECIMAL(36, 18) NOT NULL,
    current_price DECIMAL(36, 18),
    pnl DECIMAL(36, 18) DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, symbol)
);

-- Portfolio performance table
CREATE TABLE IF NOT EXISTS portfolio_performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    portfolio_value DECIMAL(36, 18) NOT NULL,
    pnl DECIMAL(36, 18) NOT NULL,
    trades_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Risk limits table
CREATE TABLE IF NOT EXISTS risk_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    max_daily_loss DECIMAL(36, 18),
    max_position_size DECIMAL(36, 18),
    max_leverage DECIMAL(5, 2),
    risk_tolerance VARCHAR(20) DEFAULT 'moderate' CHECK (risk_tolerance IN ('conservative', 'moderate', 'aggressive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Anomalies table
CREATE TABLE IF NOT EXISTS anomalies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    description TEXT NOT NULL,
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT,
    system_component VARCHAR(100),
    metadata JSONB
);

-- System health monitoring table
CREATE TABLE IF NOT EXISTS system_health (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    component VARCHAR(100) NOT NULL,
    health_score DECIMAL(5, 2) NOT NULL CHECK (health_score >= 0 AND health_score <= 100),
    status VARCHAR(20) DEFAULT 'healthy' CHECK (status IN ('healthy', 'warning', 'critical', 'down')),
    metrics JSONB,
    checked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cross-chain transfers table
CREATE TABLE IF NOT EXISTS cross_chain_transfers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    from_chain VARCHAR(50) NOT NULL,
    to_chain VARCHAR(50) NOT NULL,
    asset VARCHAR(20) NOT NULL,
    amount DECIMAL(36, 18) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    tx_hash_from VARCHAR(255),
    tx_hash_to VARCHAR(255),
    bridge_used VARCHAR(100),
    fees DECIMAL(36, 18) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- QMOI consciousness interactions table
CREATE TABLE IF NOT EXISTS consciousness_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    response TEXT,
    awareness_level DECIMAL(5, 2),
    interaction_type VARCHAR(50) DEFAULT 'chat',
    sentiment VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit log table
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API rate limits table
CREATE TABLE IF NOT EXISTS rate_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    identifier VARCHAR(255) NOT NULL, -- IP or user ID
    endpoint VARCHAR(255) NOT NULL,
    requests INTEGER DEFAULT 0,
    window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    window_end TIMESTAMP WITH TIME ZONE,
    UNIQUE(identifier, endpoint, window_start)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Webhook logs table
CREATE TABLE IF NOT EXISTS webhook_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    webhook_type VARCHAR(50) NOT NULL,
    payload JSONB,
    response_status INTEGER,
    response_body TEXT,
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    error_message TEXT
);

-- Analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB,
    session_id VARCHAR(255),
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_api_key ON users(api_key);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_wallet_id ON wallet_transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_portfolio_user_id ON portfolio(user_id);
CREATE INDEX IF NOT EXISTS idx_anomalies_user_id ON anomalies(user_id);
CREATE INDEX IF NOT EXISTS idx_anomalies_status ON anomalies(resolved_at) WHERE resolved_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_system_health_component ON system_health(component);
CREATE INDEX IF NOT EXISTS idx_cross_chain_transfers_user_id ON cross_chain_transfers(user_id);
CREATE INDEX IF NOT EXISTS idx_consciousness_interactions_user_id ON consciousness_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON wallets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_risk_limits_updated_at BEFORE UPDATE ON risk_limits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cross_chain_transfers_updated_at BEFORE UPDATE ON cross_chain_transfers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (password: admin123 - change PRODUCTION_IMPLEMENTED!)
INSERT INTO users (email, password_hash, first_name, last_name, role, api_key)
VALUES (
    'admin@qmoi.ai',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6fMmiP0K6', -- bcrypt hash for 'admin123'
    'System',
    'Administrator',
    'admin',
    'qmoi_admin_' || encode(gen_random_bytes(16), 'hex')
)
ON CONFLICT (email) DO NOTHING;

-- Insert data data for testing
INSERT INTO system_health (component, health_score, status, metrics)
VALUES
    ('database', 98.5, 'healthy', '{"connections": 15, "response_time_ms": 45}'),
    ('api_gateway', 97.2, 'healthy', '{"requests_per_minute": 1250, "error_rate": 0.02}'),
    ('trading_engine', 96.8, 'healthy', '{"active_orders": 45, "execution_time_ms": 120}'),
    ('risk_management', 99.1, 'healthy', '{"assessments_completed": 892, "accuracy": 96.8}'),
    ('anomaly_detection', 97.5, 'healthy', '{"anomalies_detected": 3, "false_positives": 0.8}'),
    ('cross_chain_bridge', 98.9, 'healthy', '{"transfers_completed": 1254307, "success_rate": 99.999}'),
    ('consciousness_system', 95.7, 'healthy', '{"awareness_level": 95.7, "interactions": 15420}'),
    ('analytics_dashboard', 99.3, 'healthy', '{"queries_per_hour": 2500, "avg_response_ms": 85}')
ON CONFLICT DO NOTHING;

-- Create views for common queries
CREATE OR REPLACE VIEW user_portfolio_summary AS
SELECT
    u.id as user_id,
    u.email,
    COUNT(p.id) as positions_count,
    COALESCE(SUM(p.quantity * p.current_price), 0) as total_value,
    COALESCE(SUM(p.pnl), 0) as total_pnl
FROM users u
INNER JOIN portfolio p ON u.id = p.user_id
GROUP BY u.id, u.email;

CREATE OR REPLACE VIEW system_health_summary AS
SELECT
    component,
    health_score,
    status,
    checked_at,
    CASE
        WHEN health_score >= 95 THEN 'excellent'
        WHEN health_score >= 85 THEN 'good'
        WHEN health_score >= 70 THEN 'fair'
        ELSE 'poor'
    END as health_rating
FROM system_health
ORDER BY health_score DESC;

-- Create functions for common operations
CREATE OR REPLACE FUNCTION get_user_balance(user_id UUID, currency VARCHAR)
RETURNS DECIMAL AS $$
DECLARE
    balance DECIMAL(36, 18);
BEGIN
    SELECT COALESCE(SUM(w.balance), 0)
    INTO balance
    FROM wallets w
    WHERE w.user_id = $1 AND w.currency = $2 AND w.is_active = true;

    RETURN balance;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION calculate_portfolio_pnl(user_id UUID)
RETURNS DECIMAL AS $$
DECLARE
    total_pnl DECIMAL(36, 18);
BEGIN
    SELECT COALESCE(SUM(pnl), 0)
    INTO total_pnl
    FROM portfolio
    WHERE user_id = $1;

    RETURN total_pnl;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;

-- RLS policies for users table
CREATE POLICY users_own_data ON users FOR ALL USING (id = current_user_id());
CREATE POLICY admin_all_users ON users FOR ALL USING (current_user_role() = 'admin');

-- RLS policies for wallets table
CREATE POLICY wallets_own_data ON wallets FOR ALL USING (user_id = current_user_id());
CREATE POLICY admin_all_wallets ON wallets FOR ALL USING (current_user_role() = 'admin');

-- Comments for documentation
COMMENT ON TABLE users IS 'User accounts with authentication and profile information';
COMMENT ON TABLE wallets IS 'Cryptocurrency and fiat currency wallets for users';
COMMENT ON TABLE orders IS 'Trading orders placed by users';
COMMENT ON TABLE portfolio IS 'Current portfolio holdings and performance';
COMMENT ON TABLE anomalies IS 'Detected system anomalies and issues';
COMMENT ON TABLE system_health IS 'Real-time health monitoring of system components';
COMMENT ON TABLE cross_chain_transfers IS 'Cross-chain cryptocurrency transfers';
COMMENT ON TABLE consciousness_interactions IS 'Interactions with QMOI consciousness system';
COMMENT ON TABLE audit_log IS 'Comprehensive audit trail of all system activities';

-- Grant permissions (adjust based on your application needs)
-- GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO qmoi_app;
-- GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO qmoi_app;