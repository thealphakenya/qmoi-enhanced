/// <reference types="node" />
import { networkInterfaces } from 'os';
import crypto from 'crypto';
import { authManager } from '../auth/AuthManager';
import { AssetManagerImpl } from './assets';
import type { AssetManagerImpl as AssetManagerImplType } from './assets';
import { WalletManager, WalletConfig } from './wallet';
import { Trade, TradeExecutionResult, TradeValidationResult, TradeHistory, TradeStatistics } from '../types/trading';
import process from 'process';

interface TradingConfig {
  bitget: {
    apiKey: string;
    secretKey: string;
    passphrase: string;
    bindIp: string;
    tradingEnabled: boolean;
    realTrading: boolean;
    maxTradeAmount: number;
    riskLevel: 'low' | 'medium' | 'high';
    connectionStatus: {
      isConnected: boolean;
      lastCheck: Date;
      retryCount: number;
      lastError?: string;
    };
  };
  trading: {
    strategies: string[];
    activePairs: string[];
    autoTrading: boolean;
    offlineTrading: boolean;
    riskManagement: {
      maxDrawdown: number;
      stopLoss: number;
      takeProfit: number;
    };
    aiTrading: AITradingConfig;
  };
  wallets: WalletConfig;
}

interface AITradingConfig {
  enabled: boolean;
  allowedUsers: string[];
  tradingRules: {
    maxDailyTrades: number;
    maxTradeAmount: number;
    allowedPairs: string[];
  };
}

type Timeout = ReturnType<typeof setTimeout>;

export class TradingManager {
  private static instance: TradingManager;
  private config: TradingConfig;
  private aiTradingConfig: AITradingConfig;
  private tradingHistory: Trade[];
  private assetManager: AssetManagerImplType;
  private walletManager: WalletManager;
  private connectionCheckInterval: Timeout | null = null;

  private constructor() {
    this.config = {
      bitget: {
        apiKey: process.env.BITGET_API_KEY || '',
        secretKey: process.env.BITGET_SECRET_KEY || '',
        passphrase: process.env.BITGET_PASSPHRASE || '',
        bindIp: '192.168.1.100',
        tradingEnabled: false,
        realTrading: false,
        maxTradeAmount: 1000,
        riskLevel: 'medium',
        connectionStatus: {
          isConnected: false,
          lastCheck: new Date(),
          retryCount: 0,
        },
      },
      trading: {
        strategies: ['trend_following', 'mean_reversion', 'breakout'],
        activePairs: ['BTC/USDT', 'ETH/USDT'],
        autoTrading: false,
        offlineTrading: false,
        riskManagement: {
          maxDrawdown: 0.1,
          stopLoss: 0.05,
          takeProfit: 0.1,
        },
        aiTrading: {
          enabled: false,
          allowedUsers: ['sister'],
          tradingRules: {
            maxDailyTrades: 10,
            maxTradeAmount: 100,
            allowedPairs: ['BTC/USDT', 'ETH/USDT'],
          },
        },
      },
      wallets: {
        spot: [
          { currency: 'USDT', balance: 3.84 },
        ],
        futures: [
          { currency: 'BTC', balance: 0.000009 },
        ],
        otc: [
          { currency: 'BTC', balance: 0.000026 },
        ],
      },
    };
    this.aiTradingConfig = this.config.trading.aiTrading;
    this.tradingHistory = [];
    this.assetManager = AssetManagerImpl.getInstance();
    this.walletManager = WalletManager.getInstance();
    this.startConnectionMonitoring();
  }

  public static getInstance(): TradingManager {
    if (!TradingManager.instance) {
      TradingManager.instance = new TradingManager();
    }
    return TradingManager.instance;
  }

  private startConnectionMonitoring(): void {
    // Check connection every 30 seconds
    this.connectionCheckInterval = setInterval(async () => {
      await this.checkAndMaintainConnection();
    }, 30000);
  }

