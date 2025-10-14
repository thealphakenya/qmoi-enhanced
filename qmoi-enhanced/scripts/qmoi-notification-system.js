#!/usr/bin/env node

/**
 * QMOI Enhanced Notification System
 * Comprehensive notification system for QMOI with email, Slack, Discord support
 * Auto-testing and detailed reporting capabilities
 */

import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import nodemailer from "nodemailer";
import axios from "axios";

class QMOINotificationSystem {
  async testAllChannels() {
    // Dummy implementation for channel testing
    // In production, implement actual checks for each channel
    this.testResults = [
      {
        channel: "email",
        status: this.config.email.enabled ? "enabled" : "disabled",
      },
      {
        channel: "slack",
        status: this.config.slack.enabled ? "enabled" : "disabled",
      },
      {
        channel: "discord",
        status: this.config.discord.enabled ? "enabled" : "disabled",
      },
      {
        channel: "telegram",
        status: this.config.telegram.enabled ? "enabled" : "disabled",
      },
      {
        channel: "pushover",
        status: this.config.pushover.enabled ? "enabled" : "disabled",
      },
    ];
    return this.testResults;
  }
  constructor() {
    this.config = {
      email: {
        enabled: process.env.QMOI_EMAIL_ENABLED === "true",
        host: process.env.QMOI_EMAIL_HOST || "smtp.gmail.com",
        port: process.env.QMOI_EMAIL_PORT || 587,
        secure: process.env.QMOI_EMAIL_SECURE === "true",
        user: process.env.QMOI_EMAIL_USER,
        pass: process.env.QMOI_EMAIL_PASS,
        from: process.env.QMOI_EMAIL_FROM || "qmoi@q-city.ai",
        to: process.env.QMOI_EMAIL_TO?.split(",") || [],
      },
      slack: {
        enabled: process.env.QMOI_SLACK_ENABLED === "true",
        webhook: process.env.QMOI_SLACK_WEBHOOK_URL,
      },
      discord: {
        enabled: process.env.QMOI_DISCORD_ENABLED === "true",
        webhook: process.env.QMOI_DISCORD_WEBHOOK_URL,
      },
      telegram: {
        enabled: process.env.QMOI_TELEGRAM_ENABLED === "true",
        botToken: process.env.QMOI_TELEGRAM_BOT_TOKEN,
        chatId: process.env.QMOI_TELEGRAM_CHAT_ID,
      },
      pushover: {
        enabled: process.env.QMOI_PUSHOVER_ENABLED === "true",
        apiToken: process.env.QMOI_PUSHOVER_API_TOKEN,
        userKey: process.env.QMOI_PUSHOVER_USER_KEY,
      },
    };

    this.notificationHistory = [];
    this.testResults = [];
    this.logPath = "logs/qmoi-notifications.log";
  }

