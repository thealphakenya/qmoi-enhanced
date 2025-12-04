#!/usr/bin/env node
const { execSync } = require('child_process');
try {
  execSync('npm run lint -- --fix', { stdio: 'inherit' });
  process.exit(0);
} catch (e) {
  process.exit(1);
} 