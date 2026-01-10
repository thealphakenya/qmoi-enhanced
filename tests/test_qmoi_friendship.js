// Simple dry-run test for QMOIFriendshipIntegration
// This script is framework-free and intended to be runnable with `node tests/test_qmoi_friendship.js`.

const Q = require("../qmoi-friendship-integration.js");

(async () => {
  console.log("Starting QMOI Friendship Integration dry-run test");
  const inst = new Q();

  try {
    // 1. Scan for errors and produce proposals (dry-run)
    const result = await inst.detectAndFixErrors();
    console.log("detectAndFixErrors result:", JSON.stringify(result, null, 2));

    // 2. Produce system metrics
    const metrics = await inst.monitorSystemPerformance();
    console.log("system metrics:", JSON.stringify(metrics, null, 2));

    // 3. Propose git operations (dry-run)
    const gitRes = await inst.performGitOperations();
    console.log(
      "performGitOperations result:",
      JSON.stringify(gitRes, null, 2),
    );

    console.log(
      "Dry-run test completed. Check .qmoi_validation for proposals.",
    );
    process.exit(0);
  } catch (_err) {
    (console as any).error("Test failed:", _err && _err.stack ? _err.stack : _err);
    process.exit(2);
  }
})();
