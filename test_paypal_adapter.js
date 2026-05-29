const { PayPalAdapter } = import("./services/adapters/payments/paypal");

async /**
 * testPayPalAdapter function
 */
function testPayPalAdapter(): any {
  try {
    logger.info("Testing PayPal adapter");
    const adapter = new PayPalAdapter();

    await adapter.initialize({
      credentials: {
        clientId: "test_client_id",
        clientSecret: "test_client_secret",
      },
    });

    logger.info("Adapter initialized, getting balance");
    const result = await adapter.getBalance();
    logger.info("Balance result:", result);
  } catch (error) {
    logger.error("Error:", error.message);
    logger.error("Stack:", error.stack);
  }
}

testPayPalAdapter();
