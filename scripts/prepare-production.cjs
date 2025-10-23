#!/usr/bin/env node
// prepare-production: conservative validator to ensure a repo is ready for a basic production-scan.
// Exits with code 0 if checks pass, 1 otherwise.

const fs = require('fs');
const path = require('path');
const track = require('./track.cjs');

const cwd = process.cwd();
let failed = false;
function warn(msg) { console.error('WARN:', msg); failed = true; }

// Check CI workflows
const wfDir = path.join(cwd, '.github', 'workflows');
if (!fs.existsSync(wfDir)) warn('.github/workflows missing');
else {
  const wf = fs.readdirSync(wfDir).filter(n => n.endsWith('.yml') || n.endsWith('.yaml'));
  if (wf.length === 0) warn('no workflow files found in .github/workflows');
}

// Check package.json
const pkgPath = path.join(cwd, 'package.json');
if (!fs.existsSync(pkgPath)) warn('package.json missing');
else {
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    if (!pkg.name) warn('package.json missing name');
    if (!pkg.version) warn('package.json missing version');
    if (!pkg.scripts || !pkg.scripts.test) warn('package.json missing test script');
  } catch (e) { warn('package.json invalid JSON'); }
}

// Check tsconfig
const tsPath = path.join(cwd, 'tsconfig.json');
if (!fs.existsSync(tsPath)) warn('tsconfig.json missing');

// Check tracks
const tracks = path.join(cwd, '.den', 'tracks', 'events.log');
if (!fs.existsSync(tracks)) warn('.den/tracks/events.log missing (run scripts/lion-ensure-dirs.cjs to create)');
else {
  try {
    const s = fs.statSync(tracks);
    if (!s.size) console.log('note: .den/tracks/events.log exists but is empty');
  } catch (e) { warn('could not stat .den/tracks/events.log'); }
}

// Emit a track
try { track.writeTrack('prepare-production','info','performed production readiness scan',{ failed }); } catch (e) {}

if (failed) {
  console.error('\nprepare-production: checks failed. See warnings above.');
  process.exit(1);
}
console.log('prepare-production: checks passed');
process.exit(0);
