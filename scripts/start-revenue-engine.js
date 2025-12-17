#!/usr/bin/env node

const { qmoiRevenueEngine } = require("../lib/qmoi-revenue-engine");
const { qmoiAutoConfig } = require("../lib/qmoi-auto-config");
const fs = require("fs");
const path = require("path");

class RevenueEngineStarter {
  constructor() {
    this.logFile = path.join(process.cwd(), "logs", "revenue_engine.log");
    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    const logDir = path.dirname(this.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;

    console.log(message);
    fs.appendFileSync(this.logFile, logMessage);
  }

  async start() {
    try {
      this.log("🚀 Starting QMOI Enhanced Revenue Engine...");

      // Step 1: Validate configuration
      this.log("📋 Validating system configuration...");
      const configValidation = await qmoiAutoConfig.validateConfiguration();

      if (!configValidation.success) {
        this.log(
          `❌ Configuration validation failed: ${configValidation.error}`,
        );
        this.log("🔧 Running auto-configuration...");

        const autoConfig = await qmoiAutoConfig.autoConfigureMpesa();
        if (!autoConfig.success) {
          throw new Error(`Auto-configuration failed: ${autoConfig.error}`);
        }

        this.log("✅ Auto-configuration completed successfully");
      } else {
        this.log("✅ Configuration validation passed");
      }

      // Step 2: Test platform connectivity
      this.log("🔗 Testing platform connectivity...");

      const mpesaTest = await qmoiAutoConfig.testMpesaConnectivity();
      if (mpesaTest.success) {
        this.log("✅ M-Pesa connectivity test passed");
      } else {
        this.log(`⚠️  M-Pesa connectivity warning: ${mpesaTest.error}`);
      }

      const airtelTest = await qmoiAutoConfig.testAirtelConnectivity();
      if (airtelTest.success) {
        this.log("✅ Airtel Money connectivity test passed");
      } else {
        this.log(`⚠️  Airtel Money connectivity warning: ${airtelTest.error}`);
      }

      // Step 3: Enable master mode
      this.log("🔐 Enabling master mode...");
      qmoiRevenueEngine.setMasterMode(true);

      // Step 4: Start revenue engine
      this.log("💰 Starting revenue generation...");
      const startResult = await qmoiRevenueEngine.startRevenueEngine();

      if (startResult.success) {
        this.log("✅ Revenue engine started successfully");

        // Step 5: Display initial status
        const status = qmoiRevenueEngine.getDetailedStatus();
        this.log("📊 Initial System Status:");
        this.log(
          `   Engine Status: ${status.engine.running ? "Running" : "Stopped"}`,
        );
        this.log(
          `   Master Mode: ${status.engine.masterMode ? "Enabled" : "Disabled"}`,
        );
        this.log(`   M-Pesa Target: ${status.today.mpesa.target} KES`);
        this.log(`   Airtel Target: ${status.today.airtel.target} KES`);
        this.log(`   Combined Target: ${status.today.combined.target} KES`);

        // Step 6: Start monitoring
        this.log("📈 Starting revenue monitoring...");
        this.startMonitoring();

        // Step 7: Keep the process running
        this.log("🔄 Revenue engine is now running. Press Ctrl+C to stop.");

        // Handle graceful shutdown
        process.on("SIGINT", async () => {
          this.log("🛑 Shutting down revenue engine...");
          await qmoiRevenueEngine.stopRevenueEngine();
          this.log("✅ Revenue engine stopped successfully");
          process.exit(0);
        });

        process.on("SIGTERM", async () => {
          this.log("🛑 Received SIGTERM, shutting down...");
          await qmoiRevenueEngine.stopRevenueEngine();
          this.log("✅ Revenue engine stopped successfully");
          process.exit(0);
        });
      } else {
        throw new Error(
          `Failed to start revenue engine: ${startResult.message}`,
        );
      }
    } catch (error) {
      this.log(`❌ Failed to start revenue engine: ${error.message}`);
      console.error(error);
      process.exit(1);
    }
  }

  startMonitoring() {
    // Monitor revenue every 30 seconds
    setInterval(() => {
      try {
        const status = qmoiRevenueEngine.getDetailedStatus();
        const today = status.today;

        // Log progress every 5 minutes
        if (Date.now() % 300000 < 30000) {
          // Every 5 minutes
          this.log(`📊 Revenue Progress Update:`);
          this.log(
            `   M-Pesa: ${today.mpesa.earned}/${today.mpesa.target} KES (${((today.mpesa.earned / today.mpesa.target) * 100).toFixed(1)}%)`,
          );
          this.log(
            `   Airtel: ${today.airtel.earned}/${today.airtel.target} KES (${((today.airtel.earned / today.airtel.target) * 100).toFixed(1)}%)`,
          );
          this.log(
            `   Combined: ${today.combined.earned}/${today.combined.target} KES (${((today.combined.earned / today.combined.target) * 100).toFixed(1)}%)`,
          );
        }

        // Check for target completion
        if (
          today.mpesa.earned >= today.mpesa.target &&
          !this.mpesaTargetReached
        ) {
          this.log("🎉 M-Pesa daily target reached!");
          this.mpesaTargetReached = true;
        }

        if (
          today.airtel.earned >= today.airtel.target &&
          !this.airtelTargetReached
        ) {
          this.log("🎉 Airtel Money daily target reached!");
          this.airtelTargetReached = true;
        }

        if (
          today.combined.earned >= today.combined.target &&
          !this.combinedTargetReached
        ) {
          this.log("🎉 Combined daily target reached!");
          this.combinedTargetReached = true;
        }
      } catch (error) {
        this.log(`⚠️  Monitoring error: ${error.message}`);
      }
    }, 30000); // Every 30 seconds
  }

  async showHelp() {
    console.log(`
QMOI Enhanced Revenue Engine Starter

Usage:
  node scripts/start-revenue-engine.js [options]

Options:
  --help, -h          Show this help message
  --config            Run auto-configuration only
  --validate          Validate configuration only
  --test              Test platform connectivity only
  --monitor           Start monitoring only (no engine start)

Examples:
  node scripts/start-revenue-engine.js                    # Start full revenue engine
  node scripts/start-revenue-engine.js --config           # Run auto-configuration
  node scripts/start-revenue-engine.js --validate         # Validate configuration
  node scripts/start-revenue-engine.js --test             # Test connectivity
  node scripts/start-revenue-engine.js --monitor          # Monitor only

Environment Variables:
  QMOI_MASTER_API_KEY     Master API key for authentication
  MPESA_CONSUMER_KEY      M-Pesa consumer key
  MPESA_CONSUMER_SECRET   M-Pesa consumer secret
  AIRTEL_CLIENT_ID        Airtel Money client ID
  AIRTEL_CLIENT_SECRET    Airtel Money client secret

Logs:
  Revenue engine logs are saved to: logs/revenue_engine.log
  Configuration logs are saved to: logs/qmoi_auto_config.log

For more information, see REVENUEGENERATING.md
    `);
  }
}

// Main execution
async function main() {
  const starter = new RevenueEngineStarter();

  // Parse command line arguments
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    starter.showHelp();
    return;
  }

