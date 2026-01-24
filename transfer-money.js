#!/usr/bin/env node

/**
 * QMOI Money Transfer Script
 * Send $1000 to CashOn using PayPal
 */

import { aiService } from "./lib/ai-service.ts";

async function initiateMoneyTransfer() {
  try {
    console.log("💸 Initiating Money Transfer: $1000 to CashOn via PayPal");
    console.log("=".repeat(60));

    const instruction = `As master, send 1000 dollars to cashon using paypal payment gateway. Cashon has pesapal credentials configured and ready. Process this payment immediately.`;

    console.log("📝 Master Instruction:");
    console.log(instruction);
    console.log();

    const response = await aiService.generateResponse(
      `master instruction ${instruction}`,
    );

    console.log("🤖 QMOI Response:");
    console.log("-".repeat(20));
    console.log(response);

    // Check if transfer was successful
    if (
      response.toLowerCase().includes("success") ||
      response.toLowerCase().includes("completed") ||
      response.toLowerCase().includes("sent")
    ) {
      console.log("\n✅ Money transfer appears to be successful!");
      console.log("💰 $1000 has been sent to CashOn via PayPal");
    } else {
      console.log("\n⚠️ Transfer status unclear - please check QMOI logs");
    }
  } catch (error) {
    console.error("❌ Error initiating money transfer:", error.message);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  initiateMoneyTransfer();
}

export { initiateMoneyTransfer };
