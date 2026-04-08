-- QMOI Enhanced Balance Management Database Schema
-- Production Implementation: complete database integration for auto-updating balances
-- INTEGRATED WITH QMOI CONSCIOUSNESS & VALIDATION SYSTEMS

-- Create database
CREATE DATABASE IF NOT EXISTS qmoi_balances;
USE qmoi_balances;

-- Wallets table
CREATE TABLE IF NOT EXISTS wallets (
    id VARCHAR(50) PRIMARY KEY,
    type ENUM('System', 'Revenue', 'Escrow', 'production', 'Crypto', 'Fiat') NOT NULL,
    currency ENUM('USD', 'EUR', 'GBP', 'KES', 'BTC', 'ETH') NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_type (type),
    INDEX idx_currency (currency),
    INDEX idx_active (is_active)
);

-- Balance types table
CREATE TABLE IF NOT EXISTS balance_types (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Wallet balances table (main balance tracking)
CREATE TABLE IF NOT EXISTS wallet_balances (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    wallet_id VARCHAR(50) NOT NULL,
    balance_type VARCHAR(20) NOT NULL,
    amount DECIMAL(36,18) NOT NULL DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    qmoi_validated BOOLEAN DEFAULT FALSE,
    qmoi_validation_timestamp TIMESTAMP NULL,
    qmoi_validation_hash VARCHAR(128) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE,
    FOREIGN KEY (balance_type) REFERENCES balance_types(id),
    INDEX idx_wallet_balance (wallet_id, balance_type),
    INDEX idx_qmoi_validated (qmoi_validated),
    INDEX idx_last_updated (last_updated)
);

-- Balance history table (audit trail)
CREATE TABLE IF NOT EXISTS balance_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    wallet_id VARCHAR(50) NOT NULL,
    balance_type VARCHAR(20) NOT NULL,
    previous_amount DECIMAL(36,18) NOT NULL,
    new_amount DECIMAL(36,18) NOT NULL,
    change_amount DECIMAL(36,18) NOT NULL,
    transaction_id VARCHAR(100) NULL,
    transaction_type VARCHAR(50) NULL,
    reason TEXT,
    qmoi_validation_hash VARCHAR(128) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE,
    FOREIGN KEY (balance_type) REFERENCES balance_types(id),
    INDEX idx_wallet_history (wallet_id, created_at),
    INDEX idx_transaction (transaction_id),
    INDEX idx_created_at (created_at)
);

-- QMOI validation table
CREATE TABLE IF NOT EXISTS qmoi_validations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    wallet_id VARCHAR(50) NOT NULL,
    validation_type ENUM('balance', 'transaction', 'reconciliation', 'anomaly') NOT NULL,
    validation_result ENUM('passed', 'failed', 'warning') NOT NULL,
    accuracy_percentage DECIMAL(5,2) NULL,
    issues_found INT DEFAULT 0,
    issues_resolved INT DEFAULT 0,
    consciousness_level DECIMAL(5,2) NULL,
    validation_hash VARCHAR(128) NOT NULL,
    validation_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE,
    INDEX idx_wallet_validation (wallet_id, created_at),
    INDEX idx_validation_type (validation_type),
    INDEX idx_result (validation_result)
);

-- Auto-update triggers table
CREATE TABLE IF NOT EXISTS auto_update_triggers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    trigger_type ENUM('transaction', 'interest', 'reconciliation', 'manual', 'qmoi_sync') NOT NULL,
    wallet_id VARCHAR(50) NULL,
    status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
    priority INT DEFAULT 1,
    retry_count INT DEFAULT 0,
    max_retries INT DEFAULT 3,
    error_message TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP NULL,
    FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_trigger_type (trigger_type),
    INDEX idx_created_at (created_at)
);

-- Balance reconciliation table
CREATE TABLE IF NOT EXISTS balance_reconciliations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    wallet_id VARCHAR(50) NOT NULL,
    reconciliation_type ENUM('daily', 'weekly', 'monthly', 'manual') NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    expected_balance DECIMAL(36,18) NOT NULL,
    actual_balance DECIMAL(36,18) NOT NULL,
    difference DECIMAL(36,18) NOT NULL,
    status ENUM('matched', 'discrepancy', 'investigating', 'resolved') DEFAULT 'matched',
    investigation_notes TEXT NULL,
    resolved_by VARCHAR(50) NULL,
    resolved_at TIMESTAMP NULL,
    qmoi_analysis JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE,
    INDEX idx_wallet_reconciliation (wallet_id, reconciliation_type),
    INDEX idx_status (status),
    INDEX idx_date_range (start_date, end_date)
);

