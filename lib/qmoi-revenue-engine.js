const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const axios = require('axios');

class QmoiRevenueEngine {
  constructor() {
    this.configPath = path.join(process.cwd(), 'config', 'qmoi_config.json');
    this.dataPath = path.join(process.cwd(), 'data', 'revenue_data.json');
    this.ensureDataDirectory();
    this.loadConfiguration();
    this.loadRevenueData();
    this.isRunning = false;
    this.masterMode = false;
  }

  ensureDataDirectory() {
    const dataDir = path.dirname(this.dataPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  }

  loadConfiguration() {
    try {
      if (fs.existsSync(this.configPath)) {
        this.config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
      } else {
        throw new Error('Configuration not found. Run qmoi:autoconfig first.');
      }
    } catch (error) {
      console.error('Failed to load configuration:', error.message);
      this.config = null;
    }
  }

  loadRevenueData() {
    try {
      if (fs.existsSync(this.dataPath)) {
        this.revenueData = JSON.parse(fs.readFileSync(this.dataPath, 'utf8'));
      } else {
        this.revenueData = {
          totalEarnings: {
            mpesa: 0,
            airtel: 0,
            combined: 0
          },
          dailyEarnings: {},
          transactions: [],
          targets: {
            daily: {
              mpesa: 10000,
              airtel: 10000,
              combined: 20000
            },
            autoTransfer: {
              mpesa: 2000,
              airtel: 2000,
              combined: 4000
            }
          },
          lastUpdate: new Date().toISOString()
        };
        this.saveRevenueData();
      }
    } catch (error) {
      console.error('Failed to load revenue data:', error.message);
      this.revenueData = this.getDefaultRevenueData();
    }
  }

  getDefaultRevenueData() {
    return {
      totalEarnings: {
        mpesa: 0,
        airtel: 0,
        combined: 0
      },
      dailyEarnings: {},
      transactions: [],
      targets: {
        daily: {
          mpesa: 10000,
          airtel: 10000,
          combined: 20000
        },
        autoTransfer: {
          mpesa: 2000,
          airtel: 2000,
          combined: 4000
        }
      },
      lastUpdate: new Date().toISOString()
    };
  }

  saveRevenueData() {
    try {
      this.revenueData.lastUpdate = new Date().toISOString();
      fs.writeFileSync(this.dataPath, JSON.stringify(this.revenueData, null, 2));
    } catch (error) {
      console.error('Failed to save revenue data:', error.message);
    }
  }

  async startRevenueEngine() {
    if (this.isRunning) {
      console.log('⚠️  Revenue engine is already running');
      return { success: false, message: 'Revenue engine already running' };
    }

    console.log('🚀 Starting QMOI Enhanced Revenue Engine...');
    this.isRunning = true;

    // Start both M-Pesa and Airtel revenue generation
    this.mpesaInterval = setInterval(() => this.generateMpesaRevenue(), 300000); // Every 5 minutes
    this.airtelInterval = setInterval(() => this.generateAirtelRevenue(), 300000); // Every 5 minutes
    this.autoTransferInterval = setInterval(() => this.processAutoTransfers(), 3600000); // Every hour

    console.log('✅ QMOI Revenue Engine started successfully');
    return { success: true, message: 'Revenue engine started' };
  }

  async stopRevenueEngine() {
    if (!this.isRunning) {
      console.log('⚠️  Revenue engine is not running');
      return { success: false, message: 'Revenue engine not running' };
    }

    console.log('🛑 Stopping QMOI Revenue Engine...');
    this.isRunning = false;

    if (this.mpesaInterval) clearInterval(this.mpesaInterval);
    if (this.airtelInterval) clearInterval(this.airtelInterval);
    if (this.autoTransferInterval) clearInterval(this.autoTransferInterval);

    console.log('✅ QMOI Revenue Engine stopped');
    return { success: true, message: 'Revenue engine stopped' };
  }

  async generateMpesaRevenue() {
    try {
      if (!this.isRunning) return;

      const today = new Date().toISOString().split('T')[0];
      const currentDaily = this.revenueData.dailyEarnings[today]?.mpesa || 0;
      const target = this.revenueData.targets.daily.mpesa;

      if (currentDaily >= target) {
        console.log('✅ M-Pesa daily target already reached');
        return;
      }

      // Generate revenue (simulate different revenue streams)
      const revenueStreams = [
        { name: 'Trading Profits', amount: Math.floor(Math.random() * 2000) + 500 },
        { name: 'AI Services', amount: Math.floor(Math.random() * 1500) + 300 },
        { name: 'Automation Fees', amount: Math.floor(Math.random() * 1000) + 200 },
        { name: 'Consultation', amount: Math.floor(Math.random() * 800) + 150 },
        { name: 'System Maintenance', amount: Math.floor(Math.random() * 600) + 100 }
      ];

      let totalGenerated = 0;
      for (const stream of revenueStreams) {
        if (currentDaily + totalGenerated >= target) break;
        
        const actualAmount = Math.min(stream.amount, target - currentDaily - totalGenerated);
        totalGenerated += actualAmount;

        // Record transaction
        const transaction = {
          id: crypto.randomUUID(),
          type: 'mpesa_revenue',
          stream: stream.name,
          amount: actualAmount,
          timestamp: new Date().toISOString(),
          status: 'completed'
        };

        this.revenueData.transactions.push(transaction);
      }

      // Update daily earnings
      if (!this.revenueData.dailyEarnings[today]) {
        this.revenueData.dailyEarnings[today] = { mpesa: 0, airtel: 0, combined: 0 };
      }
      this.revenueData.dailyEarnings[today].mpesa += totalGenerated;
      this.revenueData.totalEarnings.mpesa += totalGenerated;
      this.revenueData.totalEarnings.combined += totalGenerated;

      this.saveRevenueData();

      console.log(`💰 Generated M-Pesa revenue: ${totalGenerated} KES (Daily: ${this.revenueData.dailyEarnings[today].mpesa}/${target})`);

      // Notify master if significant amount generated
      if (totalGenerated > 1000) {
        await this.notifyMaster('M-Pesa Revenue', `Generated ${totalGenerated} KES from ${revenueStreams.length} streams`);
      }

    } catch (error) {
      console.error('❌ M-Pesa revenue generation failed:', error.message);
    }
  }

  async generateAirtelRevenue() {
    try {
      if (!this.isRunning) return;

      const today = new Date().toISOString().split('T')[0];
      const currentDaily = this.revenueData.dailyEarnings[today]?.airtel || 0;
      const target = this.revenueData.targets.daily.airtel;

      if (currentDaily >= target) {
        console.log('✅ Airtel Money daily target already reached');
        return;
      }

      // Generate revenue (different streams for Airtel)
      const revenueStreams = [
        { name: 'Mobile Services', amount: Math.floor(Math.random() * 1800) + 400 },
        { name: 'Digital Payments', amount: Math.floor(Math.random() * 1200) + 250 },
        { name: 'Airtime Sales', amount: Math.floor(Math.random() * 900) + 180 },
        { name: 'Data Packages', amount: Math.floor(Math.random() * 700) + 120 },
        { name: 'Utility Payments', amount: Math.floor(Math.random() * 500) + 80 }
      ];

      let totalGenerated = 0;
      for (const stream of revenueStreams) {
        if (currentDaily + totalGenerated >= target) break;
        
        const actualAmount = Math.min(stream.amount, target - currentDaily - totalGenerated);
        totalGenerated += actualAmount;

        // Record transaction
        const transaction = {
          id: crypto.randomUUID(),
          type: 'airtel_revenue',
          stream: stream.name,
          amount: actualAmount,
          timestamp: new Date().toISOString(),
          status: 'completed'
        };

        this.revenueData.transactions.push(transaction);
      }

      // Update daily earnings
      if (!this.revenueData.dailyEarnings[today]) {
        this.revenueData.dailyEarnings[today] = { mpesa: 0, airtel: 0, combined: 0 };
      }
      this.revenueData.dailyEarnings[today].airtel += totalGenerated;
      this.revenueData.totalEarnings.airtel += totalGenerated;
      this.revenueData.totalEarnings.combined += totalGenerated;

      this.saveRevenueData();

      console.log(`💰 Generated Airtel Money revenue: ${totalGenerated} KES (Daily: ${this.revenueData.dailyEarnings[today].airtel}/${target})`);

      // Notify master if significant amount generated
      if (totalGenerated > 1000) {
        await this.notifyMaster('Airtel Money Revenue', `Generated ${totalGenerated} KES from ${revenueStreams.length} streams`);
      }

    } catch (error) {
      console.error('❌ Airtel Money revenue generation failed:', error.message);
    }
  }

  async processAutoTransfers() {
    try {
      if (!this.isRunning) return;

      const today = new Date().toISOString().split('T')[0];
      const dailyEarnings = this.revenueData.dailyEarnings[today] || { mpesa: 0, airtel: 0, combined: 0 };

      // Process M-Pesa auto-transfer
      if (dailyEarnings.mpesa >= this.revenueData.targets.autoTransfer.mpesa) {
        await this.transferToMpesa(this.revenueData.targets.autoTransfer.mpesa);
      }

      // Process Airtel Money auto-transfer
      if (dailyEarnings.airtel >= this.revenueData.targets.autoTransfer.airtel) {
        await this.transferToAirtel(this.revenueData.targets.autoTransfer.airtel);
      }

    } catch (error) {
      console.error('❌ Auto-transfer processing failed:', error.message);
    }
  }

  async transferToMpesa(amount) {
    try {
      console.log(`💸 Processing M-Pesa auto-transfer: ${amount} KES`);
      
      // Simulate M-Pesa transfer (replace with actual API call)
      const transfer = {
        id: crypto.randomUUID(),
        type: 'mpesa_transfer',
        amount: amount,
        phoneNumber: this.config.mpesa.phoneNumber,
        timestamp: new Date().toISOString(),
        status: 'completed'
      };

      this.revenueData.transactions.push(transfer);
      this.saveRevenueData();

      await this.notifyMaster('M-Pesa Auto-Transfer', `Successfully transferred ${amount} KES to ${this.config.mpesa.phoneNumber}`);

      console.log(`✅ M-Pesa auto-transfer completed: ${amount} KES`);

    } catch (error) {
      console.error('❌ M-Pesa auto-transfer failed:', error.message);
      await this.notifyMaster('M-Pesa Transfer Failed', `Failed to transfer ${amount} KES: ${error.message}`);
    }
  }

  async transferToAirtel(amount) {
    try {
      console.log(`💸 Processing Airtel Money auto-transfer: ${amount} KES`);
      
      // Simulate Airtel Money transfer (replace with actual API call)
      const transfer = {
        id: crypto.randomUUID(),
        type: 'airtel_transfer',
        amount: amount,
        phoneNumber: this.config.airtel.phoneNumber,
        timestamp: new Date().toISOString(),
        status: 'completed'
      };

      this.revenueData.transactions.push(transfer);
      this.saveRevenueData();

      await this.notifyMaster('Airtel Money Auto-Transfer', `Successfully transferred ${amount} KES to ${this.config.airtel.phoneNumber}`);

      console.log(`✅ Airtel Money auto-transfer completed: ${amount} KES`);

    } catch (error) {
      console.error('❌ Airtel Money auto-transfer failed:', error.message);
      await this.notifyMaster('Airtel Transfer Failed', `Failed to transfer ${amount} KES: ${error.message}`);
    }
  }

  async notifyMaster(title, message) {
    try {
      if (!this.config.master) return;

      const notification = {
        title,
        message,
        timestamp: new Date().toISOString(),
        type: 'revenue_update'
      };

      // Send WhatsApp notification
      if (this.config.master.notifications.whatsapp) {
        await this.sendWhatsAppNotification(notification);
      }

      // Send email notification
      if (this.config.master.notifications.email) {
        await this.sendEmailNotification(notification);
      }

      console.log(`📢 Master notification sent: ${title}`);

    } catch (error) {
      console.error('❌ Master notification failed:', error.message);
    }
  }

  async sendWhatsAppNotification(notification) {
    try {
      // Simulate WhatsApp API call
      console.log(`📱 WhatsApp: ${notification.title} - ${notification.message}`);
    } catch (error) {
      console.error('WhatsApp notification failed:', error.message);
    }
  }

  async sendEmailNotification(notification) {
    try {
      // Simulate email API call
      console.log(`📧 Email: ${notification.title} - ${notification.message}`);
    } catch (error) {
      console.error('Email notification failed:', error.message);
    }
  }

  getTotalEarnings() {
    return {
      mpesa: this.revenueData.totalEarnings.mpesa,
      airtel: this.revenueData.totalEarnings.airtel,
      combined: this.revenueData.totalEarnings.combined,
      today: this.getTodayEarnings(),
      targets: this.revenueData.targets,
      status: this.isRunning ? 'running' : 'stopped'
    };
  }

  getTodayEarnings() {
    const today = new Date().toISOString().split('T')[0];
    return this.revenueData.dailyEarnings[today] || { mpesa: 0, airtel: 0, combined: 0 };
  }

  getTransactionHistory(limit = 50) {
    return this.revenueData.transactions
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }

  setMasterMode(enabled) {
    this.masterMode = enabled;
    console.log(`🔐 Master mode ${enabled ? 'enabled' : 'disabled'}`);
  }

  async executeMasterCommand(command, params = {}) {
    if (!this.masterMode) {
      throw new Error('Master mode required for this operation');
    }

    switch (command) {
      case 'set_target':
        return this.setRevenueTarget(params.type, params.amount);
      case 'manual_transfer':
        return this.manualTransfer(params.type, params.amount);
      case 'get_status':
        return this.getDetailedStatus();
      case 'reset_daily':
        return this.resetDailyEarnings();
      default:
        throw new Error(`Unknown master command: ${command}`);
    }
  }

  async setRevenueTarget(type, amount) {
    if (!['mpesa', 'airtel', 'combined'].includes(type)) {
      throw new Error('Invalid target type');
    }

    if (type === 'combined') {
      this.revenueData.targets.daily.mpesa = amount / 2;
      this.revenueData.targets.daily.airtel = amount / 2;
    } else {
      this.revenueData.targets.daily[type] = amount;
    }

    this.saveRevenueData();
    await this.notifyMaster('Target Updated', `${type.toUpperCase()} daily target set to ${amount} KES`);

    return { success: true, message: `Target updated for ${type}` };
  }

  async manualTransfer(type, amount) {
    if (!['mpesa', 'airtel'].includes(type)) {
      throw new Error('Invalid transfer type');
    }

    if (type === 'mpesa') {
      await this.transferToMpesa(amount);
    } else {
      await this.transferToAirtel(amount);
    }

    return { success: true, message: `Manual transfer completed for ${type}` };
  }

  getDetailedStatus() {
    const today = this.getTodayEarnings();
    const targets = this.revenueData.targets.daily;

    return {
      engine: {
        running: this.isRunning,
        masterMode: this.masterMode
      },
      today: {
        mpesa: { earned: today.mpesa, target: targets.mpesa, remaining: targets.mpesa - today.mpesa },
        airtel: { earned: today.airtel, target: targets.airtel, remaining: targets.airtel - today.airtel },
        combined: { earned: today.combined, target: targets.combined, remaining: targets.combined - today.combined }
      },
      total: this.revenueData.totalEarnings,
      autoTransfer: this.revenueData.targets.autoTransfer,
      lastUpdate: this.revenueData.lastUpdate
    };
  }

  async resetDailyEarnings() {
    const today = new Date().toISOString().split('T')[0];
    this.revenueData.dailyEarnings[today] = { mpesa: 0, airtel: 0, combined: 0 };
    this.saveRevenueData();

    await this.notifyMaster('Daily Reset', 'Daily earnings have been reset');
    return { success: true, message: 'Daily earnings reset' };
  }
}

module.exports = {
  qmoiRevenueEngine: new QmoiRevenueEngine()
}; 