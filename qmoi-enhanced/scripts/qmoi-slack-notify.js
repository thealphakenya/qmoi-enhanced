#!/usr/bin/env node

const { WebClient } = require("@slack/web-api");
const token = process.env.SLACK_TOKEN;
const slack = new WebClient(token);

const [, , channel, ...msgParts] = process.argv;
const message = msgParts.join(" ");

if (!token) {
  console.error("Error: SLACK_TOKEN environment variable not set.");
  process.exit(1);
}
if (!channel || !message) {
  console.error("Usage: node qmoi-slack-notify.js <channel> <message>");
  process.exit(1);
}

(async () => {
  try {
    await slack.chat.postMessage({ channel, text: message });
    console.log(`[SLACK] Message sent to ${channel}: ${message}`);
  } catch (e) {
    console.error("[SLACK] Error sending message:", e.message);
    process.exit(1);
  }
})();
