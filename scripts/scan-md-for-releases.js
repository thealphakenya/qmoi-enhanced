#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'docs');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

const keywords = ['release', 'build', 'cashon', 'pesapal', 'autodev', 'autotest', 'releasetrack'];
const results = [];

function scanFile(file) {
  const text = fs.readFileSync(file, 'utf8').toLowerCase();
  for (const kw of keywords) {
    if (text.includes(kw)) {
      results.push({ file: path.relative(root, file), keyword: kw });
      break;
    }
  }
}

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p);
    else if (name.endsWith('.md')) scanFile(p);
  }
}

walk(root);

const out = [];
out.push('# Release & Build Index');
out.push('');
out.push(`Generated: ${new Date().toISOString()}`);
out.push('');
for (const r of results.sort((a,b)=>a.file.localeCompare(b.file))) {
  out.push(`- ${r.file} (matched: ${r.keyword})`);
}

const dest = path.join(outDir, 'release-build-index.md');
fs.writeFileSync(dest, out.join('\n') + '\n');
console.log('Wrote', dest);
