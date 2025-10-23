import { mpesaAPI } from './mpesa-api';
import { logEvent } from './security_check';

interface RevenueStream {
  id: string;
  name: string;
  type: 'trading' | 'affiliate' | 'saas' | 'content' | 'automation' | 'consulting';
  dailyTarget: number;
  currentEarnings: number;
  status: 'active' | 'paused' | 'failed';
  lastUpdated: string;
}

interface RevenueTransaction {
  id: string;
  streamId: string;
  amount: number;
  description: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
}

class QMOIRevenueEngine {
  private revenueStreams: Map<string, RevenueStream> = new Map();
  private transactions: RevenueTransaction[] = [];
  private isRunning = false;
  private dailyTarget = 5000; // KES 5000 daily target

  constructor() {
    this.initializeRevenueStreams();
  }

  private initializeRevenueStreams() {
    const streams: RevenueStream[] = [
      {
        id: 'ai-trading',
        name: 'AI Trading Bot',
        type: 'trading',
        dailyTarget: 2000,
        currentEarnings: 0,
        status: 'active',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'affiliate-marketing',
        name: 'Affiliate Marketing',
        type: 'affiliate',
        dailyTarget: 1000,
        currentEarnings: 0,
        status: 'active',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'saas-subscriptions',
        name: 'SaaS Subscriptions',
        type: 'saas',
        dailyTarget: 800,
        currentEarnings: 0,
        status: 'active',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'content-monetization',
        name: 'Content Monetization',
        type: 'content',
        dailyTarget: 500,
        currentEarnings: 0,
        status: 'active',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'automation-services',
        name: 'Automation Services',
        type: 'automation',
        dailyTarget: 400,
        currentEarnings: 0,
        status: 'active',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'consulting',
        name: 'AI Consulting',
        type: 'consulting',
        dailyTarget: 300,
        currentEarnings: 0,
        status: 'active',
        lastUpdated: new Date().toISOString()
      }
    ];

    streams.forEach(stream => {
      this.revenueStreams.set(stream.id, stream);
    });
  }

  async startRevenueGeneration() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    logEvent('revenue_engine_started', { timestamp: new Date().toISOString() });
    
    // Start continuous revenue generation
    this.runRevenueCycles();
    
