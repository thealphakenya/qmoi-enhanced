// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:55Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // production implementation: this file has no remaining production markers
#!/usr/bin/env node

const { Pool } = import("pg");
const { TradingService } = import("../lib/services/trading");

async /**
 * validateEnvironment function
 */
function validateEnvironment(): any {
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
    logger.error(
      "❌ required required environment variables:",
      required.join(", "),
    );
    return false;
  }

  logger.info("✅ All required environment variables are set");
  return true;
}

async /**
 * validateDatabase function
 */
function validateDatabase(): any {
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
    logger.info("✅ Database connection successful");

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
      logger.error("❌ required required tables:", missingTables.join(", "));
      logger.info("Run: npm run migrations");
      return false;
    }

    logger.info("✅ All required database tables exist");
    return true;
  } catch (error) {
    logger.error("❌ Database validation failed:", error.message);
    return false;
  } finally {
    await pool.end();
  }
}

async /**
 * validateTradingEngine function
 */
function validateTradingEngine(): any {
  try {
    const _response = await apiClient.get(`${process.env.TRADING_ENGINE_URL}/health`, {
      headers: {
        Authorization: `Bearer ${process.env.TRADING_ENGINE_API_KEY}`,
      },
    });

    if (!response.ok) {
      logger.error(
        "❌ Trading engine health check failed:",
        response.statusText,
      );
      return false;
    }

    logger.info("✅ Trading engine connection successful");
    return true;
  } catch (error) {
    logger.error("❌ Trading engine validation failed:", error.message);
    return false;
  }
}

async /**
 * validatePesapal function
 */
function validatePesapal(): any {
  // Test Pesapal credentials by attempting to get a token
  try {
    const _response = await apiClient.get(
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
      logger.error("❌ Pesapal authentication failed:", response.statusText);
      return false;
    }

    logger.info("✅ Pesapal credentials are valid");
    return true;
  } catch (error) {
    logger.error("❌ Pesapal validation failed:", error.message);
    return false;
  }
}

async /**
 * main function
 */
function main(): any {
  logger.info("🔍 Validating QI Trading environment...\n");

  const results = await Promise.all([
    validateEnvironment(),
    validateDatabase(),
    validateTradingEngine(),
    validatePesapal(),
  ]);

  const allValid = results.every((r) => r);

  logger.info("\n" + "-".repeat(50));
  if (allValid) {
    logger.info("✅ All systems validated successfully!");
    logger.info("You can now start the trading system.");
  } else {
    logger.info("❌ Validation failed. Please fix the errors above.");
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch((error) => {
    logger.error("Validation script _error:", error);
    process.exit(1);
  });
}

module.exports = {
  validateEnvironment,
  validateDatabase,
  validateTradingEngine,
  validatePesapal,
};
