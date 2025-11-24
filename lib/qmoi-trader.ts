import { cashonWallet, TradeRequest } from './cashon-wallet';
import axios from 'axios';

// Types for Qmoi AI Trading
export interface MarketData {
  symbol: string;
  price: number;
  volume: number;
  change24h: number;
  marketCap: number;
  timestamp: Date;
}

export interface TradingSignal {
  symbol: string;
  action: 'buy' | 'sell' | 'hold';
  confidence: number;
  strategy: string;
  reason: string;
  expectedReturn: number;
  riskLevel: 'low' | 'medium' | 'high';
  timestamp: Date;
}

export interface TradingStrategy {
  id: string;
  name: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  minConfidence: number;
  maxPositionSize: number;
  stopLossPercentage: number;
  takeProfitPercentage: number;
  isActive: boolean;
}

export interface QmoiConfig {
  tradingEnabled: boolean;
  maxConcurrentTrades: number;
  defaultStrategy: string;
  riskTolerance: 'conservative' | 'balanced' | 'aggressive';
  autoRebalance: boolean;
  profitLockPercentage: number;
}

export class QmoiTrader {
  private config: QmoiConfig;
  private strategies: Map<string, TradingStrategy> = new Map();
  private marketData: Map<string, MarketData> = new Map();
  private tradingSignals: TradingSignal[] = [];
  private activeTrades: TradeRequest[] = [];
  private isRunning: boolean = false;
  private tradingLoop: NodeJS.Timeout | null = null;

  constructor(config: QmoiConfig) {
    this.config = config;
    this.initializeStrategies();
  }

  // Initialize trading strategies
  private initializeStrategies(): void {
    const strategies: TradingStrategy[] = [
      {
        id: 'scalping',
        name: 'Scalping',
        description: 'Quick trades with small profits',
        riskLevel: 'high',
        minConfidence: 85,
        maxPositionSize: 0.1, // 10% of available balance
        stopLossPercentage: 2,
        takeProfitPercentage: 3,
        isActive: true
      },
      {
        id: 'trend_following',
        name: 'Trend Following',
        description: 'Follow market trends',
        riskLevel: 'medium',
        minConfidence: 75,
        maxPositionSize: 0.2, // 20% of available balance
        stopLossPercentage: 5,
        takeProfitPercentage: 10,
        isActive: true
      },
      {
        id: 'dca',
        name: 'Dollar Cost Averaging',
        description: 'Regular small investments',
        riskLevel: 'low',
        minConfidence: 60,
        maxPositionSize: 0.05, // 5% of available balance
        stopLossPercentage: 10,
        takeProfitPercentage: 15,
        isActive: true
      },
      {
        id: 'reversal',
        name: 'Reversal Strategy',
        description: 'Trade market reversals',
        riskLevel: 'high',
        minConfidence: 80,
        maxPositionSize: 0.15, // 15% of available balance
        stopLossPercentage: 3,
        takeProfitPercentage: 8,
        isActive: true
      }
    ];

    strategies.forEach(strategy => {
      this.strategies.set(strategy.id, strategy);
    });
  }

  // Start autonomous trading
  async startTrading(): Promise<void> {
    if (this.isRunning) {
      throw new Error('Trading is already running');
    }

    this.isRunning = true;
    await this.enableCashonTrading();
    this.startTradingLoop();
    
    console.log('🧠 QMOI AI Trading started');
  }

  // Stop autonomous trading
  async stopTrading(): Promise<void> {
    if (!this.isRunning) {
      throw new Error('Trading is not running');
    }

    this.isRunning = false;
    if (this.tradingLoop) {
      clearInterval(this.tradingLoop);
      this.tradingLoop = null;
    }
    
    await this.disableCashonTrading();
    console.log('🧠 QMOI AI Trading stopped');
  }

  // Get trading status
  async getStatus(): Promise<{
    isRunning: boolean;
    activeTrades: number;
    totalSignals: number;
    strategies: string[];
    lastSignal: TradingSignal | null;
  }> {
    return {
      isRunning: this.isRunning,
      activeTrades: this.activeTrades.length,
      totalSignals: this.tradingSignals.length,
      strategies: Array.from(this.strategies.keys()),
      lastSignal: this.tradingSignals[this.tradingSignals.length - 1] || null
    };
  }

