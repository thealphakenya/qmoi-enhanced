#!/usr/bin/env node

/**
 * QMoi Testing Runner
 * Runs comprehensive tests on QMoi's capabilities
 */

import QMOITestingSuite from "./lib/qmoi-testing-suite.ts";
import * as fs from "fs";
import * as path from "path";

async function runTests() {
  console.log("🚀 Starting QMoi Comprehensive Testing Suite...\n");

  const suite = new QMOITestingSuite();
  const results = await suite.runAllTests();

  const report = suite.generateReport(results);

  // Save report to file
  const reportPath = path.join(process.cwd(), "QMoi_Test_Report.md");
  fs.writeFileSync(reportPath, report);

  console.log(report);
  console.log(`\n📄 Full report saved to: ${reportPath}`);

  // Summary
  const passedTests = results.filter((r) => r.passed).length;
  const totalTests = results.length;
  const overallScore =
    results.reduce((sum, r) => sum + r.score, 0) / totalTests;

  console.log(`\n📊 Summary:`);
  console.log(
    `   Tests Passed: ${passedTests}/${totalTests} (${((passedTests / totalTests) * 100).toFixed(1)}%)`,
  );
  console.log(`   Overall Score: ${overallScore.toFixed(1)}/10`);

  if (passedTests === totalTests) {
    console.log("🎉 All tests passed! QMoi is fully functional.");
  } else {
    console.log("⚠️  Some tests failed. Review the report for details.");
  }
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error);
}

export { runTests };