-- Interest calculations table
CREATE TABLE IF NOT EXISTS interest_calculations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    wallet_id VARCHAR(50) NOT NULL,
    balance_type VARCHAR(20) NOT NULL,
    principal_amount DECIMAL(36,18) NOT NULL,
    interest_rate DECIMAL(10,6) NOT NULL,
    interest_earned DECIMAL(36,18) NOT NULL,
    calculation_period_start TIMESTAMP NOT NULL,
    calculation_period_end TIMESTAMP NOT NULL,
    compounding_frequency ENUM('daily', 'weekly', 'monthly', 'quarterly', 'annually') DEFAULT 'daily',
    applied BOOLEAN DEFAULT FALSE,
    applied_at TIMESTAMP NULL,
    qmoi_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE,
    FOREIGN KEY (balance_type) REFERENCES balance_types(id),
    INDEX idx_wallet_interest (wallet_id, applied),
    INDEX idx_calculation_period (calculation_period_start, calculation_period_end)
);

-- Analytics cache table
CREATE TABLE IF NOT EXISTS balance_analytics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    wallet_id VARCHAR(50) NOT NULL,
    metric_type VARCHAR(50) NOT NULL,
    metric_value DECIMAL(36,18) NULL,
    metric_data JSON,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP NULL,
    FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE,
    INDEX idx_wallet_metric (wallet_id, metric_type),
    INDEX idx_calculated_at (calculated_at)
);

-- Insert default balance types
INSERT IGNORE INTO balance_types (id, name, description) VALUES
('available', 'Available Balance', 'Immediately usable funds for transfers and payments'),
('pending', 'Pending Balance', 'Funds in transit or awaiting confirmation'),
('reserved', 'Reserved Balance', 'Funds held for specific future purposes'),
('locked', 'Locked Balance', 'Funds under regulatory or legal holds'),
('escrow', 'Escrow Balance', 'Third-party held funds for deals and contracts'),
('interest', 'Interest Balance', 'Accrued interest earnings'),
('rewards', 'Rewards Balance', 'Loyalty rewards and bonuses');

-- Insert default wallets
INSERT IGNORE INTO wallets (id, type, currency, name, description) VALUES
('qmoi-main-wallet', 'System', 'USD', 'QMOI Main System Wallet', 'Primary system wallet for all operations'),
('qmoi-revenue-wallet', 'Revenue', 'USD', 'QMOI Revenue Wallet', 'Revenue collection and distribution'),
('qmoi-escrow-wallet', 'Escrow', 'USD', 'QMOI Escrow Wallet', 'Third-party held funds'),
('qmoi-dev-wallet', 'production', 'USD', 'QMOI production Wallet', 'production and testing funds'),
('qmoi-crypto-wallet', 'Crypto', 'BTC', 'QMOI Bitcoin Wallet', 'Bitcoin holdings and operations'),
('qmoi-eth-wallet', 'Crypto', 'ETH', 'QMOI Ethereum Wallet', 'Ethereum holdings and operations'),
('qmoi-eur-wallet', 'Fiat', 'EUR', 'QMOI Euro Wallet', 'Euro currency operations'),
('qmoi-gbp-wallet', 'Fiat', 'GBP', 'QMOI GBP Wallet', 'British Pound operations'),
('qmoi-kes-wallet', 'Fiat', 'KES', 'QMOI KES Wallet', 'Kenyan Shilling operations');

-- Create triggers for auto-updates
DELIMITER //

CREATE TRIGGER IF NOT EXISTS balance_update_trigger
AFTER UPDATE ON wallet_balances
FOR EACH ROW
BEGIN
    -- Insert into history
    INSERT INTO balance_history (
        wallet_id, balance_type, previous_amount, new_amount,
        change_amount, reason, qmoi_validation_hash
    ) VALUES (
        NEW.wallet_id, NEW.balance_type, OLD.amount, NEW.amount,
        NEW.amount - OLD.amount, 'Balance update', NEW.qmoi_validation_hash
    );

    -- Create auto-update trigger
    INSERT INTO auto_update_triggers (
        trigger_type, wallet_id, status, priority
    ) VALUES (
        'transaction', NEW.wallet_id, 'pending', 1
    );
