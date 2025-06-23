#!/usr/bin/env node
const { execSync } = require('child_process');

const allowed = 'MIT;Apache-2.0;BSD-2-Clause;BSD-3-Clause;CC0-1.0;CCO-1.0';
try {
  execSync(`npx license-checker --production --onlyAllow="${allowed}"`, { stdio: 'inherit' });
  process.exit(0);
} catch (e) {
  console.error('Non-compliant license found');
  process.exit(1);
} 