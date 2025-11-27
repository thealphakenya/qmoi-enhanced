#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

try {
  console.log('Running placeholder checker in dry-run & apply mode (no-notify)...');
  execSync('node scripts/qmoi_placeholder_checker.js --scan --apply --dry-run --no-notify --fail-on-find', { stdio: 'inherit' });
} catch (e) {
  console.error('Checker failed:', e.message);
}

const reportPath = path.join(process.cwd(), 'reports', 'placeholder_scan_report.json');
if (fs.existsSync(reportPath)) {
  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  console.log('\nSummary:');
  console.log('  Files with placeholders:', report.files.length);
  console.log('  Replacements suggested:', report.replacements.length);
  console.log('\nReport path:', reportPath);
} else {
  console.error('Report not found at:', reportPath);
}
