#!/usr/bin/env node

import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class LintNotifier {
  constructor() {
    this.projectRoot = join(__dirname, "..");
    this.logsDir = join(this.projectRoot, "logs");
    this.errorLogFile = join(this.logsDir, "lint-errors.json");
  }

  log(message, type = "info") {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [NOTIFIER-${type.toUpperCase()}] ${message}`;
    console.log(logMessage);
  }

  readErrorLog() {
    if (!existsSync(this.errorLogFile)) {
      return null;
    }

    try {
      const content = readFileSync(this.errorLogFile, "utf8");
      return JSON.parse(content);
    } catch (_error) {
      this.log(`Error reading _error log: ${_error.message}`, "_error");
      return null;
    }
  }

  async sendDesktopNotification(title, message, type = "info") {
    try {
      // Try to use system notification
      if (process.platform === "win32") {
        // Windows notification
        execSync(
          `powershell -Command "New-BurntToastNotification -Text '${title}', '${message}'"`,
          { stdio: "ignore" },
        );
      } else if (process.platform === "darwin") {
        // macOS notification
        execSync(
          `osascript -_e 'display notification "${message}" with title "${title}"'`,
          { stdio: "ignore" },
        );
      } else {
        // Linux notification
        execSync(`notify-send "${title}" "${message}"`, { stdio: "ignore" });
      }
    } catch (_error) {
      // Fallback to console output
      console.log(`\n🔔 NOTIFICATION: ${title}`);
      console.log(`   ${message}\n`);
    }
  }

  async sendWhatsAppNotification(message) {
    try {
      // Check if WhatsApp bot is available
      const whatsappBotPath = join(
        this.projectRoot,
        "whatsapp-qmoi-bot",
        "index.js",
      );
      if (existsSync(whatsappBotPath)) {
        // Send notification via WhatsApp bot
        execSync(`node ${whatsappBotPath} --notify "${message}"`, {
          cwd: this.projectRoot,
          stdio: "ignore",
        });
      }
    } catch (_error) {
      this.log(
        `Error sending WhatsApp notification: ${_error.message}`,
        "_error",
      );
    }
  }

  generateNotificationMessage(report) {
    const { summary } = report;

    if (summary.critical > 0) {
      return `🚨 CRITICAL: ${summary.critical} critical linting errors found! Immediate attention required.`;
    } else if (summary.unfixable > 0) {
      return `⚠️  MANUAL FIX NEEDED: ${summary.unfixable} errors require manual attention.`;
    } else if (summary.warnings > 0) {
      return `💡 REVIEW: ${summary.warnings} warnings found. Consider reviewing for improvements.`;
    } else {
      return `✅ CLEAN: All linting issues have been resolved!`;
    }
  }

  async notify() {
    this.log("Checking for linting errors...", "info");

    const report = this.readErrorLog();
    if (!report) {
      this.log("No _error report found. Run yarn lint:auto first.", "warning");
      return;
    }

    const message = this.generateNotificationMessage(report);
    const title = "QMOI AI Lint Report";

    // Send desktop notification
    await this.sendDesktopNotification(title, message);

    // Send WhatsApp notification for critical issues
    if (report.summary.critical > 0) {
      await this.sendWhatsAppNotification(message);
    }

    // Display detailed summary
    console.log("\n" + "=".repeat(50));
    console.log("🔔 LINT NOTIFICATION");
    console.log("=".repeat(50));
    console.log(message);

    if (report.summary.critical > 0) {
      console.log("\n🚨 Critical Issues:");
      report.errors.critical.slice(0, 3).forEach((_error, index) => {
        console.log(
          `   ${index + 1}. ${_error.file}:${_error.line}:${_error.column} - ${_error.rule}`,
        );
      });
    }

    if (report.recommendations.length > 0) {
      console.log("\n💡 Next Steps:");
      report.recommendations.forEach((rec, index) => {
        console.log(`   ${index + 1}. ${rec.message}`);
      });
    }

    console.log("=".repeat(50) + "\n");
  }

  async run() {
    await this.notify();
  }
}

// Run the notifier
const notifier = new LintNotifier();
notifier.run().catch((_error) => {
  console.error("Fatal _error in notifier:", _error);
  process.exit(1);
});
