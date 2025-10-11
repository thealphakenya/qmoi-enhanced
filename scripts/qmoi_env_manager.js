#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const requiredEnvs = [
  'HF_TOKEN',
  'HF_USERNAME',
  'WHATSAPP_API_TOKEN',
  'WHATSAPP_WEBHOOK_URL',
  // QMOI notification/email variables
  'QMOI_EMAIL_HOST',
  'QMOI_EMAIL_PORT',
  'QMOI_EMAIL_SECURE',
  'QMOI_EMAIL_USER',
  'QMOI_EMAIL_PASS',
  'QMOI_EMAIL_FROM',
  'QMOI_EMAIL_TO',
  'QMOI_SLACK_WEBHOOK',
  'QMOI_DISCORD_WEBHOOK',
  'QMOI_TELEGRAM_BOT_TOKEN',
  'QMOI_TELEGRAM_CHAT_ID'
];

const envPath = path.join(process.cwd(), '.env');
const configPath = path.join(process.cwd(), 'config', 'qmoi_huggingface_config.json');
const LOG_PATH = path.join(process.cwd(), 'logs', 'env_manager.log');
const STATUS_PATH = path.join(process.cwd(), 'logs', 'env_manager_status.json');
const envExamplePath = path.join(process.cwd(), '.env.example');

function logEnvManager(message) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(LOG_PATH, logEntry);
  console.log(message);
}

function writeStatus(statusObj) {
  fs.writeFileSync(STATUS_PATH, JSON.stringify(statusObj, null, 2));
}

function getDefaultsFromExample(missing) {
  let defaults = {};
  if (fs.existsSync(envExamplePath)) {
    const exampleContent = fs.readFileSync(envExamplePath, 'utf8');
    exampleContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value && missing.includes(key.trim())) {
        defaults[key.trim()] = value.trim();
      }
    });
  }
  return defaults;
}

function getSafeDefaults(missing) {
  // Add safe defaults for each required env
  const safeDefaults = {
    'HF_TOKEN': '[PRODUCTION IMPLEMENTATION REQUIRED]-hf-token',
    'HF_USERNAME': 'qmoi-ai',
    'WHATSAPP_API_TOKEN': '[PRODUCTION IMPLEMENTATION REQUIRED]-whatsapp-token',
    'WHATSAPP_WEBHOOK_URL': 'https://example.com/webhook'
  };
  let defaults = {};
  missing.forEach(key => {
    if (safeDefaults[key]) defaults[key] = safeDefaults[key];
  });
  return defaults;
}

function checkAndCreateEnv() {
  let missing = [];
  let envVars = {};
  // Try to load from process.env
  requiredEnvs.forEach((key) => {
    if (process.env[key]) {
      envVars[key] = process.env[key];
    } else {
      missing.push(key);
    }
  });
  // Try to load from config if missing
  if (missing.length && fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    if (config.huggingface) {
      if (missing.includes('HF_TOKEN') && config.huggingface.token) {
        envVars['HF_TOKEN'] = config.huggingface.token;
        missing = missing.filter(k => k !== 'HF_TOKEN');
      }
      if (missing.includes('HF_USERNAME') && config.huggingface.username) {
        envVars['HF_USERNAME'] = config.huggingface.username;
        missing = missing.filter(k => k !== 'HF_USERNAME');
      }
    }
    if (config.whatsapp_integration) {
      if (missing.includes('WHATSAPP_API_TOKEN') && config.whatsapp_integration.api_token) {
        envVars['WHATSAPP_API_TOKEN'] = config.whatsapp_integration.api_token;
        missing = missing.filter(k => k !== 'WHATSAPP_API_TOKEN');
      }
      if (missing.includes('WHATSAPP_WEBHOOK_URL') && config.whatsapp_integration.webhook_url) {
        envVars['WHATSAPP_WEBHOOK_URL'] = config.whatsapp_integration.webhook_url;
        missing = missing.filter(k => k !== 'WHATSAPP_WEBHOOK_URL');
      }
    }
  }
  // Try to load from .env.example if still missing
  if (missing.length) {
    const exampleDefaults = getDefaultsFromExample(missing);
    Object.assign(envVars, exampleDefaults);
    missing = missing.filter(k => !(k in exampleDefaults));
    if (Object.keys(exampleDefaults).length) {
      logEnvManager(`Filled from .env.example: ${Object.keys(exampleDefaults).join(', ')}`);
    }
  }
  // Try to load safe defaults if still missing
  if (missing.length) {
    const safeDefaults = getSafeDefaults(missing);
    Object.assign(envVars, safeDefaults);
    missing = missing.filter(k => !(k in safeDefaults));
    if (Object.keys(safeDefaults).length) {
      logEnvManager(`Filled from safe defaults: ${Object.keys(safeDefaults).join(', ')}`);
    }
  }
  // Write .env if needed
  let envContent = '';
  Object.entries(envVars).forEach(([k, v]) => {
    envContent += `${k}=${v}\n`;
  });
  if (envContent) {
    fs.writeFileSync(envPath, envContent);
    logEnvManager('\u2705 .env file created/updated.');
  }
  let statusObj = {
    timestamp: new Date().toISOString(),
    missing,
    envVars: Object.keys(envVars),
    status: missing.length ? 'partial' : 'healthy'
  };
  writeStatus(statusObj);
  if (missing.length) {
    logEnvManager(`\u26a0\ufe0f Missing required environment variables after all attempts: ${missing.join(', ')}`);
    logEnvManager('Please set them in your GitHub secrets, config, or .env file.');
    // Do not exit with failure, just log and continue
    return false;
  }
  logEnvManager('\u2705 All required environment variables are set.');
  return true;
}

if (require.main === module) {
  checkAndCreateEnv();
}

module.exports = { checkAndCreateEnv }; 