  // Update market data
  async updateMarketData(): Promise<void> {
    try {
      // Fetch market data from multiple sources
      const symbols = ['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'ADA/USDT', 'SOL/USDT'];
      
      for (const symbol of symbols) {
        const marketData = await this.fetchMarketData(symbol);
        this.marketData.set(symbol, marketData);
      }
      
      console.log(`📊 Updated market data for ${symbols.length} symbols`);
    } catch (error) {
      console.error('Failed to update market data:', error);
    }
  }

  // Generate trading signals
  async generateSignals(): Promise<TradingSignal[]> {
    const signals: TradingSignal[] = [];
    
    for (const [symbol, data] of this.marketData) {
      for (const [strategyId, strategy] of this.strategies) {
        if (!strategy.isActive) continue;
        
        const signal = await this.analyzeSymbol(symbol, data, strategy);
        if (signal && signal.confidence >= strategy.minConfidence) {
          signals.push(signal);
        }
      }
    }
    
    this.tradingSignals.push(...signals);
    return signals;
  }

  // Execute trading signals
  async executeSignals(signals: TradingSignal[]): Promise<void> {
    for (const signal of signals) {
      if (signal.action === 'hold') continue;
      
      try {
        const strategy = this.strategies.get(signal.strategy);
        if (!strategy) continue;
        
        // Calculate position size
        const balance = await this.getAvailableBalance();
        const positionSize = Math.min(
          balance * strategy.maxPositionSize,
          balance * 0.1 // Max 10% per trade
        );
        
        if (positionSize < 10) continue; // Minimum KES 10
        
        // Request trade
        const tradeId = await cashonWallet.requestTrade(
          positionSize,
          signal.symbol,
          signal.strategy,
          signal.confidence
        );
        
        console.log(`🚀 Trade requested: ${signal.symbol} ${signal.action} KES ${positionSize}`);
        
      } catch (error) {
        console.error(`Failed to execute signal for ${signal.symbol}:`, error);
      }
    }
  }

  // Analyze symbol using AI
  private async analyzeSymbol(symbol: string, data: MarketData, strategy: TradingStrategy): Promise<TradingSignal | null> {
    // AI analysis logic
    const analysis = await this.performAIAnalysis(symbol, data, strategy);
    
    if (!analysis) return null;
    
    return {
      symbol,
      action: analysis.action,
      confidence: analysis.confidence,
      strategy: strategy.id,
      reason: analysis.reason,
      expectedReturn: analysis.expectedReturn,
      riskLevel: strategy.riskLevel,
      timestamp: new Date()
    };
  }

  // Perform AI analysis
  private async performAIAnalysis(symbol: string, data: MarketData, strategy: TradingStrategy): Promise<{
    action: 'buy' | 'sell' | 'hold';
    confidence: number;
    reason: string;
    expectedReturn: number;
  } | null> {
    // This would integrate with actual AI models
    // For now, use simplified logic based on market data
    
    const volatility = Math.abs(data.change24h);
    const volume = data.volume;
    const price = data.price;
    
    let action: 'buy' | 'sell' | 'hold' = 'hold';
    let confidence = 50;
    let reason = '';
    let expectedReturn = 0;
    
    // Strategy-specific analysis
    switch (strategy.id) {
      case 'scalping':
        if (volatility > 5 && volume > 1000000) {
          action = data.change24h > 0 ? 'buy' : 'sell';
          confidence = 70 + Math.min(volatility * 2, 20);
          reason = `High volatility (${volatility.toFixed(2)}%) with good volume`;
          expectedReturn = volatility * 0.5;
        }
        break;
        
      case 'trend_following':
        if (Math.abs(data.change24h) > 2) {
          action = data.change24h > 0 ? 'buy' : 'sell';
          confidence = 60 + Math.min(Math.abs(data.change24h) * 5, 30);
          reason = `Strong trend (${data.change24h.toFixed(2)}%)`;
          expectedReturn = Math.abs(data.change24h) * 0.8;
        }
        break;
        
      case 'dca':
        if (data.change24h < -5) {
          action = 'buy';
          confidence = 65;
          reason = 'DCA opportunity on dip';
          expectedReturn = 5;
        }
        break;
        
      case 'reversal':
        if (Math.abs(data.change24h) > 8) {
          action = data.change24h > 0 ? 'sell' : 'buy';
          confidence = 75;
          reason = 'Potential reversal after strong move';
          expectedReturn = Math.abs(data.change24h) * 0.6;
        }
        break;
    }
    
    // Apply risk tolerance adjustments
    if (this.config.riskTolerance === 'conservative') {
      confidence *= 0.8;
      expectedReturn *= 0.7;
    } else if (this.config.riskTolerance === 'aggressive') {
      confidence *= 1.2;
      expectedReturn *= 1.3;
    }
    
    confidence = Math.min(confidence, 95);
    
    return confidence > 60 ? { action, confidence, reason, expectedReturn } : null;
  }

  // Fetch market data from exchange
  private async fetchMarketData(symbol: string): Promise<MarketData> {
    try {
      // This would fetch from actual exchange APIs
      // For now, simulate market data
      const response = await axios.get(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol.replace('/', '')}`);
      
      return {
        symbol,
        price: parseFloat(response.data.lastPrice),
        volume: parseFloat(response.data.volume),
        change24h: parseFloat(response.data.priceChangePercent),
        marketCap: parseFloat(response.data.quoteVolume),
        timestamp: new Date()
      };
    } catch (error) {
      // Fallback to simulated data
      return {
        symbol,
        price: 50000 + Math.random() * 10000,
        volume: 1000000 + Math.random() * 5000000,
        change24h: (Math.random() - 0.5) * 20,
        marketCap: 1000000000 + Math.random() * 5000000000,
        timestamp: new Date()
      };
    }
  }

  // Get available balance from Cashon wallet
  private async getAvailableBalance(): Promise<number> {
    try {
      const balance = await cashonWallet.getBalance(process.env.MASTER_TOKEN || '');
      return balance.availableBalance;
    } catch (error) {
      console.error('Failed to get balance:', error);
      return 0;
    }
  }

  // Enable Cashon trading
  private async enableCashonTrading(): Promise<void> {
    try {
      await cashonWallet.enableAutonomousTrading();
    } catch (error) {
      console.error('Failed to enable Cashon trading:', error);
    }
  }

  // Disable Cashon trading
  private async disableCashonTrading(): Promise<void> {
    try {
      await cashonWallet.disableAutonomousTrading();
    } catch (error) {
      console.error('Failed to disable Cashon trading:', error);
    }
  }

  // Start trading loop
  private startTradingLoop(): void {
    this.tradingLoop = setInterval(async () => {
      if (!this.isRunning) return;
      
      try {
        // Update market data
        await this.updateMarketData();
        
        // Generate signals
        const signals = await this.generateSignals();
        
        // Execute signals
        if (signals.length > 0) {
          await this.executeSignals(signals);
        }
        
        // Log status
        console.log(`🧠 QMOI: Generated ${signals.length} signals`);
        
      } catch (error) {
        console.error('Trading loop error:', error);
      }
    }, 5 * 60 * 1000); // Every 5 minutes
  }

  // Get strategy configuration
  getStrategy(id: string): TradingStrategy | undefined {
    return this.strategies.get(id);
  }

  // Update strategy
  updateStrategy(id: string, updates: Partial<TradingStrategy>): void {
    const strategy = this.strategies.get(id);
    if (strategy) {
      this.strategies.set(id, { ...strategy, ...updates });
    }
  }

  // Get recent signals
  getRecentSignals(limit: number = 10): TradingSignal[] {
    return this.tradingSignals.slice(-limit);
  }

  // Get performance metrics
  async getPerformanceMetrics(): Promise<{
    totalTrades: number;
    successfulTrades: number;
    totalProfit: number;
    averageReturn: number;
    bestTrade: number;
    worstTrade: number;
  }> {
    const trades = this.activeTrades.filter(t => t.status === 'executed');
    const successfulTrades = trades.length;
    const totalProfit = trades.reduce((sum, t) => sum + (t.amount || 0), 0);
    const averageReturn = successfulTrades > 0 ? totalProfit / successfulTrades : 0;
    
    return {
      totalTrades: this.activeTrades.length,
      successfulTrades,
      totalProfit,
      averageReturn,
      bestTrade: Math.max(...trades.map(t => t.amount || 0)),
      worstTrade: Math.min(...trades.map(t => t.amount || 0))
    };
  }
}

// Export singleton instance
export const qmoiTrader = new QmoiTrader({
  tradingEnabled: true,
  maxConcurrentTrades: 5,
  defaultStrategy: 'trend_following',
  riskTolerance: 'balanced',
  autoRebalance: true,
  profitLockPercentage: 20
}); 