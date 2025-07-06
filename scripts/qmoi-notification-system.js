#!/usr/bin/env node

/**
 * QMOI Enhanced Notification System
 * Comprehensive notification system for QMOI with email, Slack, Discord support
 * Auto-testing and detailed reporting capabilities
 */

import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import axios from 'axios';

class QMOINotificationSystem {
  constructor() {
    this.config = {
      email: {
        enabled: process.env.QMOI_EMAIL_ENABLED === 'true',
        host: process.env.QMOI_EMAIL_HOST || 'smtp.gmail.com',
        port: process.env.QMOI_EMAIL_PORT || 587,
        secure: process.env.QMOI_EMAIL_SECURE === 'true',
        user: process.env.QMOI_EMAIL_USER,
        pass: process.env.QMOI_EMAIL_PASS,
        from: process.env.QMOI_EMAIL_FROM || 'qmoi@q-city.ai',
        to: process.env.QMOI_EMAIL_TO?.split(',') || []
      },
      slack: {
        enabled: process.env.QMOI_SLACK_ENABLED === 'true',
        webhook: process.env.QMOI_SLACK_WEBHOOK_URL
      },
      discord: {
        enabled: process.env.QMOI_DISCORD_ENABLED === 'true',
        webhook: process.env.QMOI_DISCORD_WEBHOOK_URL
      },
      telegram: {
        enabled: process.env.QMOI_TELEGRAM_ENABLED === 'true',
        botToken: process.env.QMOI_TELEGRAM_BOT_TOKEN,
        chatId: process.env.QMOI_TELEGRAM_CHAT_ID
      }
    };
    
    this.notificationHistory = [];
    this.testResults = [];
    this.logPath = 'logs/qmoi-notifications.log';
  }

  async initialize() {
    console.log('🔔 Initializing QMOI Notification System...');
    
    // Create logs directory if it doesn't exist
    try {
      await fs.mkdir('logs', { recursive: true });
    } catch (error) {
      // Directory might already exist
    }
    
    // Test all notification channels
    await this.testAllChannels();
    
    console.log('✅ QMOI Notification System initialized');
  }

  async sendNotification(type, title, message, data = {}) {
    const notification = {
      id: crypto.randomUUID(),
      type,
      title,
      message,
      data,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    console.log(`📢 Sending ${type} notification: ${title}`);

    try {
      const results = await Promise.allSettled([
        this.sendEmailNotification(notification),
        this.sendSlackNotification(notification),
        this.sendDiscordNotification(notification),
        this.sendTelegramNotification(notification)
      ]);

      // Update notification status
      const successCount = results.filter(r => r.status === 'fulfilled').length;
      notification.status = successCount > 0 ? 'sent' : 'failed';
      notification.results = results;

      // Log notification
      this.notificationHistory.push(notification);
      await this.logNotification(notification);

      console.log(`✅ Notification sent via ${successCount} channels`);
      return notification;

    } catch (error) {
      notification.status = 'failed';
      notification.error = error.message;
      this.notificationHistory.push(notification);
      await this.logNotification(notification);
      
      console.error(`❌ Notification failed: ${error.message}`);
      return notification;
    }
  }

  async sendEmailNotification(notification) {
    if (!this.config.email.enabled || !this.config.email.user || !this.config.email.pass) {
      return { status: 'skipped', reason: 'Email not configured' };
    }

    try {
      const transporter = nodemailer.createTransporter({
        host: this.config.email.host,
        port: this.config.email.port,
        secure: this.config.email.secure,
        auth: {
          user: this.config.email.user,
          pass: this.config.email.pass
        }
      });

      const htmlContent = this.generateEmailHTML(notification);
      
      const mailOptions = {
        from: this.config.email.from,
        to: this.config.email.to.join(', '),
        subject: `[QMOI] ${notification.title}`,
        html: htmlContent,
        text: notification.message
      };

      const result = await transporter.sendMail(mailOptions);
      return { status: 'sent', messageId: result.messageId };

    } catch (error) {
      return { status: 'failed', error: error.message };
    }
  }

  async sendSlackNotification(notification) {
    if (!this.config.slack.enabled || !this.config.slack.webhook) {
      return { status: 'skipped', reason: 'Slack not configured' };
    }

    try {
      const slackMessage = {
        text: `*[QMOI] ${notification.title}*`,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*${notification.title}*\n${notification.message}`
            }
          },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: `🕐 ${new Date(notification.timestamp).toLocaleString()}`
              }
            ]
          }
        ]
      };

      if (notification.data.details) {
        slackMessage.blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Details:*\n\`\`\`${JSON.stringify(notification.data.details, null, 2)}\`\`\``
          }
        });
      }

