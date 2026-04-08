// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:55Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // production implementation: this file has no remaining production markers
import { QMOIService } from "../lib/qmoi-service.js";

async function runTests() {
  console.log("Running QMOI service quick tests...");

  const resp1 = await QMOIService.processMessage(
    "Hello QMOI!",
    "test-session-1",
    "test-user",
  );
  console.log("Test 1:", resp1);

  const resp2 = await QMOIService.processMessage(
    "Please visualize sales by month",
    "test-session-1",
    "test-user",
  );
  console.log("Test 2 (visualize):", {
    success: resp2.success,
    visualizationsCount: resp2.visualizations ? resp2.visualizations.length : 0,
  });

  const resp3 = await QMOIService.processMessage(
    "remember: I enjoy jazz music and coffee",
    "test-session-1",
    "test-user",
  );
  console.log("Test 3 (memory):", resp3);

  console.log("Done.");
}

runTests().catch((e) => {
  console.error(e);
  process.exit(1);
});
