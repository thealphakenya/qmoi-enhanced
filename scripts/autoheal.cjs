#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const workspace = process.cwd();

function walk(dir) {
  const list = [];
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    try {
      const stat = fs.statSync(p);
      if (stat.isDirectory()) {
        list.push(...walk(p));
      } else {
        list.push(p);
      }
    } catch (e) {}
  }
  return list;
}

function safeWrite(file, content) { fs.writeFileSync(file, content, 'utf8'); }

function dedupeErrorBoundary(file) {
  let src = fs.readFileSync(file, 'utf8');
  const count = (src.match(/class\s+ErrorBoundary\b/g)||[]).length;
  if (count === 0) return 0;
  const cleaned = src.replace(/class\s+ErrorBoundary[\s\S]*?\n}\n/g, '\n');
  if (!/import\s+ErrorBoundary\s+from\s+['\"]@\/components\/ErrorBoundary['\"]/g.test(cleaned)) {
    fs.writeFileSync(file, `import ErrorBoundary from '@/components/ErrorBoundary';\n` + cleaned);
  } else {
    fs.writeFileSync(file, cleaned);
  }
  return count;
}

function ensureReact(file) {
  let src = fs.readFileSync(file, 'utf8');
  if (!/<[A-Z][A-Za-z0-9]*/.test(src)) return false;
  if (/from\s+['\"]react['\"]/i.test(src)) return false;
  fs.writeFileSync(file, `import React from 'react';\n` + src);
  return true;
}

function run() {
  const files = walk(workspace).filter(f => f.endsWith('.tsx') && f.includes('/components/'));
  const report = { timestamp: new Date().toISOString(), modified: [] };
  for (const file of files) {
    try {
      const d = dedupeErrorBoundary(file);
      const r = ensureReact(file);
      if (d || r) report.modified.push({ file, deduped: d, addedReact: !!r });
    } catch (e) {
      // ignore
    }
  }
  fs.writeFileSync('/tmp/autoheal_report.json', JSON.stringify(report, null, 2));
  try {
    execSync('npx tsc --noEmit 2> /tmp/tsc_output.txt', { stdio: 'inherit' });
  } catch (e) {}
  console.log('autoheal: finished, report at /tmp/autoheal_report.json');
}

run();
