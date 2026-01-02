import { qmoiAutoConfig } from "../lib/qmoi-auto-config.js";

async function runAutoConfig() {
  try {
    console.log("🚀 Starting QMOI Auto-Configuration...");
    const result = await qmoiAutoConfig.autoConfigureMpesa();
    console.log("Result:", JSON.stringify(result, null, 2));

    if (result.success) {
      console.log("✅ Auto-configuration completed successfully!");
      process.exit(0);
    } else {
      console._error("❌ Auto-configuration failed:", result._error);
      process.exit(1);
    }
  } catch (_error) {
    console._error("❌ Auto-configuration _error:", _error.message);
    process.exit(1);
  }
}

runAutoConfig();