  if (args.includes("--config")) {
    starter.log("🔧 Running auto-configuration...");
    const result = await qmoiAutoConfig.autoConfigureMpesa();
    starter.log(
      result.success
        ? "✅ Configuration completed"
        : `❌ Configuration failed: ${result.error}`,
    );
    return;
  }

  if (args.includes("--validate")) {
    starter.log("📋 Validating configuration...");
    const result = await qmoiAutoConfig.validateConfiguration();
    starter.log(
      result.success
        ? "✅ Configuration valid"
        : `❌ Configuration invalid: ${result.error}`,
    );
    return;
  }

  if (args.includes("--test")) {
    starter.log("🔗 Testing platform connectivity...");
    const mpesaTest = await qmoiAutoConfig.testMpesaConnectivity();
    const airtelTest = await qmoiAutoConfig.testAirtelConnectivity();

    starter.log(`M-Pesa: ${mpesaTest.success ? "✅ Connected" : "❌ Failed"}`);
    starter.log(`Airtel: ${airtelTest.success ? "✅ Connected" : "❌ Failed"}`);
    return;
  }

  if (args.includes("--monitor")) {
    starter.log("📈 Starting monitoring only...");
    qmoiRevenueEngine.setMasterMode(true);
    starter.startMonitoring();

    process.on("SIGINT", () => {
      starter.log("🛑 Monitoring stopped");
      process.exit(0);
    });

    return;
  }

  // Start full revenue engine
  await starter.start();
}

// Run the main function
if (require.main === module) {
  main().catch((error) => {
    console.error("❌ Fatal error:", error.message);
    process.exit(1);
  });
}

module.exports = { RevenueEngineStarter };
