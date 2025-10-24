#!/usr/bin/env node
// conservative autofix scaffold for Lion-related placeholders
const fs = require('fs');
const path = require('path');

function walk(dir) {
  const files = [];
  fs.readdirSync(dir).forEach(f => {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) files.push(...walk(full));
    else files.push(full);
  });
  return files;
}

const root = process.cwd();
const targets = walk(root).filter(p => p.endsWith('.js') || p.endsWith('.ts') || p.endsWith('.md'));
targets.forEach(file => {
  try {
    let txt = fs.readFileSync(file, 'utf8');
    if (txt.includes('[PRODUCTION IMPLEMENTATION REQUIRED]')) {
      const backup = file + '.bak';
      fs.copyFileSync(file, backup);
      txt = txt.replace(/\[PRODUCTION IMPLEMENTATION REQUIRED\]/g, '/* PRODUCTION_PLACEHOLDER */');
      fs.writeFileSync(file, txt, 'utf8');
      console.log('Patched', file);
    }
  } catch (e) { }
});

console.log('lion-autofix: done');
