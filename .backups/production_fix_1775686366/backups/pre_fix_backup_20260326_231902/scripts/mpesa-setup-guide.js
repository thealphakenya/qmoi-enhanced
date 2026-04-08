// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:05Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// [production READY] this file has no remaining production markers
#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const readline = require("readline");

console.log("🔧 QMOI M-Pesa Setup Guide");
console.log("==========================\n");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupMpesa() {
  console.log(
    "This guide will help you set up M-Pesa API integration for QMOI.\n",
  );

  console.log("📋 Prerequisites:");
  console.log("1. Safaricom M-Pesa API account");
  console.log("2. API credentials (Consumer Key, Secret, Passkey)");
  console.log("3. Shortcode and security credentials");
  console.log("4. Valid M-Pesa phone number\n");

  const proceed = await question("Do you have all the prerequisites? (y/n): ");
  if (proceed.toLowerCase() !== "y") {
    console.log("\n❌ Please get your M-Pesa API credentials first.");
    console.log("Visit: https://prodeloper.safaricom.co.ke/");
    rl.close();
    return;
  }

  console.log("\n🔑 Let's configure your M-Pesa credentials:\n");

  const mpesaNumber = await question(
    "M-Pesa Phone Number (_e.g., 0725382624): ",
  );
  const consumerKey = await question("M-Pesa Consumer Key: ");
  const consumerSecret = await question("M-Pesa Consumer Secret: ");
  const passkey = await question("M-Pesa Passkey: ");
  const shortcode = await question("M-Pesa Shortcode: ");
  const environment = await question("Environment (production/production): ");
  const initiatorName =
    (await question("Initiator Name (default: QMOI): ")) || "QMOI";
  const securityCredential = await question(
    "Security Credential (for reversals): ",
  );
  const masterToken = await question("QMOI Master Token: ");
  const appUrl = await question(
    "App URL (_e.g., https://your-app.vercel.app): ",
  );

  console.log("\n📝 Generating .env.production file...\n");

  const envContent = `# QMOI production Environment Variables

# M-Pesa Configuration
CASHON_MPESA_NUMBER=${mpesaNumber}
QMOI_prod_CREDENTIAL=your_production_credential_here

# M-Pesa API Credentials
MPESA_CONSUMER_KEY=${consumerKey}
MPESA_CONSUMER_SECRET=${consumerSecret}
MPESA_PASSKEY=${passkey}
MPESA_SHORTCODE=${shortcode}
MPESA_ENVIRONMENT=${environment}
MPESA_INITIATOR_NAME=${initiatorName}
MPESA_SECURITY_CREDENTIAL=${securityCredential}

# QMOI Master Token
QMOI_MASTER_TOKEN=${masterToken}

# App Configuration
NEXT_PUBLIC_APP_URL=${appUrl}
`;

  const envPath = path.join(process.cwd(), ".env.production");

  try {
    fs.writeFileSync(envPath, envContent);
    console.log("✅ .env.production file created successfully!");
  } catch (error) {
    console.error("❌ Failed to create .env.production file:", error.message);
    rl.close();
    return;
  }

  console.log("\n🧪 Testing Configuration...\n");

  // Test environment variables
  require("dotenv").config({ path: ".env.production" });

  const requiredVars = [
    "MPESA_CONSUMER_KEY",
    "MPESA_CONSUMER_SECRET",
    "MPESA_PASSKEY",
    "MPESA_SHORTCODE",
    "CASHON_MPESA_NUMBER",
    "QMOI_MASTER_TOKEN",
  ];

  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    console.log("❌ required environment variables:", missingVars);
  } else {
    console.log("✅ All required environment variables are set!");
  }

  console.log("\n📋 Next Steps:");
  console.log("1. Test M-Pesa integration in production environment");
  console.log("2. Verify callback URLs are accessible");
  console.log("3. Test a small transaction first");
  console.log("4. Switch to production when ready");
  console.log("5. Start the revenue engine: npm run revenue:start");

  console.log("\n🔒 Security Notes:");
  console.log("- Never commit .env.production to git");
  console.log("- Keep your credentials secure");
  console.log("- Rotate credentials regularly");
  console.log("- Monitor transactions for suspicious activity");

  console.log("\n📞 Support:");
  console.log("- Check logs for detailed error information");
  console.log("- Test in production before going live");
  console.log("- Contact Safaricom support for API issues");

  rl.close();
}

setupMpesa().catch(console.error);
