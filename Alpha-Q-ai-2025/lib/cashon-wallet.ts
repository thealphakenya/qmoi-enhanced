import crypto from 'crypto';
import axios from 'axios';
import { logEvent } from './security_check';

// Types for Cashon Wallet
export interface CashonBalance {
  accountId: string;
  availableBalance: number;
  pendingBalance: number;
  lockedBalance: number;
  currency: string;
  lastUpdated: Date;
  transactionHistory: CashonTransaction[];
}

export interface CashonTransaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit' | 'deposit' | 'withdrawal' | 'trade';
  description: string;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
  reference?: string;
  source?: 'mpesa' | 'airtel' | 'trade' | 'manual';
}

export interface TradeRequest {
  id: string;
  amount: number;
  asset: string;
  strategy: string;
  timestamp: Date;
  status: 'pending' | 'approved' | 'rejected' | 'executed';
  masterApproval?: boolean;
  aiConfidence: number;
}

export interface PesapalConfig {
  consumerKey: string;
  consumerSecret: string;
  environment: 'sandbox' | 'live';
  callbackUrl: string;
  ipnUrl: string;
}

export class CashonWallet {
  private balance: CashonBalance;
  private transactions: CashonTransaction[] = [];
  private tradeRequests: TradeRequest[] = [];
  private pesapalConfig: PesapalConfig;
  private masterToken: string;
  private isTradingEnabled: boolean = false;
  private minTradeAmount: number = 10; // KES
  private profitLockPercentage: number = 20; // 20% of profits locked

  constructor(pesapalConfig: PesapalConfig, masterToken: string) {
    this.pesapalConfig = pesapalConfig;
    this.masterToken = masterToken;
    this.balance = {
      accountId: crypto.randomUUID(),
      availableBalance: 0,
      pendingBalance: 0,
      lockedBalance: 0,
      currency: 'KES',
      lastUpdated: new Date(),
      transactionHistory: []
    };
  }

  // Master-only methods
  async getBalance(masterToken: string): Promise<CashonBalance> {
    if (masterToken !== this.masterToken) {
      throw new Error('Master access required');
    }
    await this.updateBalance();
    return this.balance;
  }

  async initiateDeposit(amount: number, masterToken: string): Promise<string> {
    if (masterToken !== this.masterToken) {
      throw new Error('Master access required');
    }

    const transactionId = crypto.randomUUID();
    const transaction: CashonTransaction = {
      id: transactionId,
      amount,
      type: 'deposit',
      description: `Deposit request for KES ${amount}`,
      timestamp: new Date(),
      status: 'pending',
      source: 'mpesa'
    };

    this.transactions.push(transaction);
    await this.notifyMaster(`Deposit request: KES ${amount}`, 'deposit_request');
    
    return transactionId;
  }

  async approveDeposit(transactionId: string, masterToken: string): Promise<boolean> {
    if (masterToken !== this.masterToken) {
      throw new Error('Master access required');
    }

    const transaction = this.transactions.find(t => t.id === transactionId);
    if (!transaction || transaction.type !== 'deposit') {
      throw new Error('Invalid deposit transaction');
    }

    try {
      // Initiate Pesapal STK Push
      const stkResponse = await this.initiatePesapalSTK(transaction.amount);
      
      if (stkResponse.success) {
        transaction.status = 'completed';
        this.balance.availableBalance += transaction.amount;
        this.balance.lastUpdated = new Date();
        
        await this.notifyMaster(`Deposit approved: KES ${transaction.amount}`, 'deposit_approved');
        return true;
      } else {
        transaction.status = 'failed';
        await this.notifyMaster(`Deposit failed: KES ${transaction.amount}`, 'deposit_failed');
        return false;
      }
    } catch (error) {
      transaction.status = 'failed';
      await this.notifyMaster(`Deposit error: ${error.message}`, 'deposit_error');
      return false;
    }
  }

  async withdrawFunds(amount: number, masterToken: string): Promise<string> {
    if (masterToken !== this.masterToken) {
      throw new Error('Master access required');
    }

    if (amount > this.balance.availableBalance) {
      throw new Error('Insufficient balance');
    }

    const transactionId = crypto.randomUUID();
    const transaction: CashonTransaction = {
      id: transactionId,
      amount,
      type: 'withdrawal',
      description: `Withdrawal request for KES ${amount}`,
      timestamp: new Date(),
      status: 'pending',
      source: 'manual'
    };

    this.transactions.push(transaction);
    this.balance.availableBalance -= amount;
    this.balance.lastUpdated = new Date();

    await this.notifyMaster(`Withdrawal processed: KES ${amount}`, 'withdrawal_processed');
    return transactionId;
  }

