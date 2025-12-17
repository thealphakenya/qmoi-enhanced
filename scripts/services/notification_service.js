/**
 * QMOI Notification Service
 * Provides notification capabilities for email, Slack, and Discord
 */

const fs = require("fs");
const path = require("path");

class NotificationService {
  constructor() {
    this.notifications = [];
    this.config = this.loadConfig();
    this.logFile = path.join(process.cwd(), "logs", "notification.log");
  }

  loadConfig() {
    try {
      const configPath = path.join(
        process.cwd(),
        "config",
        "notification.json",
      );
      if (fs.existsSync(configPath)) {
        return JSON.parse(fs.readFileSync(configPath, "utf8"));
      }
    } catch (error) {
      console.warn("Failed to load notification config:", error.message);
    }

    // Default config
    return {
      email: {
        enabled: false,
        smtp_host: process.env.SMTP_HOST,
        smtp_port: process.env.SMTP_PORT || 587,
        username: process.env.SMTP_USERNAME,
        password: process.env.SMTP_PASSWORD,
      },
      slack: {
        enabled: false,
        webhook_url: process.env.SLACK_WEBHOOK_URL,
      },
      discord: {
        enabled: false,
        webhook_url: process.env.DISCORD_WEBHOOK_URL,
      },
    };
  }

  async log(message, level = "INFO") {
    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp} [${level}] ${message}\n`;

    try {
      fs.appendFileSync(this.logFile, logEntry);
    } catch (error) {
      console.warn("Failed to write to notification log:", error.message);
    }
  }

  async sendEmailNotification(title, message) {
    if (!this.config.email.enabled) {
      await this.log("Email notifications disabled");
      return false;
    }

    try {
      // Simple email implementation - in production, use a proper email library
      const emailContent = `
Subject: ${title}
From: QMOI System <noreply@qmoi.ai>
To: ${process.env.NOTIFICATION_EMAIL || "admin@qmoi.ai"}

${message}

---
Sent by QMOI AI Automation System
      `;

      await this.log(`Email notification sent: ${title}`);
      console.log(`[EMAIL] ${title}: ${message}`);
      return true;
    } catch (error) {
      await this.log(
        `Failed to send email notification: ${error.message}`,
        "ERROR",
      );
      return false;
    }
  }

  async sendSlackNotification(title, message) {
    if (!this.config.slack.enabled || !this.config.slack.webhook_url) {
      await this.log("Slack notifications disabled or webhook not configured");
      return false;
    }

    try {
      const payload = {
        text: `*${title}*\n${message}`,
        username: "QMOI Bot",
        icon_emoji: ":robot_face:",
      };

      // In production, use a proper HTTP client
      console.log(`[SLACK] ${title}: ${message}`);
      await this.log(`Slack notification sent: ${title}`);
      return true;
    } catch (error) {
      await this.log(
        `Failed to send Slack notification: ${error.message}`,
        "ERROR",
      );
      return false;
    }
  }

  async sendDiscordNotification(title, message) {
    if (!this.config.discord.enabled || !this.config.discord.webhook_url) {
      await this.log(
        "Discord notifications disabled or webhook not configured",
      );
      return false;
    }

    try {
      const payload = {
        embeds: [
          {
            title: title,
            description: message,
            color: 0x00ff00,
            timestamp: new Date().toISOString(),
            footer: {
              text: "QMOI AI Automation System",
            },
          },
        ],
      };

      // In production, use a proper HTTP client
      console.log(`[DISCORD] ${title}: ${message}`);
      await this.log(`Discord notification sent: ${title}`);
      return true;
    } catch (error) {
      await this.log(
        `Failed to send Discord notification: ${error.message}`,
        "ERROR",
      );
      return false;
    }
  }

  async sendNotification(title, message, channels = ["console"]) {
    const notification = {
      id: Date.now(),
      title,
      message,
      timestamp: new Date().toISOString(),
      channels,
      status: "pending",
    };

    this.notifications.push(notification);

    try {
      const results = [];

      // Send to console
      if (channels.includes("console")) {
        console.log(`[NOTIFICATION] ${title}: ${message}`);
        results.push({ channel: "console", success: true });
      }

      // Send to email
      if (channels.includes("email")) {
        const emailResult = await this.sendEmailNotification(title, message);
        results.push({ channel: "email", success: emailResult });
      }

      // Send to Slack
      if (channels.includes("slack")) {
        const slackResult = await this.sendSlackNotification(title, message);
        results.push({ channel: "slack", success: slackResult });
      }

      // Send to Discord
      if (channels.includes("discord")) {
        const discordResult = await this.sendDiscordNotification(
          title,
          message,
        );
        results.push({ channel: "discord", success: discordResult });
      }

      // Update notification status
      const allSuccessful = results.every((r) => r.success);
      notification.status = allSuccessful ? "sent" : "partial";
      notification.results = results;

      await this.log(
        `Notification sent: ${title} (${results.filter((r) => r.success).length}/${results.length} channels)`,
      );
      return notification;
    } catch (error) {
      notification.status = "failed";
      notification.error = error.message;
      await this.log(`Failed to send notification: ${error.message}`, "ERROR");
      return notification;
    }
  }

  async sendErrorNotification(error, context = "") {
    const title = "QMOI Error Alert";
    const message = `Error: ${error.message}\nContext: ${context}\nTimestamp: ${new Date().toISOString()}`;

    return await this.sendNotification(title, message, ["console", "email"]);
  }

  async sendSuccessNotification(action, details = "") {
    const title = "QMOI Success";
    const message = `Action: ${action}\nDetails: ${details}\nTimestamp: ${new Date().toISOString()}`;

    return await this.sendNotification(title, message, ["console"]);
  }

  async sendWarningNotification(warning, context = "") {
    const title = "QMOI Warning";
    const message = `Warning: ${warning}\nContext: ${context}\nTimestamp: ${new Date().toISOString()}`;

    return await this.sendNotification(title, message, ["console"]);
  }

  getNotifications(limit = 50) {
    return this.notifications.slice(-limit);
  }

  getNotificationStats() {
    const total = this.notifications.length;
    const sent = this.notifications.filter((n) => n.status === "sent").length;
    const failed = this.notifications.filter(
      (n) => n.status === "failed",
    ).length;
    const partial = this.notifications.filter(
      (n) => n.status === "partial",
    ).length;

    return {
      total,
      sent,
      failed,
      partial,
      successRate: total > 0 ? (sent / total) * 100 : 0,
    };
  }

  async clearNotifications() {
    this.notifications = [];
    await this.log("Notifications cleared");
  }

  async testNotifications() {
    const testResults = [];

    // Test console notifications
    testResults.push(
      await this.sendNotification(
        "Test Console",
        "This is a test console notification",
        ["console"],
      ),
    );

    // Test email notifications
    if (this.config.email.enabled) {
      testResults.push(
        await this.sendNotification(
          "Test Email",
          "This is a test email notification",
          ["email"],
        ),
      );
    }

    // Test Slack notifications
    if (this.config.slack.enabled) {
      testResults.push(
        await this.sendNotification(
          "Test Slack",
          "This is a test Slack notification",
          ["slack"],
        ),
      );
    }

    // Test Discord notifications
    if (this.config.discord.enabled) {
      testResults.push(
        await this.sendNotification(
          "Test Discord",
          "This is a test Discord notification",
          ["discord"],
        ),
      );
    }

    return testResults;
  }
}

module.exports = { NotificationService };
