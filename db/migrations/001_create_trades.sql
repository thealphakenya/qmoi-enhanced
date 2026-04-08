CREATE TABLE IF NOT EXISTS trades (
  id SERIAL PRIMARY KEY,
  symbol VARCHAR(20) NOT NULL,
  type VARCHAR(4) NOT NULL CHECK (type IN ('buy', 'sell')),
  amount DECIMAL(18,8) NOT NULL,
  price DECIMAL(18,8) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(10) NOT NULL CHECK (status IN ('completed', 'pending', 'failed', 'cancelled')),
  profit DECIMAL(18,8)
);

CREATE INDEX idx_trades_status ON trades(status);
CREATE INDEX idx_trades_timestamp ON trades(timestamp);
CREATE INDEX idx_trades_symbol ON trades(symbol);

-- Create view for optimized stats
CREATE OR REPLACE VIEW trading_stats AS
SELECT 
  COUNT(*) as total_trades,
  SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as successful_trades,
  SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_trades,
  SUM(CASE WHEN status = 'completed' THEN profit ELSE 0 END) as total_profit,
  ROUND(AVG(CASE WHEN status = 'completed' THEN profit ELSE NULL END)::numeric, 2) as avg_profit,
  ROUND((SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END)::float / COUNT(*)::float * 100)::numeric, 2) as win_rate
FROM trades;