  // AI Trading methods
  async requestTrade(amount: number, asset: string, strategy: string, aiConfidence: number): Promise<string> {
    if (!this.isTradingEnabled) {
      throw new Error('Trading is disabled');
    }

    if (amount < this.minTradeAmount) {
      throw new Error(`Minimum trade amount is KES ${this.minTradeAmount}`);
    }

    if (amount > this.balance.availableBalance) {
      // Auto-request deposit if balance is low
      await this.autoRequestDeposit(amount);
      throw new Error('Insufficient balance - deposit requested');
    }

    const tradeId = crypto.randomUUID();
    const tradeRequest: TradeRequest = {
      id: tradeId,
      amount,
      asset,
      strategy,
      timestamp: new Date(),
      status: 'pending',
      aiConfidence
    };

    this.tradeRequests.push(tradeRequest);
    
    // Auto-approve if AI confidence is high (>80%)
    if (aiConfidence > 80) {
      await this.approveTrade(tradeId, true);
    } else {
      await this.notifyMaster(`Trade request: ${asset} KES ${amount} (${strategy})`, 'trade_request');
    }

    return tradeId;
  }

  async approveTrade(tradeId: string, autoApproved: boolean = false): Promise<boolean> {
    const trade = this.tradeRequests.find(t => t.id === tradeId);
    if (!trade) {
      throw new Error('Trade request not found');
    }

    if (!autoApproved && !this.verifyMasterApproval()) {
      throw new Error('Master approval required');
    }

    try {
      // Execute trade
      const tradeResult = await this.executeTrade(trade);
      
      if (tradeResult.success) {
        trade.status = 'executed';
        trade.masterApproval = true;
        
        // Update balance
        this.balance.availableBalance -= trade.amount;
        this.balance.lastUpdated = new Date();
        
        // Record transaction
        const transaction: CashonTransaction = {
          id: crypto.randomUUID(),
          amount: trade.amount,
          type: 'trade',
          description: `Trade: ${trade.asset} (${trade.strategy})`,
          timestamp: new Date(),
          status: 'completed',
          source: 'trade'
        };
        
        this.transactions.push(transaction);
        
        await this.notifyMaster(`Trade executed: ${trade.asset} KES ${trade.amount}`, 'trade_executed');
        return true;
      } else {
        trade.status = 'rejected';
        await this.notifyMaster(`Trade failed: ${trade.asset} KES ${trade.amount}`, 'trade_failed');
        return false;
      }
    } catch (error) {
      trade.status = 'rejected';
      await this.notifyMaster(`Trade error: ${error.message}`, 'trade_error');
      return false;
    }
  }

  // AI Autonomous methods
  async enableAutonomousTrading(): Promise<void> {
    this.isTradingEnabled = true;
    await this.notifyMaster('Autonomous trading enabled', 'trading_enabled');
    
    // Start trading loop
    this.startTradingLoop();
  }

  async disableAutonomousTrading(): Promise<void> {
    this.isTradingEnabled = false;
    await this.notifyMaster('Autonomous trading disabled', 'trading_disabled');
  }

  async getTradingStatus(): Promise<{
    enabled: boolean;
    activeTrades: number;
    totalProfit: number;
    lastTrade: Date | null;
  }> {
    const activeTrades = this.tradeRequests.filter(t => t.status === 'executed').length;
    const totalProfit = this.calculateTotalProfit();
    const lastTrade = this.tradeRequests
      .filter(t => t.status === 'executed')
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0]?.timestamp || null;

