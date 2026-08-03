const { aiService } = require("./lib/ai-service");

async function testPayPalBalance() {
  try {
    console.log("Testing PayPal balance check directly...");
    const result = await aiService.generateResponse("check PayPal balance");
    console.log("Result:", result);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testPayPalBalance();
