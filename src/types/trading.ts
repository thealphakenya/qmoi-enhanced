export interface Trade {
  id: string;
  timestamp: number;
  type: "buy" | "sell";
  pair: string;
  amount: number;
  price: number;
  total: number;
  profit?: number;
  status: "pending" | "completed" | "failed";
  userId: string;
  userRole: string;
  sourceCurrency: string;
  sourceType: "spot" | "futures" | "otc";
}

export interface TradeExecutionResult {
  trade: Trade | null;
  success: boolean;
  error?: string;
  timestamp: number;
}

export interface TradeValidationResult {
  isValid: boolean;
  error?: string;
  availableBalance?: number;
  requiredBalance?: number;
}

export interface TradeHistory {
  trades: Trade[];
  totalTrades: number;
  successfulTrades: number;
  failedTrades: number;
  totalProfit: number;
  averageProfit: number;
}

export interface TradeStatistics {
  dailyVolume: number;
  weeklyVolume: number;
  monthlyVolume: number;
  profitLoss: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  successRate: number;
  averageTradeSize: number;
}

export interface TradePair {
  base: string;
  quote: string;
  minAmount: number;
  maxAmount: number;
  pricePrecision: number;
  amountPrecision: number;
  status: "active" | "inactive" | "maintenance";
}

export interface TradeLimit {
  maxTradeAmount: number;
  minTradeAmount: number;
  maxDailyTrades: number;
  maxOpenPositions: number;
  maxLeverage: number;
}

export interface TradeRisk {
  maxDrawdown: number;
  stopLoss: number;
  takeProfit: number;
  trailingStop?: number;
  riskPerTrade: number;
  maxRiskPerDay: number;
}
