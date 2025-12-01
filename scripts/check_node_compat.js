#!/usr/bin/env node
// Scan the repo for potential Node ESM/CJS mismatches and print a report.
import fs from 'fs';
import path from 'path';

function walk(dir, cb) {
  const items = fs.readdirSync(dir);
  for (const it of items) {
    const full = path.join(dir, it);
    const st = fs.statSync(full);
    if (st.isDirectory()) {
      if (it === 'node_modules' || it === '.git' || it === 'dist' || it === '.next') continue;
      walk(full, cb);
    } else {
      cb(full);
    }
  }
}

const repoRoot = process.cwd();
const fileResults = [];
walk(repoRoot, (file) => {
  if (!file.endsWith('.js') && !file.endsWith('.mjs') && !file.endsWith('.cjs')) return;
  try {
    const txt = fs.readFileSync(file, 'utf8');
    const hasRequire = /\brequire\(/.test(txt);
    const hasImport = /(^|\n)\s*import\s+/.test(txt);
    // If the repo is using ESM (package.json 'type': 'module'), and file uses require, warn.
    if (hasRequire && !file.endsWith('.cjs')) {
      fileResults.push({file, hasRequire, hasImport});
    }
  } catch (err) {
    // ignore binary files
  }
});

if (fileResults.length === 0) {
  console.log('No obvious ESM/CJS mismatches detected (no JS files with require found).');
  process.exit(0);
}

console.log('Potential ESM/CJS compatibility issues:');
for (const r of fileResults.slice(0, 200)) {
  console.log(` - ${r.file}` + (r.hasImport ? ' (contains import + require)' : ' (contains require)'));
}
console.log('Recommendations: Convert CommonJS files to ESM or rename to .cjs when using "type":"module" in package.json.');
process.exit(0);
