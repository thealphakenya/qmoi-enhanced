-- Create MPesa transactions table
CREATE TABLE IF NOT EXISTS mpesa_transactions (
  id SERIAL PRIMARY KEY,
  checkout_request_id VARCHAR(255) NOT NULL UNIQUE,
  merchant_request_id VARCHAR(255) NOT NULL,
  msisdn VARCHAR(20) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  account_reference VARCHAR(255) NOT NULL,
  transaction_desc TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  result_code INTEGER,
  result_desc TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create index for quick lookups
CREATE INDEX idx_mpesa_checkout_request ON mpesa_transactions(checkout_request_id);
CREATE INDEX idx_mpesa_status ON mpesa_transactions(status);

-- Create payments table for all payment methods
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  transaction_id VARCHAR(255) NOT NULL UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create index for payment lookups
CREATE INDEX idx_payments_transaction ON payments(transaction_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created ON payments(created_at);