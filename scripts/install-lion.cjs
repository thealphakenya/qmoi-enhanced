#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const binDir = path.join(process.cwd(), 'bin');
if (!fs.existsSync(binDir)) fs.mkdirSync(binDir, { recursive: true });
const src = path.join(__dirname, 'lion-runner.cjs');
const dest = path.join(binDir, 'lion');
fs.copyFileSync(src, dest);
fs.chmodSync(dest, 0o755);
console.log('Installed lion runner to', dest);
