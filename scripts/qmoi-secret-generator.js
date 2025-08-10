// scripts/qmoi-secret-generator.js
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const configPath = path.resolve(__dirname, '../config/qmoi_env_vars.json');
const envPath = path.resolve(__dirname, '../.env');

const envVars = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
let envContent = '';
let generated = [];

function isWeakSecret(value) {
  return !value || value.length < 16 || value === 'changeme' || value === 'demo-key';
}

Object.entries(envVars).forEach(([key, { default: def, description }]) => {
  let value = process.env[key] || def;
  if (key.toLowerCase().includes('secret') || key.toLowerCase().includes('key')) {
    if (isWeakSecret(value)) {
      value = crypto.randomBytes(32).toString('hex');
      generated.push(key);
      console.log(`QMOI: Auto-generated strong secret for ${key}`);
    }
  }
  envContent += `${key}=${value}\n`;
  process.env[key] = value;
});

fs.writeFileSync(envPath, envContent);
console.log('QMOI secret generation complete.');
if (generated.length) {
  console.log('QMOI: The following secrets were auto-generated:', generated.join(', '));
  // Optionally sync with GitLab
  try {
    require('./qmoi-gitlab-sync');
  } catch (e) {
    console.warn('QMOI: GitLab sync not run (optional).');
  }
} 