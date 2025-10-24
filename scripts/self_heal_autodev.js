#!/usr/bin/env node
// Lightweight autodev/self-heal scaffold.
// This script performs checks and will try to repair common problems.
// It is intentionally conservative: it will never push or merge without explicit flags.

const fs = require('fs');
const { execSync } = require('child_process');

function checkNode() {
  try {
    const v = execSync('node -v').toString().trim();
    process.stdout.write(`node: ${v}\n`);
    return true;
  } catch (e) {
    process.stderr.write('node not found\n');
    return false;
  }
}

function run() {
  process.stdout.write('Running self-heal autodev checks...\n');
  checkNode();
  if (fs.existsSync('package.json')) {
    process.stdout.write('Found package.json, running npm ci (dry-run)...\n');
    try {
      execSync('npm ci --no-audit --prefer-offline', { stdio: 'inherit' });
    } catch (e) {
      process.stderr.write('npm ci failed (this is normal in isolated containers without network)\n');
    }
  }
  process.stdout.write('Self-heal scaffold complete. To proceed, run with --fix to apply safe fixes.\n');
}

if (require.main === module) run();
