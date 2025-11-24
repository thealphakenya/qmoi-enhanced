export interface Trade {
  id: string;
  strategyId: string;
  pair: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
  profit?: number;
  stopLoss?: number;
  takeProfit?: number;
}

export interface TradingStrategy {
  id: string;
  name: string;
  type: 'momentum' | 'mean-reversion' | 'ml-based' | 'hybrid';
  status: 'active' | 'paused' | 'testing';
  performance: {
    winRate: number;
    profitFactor: number;
    sharpeRatio: number;
    totalTrades: number;
    netProfit: number;
  };
  settings: {
    riskLevel: 'low' | 'medium' | 'high';
    maxDrawdown: number;
    positionSize: number;
    stopLoss: number;
    takeProfit: number;
  };
}

export interface WalletTransaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'trade' | 'transfer';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  details?: string;
  fee?: number;
  balance?: number;
}

export interface TradingStats {
  analytics: {
    totalTrades: number;
    successRate: number;
    totalProfit: number;
    totalLoss: number;
    netProfit: number;
    winCount?: number;
    lossCount?: number;
    confidence?: number;
    pairs?: string[];
  };
  trades: Trade[];
}

export interface TradingPair {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  minQty: number;
  maxQty: number;
  stepSize: number;
  minPrice: number;
  maxPrice: number;
  tickSize: number;
  status: 'active' | 'inactive';
}

export interface OrderBook {
  bids: [number, number][]; // [price, quantity]
  asks: [number, number][]; // [price, quantity]
  timestamp: number;
}

export interface MarketData {
  symbol: string;
  price: number;
  volume: number;
  change24h: number;
  high24h: number;
  low24h: number;
  timestamp: number;
} 