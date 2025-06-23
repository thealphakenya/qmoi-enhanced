#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { fixError } = require('../../src/services/ErrorFixingService');
const { notifyMaster } = require('../../src/services/WhatsAppService');
const nodemailer = require('nodemailer');
const axios = require('axios');
const twilio = require('twilio');
const { VPNService } = require('../../src/services/VPNService');

const MAX_RETRIES = 3;
let retries = 0;

function log(msg) {
  console.log(`[AutoDeploy] ${msg}`);
  fs.appendFileSync('logs/vercel_auto_deploy.log', `[${new Date().toISOString()}] ${msg}\n`);
}

function hasVercelEnv() {
  return process.env.VERCEL_TOKEN || fs.existsSync('.vercel/project.json');
}
function hasHerokuEnv() {
  return process.env.HEROKU_API_KEY;
}
function hasAWSEnv() {
  return process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY;
}
function hasGitHubEnv() {
  return process.env.GITHUB_TOKEN || fs.existsSync('.git');
}
function hasAzureEnv() {
  return process.env.AZURE_CLIENT_ID && process.env.AZURE_TENANT_ID && process.env.AZURE_CLIENT_SECRET;
}
function hasGCPEnv() {
  return process.env.GCP_PROJECT_ID && process.env.GCP_KEYFILE;
}

function ensureEnvGitIgnored() {
  const gitignorePath = '.gitignore';
  let content = '';
  if (fs.existsSync(gitignorePath)) {
    content = fs.readFileSync(gitignorePath, 'utf-8');
  }
  if (!content.includes('.env')) {
    fs.appendFileSync(gitignorePath, '\n.env\n');
    log('.env added to .gitignore');
  }
}

function injectSafeFallbackEnv() {
  log('Injecting safe fallback env for Vercel...');
  ensureEnvGitIgnored();
  const envPath = '.env';
  if (!fs.existsSync(envPath)) {
    // Generate safe random values for required envs
    const crypto = require('crypto');
    const fallback = [
      'NODE_ENV=production',
      'FALLBACK_MODE=true',
      `ADMIN_TOKEN=${crypto.randomBytes(16).toString('hex')}`,
      `BITGET_API_KEY=fallback_${crypto.randomBytes(8).toString('hex')}`,
      `BITGET_API_SECRET=fallback_${crypto.randomBytes(8).toString('hex')}`,
      `BITGET_PASSPHRASE=fallback_${crypto.randomBytes(8).toString('hex')}`
    ].join('\n');
    fs.writeFileSync(envPath, fallback + '\n');
    log('Safe fallback .env created.');
  }
}

function injectStaticExportFallback() {
  log('Attempting static export fallback...');
  try {
    execSync('npx next export', { stdio: 'inherit' });
    log('Static export completed.');
  } catch (e) {
    log('Static export failed: ' + e.message);
  }
}

function injectDockerFallback() {
  log('Attempting Docker fallback...');
  try {
    execSync('docker build -t alpha-q-ai .', { stdio: 'inherit' });
    execSync('docker run -d --name alpha-q-ai -p 3000:3000 alpha-q-ai', { stdio: 'inherit' });
    log('Docker deployment completed.');
  } catch (e) {
    log('Docker deployment failed: ' + e.message);
  }
}

async function autoFixErrors(errorMsg) {
  await VPNService.ensureSecureConnection();
  log('Attempting AI-driven error fix...');
  try {
    await fixError(errorMsg);
    log('Auto-fix completed.');
  } catch (e) {
    log('Auto-fix failed: ' + e.message);
  }
}

function autoCommitAndPush() {
  try {
    // Unstage .env if staged
    try { execSync('git reset .env'); } catch {}
    execSync('git add .');
    execSync('git commit -m "Auto-fix: deploy error"');
    execSync('git push');
    log('Auto-committed and pushed fixes.');
  } catch (e) {
    log('No changes to commit or push.');
  }
}

