const fs = require('fs');
const path = require('path');

const configPath = path.resolve(__dirname, '../config/qmoi_env_vars.json');
const envPath = path.resolve(__dirname, '../.env');

const envVars = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
let envContent = '';
let missing = [];

Object.entries(envVars).forEach(([key, { default: def }]) => {
  let value = process.env[key] || def;
  if (!process.env[key]) {
    console.warn(`QMOI: ${key} not set, using default: ${def}`);
    missing.push(key);
  }
  envContent += `${key}=${value}\n`;
  process.env[key] = value; // Inject for current process
});

fs.writeFileSync(envPath, envContent);
console.log('QMOI env setup complete.');
if (missing.length) {
  console.log('QMOI: The following env vars were missing and set to defaults:', missing.join(', '));
} 