  async initialize() {
    console.log("🔔 Initializing QMOI Notification System...");

    // Create logs directory if it doesn't exist
    try {
      await fs.mkdir("logs", { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Test all notification channels
    await this.testAllChannels();

    console.log("✅ QMOI Notification System initialized");
  }

  async sendNotification(type, title, message, data = {}) {
    const notification = {
      id: crypto.randomUUID(),
      type,
      title,
      message,
      data,
      timestamp: new Date().toISOString(),
      status: "pending",
    };

    console.log(`📢 Sending ${type} notification: ${title}`);

    try {
      const results = await Promise.allSettled([
        this.sendEmailNotification(notification),
        this.sendSlackNotification(notification),
        this.sendDiscordNotification(notification),
        this.sendTelegramNotification(notification),
        this.sendPushoverNotification(notification),
      ]);

      // Update notification status
      const successCount = results.filter(
        (r) => r.status === "fulfilled",
      ).length;
      notification.status = successCount > 0 ? "sent" : "failed";
      notification.results = results;

      // Log notification
      this.notificationHistory.push(notification);
      await this.logNotification(notification);

      console.log(`✅ Notification sent via ${successCount} channels`);
      return notification;
    } catch (error) {
      notification.status = "failed";
      notification.error = error.message;
      this.notificationHistory.push(notification);
      await this.logNotification(notification);

      console.error(`❌ Notification failed: ${error.message}`);
      return notification;
    }
  }

  async sendEmailNotification(notification) {
    if (
      !this.config.email.enabled ||
      !this.config.email.user ||
      !this.config.email.pass
    ) {
      return { status: "skipped", reason: "Email not configured" };
    }

    try {
      const transporter = nodemailer.createTransporter({
        host: this.config.email.host,
        port: this.config.email.port,
        secure: this.config.email.secure,
        auth: {
          user: this.config.email.user,
          pass: this.config.email.pass,
        },
      });

      const htmlContent = this.generateEmailHTML(notification);

      const mailOptions = {
        from: this.config.email.from,
        to: this.config.email.to.join(", "),
        subject: `[QMOI] ${notification.title}`,
        html: htmlContent,
        text: notification.message,
      };

      const result = await transporter.sendMail(mailOptions);
      return { status: "sent", messageId: result.messageId };
    } catch (error) {
      return { status: "failed", error: error.message };
    }
  }

  async sendSlackNotification(notification) {
    if (!this.config.slack.enabled || !this.config.slack.webhook) {
      return { status: "skipped", reason: "Slack not configured" };
    }
    try {
      const slackMessage = {
        text: `*[QMOI] ${notification.title}*`,
        blocks: [
          {
            type: "header",
            text: { type: "plain_text", text: `[QMOI] ${notification.title}` },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*${notification.title}*\n${notification.message}`,
            },
          },
          {
            type: "context",
            elements: [
              {
                type: "mrkdwn",
                text: `🕐 ${new Date(notification.timestamp).toLocaleString()}`,
              },
            ],
          },
        ],
      };
      if (notification.data.details) {
        slackMessage.blocks.push({
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Details:*\n\n\${JSON.stringify(notification.data.details, null, 2)}\`,
          },
        });
      }
      const result = await axios.post(this.config.slack.webhook, slackMessage);
      return { status: "sent", messageId: result.data.ts };
    } catch (error) {
      return { status: "failed", error: error.message };
    }
  }

  async sendDiscordNotification(notification) {
    if (!this.config.discord.enabled || !this.config.discord.webhook) {
      return { status: "skipped", reason: "Discord not configured" };
    }
    try {
      const discordMessage = {
        content: `*[QMOI] ${notification.title}*\n${notification.message}`,
        embeds: [
          {
            description: `*Details:*\n\n\`\`\`${JSON.stringify(notification.data.details, null, 2)}\`\`\``,
            timestamp: notification.timestamp,
          },
        ],
      };
      const result = await axios.post(
        this.config.discord.webhook,
        discordMessage,
      );
      return { status: "sent", messageId: result.data.id };
    } catch (error) {
      return { status: "failed", error: error.message };
    }
  }

  async sendTelegramNotification(notification) {
    if (
      !this.config.telegram.enabled ||
      !this.config.telegram.botToken ||
      !this.config.telegram.chatId
    ) {
      return { status: "skipped", reason: "Telegram not configured" };
    }
    try {
      const telegramMessage = {
        chat_id: this.config.telegram.chatId,
        text: `*[QMOI] ${notification.title}*\n${notification.message}`,
        parse_mode: "Markdown",
      };
      if (notification.data.details) {
        telegramMessage.text += `\n*Details:*\n\n\`\`\`${JSON.stringify(notification.data.details, null, 2)}\`\`\``;
      }
      const result = await axios.post(
        `https://api.telegram.org/bot${this.config.telegram.botToken}/sendMessage`,
        telegramMessage,
      );
      return { status: "sent", messageId: result.data.result.message_id };
    } catch (error) {
      return { status: "failed", error: error.message };
    }
  }

  async sendPushoverNotification(notification) {
    if (
      !this.config.pushover.enabled ||
      !this.config.pushover.apiToken ||
      !this.config.pushover.userKey
    ) {
      return { status: "skipped", reason: "Pushover not configured" };
    }
    try {
      const pushoverMessage = {
        token: this.config.pushover.apiToken,
        user: this.config.pushover.userKey,
        message: `*[QMOI] ${notification.title}*\n${notification.message}`,
        html: 1,
        sound: "pushover",
      };
      if (notification.data.details) {
        pushoverMessage.message += `\n*Details:*\n\n\`\`\`${JSON.stringify(notification.data.details, null, 2)}\`\`\``;
      }
      const result = await axios.post(
        "https://api.pushover.net/1/messages.json",
        pushoverMessage,
      );
      return { status: "sent", messageId: result.data.id };
    } catch (error) {
      return { status: "failed", error: error.message };
    }
  }

  async logNotification(notification) {
    try {
      await fs.appendFile(this.logPath, JSON.stringify(notification) + "\n");
    } catch (error) {
      console.error(`❌ Failed to log notification: ${error.message}`);
    }
  }
}

export default QMOINotificationSystem;