  private async checkAndMaintainConnection(): Promise<void> {
    try {
      const isConnected = await this.connectToBitget();
      this.config.bitget.connectionStatus.isConnected = isConnected;
      this.config.bitget.connectionStatus.lastCheck = new Date();

      if (!isConnected) {
        this.config.bitget.connectionStatus.retryCount++;
        this.config.bitget.connectionStatus.lastError = 'Connection failed';
        
        // Implement automatic recovery
        await this.attemptConnectionRecovery();
      } else {
        this.config.bitget.connectionStatus.retryCount = 0;
        this.config.bitget.connectionStatus.lastError = undefined;
      }
    } catch (error) {
      console.error('Connection check failed:', error);
      this.config.bitget.connectionStatus.lastError = error instanceof Error ? error.message : 'Unknown error';
    }
  }

  private async attemptConnectionRecovery(): Promise<void> {
    // Implement various recovery strategies
    const strategies = [
      this.retryWithBackoff.bind(this),
      this.checkNetworkStatus.bind(this),
      this.verifyCredentials.bind(this),
      this.updateWhitelist.bind(this),
    ];

    for (const strategy of strategies) {
      try {
        await strategy();
        const isConnected = await this.connectToBitget();
        if (isConnected) {
          console.log('Connection recovered successfully');
          return;
        }
      } catch (error) {
        console.error('Recovery strategy failed:', error);
      }
    }
  }

  private async retryWithBackoff(): Promise<void> {
    const maxRetries = 5;
    const baseDelay = 1000;

    for (let i = 0; i < maxRetries; i++) {
      const delay = baseDelay * Math.pow(2, i);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      try {
        await this.connectToBitget();
        return;
      } catch (error) {
        console.error(`Retry ${i + 1} failed:`, error);
      }
    }
  }

  private async checkNetworkStatus(): Promise<void> {
    // Implement network status check
    const interfaces = networkInterfaces();
    let networkAvailable = false;

    for (const name of Object.keys(interfaces)) {
      const iface = interfaces[name];
      if (iface) {
        for (const addr of iface) {
          if (addr.family === 'IPv4' && !addr.internal) {
            networkAvailable = true;
            break;
          }
        }
      }
      if (networkAvailable) break;
    }

    if (!networkAvailable) {
      throw new Error('Network not available');
    }
  }

  private async verifyCredentials(): Promise<void> {
    // Verify Bitget credentials
    if (!this.config.bitget.apiKey || !this.config.bitget.secretKey || !this.config.bitget.passphrase) {
      throw new Error('Missing Bitget credentials');
    }
  }

  private async updateWhitelist(): Promise<void> {
    await this.updateBitgetWhitelist();
  }

  public getBindIp(): string {
    return this.config.bitget.bindIp;
  }