      const response = await axios.post(this.config.slack.webhook, slackMessage);
      return { status: 'sent', response: response.status };

    } catch (error) {
      return { status: 'failed', error: error.message };
    }
  }

  async sendDiscordNotification(notification) {
    if (!this.config.discord.enabled || !this.config.discord.webhook) {
      return { status: 'skipped', reason: 'Discord not configured' };
    }

    try {
      const discordMessage = {
        embeds: [
          {
            title: `[QMOI] ${notification.title}`,
            description: notification.message,
            color: this.getNotificationColor(notification.type),
            timestamp: notification.timestamp,
            fields: []
          }
        ]
      };

      if (notification.data.details) {
        discordMessage.embeds[0].fields.push({
          name: 'Details',
          value: `\`\`\`json\n${JSON.stringify(notification.data.details, null, 2)}\n\`\`\``,
          inline: false
        });
      }

      const response = await axios.post(this.config.discord.webhook, discordMessage);
      return { status: 'sent', response: response.status };

    } catch (error) {
      return { status: 'failed', error: error.message };
    }
  }

  async sendTelegramNotification(notification) {
    if (!this.config.telegram.enabled || !this.config.telegram.botToken || !this.config.telegram.chatId) {
      return { status: 'skipped', reason: 'Telegram not configured' };
    }

    try {
      const telegramMessage = `*[QMOI] ${notification.title}*\n\n${notification.message}`;
      
      const url = `https://api.telegram.org/bot${this.config.telegram.botToken}/sendMessage`;
      const response = await axios.post(url, {
        chat_id: this.config.telegram.chatId,
        text: telegramMessage,
        parse_mode: 'Markdown'
      });

      return { status: 'sent', response: response.status };

    } catch (error) {
      return { status: 'failed', error: error.message };
    }
  }

  generateEmailHTML(notification) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .content { line-height: 1.6; }
          .details { background: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 20px; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🤖 QMOI Notification</h1>
            <p>${notification.title}</p>
          </div>
          <div class="content">
            <p>${notification.message}</p>
            ${notification.data.details ? `
              <div class="details">
                <h3>Details:</h3>
                <pre>${JSON.stringify(notification.data.details, null, 2)}</pre>
              </div>
            ` : ''}
          </div>
          <div class="footer">
            <p>Sent by QMOI Notification System at ${new Date(notification.timestamp).toLocaleString()}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getNotificationColor(type) {
    const colors = {
      success: 0x00ff00,
      error: 0xff0000,
      warning: 0xffaa00,
      info: 0x0099ff,
      fix: 0x00ffff
    };
    return colors[type] || colors.info;
  }

  async logNotification(notification) {
    const logEntry = {
      timestamp: notification.timestamp,
      type: notification.type,
      title: notification.title,
      status: notification.status,
      results: notification.results
    };

    try {
      await fs.appendFile(this.logPath, JSON.stringify(logEntry) + '\n');
    } catch (error) {
      console.error('Failed to log notification:', error.message);
    }
  }

  async testAllChannels() {
    console.log('🧪 Testing all notification channels...');
    
    const testResults = [];
    
    // Test Email
    if (this.config.email.enabled) {
      const emailTest = await this.testEmailChannel();
      testResults.push({ channel: 'email', ...emailTest });
    }
    
    // Test Slack
    if (this.config.slack.enabled) {
      const slackTest = await this.testSlackChannel();
      testResults.push({ channel: 'slack', ...slackTest });
    }
    
    // Test Discord
    if (this.config.discord.enabled) {
      const discordTest = await this.testDiscordChannel();
      testResults.push({ channel: 'discord', ...discordTest });
    }
    
    // Test Telegram
    if (this.config.telegram.enabled) {
      const telegramTest = await this.testTelegramChannel();
      testResults.push({ channel: 'telegram', ...telegramTest });
    }
    
    this.testResults = testResults;
    
    // Log test results
    const testReport = {
      timestamp: new Date().toISOString(),
      results: testResults,
      summary: {
        total: testResults.length,
        successful: testResults.filter(r => r.success).length,
        failed: testResults.filter(r => !r.success).length
      }
    };
    
    await fs.writeFile('logs/qmoi-notification-test-report.json', JSON.stringify(testReport, null, 2));
    
    console.log(`📊 Notification test results: ${testReport.summary.successful}/${testReport.summary.total} channels working`);
    
    return testReport;
  }

  async testEmailChannel() {
    try {
      if (!this.config.email.user || !this.config.email.pass) {
        return { success: false, error: 'Email credentials not configured' };
      }

      const transporter = nodemailer.createTransporter({
        host: this.config.email.host,
        port: this.config.email.port,
        secure: this.config.email.secure,
        auth: {
          user: this.config.email.user,
          pass: this.config.email.pass
        }
      });

      await transporter.verify();
      return { success: true, message: 'Email connection verified' };
      
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async testSlackChannel() {
    try {
      if (!this.config.slack.webhook) {
        return { success: false, error: 'Slack webhook not configured' };
      }

      const response = await axios.post(this.config.slack.webhook, {
        text: '🧪 QMOI Notification System Test - This is a test message'
      });
      
      return { success: response.status === 200, message: 'Slack webhook test sent' };
      
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async testDiscordChannel() {
    try {
      if (!this.config.discord.webhook) {
        return { success: false, error: 'Discord webhook not configured' };
      }

      const response = await axios.post(this.config.discord.webhook, {
        content: '🧪 QMOI Notification System Test - This is a test message'
      });
      
      return { success: response.status === 204, message: 'Discord webhook test sent' };
      
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async testTelegramChannel() {
    try {
      if (!this.config.telegram.botToken || !this.config.telegram.chatId) {
        return { success: false, error: 'Telegram credentials not configured' };
      }

      const url = `https://api.telegram.org/bot${this.config.telegram.botToken}/sendMessage`;
      const response = await axios.post(url, {
        chat_id: this.config.telegram.chatId,
        text: '🧪 QMOI Notification System Test - This is a test message'
      });
      
      return { success: response.status === 200, message: 'Telegram test sent' };
      
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getNotificationHistory(limit = 50) {
    return this.notificationHistory.slice(-limit);
  }

  async getTestResults() {
    return this.testResults;
  }

  async generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      systemStatus: {
        email: this.config.email.enabled,
        slack: this.config.slack.enabled,
        discord: this.config.discord.enabled,
        telegram: this.config.telegram.enabled
      },
      testResults: this.testResults,
      recentNotifications: await this.getNotificationHistory(10),
      summary: {
        totalNotifications: this.notificationHistory.length,
        successfulNotifications: this.notificationHistory.filter(n => n.status === 'sent').length,
        failedNotifications: this.notificationHistory.filter(n => n.status === 'failed').length
      }
    };

    await fs.writeFile('logs/qmoi-notification-report.json', JSON.stringify(report, null, 2));
    return report;
  }
}

// CLI interface
const isMainModule = process.argv[1] && process.argv[1].endsWith('qmoi-notification-system.js');
if (isMainModule) {
  const notificationSystem = new QMOINotificationSystem();
  const args = process.argv.slice(2);

  async function main() {
    await notificationSystem.initialize();

    if (args.includes('--test')) {
      console.log('🧪 Running notification channel tests...');
      const results = await notificationSystem.testAllChannels();
      console.log('Test Results:', JSON.stringify(results, null, 2));
    } else if (args.includes('--send')) {
      const type = args[args.indexOf('--send') + 1] || 'info';
      const title = args[args.indexOf('--send') + 2] || 'Test Notification';
      const message = args[args.indexOf('--send') + 3] || 'This is a test notification from QMOI';
      
      await notificationSystem.sendNotification(type, title, message);
    } else if (args.includes('--report')) {
      const report = await notificationSystem.generateReport();
      console.log('Report generated:', report);
    } else {
      console.log(`
QMOI Notification System

Usage:
  node qmoi-notification-system.js --test                    # Test all notification channels
  node qmoi-notification-system.js --send <type> <title> <message>  # Send test notification
  node qmoi-notification-system.js --report                 # Generate notification report

Environment Variables:
  QMOI_EMAIL_ENABLED=true
  QMOI_EMAIL_HOST=smtp.gmail.com
  QMOI_EMAIL_PORT=587
  QMOI_EMAIL_USER=your-email@gmail.com
  QMOI_EMAIL_PASS=your-app-password
  QMOI_EMAIL_FROM=qmoi@q-city.ai
  QMOI_EMAIL_TO=recipient1@example.com,recipient2@example.com
  
  QMOI_SLACK_ENABLED=true
  QMOI_SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
  
  QMOI_DISCORD_ENABLED=true
  QMOI_DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
  
  QMOI_TELEGRAM_ENABLED=true
  QMOI_TELEGRAM_BOT_TOKEN=your-bot-token
  QMOI_TELEGRAM_CHAT_ID=your-chat-id

Examples:
  node qmoi-notification-system.js --test
  node qmoi-notification-system.js --send success "Build Complete" "QMOI build completed successfully"
  node qmoi-notification-system.js --report
`);
    }
  }

  main().catch(console.error);
}

export default QMOINotificationSystem; 