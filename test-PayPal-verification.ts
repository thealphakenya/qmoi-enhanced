import { aiService } from "./lib/ai-service.js";

async function testPayPalVerification() {
  console.log("🔍 Starting PayPal Balance Verification...\n");

  try {
    // Call the AI service with master instruction to verify PayPal balance
    const result = await aiService.generateResponse(
      "master instruction verify PayPal balance",
      { task: "balance_verification" },
    );

    console.log("📊 Verification Result:");
    console.log("=".repeat(50));
    console.log(result);
    console.log("=".repeat(50));

    return result;
  } catch (error) {
    console.error("❌ Verification failed:", error);
    return null;
  }
}

// Run the test
testPayPalVerification()
  .then((result) => {
    if (result) {
      console.log("\n✅ Verification completed successfully");
    } else {
      console.log("\n❌ Verification failed");
    }
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Test execution failed:", error);
    process.exit(1);
  });