  public async connectToBitget(): Promise<boolean> {
    try {
      const timestamp = Date.now();
      const signature = this.generateSignature(timestamp);

      const response = await fetch('https://api.bitget.com/api/v2/spot/account/assets', {
        method: 'GET',
        headers: {
          'ACCESS-KEY': this.config.bitget.apiKey,
          'ACCESS-SIGN': signature,
          'ACCESS-TIMESTAMP': timestamp.toString(),
          'ACCESS-PASSPHRASE': this.config.bitget.passphrase,
        },
      });

      if (response.ok) {
        await this.updateBitgetWhitelist();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to connect to Bitget:', error);
      return false;
    }
  }

  private generateSignature(timestamp: number): string {
    const message = `${timestamp}GET/api/v2/spot/account/assets`;
    return crypto
      .createHmac('sha256', this.config.bitget.secretKey)
      .update(message)
      .digest('base64');
  }

  private async updateBitgetWhitelist(): Promise<void> {
    try {
      const timestamp = Date.now();
      const signature = this.generateSignature(timestamp);

      await fetch('https://api.bitget.com/api/v2/spot/account/ip-whitelist', {
        method: 'POST',
        headers: {
          'ACCESS-KEY': this.config.bitget.apiKey,
          'ACCESS-SIGN': signature,
          'ACCESS-TIMESTAMP': timestamp.toString(),
          'ACCESS-PASSPHRASE': this.config.bitget.passphrase,
        },
        body: JSON.stringify({
          ip: this.config.bitget.bindIp,
        }),
      });
    } catch (error) {
      console.error('Failed to update Bitget whitelist:', error);
    }
  }

  public async startTrading(sessionId: string): Promise<void> {
    // Check if user has permission
    const user = await authManager.getUser(sessionId);
    if (!user) {
      throw new Error('User not found');
    }

    // Only allow master or authorized sister to trade
    if (user.role !== 'master' && 
        (user.role !== 'sister' || !this.config.trading.aiTrading.allowedUsers.includes(user.id))) {
      throw new Error('Unauthorized to trade');
    }

    if (!this.config.bitget.tradingEnabled) {
      throw new Error('Trading is not enabled');
    }

    if (this.config.bitget.realTrading) {
      await this.connectToBitget();
      this.startTradingStrategies();
    } else {
      this.startPaperTrading();
    }
  }

  private startTradingStrategies(): void {
    this.config.trading.strategies.forEach(strategy => {
      console.log(`Starting strategy: ${strategy}`);
      // Implement strategy execution
    });
  }

  private startPaperTrading(): void {
    console.log('Starting paper trading');
  }

  public async updateWalletBalance(): Promise<void> {
    try {
      const timestamp = Date.now();
      const signature = this.generateSignature(timestamp);

      const response = await fetch('https://api.bitget.com/api/v2/spot/account/assets', {
        method: 'GET',
        headers: {
          'ACCESS-KEY': this.config.bitget.apiKey,
          'ACCESS-SIGN': signature,
          'ACCESS-TIMESTAMP': timestamp.toString(),
          'ACCESS-PASSPHRASE': this.config.bitget.passphrase,
        },
      });

      if (response.ok) {
        const data = await response.json();
        this.updateWalletBalances(data);
      }
    } catch (error) {
      console.error('Failed to update wallet balance:', error);
    }
  }

  private async updateWalletBalances(_data: any): Promise<void> {
    // Bitget wallet update logic removed: WalletConfig does not have a bitget property.
    // If you want to update wallet balances, use walletManager or another appropriate method.
  }

  public getConnectionStatus(): TradingConfig['bitget']['connectionStatus'] {
    return this.config.bitget.connectionStatus;
  }

  public async getWalletBalances(): Promise<{
    currency: string;
    balance: number;
    usdValue: number;
  }[]> {
    return this.walletManager.getBalances();
  }

  public cleanup(): void {
    if (this.connectionCheckInterval) {
      clearInterval(this.connectionCheckInterval);
    }
  }

  public async getAITradingConfig(): Promise<AITradingConfig> {
    return this.aiTradingConfig;
  }

  public async updateAITradingConfig(config: AITradingConfig): Promise<void> {
    this.aiTradingConfig = config;
    this.config.trading.aiTrading = config;
    // Save to persistent storage
    await this.saveConfig();
  }

  public async canUserTrade(userId: string, userRole: string): Promise<boolean> {
    if (userRole === 'master') {
      return true;
    }
    if (userRole === 'sister' && this.aiTradingConfig.enabled) {
      return this.aiTradingConfig.allowedUsers.includes(userId);
    }
    return false;
  }

  public async validateTrade(trade: Omit<Trade, 'id' | 'timestamp' | 'total' | 'profit'>): Promise<TradeValidationResult> {
    const balances = await this.walletManager.getBalances();
    const sourceBalance = balances.find(b => b.currency === trade.sourceCurrency);
    
    if (!sourceBalance) {
      return {
        isValid: false,
        error: 'Source currency not found in wallet',
      };
    }

    if (sourceBalance.balance < trade.amount) {
      return {
        isValid: false,
        error: 'Insufficient balance for trade',
        availableBalance: sourceBalance.balance,
        requiredBalance: trade.amount,
      };
    }

    return {
      isValid: true,
      availableBalance: sourceBalance.balance,
      requiredBalance: trade.amount,
    };
  }

  private async saveConfig(): Promise<void> {
    // Implement config persistence
  }

  public async getTradingHistory(): Promise<Trade[]> {
    // In a real implementation, this would fetch from a database
    return this.tradingHistory;
  }

  private async addTrade(trade: Omit<Trade, 'id' | 'timestamp' | 'total' | 'profit'>): Promise<Trade> {
    const newTrade: Trade = {
      ...trade,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      total: trade.amount * trade.price,
      profit: 0,
    };
    this.tradingHistory.unshift(newTrade);
    return newTrade;
  }

  public async updateTradeStatus(tradeId: string, status: Trade['status'], profit?: number): Promise<void> {
    const trade = this.tradingHistory.find(t => t.id === tradeId);
    if (trade) {
      trade.status = status;
      if (profit !== undefined) {
        trade.profit = profit;
      }
      // In a real implementation, this would update the database
    }
  }

  public async executeTrade(trade: Omit<Trade, 'id' | 'timestamp' | 'total' | 'profit'>): Promise<TradeExecutionResult> {
    try {
      // Validate trade
      const validation = await this.validateTrade(trade);
      if (!validation.isValid) {
        return {
          trade: null,
          success: false,
          error: validation.error,
          timestamp: Date.now(),
        };
      }

      // Execute trade
      const newTrade = await this.addTrade(trade);

      // Update wallet balances
      await this.walletManager.updateBalance(
        trade.sourceType,
        trade.sourceCurrency,
        (validation.availableBalance !== undefined ? validation.availableBalance - trade.amount : 0)
      );

      return {
        trade: newTrade,
        success: true,
        timestamp: Date.now(),
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return {
        trade: null,
        success: false,
        error: errorMessage,
        timestamp: Date.now(),
      };
    }
  }

  public getTradeHistory(): TradeHistory {
    const successfulTrades = this.tradingHistory.filter(t => t.status === 'completed');
    const totalProfit = successfulTrades.reduce((sum, t) => sum + (t.profit ?? 0), 0);

    return {
      trades: this.tradingHistory,
      totalTrades: this.tradingHistory.length,
      successfulTrades: successfulTrades.length,
      failedTrades: this.tradingHistory.filter(t => t.status === 'failed').length,
      totalProfit,
      averageProfit: successfulTrades.length > 0 ? totalProfit / successfulTrades.length : 0,
    };
  }

  public getTradeStatistics(): TradeStatistics {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;
    const oneMonth = 30 * oneDay;

    const trades = this.tradingHistory.filter(t => t.status === 'completed');
    const recentTrades = trades.filter(t => t.timestamp > now - oneDay);
    const weeklyTrades = trades.filter(t => t.timestamp > now - oneWeek);
    const monthlyTrades = trades.filter(t => t.timestamp > now - oneMonth);

    return {
      dailyVolume: recentTrades.reduce((sum, t) => sum + t.total, 0),
      weeklyVolume: weeklyTrades.reduce((sum, t) => sum + t.total, 0),
      monthlyVolume: monthlyTrades.reduce((sum, t) => sum + t.total, 0),
      profitLoss: {
        daily: recentTrades.reduce((sum, t) => sum + (t.profit ?? 0), 0),
        weekly: weeklyTrades.reduce((sum, t) => sum + (t.profit ?? 0), 0),
        monthly: monthlyTrades.reduce((sum, t) => sum + (t.profit ?? 0), 0),
      },
      successRate: trades.length > 0 ? trades.filter(t => t.profit && t.profit > 0).length / trades.length : 0,
      averageTradeSize: trades.length > 0 ? trades.reduce((sum, t) => sum + t.amount, 0) / trades.length : 0,
    };
  }

  public async getProfitOpportunities(): Promise<{
    type: string;
    opportunity: string;
    potentialProfit: number;
    risk: 'low' | 'medium' | 'high';
  }[]> {
    return this.assetManager.getProfitOpportunities();
  }
}

// Export singleton instance
export const tradingManager = TradingManager.getInstance(); 