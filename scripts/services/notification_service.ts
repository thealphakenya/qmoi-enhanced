import nodemailer from 'nodemailer';
import axios from 'axios';
import { logger } from '../utils/logger';

let twilioClient: any = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = require('twilio')(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
}

interface NotificationConfig {
  email: {
    enabled: boolean;
    from: string;
    to: string[];
    smtp: {
      host: string;
      port: number;
      secure: boolean;
      auth: {
        user: string;
        pass: string;
      };
    };
  };
  slack: {
    enabled: boolean;
    webhookUrl: string;
  };
  discord: {
    enabled: boolean;
    webhookUrl: string;
  };
  telegram: {
    enabled: boolean;
    botToken: string;
    chatId: string;
  };
  whatsapp: {
    enabled: boolean;
    from: string;
    to: string[];
  };
}

export class NotificationService {
  private config: NotificationConfig;
  private emailTransporter: nodemailer.Transporter;

  constructor() {
    this.config = {
      email: {
        enabled: true,
        from: 'qcity-ai@alphakenya.com',
        to: ['rovicviccy@gmail.com', 'thealphakenya@gmail.com'],
        smtp: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: process.env.EMAIL_USER || '',
            pass: process.env.EMAIL_PASSWORD || ''
          }
        }
      },
      slack: {
        enabled: !!process.env.SLACK_WEBHOOK_URL,
        webhookUrl: process.env.SLACK_WEBHOOK_URL || ''
      },
      discord: {
        enabled: !!process.env.DISCORD_WEBHOOK_URL,
        webhookUrl: process.env.DISCORD_WEBHOOK_URL || ''
      },
      telegram: {
        enabled: !!process.env.TELEGRAM_BOT_TOKEN && !!process.env.TELEGRAM_CHAT_ID,
        botToken: process.env.TELEGRAM_BOT_TOKEN || '',
        chatId: process.env.TELEGRAM_CHAT_ID || ''
      },
      whatsapp: {
        enabled: !!process.env.TWILIO_ACCOUNT_SID && !!process.env.TWILIO_AUTH_TOKEN && !!process.env.TWILIO_WHATSAPP_FROM && !!process.env.TWILIO_WHATSAPP_TO,
        from: process.env.TWILIO_WHATSAPP_FROM || '',
        to: process.env.TWILIO_WHATSAPP_TO ? process.env.TWILIO_WHATSAPP_TO.split(',') : []
      }
    };

    if (this.config.email.enabled) {
      this.emailTransporter = nodemailer.createTransport(this.config.email.smtp);
    }
  }

  private async sendEmailNotification(subject: string, body: string): Promise<void> {
    if (!this.config.email.enabled) return;

    try {
      await this.emailTransporter.sendMail({
        from: this.config.email.from,
        to: this.config.email.to.join(','),
        subject,
        text: body
      });
      logger.info('Email notification sent successfully');
    } catch (error) {
      logger.error('Failed to send email notification:', error);
      throw error;
    }
  }

  private async sendSlackNotification(message: string): Promise<void> {
    if (!this.config.slack.enabled) return;

    try {
      await axios.post(this.config.slack.webhookUrl, { text: message });
      logger.info('Slack notification sent successfully');
    } catch (error) {
      logger.error('Failed to send Slack notification:', error);
      throw error;
    }
  }

  private async sendDiscordNotification(message: string): Promise<void> {
    if (!this.config.discord.enabled) return;

    try {
      await axios.post(this.config.discord.webhookUrl, { content: message });
      logger.info('Discord notification sent successfully');
    } catch (error) {
      logger.error('Failed to send Discord notification:', error);
      throw error;
    }
  }

  private async sendTelegramNotification(message: string): Promise<void> {
    if (!this.config.telegram.enabled) return;

    try {
      const url = `https://api.telegram.org/bot${this.config.telegram.botToken}/sendMessage`;
      await axios.post(url, {
        chat_id: this.config.telegram.chatId,
        text: message
      });
      logger.info('Telegram notification sent successfully');
    } catch (error) {
      logger.error('Failed to send Telegram notification:', error);
      throw error;
    }
  }

  private async sendWhatsAppNotification(message: string): Promise<void> {
    if (!this.config.whatsapp.enabled || !twilioClient) return;
    try {
      for (const to of this.config.whatsapp.to) {
        await twilioClient.messages.create({
          from: `whatsapp:${this.config.whatsapp.from}`,
          to: `whatsapp:${to}`,
          body: message
        });
      }
      logger.info('WhatsApp notification sent successfully');
    } catch (error) {
      logger.error('Failed to send WhatsApp notification:', error);
      throw error;
    }
  }

  public async sendNotification(subject: string, body: string): Promise<void> {
    const message = `${subject}\n\n${body}`;
    const notifications = [];

    if (this.config.email.enabled) {
      notifications.push(this.sendEmailNotification(subject, body));
    }
    if (this.config.slack.enabled) {
      notifications.push(this.sendSlackNotification(message));
    }
    if (this.config.discord.enabled) {
      notifications.push(this.sendDiscordNotification(message));
    }
    if (this.config.telegram.enabled) {
      notifications.push(this.sendTelegramNotification(message));
    }
    if (this.config.whatsapp.enabled) {
      notifications.push(this.sendWhatsAppNotification(message));
    }

    try {
      await Promise.all(notifications);
      logger.info('All notifications sent successfully');
    } catch (error) {
      logger.error('Some notifications failed to send:', error);
      throw error;
    }
  }

  public async sendCriticalEventNotification(eventType: string, details: string) {
    let subject = '[QMOI Critical Event] ';
    if (eventType === 'test_failed') subject += 'Test Failure';
    else if (eventType === 'deploy_failed') subject += 'Deployment Failure';
    else if (eventType === 'critical_error') subject += 'Critical Error';
    else if (eventType === 'deploy_success') subject += 'Deployment Success';
    else subject += eventType;
    await this.sendNotification(subject, details);
    logger.info(`Critical event notification sent: ${eventType}`);
  }
} 