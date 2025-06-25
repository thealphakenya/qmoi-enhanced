/* eslint-env node */
const fs = require('fs');
const { execSync } = require('child_process');
const { notifyMaster } = require('../src/services/WhatsAppService');
const nodemailer = require('nodemailer');
const axios = require('axios');

function logFix(msg) {
  console.log(`[AI Error Fix] ${msg}`);
  fs.appendFileSync('logs/ai_error_fix.log', `[${new Date().toISOString()}] ${msg}\n`);
}

function getNotificationConfig() {
  try {
    const config = JSON.parse(fs.readFileSync('test_config.json', 'utf-8'));
    return config.notifications || {};
  } catch (e) {
    logFix('Failed to read notification config: ' + e.message);
    return {};
  }
}

async function sendSlackNotification(msg) {
  const config = getNotificationConfig().slack || {};
  if (!config.enabled || !config.webhook_url) {
    logFix('Slack notification is disabled or webhook missing.');
    return;
  }
  try {
    await axios.post(config.webhook_url, { text: msg });
    logFix('Slack notification sent.');
  } catch (e) {
    logFix('Failed to send Slack notification: ' + e.message);
  }
}

async function sendEmailNotification(msg) {
  const config = getNotificationConfig().email || {};
  if (!config.enabled || !config.smtp_server || !config.sender_email || !config.sender_password || !config.recipient_emails || !config.recipient_emails.length) {
    logFix('Email notification is disabled or credentials missing.');
    return;
  }
  try {
    let transporter = nodemailer.createTransport({
      host: config.smtp_server,
      port: config.smtp_port || 587,
      secure: false,
      auth: {
        user: config.sender_email,
        pass: config.sender_password,
      },
    });
    await transporter.sendMail({
      from: config.sender_email,
      to: config.recipient_emails.join(','),
      subject: '[QMOI AI] Automated Fix Notification',
      text: msg,
    });
    logFix('Email notification sent.');
  } catch (e) {
    logFix('Failed to send email notification: ' + e.message);
  }
}

async function fixLicenseErrors() {
  logFix('Scanning for non-compliant licenses...');
  try {
    const report = JSON.parse(fs.readFileSync('license-report.json', 'utf-8'));
    const offenders = Object.entries(report).filter(([pkg, meta]) => {
      const allowed = ['MIT', 'Apache-2.0', 'BSD-2-Clause', 'BSD-3-Clause'];
      return meta.licenses && !allowed.includes(meta.licenses);
    });
    if (offenders.length === 0) {
      logFix('No non-compliant packages found.');
      return true;
    }
    for (const [pkg, meta] of offenders) {
      logFix(`Non-compliant package: ${pkg} (${meta.licenses})`);
      try {
        execSync(`npm uninstall ${pkg.split('@')[0]}`);
        logFix(`Uninstalled ${pkg}`);
      } catch (e) {
        logFix(`Failed to uninstall ${pkg}: ${e.message}`);
      }
    }
    return true;
  } catch (e) {
    logFix('Failed to parse license report: ' + e.message);
    return false;
  }
}

async function fixVercelErrors() {
  logFix('Retrying Vercel deploy with force and cache clear...');
  try {
    execSync('npx vercel --prod --force --yes', { stdio: 'inherit' });
    logFix('Vercel deploy retried with force.');
    return true;
  } catch (e) {
    logFix('Vercel deploy retry failed: ' + e.message);
    try {
      execSync('npx vercel --prod --yes --force --prebuilt', { stdio: 'inherit' });
      logFix('Vercel deploy retried with prebuilt.');
      return true;
    } catch (e2) {
      logFix('Vercel deploy retry with prebuilt failed: ' + e2.message);
      return false;
    }
  }
}

async function sendNotifications(type, result) {
  const msg = `[AI Error Fix] Type: ${type}\nResult: ${result}`;
  try {
    await notifyMaster(msg);
    logFix('WhatsApp notification sent to master.');
  } catch (e) {
    logFix('Failed to send WhatsApp notification: ' + e.message);
  }
  await sendSlackNotification(msg);
  await sendEmailNotification(msg);
}

async function main() {
  const argType = process.argv.find((a) => a.startsWith('--type=')) || '';
  const type = argType.replace('--type=', '');
  let result = '';
  if (type === 'license') {
    result = (await fixLicenseErrors()) ? 'License fix attempted.' : 'License fix failed.';
  } else if (type === 'vercel') {
    result = (await fixVercelErrors()) ? 'Vercel fix attempted.' : 'Vercel fix failed.';
  } else {
    result = 'No error type specified. Exiting.';
  }
  await sendNotifications(type, result);
}

main(); 