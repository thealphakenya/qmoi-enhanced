llillllllllillllllllllllllllllllllllllllllllll#!/usr/bin/env node
// Autoheal script: performs safe bulk fixes to reduce common TypeScript/TSX errors.
// Operations:
// - find files with duplicate `class ErrorBoundary` definitions and replace them with an import from components/ErrorBoundary
// - ensure React import is present where JSX is used
// - add missing hook imports (`useState`, `useEffect`, `useCallback`) when used
// - write a report to /tmp/autoheal_report.json

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const workspace = process.cwd();
const report = { timestamp: new Date().toISOString(), fixes: [] };

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
    } catch (e) {
      // ignore
    }
  }
  return list;
}

function safeWrite(file, content) {
  fs.writeFileSync(file, content, 'utf8');
}

function fixErrorBoundary(file) {
  let src = fs.readFileSync(file, 'utf8');
  const occurrences = (src.match(/class\s+ErrorBoundary\b/g) || []).length;
  if (occurrences === 0) return 0;
  // remove class blocks (non-greedy)
  const cleaned = src.replace(/class\s+ErrorBoundary[\s\S]*?\n}\n/g, '\n');
  let out = cleaned;
  // add import at top if not present
  if (!/import\s+ErrorBoundary\s+from\s+['\"]@\/components\/ErrorBoundary['\"];?/.test(out)) {
    out = `import ErrorBoundary from '@/components/ErrorBoundary';\n` + out;
  }
  safeWrite(file, out);
  report.fixes.push({ file, fix: 'dedupe-error-boundary', occurrences });
  return occurrences;
}

function ensureReactImport(file) {
  let src = fs.readFileSync(file, 'utf8');
  if (!/<[A-Z][A-Za-z0-9]*/.test(src)) return false; // no JSX-ish caps
  const hasReactImport = /import\s+React(,|\s|\{|from)/.test(src) || /from\s+['\"]react['\"];?/.test(src);
  if (hasReactImport) return false;
  // add default import
  src = `import React from 'react';\n` + src;
  safeWrite(file, src);
  report.fixes.push({ file, fix: 'add-react-import' });
  return true;
}

function ensureHookImports(file) {
  let src = fs.readFileSync(file, 'utf8');
  const uses = [];
  if (/useState\s*\(/.test(src) && !/useState/.test(getReactNamedImports(src))) uses.push('useState');
  if (/useEffect\s*\(/.test(src) && !/useEffect/.test(getReactNamedImports(src))) uses.push('useEffect');
  if (/useCallback\s*\(/.test(src) && !/useCallback/.test(getReactNamedImports(src))) uses.push('useCallback');
  if (uses.length === 0) return false;
  // find existing React import and patch it
  const reactImportMatch = src.match(/import\s+React\s*(,\s*\{[^}]*\})?\s*from\s+['\"]react['\"];?/);
  if (reactImportMatch) {
    const full = reactImportMatch[0];
    let named = reactImportMatch[1] || '';
    if (!named) named = `, { ${uses.join(', ')} }`;
    else {
      // insert missing hooks into the named import
      named = named.replace(/\{([^}]*)\}/, (m, p1) => {
        const existing = p1.split(',').map(s => s.trim()).filter(Boolean);
        const merged = Array.from(new Set([...existing, ...uses]));
        return `{ ${merged.join(', ')} }`;
      });
    }
    const replacement = `import React${named} from 'react';`;
    src = src.replace(full, replacement);
  } else {
    // try adding named import
    src = `import React, { ${uses.join(', ')} } from 'react';\n` + src;
  }
  safeWrite(file, src);
  report.fixes.push({ file, fix: 'add-hook-imports', imports: uses });
  return true;
}

function getReactNamedImports(src) {
  const m = src.match(/import\s+React\s*,?\s*\{([^}]*)\}\s*from\s+['\"]react['\"];?/);
  if (!m) return '';
  return m[1];
}

function run() {
  const files = walk(workspace);
  const tsxFiles = files.filter(f => f.endsWith('.tsx') && f.includes('/components/'));
  // First pass: dedupe ErrorBoundary and add React imports and hook imports
  for (const file of tsxFiles) {
    try {
      fixErrorBoundary(file);
      ensureReactImport(file);
      ensureHookImports(file);
    } catch (e) {
      // continue
    }
  }

  // Run tsc to get current diagnostics
  try {
    execSync('npx tsc --noEmit 2> /tmp/tsc_output.txt', { stdio: 'inherit' });
    report.tscRan = true;
  } catch (e) {
    // tsc will exit non-zero on errors, but output saved
    report.tscRan = true;
  }

  safeWrite('/tmp/autoheal_report.json', JSON.stringify(report, null, 2));
  console.log('Autoheal completed. Report written to /tmp/autoheal_report.json');
}

run();