async function deployToVercel() {
  await VPNService.ensureSecureConnection();
  try {
    log('Starting Vercel deployment...');
    execSync('npx vercel --prod --yes', { stdio: 'inherit' });
    log('Vercel deployment successful!');
    notifyMaster('Vercel deployment successful!');
    return true;
  } catch (e) {
    log(`Vercel deployment failed: ${e.message}`);
    notifyMaster(`Vercel deployment failed: ${e.message}`);
    return false;
  }
}

async function deployToHeroku() {
  await VPNService.ensureSecureConnection();
  try {
    log('Starting Heroku deployment...');
    execSync('git push https://heroku:$HEROKU_API_KEY@git.heroku.com/$HEROKU_APP_NAME.git main --force', { stdio: 'inherit' });
    log('Heroku deployment successful!');
    notifyMaster('Heroku deployment successful!');
    return true;
  } catch (e) {
    log(`Heroku deployment failed: ${e.message}`);
    notifyMaster(`Heroku deployment failed: ${e.message}`);
    return false;
  }
}

function deployToAzure() {
  try {
    log('Starting Azure deployment...');
    execSync('az webapp up --name $AZURE_APP_NAME --resource-group $AZURE_RESOURCE_GROUP --location $AZURE_LOCATION --runtime "NODE|18-lts"', { stdio: 'inherit' });
    log('Azure deployment successful!');
    notifyMaster('Azure deployment successful!');
    return true;
  } catch (e) {
    log(`Azure deployment failed: ${e.message}`);
    notifyMaster(`Azure deployment failed: ${e.message}`);
    return false;
  }
}

function deployToGCP() {
  try {
    log('Starting GCP deployment...');
    execSync('gcloud app deploy --quiet', { stdio: 'inherit' });
    log('GCP deployment successful!');
    notifyMaster('GCP deployment successful!');
    return true;
  } catch (e) {
    log(`GCP deployment failed: ${e.message}`);
    notifyMaster(`GCP deployment failed: ${e.message}`);
    return false;
  }
}

async function notifyByEmail(msg) {
  // Configure with real SMTP credentials for production
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER || 'user@example.com',
      pass: process.env.SMTP_PASS || 'password',
    },
  });
  try {
    await transporter.sendMail({
      from: 'Alpha-Q AI <noreply@alphaq.com>',
      to: process.env.MASTER_EMAIL || 'master@example.com',
      subject: 'Alpha-Q AI Deployment Notification',
      text: msg,
    });
    log('Email notification sent.');
  } catch (e) {
    log('Email notification failed: ' + e.message);
  }
}

async function monitorHealth(url) {
  try {
    const res = await axios.get(url);
    if (res.status === 200) {
      log('Health check passed.');
      return true;
    } else {
      log('Health check failed: ' + res.status);
      notifyMaster('Health check failed: ' + res.status);
      return false;
    }
  } catch (e) {
    log('Health check error: ' + e.message);
    notifyMaster('Health check error: ' + e.message);
    return false;
  }
}

async function pingUptimeMonitor() {
  const url = process.env.UPTIME_MONITOR_URL;
  if (!url) return;
  try {
    const res = await axios.get(url);
    if (res.status === 200) {
      log('Uptime monitor check passed.');
    } else {
      log('Uptime monitor check failed: ' + res.status);
      notifyMaster('Uptime monitor check failed: ' + res.status);
    }
  } catch (e) {
    log('Uptime monitor error: ' + e.message);
    notifyMaster('Uptime monitor error: ' + e.message);
  }
}

async function notifySlack(message) {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) return;
  try {
    await axios.post(url, { text: message });
    log('Slack notification sent.');
  } catch (e) {
    log('Slack notification failed: ' + e.message);
  }
}

async function notifyDiscord(message) {
  const url = process.env.DISCORD_WEBHOOK_URL;
  if (!url) return;
  try {
    await axios.post(url, { content: message });
    log('Discord notification sent.');
  } catch (e) {
    log('Discord notification failed: ' + e.message);
  }
}

