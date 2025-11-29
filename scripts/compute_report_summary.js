#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const reportPath = path.join(process.cwd(), 'reports', 'placeholder_scan_report.json');
let report = { files: [], replacements: [] };
try {
  report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
} catch (e) {
  // missing or invalid report
}
const filesCount = (report.files || []).length;
const replacementsCount = (report.replacements || []).length;

// Print outputs for GitHub Actions
if (process.env.GITHUB_OUTPUT) {
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `files_count=${filesCount}\n`);
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `replacements_count=${replacementsCount}\n`);
} else {
  console.log(filesCount);
  console.log(replacementsCount);
}

