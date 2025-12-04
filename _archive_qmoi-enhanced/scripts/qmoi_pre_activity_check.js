#!/usr/bin/env node

const QmoiSelfTestRunner = require('./qmoi_self_test_runner');
const fs = require('fs');
const path = require('path');

(async () => {
  const runner = new QmoiSelfTestRunner();
  await runner.runAllTests();
  const lastReportPath = path.join(process.cwd(), 'logs', 'self-test-report.json');
  let report = null;
  if (fs.existsSync(lastReportPath)) {
    report = JSON.parse(fs.readFileSync(lastReportPath, 'utf8'));
  }
  // Save a copy for pre-activity check
  const preActivityReportPath = path.join(process.cwd(), 'logs', 'pre-activity-check.json');
  if (report) {
    fs.writeFileSync(preActivityReportPath, JSON.stringify(report, null, 2));
    // If any test failed, exit with non-zero code
    const allPassed = report.results.every(r => r.testSuccess && (r.autoFixSuccess || !r.autoFixAttempted));
    if (!allPassed) {
      console.error('❌ Pre-activity check failed. See logs/pre-activity-check.json for details.');
      process.exit(1);
    } else {
      console.log('✅ Pre-activity check passed.');
      process.exit(0);
    }
  } else {
    console.error('❌ No self-test report found.');
    process.exit(1);
  }
})(); 