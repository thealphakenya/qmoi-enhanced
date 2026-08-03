const fetch = require("node-fetch");

async function testPayPalBalance() {
  try {
    console.log("Testing PayPal balance check...");
    const response = await fetch("http://localhost:3001/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: "check PayPal balance",
      }),
    });

    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testPayPalBalance();