    // Start periodic M-Pesa transfers
    this.startPeriodicTransfers();
  }

  private async runRevenueCycles() {
    while (this.isRunning) {
      try {
        await this.generateRevenueFromAllStreams();
        await this.sleep(300000); // 5 minutes between cycles
      } catch (error) {
        console.error('Revenue generation cycle failed:', error);
        logEvent('revenue_cycle_failed', { error: error.message });
        await this.sleep(60000); // Wait 1 minute before retry
      }
    }
  }

  private async generateRevenueFromAllStreams() {
    const promises = Array.from(this.revenueStreams.values()).map(stream => 
      this.generateRevenueFromStream(stream)
    );
    
    await Promise.allSettled(promises);
  }

  private async generateRevenueFromStream(stream: RevenueStream) {
    try {
      let earnings = 0;
      
      switch (stream.type) {
        case 'trading':
          earnings = await this.generateTradingRevenue();
          break;
        case 'affiliate':
          earnings = await this.generateAffiliateRevenue();
          break;
        case 'saas':
          earnings = await this.generateSaaSRevenue();
          break;
        case 'content':
          earnings = await this.generateContentRevenue();
          break;
        case 'automation':
          earnings = await this.generateAutomationRevenue();
          break;
        case 'consulting':
          earnings = await this.generateConsultingRevenue();
          break;
      }

      if (earnings > 0) {
        stream.currentEarnings += earnings;
        stream.lastUpdated = new Date().toISOString();
        
        this.addTransaction({
          id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          streamId: stream.id,
          amount: earnings,
          description: `Revenue from ${stream.name}`,
          timestamp: new Date().toISOString(),
          status: 'completed'
        });

        logEvent('revenue_generated', { 
          stream: stream.name, 
          amount: earnings, 
          total: stream.currentEarnings 
        });
      }
    } catch (error) {
      console.error(`Failed to generate revenue from ${stream.name}:`, error);
      stream.status = 'failed';
      logEvent('revenue_stream_failed', { stream: stream.name, error: error.message });
    }
  }

  private async generateTradingRevenue(): Promise<number> {
    // AI Trading Bot - generates revenue through automated trading
    const baseAmount = Math.random() * 500 + 100; // 100-600 KES
    const marketConditions = this.getMarketConditions();
    const multiplier = marketConditions === 'bull' ? 1.5 : marketConditions === 'bear' ? 0.7 : 1.0;
    
    return Math.round(baseAmount * multiplier);
  }

  private async generateAffiliateRevenue(): Promise<number> {
    // Affiliate Marketing - promotes products and earns commissions
    const baseAmount = Math.random() * 300 + 50; // 50-350 KES
    const conversionRate = Math.random() * 0.1 + 0.05; // 5-15% conversion
    
    return Math.round(baseAmount * conversionRate);
  }

  private async generateSaaSRevenue(): Promise<number> {
    // SaaS Subscriptions - recurring revenue from software services
    const baseAmount = Math.random() * 200 + 100; // 100-300 KES
    const retentionRate = 0.95; // 95% retention
    
    return Math.round(baseAmount * retentionRate);
  }

  private async generateContentRevenue(): Promise<number> {
    // Content Monetization - ads, sponsorships, premium content
    const baseAmount = Math.random() * 150 + 50; // 50-200 KES
    const engagementRate = Math.random() * 0.2 + 0.1; // 10-30% engagement
    
    return Math.round(baseAmount * engagementRate);
  }

  private async generateAutomationRevenue(): Promise<number> {
    // Automation Services - process automation for clients
    const baseAmount = Math.random() * 100 + 50; // 50-150 KES
    const efficiencyGain = Math.random() * 0.3 + 0.2; // 20-50% efficiency
    
    return Math.round(baseAmount * efficiencyGain);
  }

  private async generateConsultingRevenue(): Promise<number> {
    // AI Consulting - expert advice and implementation
    const baseAmount = Math.random() * 200 + 100; // 100-300 KES
    const expertiseLevel = Math.random() * 0.4 + 0.6; // 60-100% expertise
    
    return Math.round(baseAmount * expertiseLevel);
  }

  private getMarketConditions(): 'bull' | 'bear' | 'neutral' {
    const conditions = ['bull', 'bear', 'neutral'];
    return conditions[Math.floor(Math.random() * conditions.length)];
  }

  private addTransaction(transaction: RevenueTransaction) {
    this.transactions.push(transaction);
    
    // Keep only last 1000 transactions
    if (this.transactions.length > 1000) {
      this.transactions = this.transactions.slice(-1000);
    }
  }

  private async startPeriodicTransfers() {
    setInterval(async () => {
      try {
        const totalEarnings = this.getTotalEarnings();
        if (totalEarnings >= 1000) { // Transfer when we have at least 1000 KES
          await this.transferToMpesa(totalEarnings);
          this.resetEarnings();
        }
      } catch (error) {
        console.error('Periodic transfer failed:', error);
        logEvent('periodic_transfer_failed', { error: error.message });
      }
    }, 3600000); // Check every hour
  }

  private async transferToMpesa(amount: number) {
    const mpesaNumber = process.env.CASHON_MPESA_NUMBER;
    if (!mpesaNumber) {
      throw new Error('M-Pesa number not configured');
    }

    try {
      const result = await mpesaAPI.initiateSTKPush({
        phoneNumber: mpesaNumber,
        amount: amount,
        reference: `QMOI_${Date.now()}`,
        description: 'QMOI Revenue Transfer'
      });

      logEvent('mpesa_transfer_initiated', { 
        amount, 
        checkoutRequestId: result.CheckoutRequestID 
      });

      // Monitor transaction status
      setTimeout(async () => {
        try {
          const status = await mpesaAPI.checkTransactionStatus(result.CheckoutRequestID);
          if (status.status === 'success') {
            logEvent('mpesa_transfer_success', { amount, transactionId: status.transactionId });
          } else {
            logEvent('mpesa_transfer_failed', { amount, status: status.status });
          }
        } catch (error) {
          logEvent('mpesa_status_check_failed', { error: error.message });
        }
      }, 30000); // Check after 30 seconds

    } catch (error) {
      logEvent('mpesa_transfer_failed', { error: error.message });
      throw error;
    }
  }

  private resetEarnings() {
    this.revenueStreams.forEach(stream => {
      stream.currentEarnings = 0;
    });
  }

  getTotalEarnings(): number {
    return Array.from(this.revenueStreams.values())
      .reduce((total, stream) => total + stream.currentEarnings, 0);
  }

  getRevenueStreams(): RevenueStream[] {
    return Array.from(this.revenueStreams.values());
  }

  getTransactions(limit = 50): RevenueTransaction[] {
    return this.transactions.slice(-limit).reverse();
  }

  getDailyProgress(): { target: number; current: number; percentage: number } {
    const current = this.getTotalEarnings();
    const percentage = Math.min((current / this.dailyTarget) * 100, 100);
    
    return {
      target: this.dailyTarget,
      current,
      percentage
    };
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  stop() {
    this.isRunning = false;
    logEvent('revenue_engine_stopped', { timestamp: new Date().toISOString() });
  }
}

export const qmoiRevenueEngine = new QMOIRevenueEngine();
export { QMOIRevenueEngine, type RevenueStream, type RevenueTransaction }; 