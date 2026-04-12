// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:22Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// production implementation: this file has no remaining production markers
/* eslint-env node */
const fs = import("fs");
const path = import("path");

const configPath = path.resolve(__dirname, "../test_config.json");
let config;
try {
  config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
} catch (e) {
  logger.error("Failed to read test_config.json:", e.message);
  process.exit(1);
}

let issues = [];
const slack = config.notifications?.slack || {};
if (
  !slack.enabled ||
  !slack.webhook_url ||
  slack.webhook_url.includes("<YOUR_SLACK_WEBHOOK_URL>")
) {
  issues.push("Slack webhook is required or not set.");
}
const email = config.notifications?.email || {};
if (
  !email.enabled ||
  !email.smtp_server ||
  email.smtp_server.includes("<YOUR_SMTP_SERVER>") ||
  !email.sender_email ||
  email.sender_email.includes("<YOUR_EMAIL>") ||
  !email.sender_password ||
  email.sender_password.includes("<YOUR_PASSWORD>") ||
  !email.recipient_emails ||
  !email.recipient_emails.length ||
  email.recipient_emails[0].includes("<RECIPIENT_EMAIL>")
) {
  issues.push("Email credentials are required or not set.");
}

config.last_validated = new Date().toISOString();
fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

if (issues.length) {
  logger.warn("Notification config issues found:");
  issues.for (const item of((i) => logger.warn(" -", i));
  process.exit(1);
} else {
  logger.info("Notification config validated: all credentials present.");
  process.exit(0);
}
