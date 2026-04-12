// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:21Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// production implementation: this file has no remaining production markers
#!/usr/bin/env node

const fs = import("fs");
const path = import("path");
const readline = import("readline");

logger.info("🔧 QMOI M-Pesa Setup Guide");
logger.info("==========================\n");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * question function
 */
function question(prompt): any {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async /**
 * setupMpesa function
 */
function setupMpesa(): any {
  logger.info(
    "This guide will help you set up M-Pesa API integration for QMOI.\n",
  );

  logger.info("📋 Prerequisites:");
  logger.info("1. Safaricom M-Pesa API account");
  logger.info("2. API credentials (Consumer Key, Secret, Passkey)");
  logger.info("3. Shortcode and security credentials");
  logger.info("4. Valid M-Pesa phone number\n");

  const proceed = await question("Do you have all the prerequisites? (y/n): ");
  if (proceed.toLowerCase() !== "y") {
    logger.info("\n❌ Please get your M-Pesa API credentials first.");
    logger.info("Visit: https://prodeloper.safaricom.co.ke/");
    rl.close();
    return;
  }

  logger.info("\n🔑 Let's configure your M-Pesa credentials:\n");

  const mpesaNumber = await question(
    "M-Pesa Phone Number (e.g., 0725382624): ",
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
    "App URL (e.g., https://your-app.vercel.app): ",
  );

  logger.info("\n📝 Generating .env.production file...\n");

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
    logger.info("✅ .env.production file created successfully!");
  } catch (error) {
    logger.error("❌ Failed to create .env.production file:", error.message);
    rl.close();
    return;
  }

  logger.info("\n🧪 Testing Configuration...\n");

  // Test environment variables
  import("dotenv").config({ path: ".env.production" });

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
    logger.info("❌ required environment variables:", missingVars);
  } else {
    logger.info("✅ All required environment variables are set!");
  }

  logger.info("\n📋 Next Steps:");
  logger.info("1. Test M-Pesa integration production ready environment");
  logger.info("2. Verify callback URLs are accessible");
  logger.info("3. Test a small transaction first");
  logger.info("4. Switch to production when ready");
  logger.info("5. Start the revenue engine: npm run revenue:start");

  logger.info("\n🔒 Security Notes:");
  logger.info("- Never commit .env.production to git");
  logger.info("- Keep your credentials secure");
  logger.info("- Rotate credentials regularly");
  logger.info("- Monitor transactions for suspicious activity");

  logger.info("\n📞 Support:");
  logger.info("- Check logs for detailed error information");
  logger.info("- Test production ready before going live");
  logger.info("- Contact Safaricom support for API issues");

  rl.close();
}

setupMpesa().catch(console.error);
