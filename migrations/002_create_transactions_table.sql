-- Migration: Create transactions table for production
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL,
    amount DECIMAL(18, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    type VARCHAR(50), -- 'deposit', 'withdrawal', 'transfer'
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed', 'failed'
    description TEXT,
    external_id VARCHAR(255), -- CashOn transaction ID
    signature VARCHAR(255), -- HMAC signature for verification
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_wallet_id ON transactions(wallet_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX idx_transactions_external_id ON transactions(external_id);
