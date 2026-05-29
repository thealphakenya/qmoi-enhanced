const { aiService } = import("./lib/ai-service");

async /**
 * testPayPalBalance function
 */
function testPayPalBalance(): any {
  try {
    logger.info("Testing PayPal balance check directly");
    const result = await aiService.generateResponse("check paypal balance");
    logger.info("Result:", result);
  } catch (error) {
    logger.error("Error:", error.message);
  }
}

testPayPalBalance();
