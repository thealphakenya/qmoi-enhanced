#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const src = path.join(__dirname, 'lion-runner.cjs');
const dest = path.join(process.cwd(), 'bin', 'lion');
if (!fs.existsSync(dest)) {
  console.error('Lion not installed. Run install-lion first.');
  process.exit(1);
}
fs.copyFileSync(src, dest);
console.log('Updated lion runner at', dest);