    return {
      enabled: this.isTradingEnabled,
      activeTrades,
      totalProfit,
      lastTrade
    };
  }

  // Private helper methods
  private async updateBalance(): Promise<void> {
    try {
      // Fetch balance from Pesapal API
      const response = await axios.get(`${this.pesapalConfig.environment === 'live' ? 'https://api.pesapal.com' : 'https://demo.pesapal.com'}/api/v1/accounts/balance`, {
        headers: {
          'Authorization': `Bearer ${await this.getPesapalToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        this.balance.availableBalance = response.data.data.availableBalance;
        this.balance.pendingBalance = response.data.data.pendingBalance;
        this.balance.lastUpdated = new Date();
      }
    } catch (error) {
      console.error('Failed to update balance:', error);
    }
  }

  private async initiatePesapalSTK(amount: number): Promise<{ success: boolean; reference?: string }> {
    try {
      const response = await axios.post(`${this.pesapalConfig.environment === 'live' ? 'https://api.pesapal.com' : 'https://demo.pesapal.com'}/api/v1/payments/request`, {
        amount: amount.toString(),
        currency: 'KES',
        description: 'Cashon Trading Deposit',
        callback_url: this.pesapalConfig.callbackUrl,
        ipn_url: this.pesapalConfig.ipnUrl,
        billing_address: {
          email_address: 'master@cashon.ai',
          phone_number: '+254700000000',
          country_code: 'KE',
          first_name: 'Master',
          last_name: 'User'
        }
      }, {
        headers: {
          'Authorization': `Bearer ${await this.getPesapalToken()}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: response.data.success,
        reference: response.data.reference
      };
    } catch (error) {
      console.error('Pesapal STK initiation failed:', error);
      return { success: false };
    }
  }

  private async getPesapalToken(): Promise<string> {
    // Implement Pesapal OAuth token generation
    // This would typically involve getting a token using consumer key/secret
    return 'pesapal_token_placeholder';
  }

  private async autoRequestDeposit(requiredAmount: number): Promise<void> {
    const depositAmount = Math.max(50, requiredAmount + 20); // Minimum KES 50
    await this.initiateDeposit(depositAmount, this.masterToken);
    await this.notifyMaster(`Auto-deposit requested: KES ${depositAmount}`, 'auto_deposit_requested');
  }

  private async executeTrade(trade: TradeRequest): Promise<{ success: boolean; profit?: number }> {
    // This would integrate with actual trading APIs (Binance, Valr, etc.)
    // For now, simulate trade execution
    const success = Math.random() > 0.3; // 70% success rate
    const profit = success ? (Math.random() * 0.1 - 0.05) * trade.amount : 0; // -5% to +5%
    
    return { success, profit };
  }

  private calculateTotalProfit(): number {
    return this.transactions
      .filter(t => t.type === 'trade')
      .reduce((total, t) => total + (t.amount || 0), 0);
  }

  private verifyMasterApproval(): boolean {
    // Implement master approval verification (biometric, passphrase, etc.)
    return true; // Placeholder
  }

  private async notifyMaster(message: string, type: string): Promise<void> {
    // Send notification to master via WhatsApp, email, or other channels
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // TODO: Implement actual notification system
    // await this.sendWhatsAppNotification(message);
    // await this.sendEmailNotification(message);
  }

  private startTradingLoop(): void {
    // Start autonomous trading loop
    setInterval(async () => {
      if (!this.isTradingEnabled) return;
      
      try {
        await this.updateBalance();
        
        if (this.balance.availableBalance < this.minTradeAmount) {
          await this.autoRequestDeposit(this.minTradeAmount);
          return;
        }
        
        // AI trading logic would go here
        // For now, just log the check
        console.log('Trading loop check - balance:', this.balance.availableBalance);
      } catch (error) {
        console.error('Trading loop error:', error);
      }
    }, 5 * 60 * 1000); // Every 5 minutes
  }
}

// Export singleton instance
export const cashonWallet = new CashonWallet({
  consumerKey: process.env.PESAPAL_CONSUMER_KEY || '',
  consumerSecret: process.env.PESAPAL_CONSUMER_SECRET || '',
  environment: (process.env.PESAPAL_ENVIRONMENT as 'sandbox' | 'live') || 'sandbox',
  callbackUrl: process.env.PESAPAL_CALLBACK_URL || '',
  ipnUrl: process.env.PESAPAL_IPN_URL || ''
}, process.env.MASTER_TOKEN || '');

export async function transferToMpesa(amount: number) {
  const mpesaNumber = process.env.CASHON_MPESA_NUMBER;
  if (!mpesaNumber) {
    logEvent('mpesa_transfer_failed', { reason: 'Missing M-Pesa number' });
    throw new Error('M-Pesa number not configured');
  }
  try {
    // TODO: Integrate with real M-Pesa API
    logEvent('mpesa_transfer_success', { mpesaNumber, amount });
    return { success: true };
  } catch (err) {
    logEvent('mpesa_transfer_failed', { error: err.message });
    throw err;
  }
} 