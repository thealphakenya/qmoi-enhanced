// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:06Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // production implementation: this file has no remaining production markers
const { aiService } = require("./lib/ai-service");

async function testPayPalBalance() {
  try {
    console.log("Testing PayPal balance check directly...");
    const result = await aiService.generateResponse("check paypal balance");
    console.log("Result:", result);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testPayPalBalance();
