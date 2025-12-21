#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const EXCLUDE_DIRS = new Set(['node_modules', '.git', '.next', 'dist', 'coverage', 'reports', '_archive_qmoi-enhanced']);
const SKIP_FILES = new Set(['link_report.md', 'reports/suggestions.json']);
const SAFE_EXT = new Set(['.md', '.txt', '.rst', '.js', '.ts', '.py', '.json', '.yaml', '.yml']);
const MAX_SAFE_SIZE = 300 * 1024; // skip large files

const TODO = 'TODO_PROD';

async function walk(dir, files = []) {
  const dirents = await fs.promises.readdir(dir, { withFileTypes: true });
  for (const d of dirents) {
    if (EXCLUDE_DIRS.has(d.name)) continue;
    const abs = path.join(dir, d.name);
    if (d.isDirectory()) {
      await walk(abs, files);
    } else {
      files.push(abs);
    }
  }
  return files;
}

(async function main() {
  console.log('Running TODO_PROD scan...');
  const allFiles = await walk(ROOT);
  const report = {
    scannedFiles: 0,
    filesWithMatches: [],
    totalMatches: 0,
  };

  for (const f of allFiles) {
    const name = path.basename(f);
    if (SKIP_FILES.has(name)) continue;
    if (name === 'TODO_PROD_BATCH_RESULTS.json' || name === 'TODO_PROD_CHECK_REPORT.json') continue;
    const ext = path.extname(f).toLowerCase();
    if (!SAFE_EXT.has(ext)) continue;
    let stat;
    try {
      stat = await fs.promises.stat(f);
    } catch (e) {
      continue;
    }
    if (stat.size === 0) continue;
    if (stat.size > MAX_SAFE_SIZE) continue;

    report.scannedFiles++;
    const content = await fs.promises.readFile(f, 'utf8');
    const matches = content.split(TODO).length - 1;
    if (matches > 0) {
      report.filesWithMatches.push({ file: path.relative(ROOT, f), matches });
      report.totalMatches += matches;
    }
  }

  await fs.promises.writeFile(path.join(ROOT, 'TODO_PROD_CHECK_REPORT.json'), JSON.stringify(report, null, 2));

  if (report.filesWithMatches.length) {
    console.error('TODO_PROD check failed — occurrences found in non-excluded files');
    for (const f of report.filesWithMatches) {
      console.error(`${f.file}: ${f.matches}`);
    }
    console.error('\nSee TODO_PROD_CHECK_REPORT.json for details.');
    process.exit(1);
  }

  console.log('TODO_PROD check passed — no matches in scanned files');
  process.exit(0);
})();
