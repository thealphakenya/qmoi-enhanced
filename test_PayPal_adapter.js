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