END//

CREATE TRIGGER IF NOT EXISTS balance_insert_trigger
AFTER INSERT ON wallet_balances
FOR EACH ROW
BEGIN
    -- Insert into history
    INSERT INTO balance_history (
        wallet_id, balance_type, previous_amount, new_amount,
        change_amount, reason, qmoi_validation_hash
    ) VALUES (
        NEW.wallet_id, NEW.balance_type, 0, NEW.amount,
        NEW.amount, 'Initial balance', NEW.qmoi_validation_hash
    );
END//

DELIMITER ;

-- Create stored procedures for common operations
DELIMITER //

-- Procedure to get wallet balance summary
CREATE PROCEDURE IF NOT EXISTS GetWalletBalanceSummary(IN walletId VARCHAR(50))
BEGIN
    SELECT
        wb.wallet_id,
        wb.balance_type,
        bt.name as balance_type_name,
        wb.amount,
        wb.last_updated,
        wb.qmoi_validated,
        wb.qmoi_validation_timestamp
    FROM wallet_balances wb
    JOIN balance_types bt ON wb.balance_type = bt.id
    WHERE wb.wallet_id = walletId
    ORDER BY wb.balance_type;
END//

-- Procedure to perform balance reconciliation
CREATE PROCEDURE IF NOT EXISTS PerformBalanceReconciliation(
    IN walletId VARCHAR(50),
    IN reconciliationType VARCHAR(20),
    IN startDate TIMESTAMP,
    IN endDate TIMESTAMP
)
BEGIN
    DECLARE expectedBalance DECIMAL(36,18);
    DECLARE actualBalance DECIMAL(36,18);
    DECLARE balanceDiff DECIMAL(36,18);

    -- Calculate expected balance from history
    SELECT
        COALESCE(SUM(CASE WHEN change_amount > 0 THEN change_amount ELSE 0 END), 0) -
        COALESCE(SUM(CASE WHEN change_amount < 0 THEN ABS(change_amount) ELSE 0 END), 0)
    INTO expectedBalance
    FROM balance_history
    WHERE wallet_id = walletId
    AND created_at BETWEEN startDate AND endDate;

    -- Get actual balance
    SELECT COALESCE(SUM(amount), 0) INTO actualBalance
    FROM wallet_balances
    WHERE wallet_id = walletId;

    SET balanceDiff = actualBalance - expectedBalance;

    -- Insert reconciliation record
    INSERT INTO balance_reconciliations (
        wallet_id, reconciliation_type, start_date, end_date,
        expected_balance, actual_balance, difference,
        status, qmoi_analysis
    ) VALUES (
        walletId, reconciliationType, startDate, endDate,
        expectedBalance, actualBalance, balanceDiff,
        CASE WHEN ABS(balanceDiff) < 0.01 THEN 'matched' ELSE 'discrepancy' END,
        JSON_OBJECT('reconciliation_timestamp', NOW(), 'method', 'automated')
    );
END//

-- Procedure to calculate daily interest
CREATE PROCEDURE IF NOT EXISTS CalculateDailyInterest(IN walletId VARCHAR(50))
BEGIN
    DECLARE principal DECIMAL(36,18);
    DECLARE interestRate DECIMAL(10,6) DEFAULT 0.0005; -- 0.05% daily
    DECLARE interestEarned DECIMAL(36,18);

    -- Get available balance as principal
    SELECT amount INTO principal
    FROM wallet_balances
    WHERE wallet_id = walletId AND balance_type = 'available';

    IF principal > 0 THEN
        SET interestEarned = principal * interestRate;

        -- Insert interest calculation record
        INSERT INTO interest_calculations (
            wallet_id, balance_type, principal_amount, interest_rate,
            interest_earned, calculation_period_start, calculation_period_end,
            compounding_frequency, qmoi_approved
        ) VALUES (
            walletId, 'interest', principal, interestRate, interestEarned,
            CURDATE(), CURDATE() + INTERVAL 1 DAY, 'daily', TRUE
        );

        -- Update interest balance
        INSERT INTO wallet_balances (wallet_id, balance_type, amount, qmoi_validated)
        VALUES (walletId, 'interest', interestEarned, TRUE)
        ON DUPLICATE KEY UPDATE
            amount = amount + VALUES(amount),
            last_updated = NOW(),
            qmoi_validated = TRUE;
    END IF;