async function notifySMS(message) {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM, TWILIO_TO } = process.env;
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM || !TWILIO_TO) return;
  try {
    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    await client.messages.create({
      body: message,
      from: TWILIO_FROM,
      to: TWILIO_TO,
    });
    log('SMS notification sent.');
  } catch (e) {
    log('SMS notification failed: ' + e.message);
  }
}

async function autoRollback() {
  log('Attempting auto-rollback to previous commit...');
  try {
    execSync('git reset --hard HEAD~1');
    execSync('git push --force');
    log('Rollback to previous commit successful. Redeploying...');
    await notifyMaster('Auto-rollback performed. Redeploying previous version.');
    await notifySlack('Auto-rollback performed. Redeploying previous version.');
    await notifyDiscord('Auto-rollback performed. Redeploying previous version.');
    await notifySMS('Auto-rollback performed. Redeploying previous version.');
    // Try redeploy (Vercel as example, extend for others as needed)
    await deployToVercel();
  } catch (e) {
    log('Auto-rollback failed: ' + e.message);
    await notifyMaster('Auto-rollback failed: ' + e.message);
    await notifySlack('Auto-rollback failed: ' + e.message);
    await notifyDiscord('Auto-rollback failed: ' + e.message);
    await notifySMS('Auto-rollback failed: ' + e.message);
  }
}

async function selfHealingDeploy(deployFn) {
  let attempts = 0;
  let healthy = false;
  while (attempts < 3 && !healthy) {
    deployFn();
    const healthUrl = process.env.HEALTH_URL || 'http://localhost:3000/api/health';
    healthy = await monitorHealth(healthUrl);
    if (healthy) break;
    log(`Health check failed after deployment attempt ${attempts + 1}. Retrying...`);
    await notifyMaster(`Health check failed after deployment attempt ${attempts + 1}. Retrying...`);
    await notifySlack(`Health check failed after deployment attempt ${attempts + 1}. Retrying...`);
    await notifyDiscord(`Health check failed after deployment attempt ${attempts + 1}. Retrying...`);
    await notifySMS(`Health check failed after deployment attempt ${attempts + 1}. Retrying...`);
    attempts++;
  }
  if (!healthy) {
    log('All self-healing attempts failed. Initiating auto-rollback.');
    await notifyMaster('All self-healing attempts failed. Initiating auto-rollback.');
    await notifySlack('All self-healing attempts failed. Initiating auto-rollback.');
    await notifyDiscord('All self-healing attempts failed. Initiating auto-rollback.');
    await notifySMS('All self-healing attempts failed. Initiating auto-rollback.');
    await autoRollback();
  }
}

async function main() {
  let deployed = false;
  if (hasVercelEnv()) {
    while (retries < MAX_RETRIES && !deployed) {
      if (await deployToVercel()) deployed = true;
      else {
        await autoFixErrors('Vercel deployment error');
        autoCommitAndPush();
        retries++;
        log(`Retrying Vercel deployment (attempt ${retries + 1})...`);
      }
    }
  } else if (hasHerokuEnv()) {
    retries = 0;
    while (retries < MAX_RETRIES && !deployed) {
      if (await deployToHeroku()) deployed = true;
      else {
        await autoFixErrors('Heroku deployment error');
        autoCommitAndPush();
        retries++;
        log(`Retrying Heroku deployment (attempt ${retries + 1})...`);
      }
    }
  } else {
    log('No cloud credentials found. Using fallback mode.');
    injectSafeFallbackEnv();
    if (!hasGitHubEnv()) {
      log('GitHub credentials also missing. Attempting static export and email notification.');
      injectStaticExportFallback();
      await notifyByEmail('All cloud credentials missing. Static export attempted.');
      return;
    } else {
      injectDockerFallback();
      await notifyByEmail('All cloud credentials missing. Docker fallback attempted.');
    }
  }
  // Health monitoring
  const healthUrl = process.env.HEALTH_URL || 'http://localhost:3000/api/health';
  await selfHealingDeploy(deployToVercel);
  await pingUptimeMonitor();
  if (!deployed) {
    for (let i = 0; i < 2 && !deployed; i++) {
      await autoRollback();
      deployed = await deployToVercel();
    }
  }
}

main(); 
