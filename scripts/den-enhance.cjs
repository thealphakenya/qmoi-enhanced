#!/usr/bin/env node
// den-enhance: small utility to inspect and enhance den/.den directories.
// Features:
// - Report den status for current cwd and home
// - Ensure runtime files exist and healthy
// - Rotate caches (simple LRU by mtime, configurable)
// - Optionally run lion-autofix-extended on den-managed files

const fs = require('fs');
const path = require('path');
const os = require('os');
const track = require('./track.cjs');

function statSafe(p) {
  try { return fs.statSync(p); } catch (e) { return null; }
}

function ensureRuntime(dir) {
  const runtime = path.join(dir, 'runtime');
  if (!fs.existsSync(runtime)) fs.mkdirSync(runtime, { recursive: true });
  const file = path.join(runtime, 'runtime.json');
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify({ createdAt: new Date().toISOString(), note: 'den-enhance' }, null, 2), 'utf8');
    console.log('wrote runtime.json in', runtime);
  }
}

function rotateCache(dir, maxFiles = 100) {
  const cacheDir = path.join(dir, 'cache');
  if (!fs.existsSync(cacheDir)) return;
  const files = fs.readdirSync(cacheDir).map(f => ({ f, p: path.join(cacheDir, f), m: statSafe(path.join(cacheDir, f)) })).filter(Boolean);
  if (files.length <= maxFiles) return;
  files.sort((a,b) => a.m.mtimeMs - b.m.mtimeMs);
  const remove = files.slice(0, files.length - maxFiles);
  for (const r of remove) {
    try { fs.unlinkSync(r.p); console.log('rotated cache:', r.p); } catch (e) {}
  }
}

function runAutofix(targetDir) {
  const autofix = path.join(__dirname, 'lion-autofix-extended.cjs');
  if (fs.existsSync(autofix)) {
    console.log('running autofix on', targetDir);
    require(autofix);
  } else console.warn('autofix script not found');
}

(function main(){
  const cwd = process.cwd();
  const home = os.homedir();
  const targets = [path.join(cwd, '.den'), path.join(cwd, 'den'), path.join(home, '.den'), path.join(home, 'den')];
  for (const t of targets) {
    if (!t) continue;
    try {
      if (!fs.existsSync(t)) fs.mkdirSync(t, { recursive: true });
      ensureRuntime(t);
      rotateCache(t, 250);
    } catch (e) { console.warn('failed for', t, e.message); }
  }
  // conservative: do not autofix by default; only if --autofix passed
  if (process.argv.includes('--autofix')) runAutofix(cwd);
  try { track.writeTrack('den-enhance', 'info', 'den enhancement completed', { targets }); } catch (e) {}
  console.log('den-enhance: completed');
})();
