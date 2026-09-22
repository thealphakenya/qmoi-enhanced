import { TradingStrategy, WalletTransaction } from '../types';

export interface TradingConfig {
  strategies: {
    [key: string]: TradingStrategy;
  };
  riskManagement: {
    maxDrawdown: number;
    positionSize: number;
    stopLoss: number;
    takeProfit: number;
    maxOpenPositions: number;
  };
  execution: {
    orderTypes: ('market' | 'limit' | 'stop')[];
    smartRouting: boolean;
    icebergOrders: boolean;
    twapVwap: boolean;
  };
  monitoring: {
    performanceMetrics: string[];
    alertThresholds: {
      drawdown: number;
      profit: number;
      volatility: number;
    };
  };
}

export const defaultTradingConfig: TradingConfig = {
  strategies: {
    momentum: {
      id: 'momentum',
      name: 'Momentum Strategy',
      type: 'momentum',
      status: 'active',
      performance: {
        winRate: 0,
        profitFactor: 0,
        sharpeRatio: 0,
        totalTrades: 0,
        netProfit: 0
      },
      settings: {
        riskLevel: 'medium',
        maxDrawdown: 0.1,
        positionSize: 0.1,
        stopLoss: 0.02,
        takeProfit: 0.04
      }
    },
    meanReversion: {
      id: 'meanReversion',
      name: 'Mean Reversion Strategy',
      type: 'mean-reversion',
      status: 'active',
      performance: {
        winRate: 0,
        profitFactor: 0,
        sharpeRatio: 0,
        totalTrades: 0,
        netProfit: 0
      },
      settings: {
        riskLevel: 'low',
        maxDrawdown: 0.05,
        positionSize: 0.05,
        stopLoss: 0.01,
        takeProfit: 0.02
      }
    }
  },
  riskManagement: {
    maxDrawdown: 0.15,
    positionSize: 0.1,
    stopLoss: 0.02,
    takeProfit: 0.04,
    maxOpenPositions: 5
  },
  execution: {
    orderTypes: ['limit', 'stop'],
    smartRouting: true,
    icebergOrders: true,
    twapVwap: true
  },
  monitoring: {
    performanceMetrics: [
      'winRate',
      'profitFactor',
      'sharpeRatio',
      'sortinoRatio',
      'maxDrawdown'
    ],
    alertThresholds: {
      drawdown: 0.1,
      profit: 0.2,
      volatility: 0.3
    }
  }
};

export const ADMIN_TOKEN = process.env.ADMIN_TOKEN || generateSecureToken();

function generateSecureToken(): string {
  const array = new Uint32Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
}

export function validateConfig(config: TradingConfig): boolean {
  // Add validation logic here
  return true;
}

export function updateConfig(config: TradingConfig, updates: Partial<TradingConfig>): TradingConfig {
  return {
    ...config,
    ...updates
  };
} 