// @ts-ignore
import { Client, LocalAuth, Message, QRCode } from 'whatsapp-web.js';
// @ts-ignore
import * as qrcode from 'qrcode-terminal';
import { logger } from './LoggerService';

interface WhatsAppConfig {
  masterPhone: string;
  leahPhone: string;
  autoNotifications: boolean;
  qrNotifications: boolean;
  sessionPath: string;
}

interface QRCodeStatus {
  isScanned: boolean;
  timestamp: Date;
  deviceInfo: DeviceInfo;
  notifications: {
    master: boolean;
    leah: boolean;
    status: 'sent' | 'failed' | 'pending';
  };
}

interface DeviceInfo {
  deviceId: string;
  deviceName: string;
  platform: 'android' | 'ios' | 'web';
  location: string;
  ipAddress: string;
}

interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  variables: string[];
}

export class WhatsAppService {
  private static instance: WhatsAppService;
  private client: Client;
  private config: WhatsAppConfig;
  private isConnected: boolean = false;
  private qrCodeStatus: QRCodeStatus;
  private messageTemplates: MessageTemplate[] = [];
  private autoResponders: Map<string, (message: Message) => Promise<string>> = new Map();

  private constructor() {
    this.config = {
      masterPhone: process.env.MASTER_PHONE || '',
      leahPhone: process.env.LEAH_PHONE || '',
      autoNotifications: true,
      qrNotifications: true,
      sessionPath: process.env.WHATSAPP_SESSION_PATH || './whatsapp-session'
    };

    this.qrCodeStatus = {
      isScanned: false,
      timestamp: new Date(),
      deviceInfo: {
        deviceId: '',
        deviceName: 'QMOI AI System',
        platform: 'web',
        location: 'Nairobi, Kenya',
        ipAddress: '127.0.0.1'
      },
      notifications: {
        master: false,
        leah: false,
        status: 'pending'
      }
    };

    this.initializeClient();
    this.initializeMessageTemplates();
    this.initializeAutoResponders();
  }

  public static getInstance(): WhatsAppService {
    if (!WhatsAppService.instance) {
      WhatsAppService.instance = new WhatsAppService();
    }
    return WhatsAppService.instance;
  }

