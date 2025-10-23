#!/usr/bin/env node
// Conservative repo-wide autofix. Creates .bak copies and only applies minimal safe changes.
// - JSON files: parse and reformat (stringify with 2 spaces)
// - Remove BOM if present
// - Normalize newlines to LF
// - Trim trailing spaces on lines
// - YAML files: normalize indentation of tabs -> 2 spaces (conservative)

const fs = require('fs');
const path = require('path');
const track = require('./track.cjs');

const exts = ['.json', '.yml', '.yaml', '.js', '.ts', '.tsx', '.md'];

function walk(dir, cb) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (['.git', 'node_modules', 'den', '.den', 'dist'].includes(e.name)) continue;
      walk(full, cb);
    } else if (e.isFile()) {
      cb(full);
    }
  }
}

function backup(file) {
  const bak = file + '.bak';
  if (!fs.existsSync(bak)) {
    fs.copyFileSync(file, bak);
  }
}

function doFix(file) {
  const ext = path.extname(file).toLowerCase();
  if (!exts.includes(ext)) return;
  let raw = fs.readFileSync(file, 'utf8');
  const orig = raw;

  // Remove BOM
  if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);

  // Normalize newlines
  raw = raw.replace(/\r\n/g, '\n');

  // Trim trailing spaces
  raw = raw.split('\n').map(l => l.replace(/[ \t]+$/g, '')).join('\n');

  try {
    if (ext === '.json') {
      // try to parse and write pretty
      const parsed = JSON.parse(raw);
      raw = JSON.stringify(parsed, null, 2) + '\n';
    } else if (ext === '.yml' || ext === '.yaml') {
      // conservative: replace leading tabs with two spaces
      raw = raw.replace(/^\t+/gm, m => '  '.repeat(m.length));
    }
  } catch (e) {
    // parsing failed: don't overwrite JSON if invalid; just leave newline/trim fixes applied
    console.warn('parse failed for', file, e.message);
  }

  if (raw !== orig) {
    backup(file);
    fs.writeFileSync(file, raw, 'utf8');
    try { track.writeTrack('lion-autofix', 'fix', 'fixed file', { file }); } catch (e) {}
    console.log('fixed:', file);
  }
}

(function main(){
  const repo = process.cwd();
  walk(repo, doFix);
  console.log('lion-autofix-extended: completed');
})();
