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
      console.error("❌ Auto-configuration failed:", result.error);
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Auto-configuration error:", error.message);
    process.exit(1);
  }
}

runAutoConfig();
