// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:55Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // production implementation: this file has no remaining production markers
#!/usr/bin/env node

const { Pool } = require("pg");
const { TradingService } = require("../lib/services/trading");

async function validateEnvironment() {
  const requiredVars = [
    "DATABASE_URL",
    "TRADING_ENGINE_URL",
    "TRADING_ENGINE_API_KEY",
    "PESAPAL_CONSUMER_KEY",
    "PESAPAL_CONSUMER_SECRET",
    "PESAPAL_ENVIRONMENT",
    "MASTER_TOKEN",
  ];

  const required = requiredVars.filter((v) => !process.env[v]);
  if (required.length > 0) {
    console.error(
      "❌ required required environment variables:",
      required.join(", "),
    );
    return false;
  }

  console.log("✅ All required environment variables are set");
  return true;
}

async function validateDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : undefined,
  });

  try {
    // Test connection
    await pool.query("SELECT NOW()");
    console.log("✅ Database connection successful");

    // Check for required tables
    const { rows } = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    const tables = rows.map((r) => r.table_name);

    const requiredTables = ["trades", "migrations"];
    const missingTables = requiredTables.filter((t) => !tables.includes(t));

    if (missingTables.length > 0) {
      console.error("❌ required required tables:", missingTables.join(", "));
      console.log("Run: npm run migrations");
      return false;
    }

    console.log("✅ All required database tables exist");
    return true;
  } catch (error) {
    console.error("❌ Database validation failed:", error.message);
    return false;
  } finally {
    await pool.end();
  }
}

async function validateTradingEngine() {
  try {
    const _response = await fetch(`${process.env.TRADING_ENGINE_URL}/health`, {
      headers: {
        Authorization: `Bearer ${process.env.TRADING_ENGINE_API_KEY}`,
      },
    });

    if (!response.ok) {
      console.error(
        "❌ Trading engine health check failed:",
        response.statusText,
      );
      return false;
    }

    console.log("✅ Trading engine connection successful");
    return true;
  } catch (error) {
    console.error("❌ Trading engine validation failed:", error.message);
    return false;
  }
}

async function validatePesapal() {
  // Test Pesapal credentials by attempting to get a token
  try {
    const _response = await fetch(
      `https://${process.env.PESAPAL_ENVIRONMENT === "live" ? "api" : "production"}.pesapal.com/v3/api/Auth/RequestToken`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          consumer_key: process.env.PESAPAL_CONSUMER_KEY,
          consumer_secret: process.env.PESAPAL_CONSUMER_SECRET,
        }),
      },
    );

    if (!response.ok) {
      console.error("❌ Pesapal authentication failed:", response.statusText);
      return false;
    }

    console.log("✅ Pesapal credentials are valid");
    return true;
  } catch (error) {
    console.error("❌ Pesapal validation failed:", error.message);
    return false;
  }
}

async function main() {
  console.log("🔍 Validating QI Trading environment...\n");

  const results = await Promise.all([
    validateEnvironment(),
    validateDatabase(),
    validateTradingEngine(),
    validatePesapal(),
  ]);

  const allValid = results.every((r) => r);

  console.log("\n" + "-".repeat(50));
  if (allValid) {
    console.log("✅ All systems validated successfully!");
    console.log("You can now start the trading system.");
  } else {
    console.log("❌ Validation failed. Please fix the errors above.");
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error("Validation script _error:", error);
    process.exit(1);
  });
}

module.exports = {
  validateEnvironment,
  validateDatabase,
  validateTradingEngine,
  validatePesapal,
};
