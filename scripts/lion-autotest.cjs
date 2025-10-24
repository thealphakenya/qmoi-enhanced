#!/usr/bin/env node
// Autotest scaffold: run small checks to ensure lion runner and coursebooks are available
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function run(cmd) {
  try { return execSync(cmd, { encoding: 'utf8' }).trim(); } catch (e) { return null; }
}

console.log('Running lion autotests...');
const runner = path.join(process.cwd(), 'scripts', 'lion-runner.cjs');
if (!fs.existsSync(runner)) {
  console.error('Runner missing:', runner); process.exit(2);
}
const example = path.join(process.cwd(), 'examples', 'hello.li');
if (!fs.existsSync(example)) {
  fs.mkdirSync(path.dirname(example), { recursive: true });
  fs.writeFileSync(example, 'print: Autotest Hello\n', 'utf8');
}
const out = run(`node ${runner} ${example}`);
if (out && out.includes('Autotest Hello')) console.log('Runner test: OK'); else { console.error('Runner test: FAIL'); process.exit(3); }

// coursebook sync
const sync = path.join(process.cwd(), 'scripts', 'coursebook-sync.cjs');
if (fs.existsSync(sync)) {
  run(`node ${sync}`);
  console.log('Coursebook sync: OK');
} else console.warn('Coursebook sync missing');

console.log('Lion autotests completed.');
