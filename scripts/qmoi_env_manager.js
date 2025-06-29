#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const requiredEnvs = [
  'HF_TOKEN',
  'HF_USERNAME',
  'WHATSAPP_API_TOKEN',
  'WHATSAPP_WEBHOOK_URL'
];

const envPath = path.join(process.cwd(), '.env');
const configPath = path.join(process.cwd(), 'config', 'qmoi_huggingface_config.json');

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
  // Write .env if needed
  let envContent = '';
  Object.entries(envVars).forEach(([k, v]) => {
    envContent += `${k}=${v}\n`;
  });
  if (envContent) {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created/updated.');
  }
  if (missing.length) {
    console.warn('⚠️ Missing required environment variables:', missing.join(', '));
    console.warn('Please set them in your GitHub secrets or config.');
    process.exitCode = 1;
    return false;
  }
  console.log('✅ All required environment variables are set.');
  return true;
}

if (require.main === module) {
  checkAndCreateEnv();
}

module.exports = { checkAndCreateEnv }; 