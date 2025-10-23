#!/usr/bin/env node
// Small bootstrap to allow Lion to run without full install.
// - Ensures directories exist
// - Runs a plan file with the runner if provided
// - If no file provided, prints quick help
const path = require('path');
const fs = require('fs');

// ensure dirs (this script intentionally requires the idempotent script)
try {
  require('./lion-ensure-dirs.cjs');
} catch (e) {
  // best-effort: if require fails, ignore and continue
  console.warn('lion-bootstrap: could not require lion-ensure-dirs (continuing):', e.message);
}

const runnerPath = path.join(__dirname, 'lion-runner.cjs');
let runner;
try {
  runner = require(runnerPath);
} catch (e) {
  console.error('lion-bootstrap: could not load runner from', runnerPath, e.message);
}

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log('Lion bootstrap: ensure .den/den/lion directories exist and run plans.');
    console.log('Usage: node scripts/lion-bootstrap.cjs <plan.li>');
    process.exit(0);
  }
  const file = args[0];
  if (!fs.existsSync(file)) {
    console.error('file not found:', file);
    process.exit(2);
  }
  const txt = fs.readFileSync(file, 'utf8');
  if (!runner || !runner.runPlan) {
    console.error('runner not available. check scripts/lion-runner.cjs');
    process.exit(3);
  }
  const res = runner.runPlan(txt);
  res.forEach(r => console.log(r));
}

module.exports = {};