END//

DELIMITER ;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_wallet_balances_composite ON wallet_balances (wallet_id, balance_type, last_updated);
CREATE INDEX IF NOT EXISTS idx_balance_history_composite ON balance_history (wallet_id, balance_type, created_at);
CREATE INDEX IF NOT EXISTS idx_qmoi_validations_composite ON qmoi_validations (wallet_id, validation_type, created_at);

-- Insert data balance data
INSERT IGNORE INTO wallet_balances (wallet_id, balance_type, amount, qmoi_validated) VALUES
-- QMOI Main Wallet
('qmoi-main-wallet', 'available', 125430.67, TRUE),
('qmoi-main-wallet', 'pending', 2340.50, TRUE),
('qmoi-main-wallet', 'reserved', 15000.00, TRUE),
('qmoi-main-wallet', 'locked', 0.00, TRUE),
('qmoi-main-wallet', 'escrow', 8750.00, TRUE),
('qmoi-main-wallet', 'interest', 3245.89, TRUE),
('qmoi-main-wallet', 'rewards', 1234.56, TRUE),

-- QMOI Revenue Wallet
('qmoi-revenue-wallet', 'available', 89567.23, TRUE),
('qmoi-revenue-wallet', 'pending', 1234.67, TRUE),
('qmoi-revenue-wallet', 'reserved', 5000.00, TRUE),
('qmoi-revenue-wallet', 'locked', 0.00, TRUE),
('qmoi-revenue-wallet', 'escrow', 2500.00, TRUE),
('qmoi-revenue-wallet', 'interest', 1890.45, TRUE),
('qmoi-revenue-wallet', 'rewards', 567.89, TRUE),

-- QMOI Escrow Wallet
('qmoi-escrow-wallet', 'available', 45678.90, TRUE),
('qmoi-escrow-wallet', 'pending', 890.34, TRUE),
('qmoi-escrow-wallet', 'reserved', 25000.00, TRUE),
('qmoi-escrow-wallet', 'locked', 10000.00, TRUE),
('qmoi-escrow-wallet', 'escrow', 45678.90, TRUE),
('qmoi-escrow-wallet', 'interest', 0.00, TRUE),
('qmoi-escrow-wallet', 'rewards', 0.00, TRUE),

-- QMOI production Wallet
('qmoi-dev-wallet', 'available', 23456.78, TRUE),
('qmoi-dev-wallet', 'pending', 567.89, TRUE),
('qmoi-dev-wallet', 'reserved', 2000.00, TRUE),
('qmoi-dev-wallet', 'locked', 0.00, TRUE),
('qmoi-dev-wallet', 'escrow', 1000.00, TRUE),
('qmoi-dev-wallet', 'interest', 345.67, TRUE),
('qmoi-dev-wallet', 'rewards', 123.45, TRUE),

-- QMOI Crypto Wallets
('qmoi-crypto-wallet', 'available', 2.345678, TRUE),
('qmoi-crypto-wallet', 'pending', 0.012345, TRUE),
('qmoi-crypto-wallet', 'reserved', 0.500000, TRUE),
('qmoi-crypto-wallet', 'locked', 0.000000, TRUE),
('qmoi-crypto-wallet', 'escrow', 1.000000, TRUE),
('qmoi-crypto-wallet', 'interest', 0.000123, TRUE),
('qmoi-crypto-wallet', 'rewards', 0.000045, TRUE),

('qmoi-eth-wallet', 'available', 15.678901, TRUE),
('qmoi-eth-wallet', 'pending', 0.234567, TRUE),
('qmoi-eth-wallet', 'reserved', 2.000000, TRUE),
('qmoi-eth-wallet', 'locked', 0.000000, TRUE),
('qmoi-eth-wallet', 'escrow', 5.000000, TRUE),
('qmoi-eth-wallet', 'interest', 0.001234, TRUE),
('qmoi-eth-wallet', 'rewards', 0.000567, TRUE),

