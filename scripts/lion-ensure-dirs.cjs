#!/usr/bin/env node
// Idempotent bootstrap to ensure .den, den, and lion directories exist and have minimal files.
// Safe and local-only.
const fs = require('fs');
const os = require('os');
const path = require('path');
const track = require('./track.cjs');

function ensure(dir) {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log('created:', dir);
    }
  } catch (err) {
    console.error('failed to ensure', dir, err.message);
  }
}

function touch(file, content) {
  try {
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, content || '', { encoding: 'utf8' });
      console.log('wrote:', file);
    }
  } catch (err) {
    console.error('failed to write', file, err.message);
  }
}

(function main(){
  const cwd = process.cwd();
  const homedir = os.homedir();

  const targets = [
    path.join(cwd, '.den'),
    path.join(cwd, 'den'),
    path.join(cwd, 'lion'),
    path.join(homedir, '.lion'),
    path.join(homedir, '.den'),
  ];

  for (const t of targets) {
    ensure(t);
    ensure(path.join(t, 'logs'));
    ensure(path.join(t, 'cache'));
    ensure(path.join(t, 'runtime'));
    touch(path.join(t, 'runtime', 'runtime.json'), JSON.stringify({ createdBy: 'lion-ensure-dirs', createdAt: new Date().toISOString() }, null, 2));
  }

  // create a cluster file for local discovery
  const clusterFile = path.join(cwd, '.den', 'cluster.json');
  if (!fs.existsSync(clusterFile)) {
    touch(clusterFile, JSON.stringify({ nodes: [{ id: 'local', type: 'standalone', createdAt: new Date().toISOString() }] }, null, 2));
  }

  // write a track entry for discovery
  try { track.writeTrack('lion-ensure-dirs', 'info', 'ensured directories and runtime files', { targets }); } catch (e) {}

  console.log('lion-ensure-dirs: completed');
})();
