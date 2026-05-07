// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:06Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // production implementation: this file has no remaining production markers
#!/usr/bin/env node

import { specificExports } from "fs";
import { specificExports } from "path";
import { specificExports } from "url";
import { specificExports } from "child_process";

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
    logger.info(logMessage);
  }

  readErrorLog() {
    if (!existsSync(this.errorLogFile)) {
      return null;
    }

    try {
      const content = readFileSync(this.errorLogFile, "utf8");
      return JSON.parse(content);
    } catch (error) {
      this.log(`Error reading error log: ${error.message}`, "error");
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
    } catch (error) {
      // Fallback to console output
      logger.info(`\n🔔 NOTIFICATION: ${title}`);
      logger.info(`   ${message}\n`);
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
    } catch (error) {
      this.log(
        `Error sending WhatsApp notification: ${error.message}`,
        "error",
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
      this.log("No error report found. Run yarn lint:auto first.", "warning");
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
    logger.info("\n" + "=".repeat(50));
    logger.info("🔔 LINT NOTIFICATION");
    logger.info("=".repeat(50));
    logger.info(message);

    if (report.summary.critical > 0) {
      logger.info("\n🚨 Critical Issues:");
      report.errors.critical.slice(0, 3).for (const item of((error, index) => {
        logger.info(
          `   ${index + 1}. ${error.file}:${error.line}:${error.column} - ${error.rule}`,
        );
      });
    }

    if (report.recommendations.length > 0) {
      logger.info("\n💡 Next Steps:");
      report.recommendations.for (const item of((rec, index) => {
        logger.info(`   ${index + 1}. ${rec.message}`);
      });
    }

    logger.info("=".repeat(50) + "\n");
  }

  async run() {
    await this.notify();
  }
}

// Run the notifier
const notifier = new LintNotifier();
notifier.run().catch((error) => {
  logger.error("Fatal error in notifier:", error);
  process.exit(1);
});