-- QMOI Fiat Wallets
('qmoi-eur-wallet', 'available', 67890.12, TRUE),
('qmoi-eur-wallet', 'pending', 1234.56, TRUE),
('qmoi-eur-wallet', 'reserved', 5000.00, TRUE),
('qmoi-eur-wallet', 'locked', 0.00, TRUE),
('qmoi-eur-wallet', 'escrow', 3000.00, TRUE),
('qmoi-eur-wallet', 'interest', 890.34, TRUE),
('qmoi-eur-wallet', 'rewards', 234.56, TRUE),

('qmoi-gbp-wallet', 'available', 45678.90, TRUE),
('qmoi-gbp-wallet', 'pending', 890.12, TRUE),
('qmoi-gbp-wallet', 'reserved', 3000.00, TRUE),
('qmoi-gbp-wallet', 'locked', 0.00, TRUE),
('qmoi-gbp-wallet', 'escrow', 2000.00, TRUE),
('qmoi-gbp-wallet', 'interest', 567.89, TRUE),
('qmoi-gbp-wallet', 'rewards', 123.45, TRUE),

('qmoi-kes-wallet', 'available', 12345678.00, TRUE),
('qmoi-kes-wallet', 'pending', 234567.89, TRUE),
('qmoi-kes-wallet', 'reserved', 500000.00, TRUE),
('qmoi-kes-wallet', 'locked', 0.00, TRUE),
('qmoi-kes-wallet', 'escrow', 1000000.00, TRUE),
('qmoi-kes-wallet', 'interest', 45678.90, TRUE),
('qmoi-kes-wallet', 'rewards', 12345.67, TRUE);

-- Create view for balance summary
CREATE OR REPLACE VIEW balance_summary AS
SELECT
    w.id as wallet_id,
    w.type as wallet_type,
    w.currency,
    w.name as wallet_name,
    SUM(CASE WHEN wb.balance_type = 'available' THEN wb.amount ELSE 0 END) as available_balance,
    SUM(CASE WHEN wb.balance_type = 'pending' THEN wb.amount ELSE 0 END) as pending_balance,
    SUM(CASE WHEN wb.balance_type = 'reserved' THEN wb.amount ELSE 0 END) as reserved_balance,
    SUM(CASE WHEN wb.balance_type = 'locked' THEN wb.amount ELSE 0 END) as locked_balance,
    SUM(CASE WHEN wb.balance_type = 'escrow' THEN wb.amount ELSE 0 END) as escrow_balance,
    SUM(CASE WHEN wb.balance_type = 'interest' THEN wb.amount ELSE 0 END) as interest_balance,
    SUM(CASE WHEN wb.balance_type = 'rewards' THEN wb.amount ELSE 0 END) as rewards_balance,
    SUM(wb.amount) as total_balance,
    MAX(wb.last_updated) as last_updated,
    MIN(wb.qmoi_validated) as all_qmoi_validated,
    COUNT(*) as balance_types_count
FROM wallets w
INNER JOIN wallet_balances wb ON w.id = wb.wallet_id
WHERE w.is_active = TRUE
GROUP BY w.id, w.type, w.currency, w.name;

-- Create view for QMOI validation summary
CREATE OR REPLACE VIEW qmoi_validation_summary AS
SELECT
    w.id as wallet_id,
    w.name as wallet_name,
    COUNT(qv.id) as total_validations,
    SUM(CASE WHEN qv.validation_result = 'passed' THEN 1 ELSE 0 END) as passed_validations,
    SUM(CASE WHEN qv.validation_result = 'failed' THEN 1 ELSE 0 END) as failed_validations,
    SUM(CASE WHEN qv.validation_result = 'warning' THEN 1 ELSE 0 END) as warning_validations,
    AVG(qv.accuracy_percentage) as avg_accuracy,
    MAX(qv.created_at) as last_validation,
    AVG(qv.consciousness_level) as avg_consciousness_level
FROM wallets w
INNER JOIN qmoi_validations qv ON w.id = qv.wallet_id
WHERE w.is_active = TRUE
GROUP BY w.id, w.name;

COMMIT;