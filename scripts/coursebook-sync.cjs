#!/usr/bin/env node
// Mirror coursebook .md files to .txt for consumers that prefer text format.
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'docs', 'lion', 'coursebooks');
if (!fs.existsSync(srcDir)) {
  console.error('coursebook directory missing:', srcDir);
  process.exit(1);
}
const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.md'));
files.forEach(f => {
  const md = fs.readFileSync(path.join(srcDir, f), 'utf8');
  const txtPath = path.join(srcDir, f.replace(/\.md$/, '.txt'));
  fs.writeFileSync(txtPath, md, 'utf8');
  console.log('Wrote', txtPath);
});
