import { logger } from '../utils/logger';
import { NotificationService } from './notification_service';
import axios from 'axios';

interface WhatsAppConfig {
  enabled: boolean;
  phoneNumber: string;
  apiKey: string;
  webhookUrl: string;
  autoReply: boolean;
  allowedContacts: string[];
  messageTemplates: Record<string, string>;
}

interface WhatsAppMessage {
  id: string;
  from: string;
  to: string;
  content: string;
  type: 'text' | 'image' | 'document' | 'audio' | 'video';
  timestamp: number;
  status: 'sent' | 'delivered' | 'read' | 'failed';
}

export class WhatsAppService {
  private config: WhatsAppConfig;
  private messages: WhatsAppMessage[] = [];
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
    this.config = {
      enabled: false,
      phoneNumber: '',
      apiKey: '',
      webhookUrl: '',
      autoReply: false,
      allowedContacts: [],
      messageTemplates: {}
    };
  }

  async initialize(): Promise<void> {
    try {
      logger.info('Initializing WhatsApp service...');
      await this.loadConfig();
      await this.initializeWebhook();
      logger.info('WhatsApp service initialized successfully');
      await this.notificationService.sendNotification(
        'WhatsApp Service',
        'WhatsApp service has been initialized successfully.'
      );
    } catch (error) {
      logger.error('Failed to initialize WhatsApp service:', error);
      throw error;
    }
  }

  private async loadConfig(): Promise<void> {
    try {
      this.config = {
        enabled: process.env.ENABLE_WHATSAPP === 'true',
        phoneNumber: process.env.WHATSAPP_PHONE_NUMBER || '',
        apiKey: process.env.WHATSAPP_API_KEY || '',
        webhookUrl: process.env.WHATSAPP_WEBHOOK_URL || '',
        autoReply: process.env.WHATSAPP_AUTO_REPLY === 'true',
        allowedContacts: (process.env.WHATSAPP_ALLOWED_CONTACTS || '').split(','),
        messageTemplates: JSON.parse(process.env.WHATSAPP_MESSAGE_TEMPLATES || '{}')
      };
      logger.info('WhatsApp configuration loaded successfully');
    } catch (error) {
      logger.error('Failed to load WhatsApp configuration:', error);
      throw error;
    }
  }

  private async initializeWebhook(): Promise<void> {
    try {
      if (!this.config.webhookUrl) {
        logger.warn('No webhook URL configured for WhatsApp service');
        return;
      }

      // Register webhook with WhatsApp API
      await this.registerWebhook();
      logger.info('WhatsApp webhook initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize WhatsApp webhook:', error);
      throw error;
    }
  }

  private async registerWebhook(): Promise<void> {
    logger.info('Registering WhatsApp webhook...');
    // Implementation for webhook registration
  }

  public async sendMessage(to: string, content: string, type: 'text' | 'image' | 'document' | 'audio' | 'video' = 'text'): Promise<WhatsAppMessage> {
    try {
      if (!this.config.enabled) {
        throw new Error('WhatsApp service is not enabled');
      }

      if (!this.config.allowedContacts.includes(to)) {
        throw new Error('Contact not allowed');
      }

      const message: WhatsAppMessage = {
        id: Date.now().toString(),
        from: this.config.phoneNumber,
        to,
        content,
        type,
        timestamp: Date.now(),
        status: 'sent'
      };

      // Send message through WhatsApp API
      await this.sendMessageToAPI(message);

      this.messages.push(message);
      logger.info(`Message sent: ${JSON.stringify(message)}`);

      await this.notificationService.sendNotification(
        'WhatsApp Message Sent',
        `Message sent to ${to}: ${content}`
      );

      return message;
    } catch (error) {
      logger.error('Failed to send WhatsApp message:', error);
      throw error;
    }
  }

  private async sendMessageToAPI(message: WhatsAppMessage): Promise<void> {
    logger.info(`Sending message to API: ${message.id}`);
    // Implementation for sending message to WhatsApp API
  }

  public async handleIncomingMessage(message: WhatsAppMessage): Promise<void> {
    try {
      if (!this.config.enabled) {
        throw new Error('WhatsApp service is not enabled');
      }

      this.messages.push(message);
      logger.info(`Message received: ${JSON.stringify(message)}`);

      if (this.config.autoReply) {
        const template = this.config.messageTemplates[message.type] || this.config.messageTemplates['default'];
        if (template) {
          const reply = template.replace('{sender}', message.from);
          await this.sendMessage(message.from, reply);
        }
      }

      await this.notificationService.sendNotification(
        'WhatsApp Message Received',
        `Message from ${message.from}: ${message.content}`
      );
    } catch (error) {
      logger.error('Failed to handle incoming WhatsApp message:', error);
      throw error;
    }
  }

  public getMessages(): WhatsAppMessage[] {
    return this.messages;
  }

  public getConfig(): WhatsAppConfig {
    return this.config;
  }

  public async updateConfig(newConfig: Partial<WhatsAppConfig>): Promise<void> {
    try {
      this.config = { ...this.config, ...newConfig };
      logger.info('WhatsApp configuration updated successfully');
    } catch (error) {
      logger.error('Failed to update WhatsApp configuration:', error);
      throw error;
    }
  }
} 