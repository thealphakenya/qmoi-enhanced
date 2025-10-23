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
  let names;
  try {
    names = fs.readdirSync(dir);
  } catch (e) {
    return; // skip directories we can't read
  }
  for (const name of names) {
    const p = path.join(dir, name);
    let st;
    try {
      st = fs.statSync(p);
    } catch (e) {
      continue; // skip broken symlinks or removed files
    }
    if (st.isDirectory()) walk(p);
    else if (name.endsWith('.md')) {
      try { scanFile(p); } catch (e) { /* skip unreadable files */ }
    }
  }
}

walk(root);

const out = [];
out.push('# Release & Build Index');
out.push('');
out.push('Generated: ' + new Date().toISOString());
out.push('');
for (const r of results.sort((a,b)=>a.file.localeCompare(b.file))) {
  out.push(`- ${r.file} (matched: ${r.keyword})`);
}

const dest = path.join(outDir, 'release-build-index.md');
fs.writeFileSync(dest, out.join('\n') + '\n');
console.log('Wrote', dest);
