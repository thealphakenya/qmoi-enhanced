/* eslint-env node */
import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const secretsDir = path.join(__dirname, '../secrets');
const pubKey = path.join(secretsDir, 'bitget_public.pem');
const privKey = path.join(secretsDir, 'bitget_private.pem');

function checkKeys() {
  return fs.existsSync(pubKey) && fs.existsSync(privKey);
}

function checkIP() {
  try {
    const ip = execSync('python scripts/get_public_ip.py').toString().trim();
    return ip.includes('Your public IP address is:');
  } catch {
    return false;
  }
}

function main() {
  if (!checkKeys()) {
    console.log('Bitget RSA keys not found. Run: yarn trading:genkey');
    process.exit(1);
  }
  if (!checkIP()) {
    console.log('Could not fetch public IP. Run: yarn trading:publicip');
    process.exit(1);
  }
  console.log('All trading setup checks passed. Starting trading automation...');
  // Place trading automation logic here
}

main(); 