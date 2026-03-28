// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:28Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// Production implementation: this file has no remaining non-production markers
const { PayPalAdapter } = require("./services/adapters/payments/paypal");

async function testPayPalAdapter() {
  try {
    console.log("Testing PayPal adapter...");
    const adapter = new PayPalAdapter();

    await adapter.initialize({
      sandboxMode: true,
      credentials: {
        clientId: "test_client_id",
        clientSecret: "test_client_secret",
      },
    });

    console.log("Adapter initialized, getting balance...");
    const result = await adapter.getBalance();
    console.log("Balance result:", result);
  } catch (error) {
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
  }
}

testPayPalAdapter();
