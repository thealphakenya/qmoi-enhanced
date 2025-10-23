#!/usr/bin/env node
// Lightweight track writer used by Lion/Den scripts.
const fs = require('fs');
const path = require('path');
const os = require('os');

function targetsFor(cwd) {
  const home = os.homedir();
  return [path.join(cwd, '.den'), path.join(cwd, 'den'), path.join(home, '.den'), path.join(home, 'den')];
}

function writeTrack(component, level, message, data) {
  try {
    const cwd = process.cwd();
    const entry = {
      ts: new Date().toISOString(),
      component: String(component || 'lion'),
      level: String(level || 'info'),
      message: String(message || ''),
      data: data === undefined ? null : data
    };
    const targets = targetsFor(cwd);
    for (const t of targets) {
      try {
        const dir = path.join(t, 'tracks');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        const file = path.join(dir, 'events.log');
        fs.appendFileSync(file, JSON.stringify(entry) + '\n', 'utf8');
      } catch (e) {
        // ignore individual target write errors
      }
    }
    return entry;
  } catch (e) {
    return null;
  }
}

module.exports = { writeTrack };