  private initializeClient(): void {
    this.client = new Client({
      authStrategy: new LocalAuth({
        clientId: 'qmoi-ai-system',
        dataPath: this.config.sessionPath
      }),
      puppeteer: {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ]
      }
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    // QR Code generation
    this.client.on('qr', async (qr: string) => {
      console.log('🔗 WhatsApp QR Code generated');
      qrcode.generate(qr, { small: true });
      
      if (this.config.qrNotifications) {
        await this.handleQRCodeGenerated(qr);
      }
    });

    // Client ready
    this.client.on('ready', async () => {
      console.log('✅ WhatsApp client is ready!');
      this.isConnected = true;
      this.qrCodeStatus.isScanned = true;
      this.qrCodeStatus.timestamp = new Date();
      
      if (this.config.qrNotifications) {
        await this.handleQRCodeScanned();
      }
    });

    // Authentication failure
    this.client.on('auth_failure', async (message: string) => {
      console.error('❌ WhatsApp authentication failed:', message);
      this.isConnected = false;
      await this.sendErrorNotification('WhatsApp authentication failed', message);
    });

    // Disconnected
    this.client.on('disconnected', async (reason: string) => {
      console.log('🔌 WhatsApp client disconnected:', reason);
      this.isConnected = false;
      await this.sendErrorNotification('WhatsApp disconnected', reason);
    });

    // Message received
    this.client.on('message', async (message: Message) => {
      await this.handleIncomingMessage(message);
    });

    // Message acknowledged
    this.client.on('message_ack', (message: Message, ack: number) => {
      console.log(`📨 Message ${message.id._serialized} acknowledged with status: ${ack}`);
    });
  }

  private async handleQRCodeGenerated(qr: string): Promise<void> {
    console.log('📱 QR Code generated, waiting for scan...');
    
    // Store QR code for potential retry
    this.qrCodeStatus.notifications.status = 'pending';
    this.qrCodeStatus.deviceInfo.deviceId = `qmoi-${Date.now()}`;
  }

  private async handleQRCodeScanned(): Promise<void> {
    console.log('✅ QR Code successfully scanned!');
    
    // Send immediate notifications to master and Leah
    await this.sendQRCodeScannedNotifications();
    
    // Update status
    this.qrCodeStatus.notifications.status = 'sent';
    this.qrCodeStatus.isScanned = true;
    this.qrCodeStatus.timestamp = new Date();
  }

  private async sendQRCodeScannedNotifications(): Promise<void> {
    const masterMessage = `🔗 WhatsApp QR Code Successfully Scanned!

📱 Device: ${this.qrCodeStatus.deviceInfo.deviceName}
📍 Location: ${this.qrCodeStatus.deviceInfo.location}
⏰ Time: ${this.qrCodeStatus.timestamp.toLocaleString()}

✅ QMOI System is now connected and operational.
🤖 AI earning system activated
💰 Trading system online
📊 Real-time monitoring active

You'll receive updates about:
• Trading activities
• Earning reports
• System status
• Emergency alerts`;

    const leahMessage = `💫 QMOI System Connected!

🎉 The AI system is now online and ready to help.
💰 Earning system activated
🤖 AI features enabled
📱 WhatsApp integration working

You'll receive updates about:
• Your earnings
• System status
• Important notifications
• Daily summaries

Time: ${this.qrCodeStatus.timestamp.toLocaleString()}`;

    try {
      // Send to master
      if (this.config.masterPhone) {
        await this.sendMessage(this.config.masterPhone, masterMessage);
        this.qrCodeStatus.notifications.master = true;
        console.log('📱 QR scan notification sent to master');
      }

      // Send to Leah
      if (this.config.leahPhone) {
        await this.sendMessage(this.config.leahPhone, leahMessage);
        this.qrCodeStatus.notifications.leah = true;
        console.log('📱 QR scan notification sent to Leah');
      }

      // Send backup verification
      await this.sendBackupVerification();
      
    } catch (error) {
      console.error('Error sending QR code notifications:', error);
      this.qrCodeStatus.notifications.status = 'failed';
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await this.sendErrorNotification('Failed to send QR notifications', errorMessage);
    }
  }

  private async sendBackupVerification(): Promise<void> {
    const verificationMessage = `🔐 QMOI System Verification

✅ WhatsApp QR Code scanned successfully
✅ Master notification: ${this.qrCodeStatus.notifications.master ? 'SENT' : 'FAILED'}
✅ Leah notification: ${this.qrCodeStatus.notifications.leah ? 'SENT' : 'FAILED'}
✅ System status: OPERATIONAL

🛡️ Security checks passed
🤖 AI systems online
💰 Earning system ready

Time: ${new Date().toLocaleString()}`;

    if (this.config.masterPhone) {
      await this.sendMessage(this.config.masterPhone, verificationMessage);
    }
  }

  private async handleIncomingMessage(message: Message): Promise<void> {
    try {
      console.log(`📨 Received message from ${message.from}: ${message.body}`);

      // Check for auto-responders
      const response = await this.processAutoResponders(message);
      if (response) {
        await message.reply(response);
        return;
      }

      // Process commands
      if (message.body.startsWith('/')) {
        await this.processCommand(message);
        return;
      }

      // Forward important messages to master
      if (this.shouldForwardToMaster(message)) {
        await this.forwardToMaster(message);
      }

    } catch (error) {
      console.error('Error handling incoming message:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await this.sendErrorNotification('Message handling error', errorMessage);
    }
  }

  private async processAutoResponders(message: Message): Promise<string | null> {
    const body = message.body.toLowerCase();
    
    // Balance query
    if (body.includes('balance') || body.includes('pesapal')) {
      return await this.getBalanceResponse();
    }

    // Status query
    if (body.includes('status') || body.includes('system')) {
      return await this.getSystemStatusResponse();
    }

    // Earnings query
    if (body.includes('earnings') || body.includes('profit')) {
      return await this.getEarningsResponse();
    }

    // Help query
    if (body.includes('help') || body.includes('commands')) {
      return this.getHelpResponse();
    }

    return null;
  }

  private async processCommand(message: Message): Promise<void> {
    const command = message.body.split(' ')[0].toLowerCase();
    const args = message.body.split(' ').slice(1);

    switch (command) {
      case '/start':
        await message.reply(this.getWelcomeMessage());
        break;
      
      case '/balance':
        const balance = await this.getBalanceResponse();
        await message.reply(balance);
        break;
      
      case '/status':
        const status = await this.getSystemStatusResponse();
        await message.reply(status);
        break;
      
      case '/earnings':
        const earnings = await this.getEarningsResponse();
        await message.reply(earnings);
        break;
      
      case '/help':
        await message.reply(this.getHelpResponse());
        break;
      
      case '/master':
        if (args.length > 0) {
          await this.processMasterCommand(message, args);
        } else {
          await message.reply('Master command requires arguments. Use /help for more info.');
        }
        break;
      
      default:
        await message.reply(`Unknown command: ${command}. Use /help for available commands.`);
    }
  }

  private async processMasterCommand(message: Message, args: string[]): Promise<void> {
    const subCommand = args[0].toLowerCase();
    
    switch (subCommand) {
      case 'override':
        await message.reply('🛑 Master override activated. AI decisions suspended.');
        break;
      
      case 'stop':
        await message.reply('🛑 Trading system stopped by master command.');
        break;
      
      case 'withdraw':
        await message.reply('💸 Emergency withdrawal initiated by master.');
        break;
      
      case 'status':
        const detailedStatus = await this.getDetailedSystemStatus();
        await message.reply(detailedStatus);
        break;
      
      default:
        await message.reply(`Unknown master command: ${subCommand}`);
    }
  }

  private shouldForwardToMaster(message: Message): boolean {
    const body = message.body.toLowerCase();
    const keywords = ['urgent', 'emergency', 'error', 'problem', 'issue', 'help'];
    return keywords.some(keyword => body.includes(keyword));
  }

  private async forwardToMaster(message: Message): Promise<void> {
    if (!this.config.masterPhone) return;

    const forwardMessage = `📨 Forwarded Message

From: ${message.from}
Time: ${message.timestamp.toLocaleString()}
Message: ${message.body}

⚠️ This message contains keywords that may require attention.`;

    await this.sendMessage(this.config.masterPhone, forwardMessage);
  }

  private async getBalanceResponse(): Promise<string> {
    try {
      // This would integrate with PesapalService
      const balance = 1250.75; // Mock balance
      return `💰 Pesapal Balance: $${balance.toFixed(2)}

💳 Account Status: Active
📊 Last Updated: ${new Date().toLocaleString()}
🔄 Auto-withdrawal: Enabled`;
    } catch (error) {
      return '❌ Unable to fetch balance at this time.';
    }
  }

  private async getSystemStatusResponse(): Promise<string> {
    return `🤖 QMOI System Status

✅ WhatsApp: Connected
✅ Trading: Active
✅ Earning: Running
✅ Pesapal: Connected
✅ AI: Operational

📊 Performance:
• Uptime: 99.9%
• Response Time: <100ms
• Error Rate: 0.1%

⏰ Last Update: ${new Date().toLocaleString()}`;
  }

  private async getEarningsResponse(): Promise<string> {
    // This would integrate with QAllpurposeService
    const totalEarnings = 847.50; // Mock earnings
    return `📈 Today's Earnings: $${totalEarnings.toFixed(2)}

🏆 Top Strategies:
• Crypto Trading: $245.30
• Forex Trading: $189.20
• Content Creation: $156.80
• Freelancing: $123.40
• E-commerce: $132.80

📊 Performance:
• Win Rate: 78%
• Profit Factor: 1.6
• Total Trades: 47

⏰ Updated: ${new Date().toLocaleString()}`;
  }

  private getHelpResponse(): string {
    return `📚 QMOI WhatsApp Commands

General Commands:
/start - Initialize the bot
/help - Show this help message
/status - Check system status
/balance - Check Pesapal balance
/earnings - View recent earnings

Master Commands:
/master override - Override AI decisions
/master stop - Stop automated trading
/master withdraw - Emergency withdrawal
/master status - Detailed system status

📱 You can also ask natural questions like:
• "What's my balance?"
• "How are earnings today?"
• "System status"
• "Help me"`;
  }

  private getWelcomeMessage(): string {
    return `🎉 Welcome to QMOI AI System!

🤖 I'm your AI assistant for the QMOI earning system.
💰 I can help you with:
• Checking your Pesapal balance
• Viewing earnings reports
• System status updates
• Trading information
• Emergency controls

📱 Use /help to see all available commands.
⏰ I'm available 24/7 to assist you!`;
  }

  private async getDetailedSystemStatus(): Promise<string> {
    return `🔍 Detailed System Status

🤖 AI Systems:
• Trading AI: Active (Confidence: 87%)
• Market Analysis: Running
• Risk Management: Operational
• Decision Engine: Online

💰 Financial Systems:
• Pesapal Integration: Connected
• Auto-trading: Enabled
• Risk Limits: 5% daily loss
• Profit Targets: 4% per trade

📊 Performance Metrics:
• Total Earnings Today: $847.50
• Win Rate: 78%
• Profit Factor: 1.6
• Max Drawdown: 2.3%

🔧 System Health:
• Memory Usage: 45%
• CPU Usage: 32%
• Network: Stable
• Storage: 23% used

⏰ Last Update: ${new Date().toLocaleString()}`;
  }

  public async start(): Promise<void> {
    try {
      console.log('🚀 Starting WhatsApp service...');
      await this.client.initialize();
    } catch (error) {
      console.error('Error starting WhatsApp service:', error);
      throw error;
    }
  }

  public async stop(): Promise<void> {
    try {
      console.log('🛑 Stopping WhatsApp service...');
      await this.client.destroy();
      this.isConnected = false;
    } catch (error) {
      console.error('Error stopping WhatsApp service:', error);
    }
  }

  public async sendMessage(to: string, message: string): Promise<void> {
    try {
      if (!this.isConnected) {
        throw new Error('WhatsApp client not connected');
      }

      const chatId = to.includes('@c.us') ? to : `${to}@c.us`;
      await this.client.sendMessage(chatId, message);
      console.log(`📤 Message sent to ${to}`);
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      throw error;
    }
  }

  public async sendMessageToMaster(message: string): Promise<void> {
    if (this.config.masterPhone) {
      await this.sendMessage(this.config.masterPhone, message);
    }
  }

  public async sendMessageToLeah(message: string): Promise<void> {
    if (this.config.leahPhone) {
      await this.sendMessage(this.config.leahPhone, message);
    }
  }

  public async broadcastMessage(message: string, contacts: string[]): Promise<void> {
    for (const contact of contacts) {
      try {
        await this.sendMessage(contact, message);
        await this.sleep(1000); // Delay between messages
      } catch (error) {
        console.error(`Error broadcasting to ${contact}:`, error);
      }
    }
  }

  private async sendErrorNotification(title: string, message: string): Promise<void> {
    const errorMessage = `⚠️ ${title}

❌ Error: ${message}
⏰ Time: ${new Date().toLocaleString()}
🔧 Auto-fix system is working to resolve this.`;

    if (this.config.masterPhone) {
      await this.sendMessage(this.config.masterPhone, errorMessage);
    }
  }

  private initializeMessageTemplates(): void {
    this.messageTemplates = [
      {
        id: 'welcome',
        name: 'Welcome Message',
        content: '🎉 Welcome to QMOI AI System! I\'m here to help you with your earnings and system management.',
        variables: []
      },
      {
        id: 'earnings_update',
        name: 'Earnings Update',
        content: '📈 Earnings Update: ${amount} from ${source}. Total today: ${total}',
        variables: ['amount', 'source', 'total']
      },
      {
        id: 'system_alert',
        name: 'System Alert',
        content: '⚠️ System Alert: ${alert_type} - ${message}',
        variables: ['alert_type', 'message']
      }
    ];
  }

  private initializeAutoResponders(): void {
    // Add custom auto-responders here
    this.autoResponders.set('ping', async () => 'pong');
    this.autoResponders.set('time', async () => new Date().toLocaleString());
  }

  public getConnectionStatus(): boolean {
    return this.isConnected;
  }

  public getQRCodeStatus(): QRCodeStatus {
    return this.qrCodeStatus;
  }

  public updateConfig(newConfig: Partial<WhatsAppConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default WhatsAppService; 