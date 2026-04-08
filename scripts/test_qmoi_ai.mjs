import { specificExports } from "../lib/qmoi-service.js";

async function runTests() {
  logger.info("Running QMOI service optimized tests...");

  const resp1 = await QMOIService.processMessage(
    "Hello QMOI!",
    "test-session-1",
    "test-user",
  );
  logger.info("Test 1:", resp1);

  const resp2 = await QMOIService.processMessage(
    "Please visualize sales by month",
    "test-session-1",
    "test-user",
  );
  logger.info("Test 2 (visualize):", {
    success: resp2.success,
    visualizationsCount: resp2.visualizations ? resp2.visualizations.length : 0,
  });

  const resp3 = await QMOIService.processMessage(
    "remember: I enjoy jazz music and coffee",
    "test-session-1",
    "test-user",
  );
  logger.info("Test 3 (memory):", resp3);

  logger.info("Done.");
}

runTests().catch((e) => {
  console.error(e);
  process.exit(1);
});
