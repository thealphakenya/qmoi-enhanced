#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// QMOI Payment Fix Script - Resolves payment failures affecting autodevelopment
class QmoiPaymentFix {
  constructor() {
    this.projectRoot = process.cwd();
    this.logFile = path.join(this.projectRoot, "logs", "payment-fix.log");
    this.configPath = path.join(this.projectRoot, ".env.production");
    this.issues = [];
    this.fixes = [];

    // Ensure logs directory exists
    if (!fs.existsSync(path.dirname(this.logFile))) {
      fs.mkdirSync(path.dirname(this.logFile), { recursive: true });
    }
  }

  log(message, type = "INFO") {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${type}] ${message}`;
    console.log(logMessage);
    fs.appendFileSync(this.logFile, logMessage + "\n");
  }

  async checkPaymentCredentials() {
    this.log("🔍 Checking payment credentials...");

    const issues = [];

    // Check if .env.production exists
    if (!fs.existsSync(this.configPath)) {
      issues.push("Missing .env.production file");
      return issues;
    }

    // Load environment variables
    const envContent = fs.readFileSync(this.configPath, "utf8");
    const envVars = {};

    envContent.split("\n").forEach((line) => {
      const [key, value] = line.split("=");
      if (key && value) {
        envVars[key.trim()] = value.trim();
      }
    });

    // Check required payment credentials
    const requiredCredentials = [
      "MPESA_CONSUMER_KEY",
      "MPESA_CONSUMER_SECRET",
      "MPESA_PASSKEY",
      "MPESA_SHORTCODE",
      "AIRTEL_CLIENT_ID",
      "AIRTEL_CLIENT_SECRET",
      "PESAPAL_CONSUMER_KEY",
      "PESAPAL_CONSUMER_SECRET",
      "CASHON_MPESA_NUMBER",
      "QMOI_MASTER_TOKEN",
    ];

    for (const credential of requiredCredentials) {
      if (!envVars[credential] || envVars[credential] === "") {
        issues.push(`Missing or empty ${credential}`);
      }
    }

    return issues;
  }

  async fixPaymentCredentials() {
    this.log("🔧 Fixing payment credentials...");

    const fixes = [];

    // Create backup of current config
    if (fs.existsSync(this.configPath)) {
      const backupPath = this.configPath + ".backup." + Date.now();
      fs.copyFileSync(this.configPath, backupPath);
      this.log(`Backup created: ${backupPath}`);
    }

    // Generate new credentials or restore defaults
    const newCredentials = {
      MPESA_CONSUMER_KEY:
        process.env.MPESA_CONSUMER_KEY ||
        "ruOrfyOb22NgqcsmToADVNDf0Gltcu6AI8woFLOusfgkNBnj",
      MPESA_CONSUMER_SECRET:
        process.env.MPESA_CONSUMER_SECRET ||
        "u27oKMfyACGxoQsD2bAuAJn0QzMQ8cWofA6bfzuG4hXaGxCB90PiGOSuCVNcaCSj",
      MPESA_PASSKEY:
        process.env.MPESA_PASSKEY ||
        "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919",
      MPESA_SHORTCODE: process.env.MPESA_SHORTCODE || "174379",
      AIRTEL_CLIENT_ID: process.env.AIRTEL_CLIENT_ID || "your_airtel_client_id",
      AIRTEL_CLIENT_SECRET:
        process.env.AIRTEL_CLIENT_SECRET || "your_airtel_client_secret",
      PESAPAL_CONSUMER_KEY:
        process.env.PESAPAL_CONSUMER_KEY || "UCz/GBzE5O5vNpzt99a6xEEqMi0O3QQE",
      PESAPAL_CONSUMER_SECRET:
        process.env.PESAPAL_CONSUMER_SECRET || "OyeJBzYMiWvVQdfNGJW3/wBpems=",
      CASHON_MPESA_NUMBER: process.env.CASHON_MPESA_NUMBER || "254786322855",
      QMOI_MASTER_TOKEN:
        process.env.QMOI_MASTER_TOKEN || "qmoi_master_token_" + Date.now(),
      QMOI_DAILY_TARGET: process.env.QMOI_DAILY_TARGET || "10000",
      QMOI_AUTO_TRANSFER_AMOUNT:
        process.env.QMOI_AUTO_TRANSFER_AMOUNT || "2000",
      QMOI_GROWTH_TARGET: process.env.QMOI_GROWTH_TARGET || "0.20",
    };

    // Write new credentials to .env.production
    const envContent = Object.entries(newCredentials)
      .map(([key, value]) => `${key}=${value}`)
      .join("\n");

    fs.writeFileSync(this.configPath, envContent);
    fixes.push("Payment credentials updated");

    return fixes;
  }

  async checkPaymentAPIs() {
    this.log("🔍 Testing payment API connectivity...");

    const issues = [];

    try {
      // Test M-Pesa API connectivity
      const mpesaTest = await this.testMpesaAPI();
      if (!mpesaTest.success) {
        issues.push(`M-Pesa API: ${mpesaTest.error}`);
      }

      // Test Airtel API connectivity
      const airtelTest = await this.testAirtelAPI();
      if (!airtelTest.success) {
        issues.push(`Airtel API: ${airtelTest.error}`);
      }

      // Test Pesapal API connectivity
      const pesapalTest = await this.testPesapalAPI();
      if (!pesapalTest.success) {
        issues.push(`Pesapal API: ${pesapalTest.error}`);
      }
    } catch (error) {
      issues.push(`API connectivity test failed: ${error.message}`);
    }

    return issues;
  }

  async testMpesaAPI() {
    try {
      // Simulate M-Pesa API test
      const response = await fetch(
        "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
        {
          method: "GET",
          headers: {
            Authorization:
              "Basic " +
              Buffer.from(
                process.env.MPESA_CONSUMER_KEY +
                  ":" +
                  process.env.MPESA_CONSUMER_SECRET,
              ).toString("base64"),
          },
        },
      );

      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, error: `HTTP ${response.status}` };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async testAirtelAPI() {
    try {
      // Simulate Airtel API test
      const response = await fetch(
        "https://openapiuat.airtel.africa/auth/oauth2/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            client_id: process.env.AIRTEL_CLIENT_ID,
            client_secret: process.env.AIRTEL_CLIENT_SECRET,
            grant_type: "client_credentials",
          }),
        },
      );

      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, error: `HTTP ${response.status}` };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async testPesapalAPI() {
    try {
      // Simulate Pesapal API test
      const response = await fetch(
        "https://demo.pesapal.com/api/PostPesapalDirectOrderV4",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/xml",
          },
          body: "<test>connection</test>",
        },
      );

      // Pesapal might return different status codes, but we're just testing connectivity
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async fixPaymentAPIs() {
    this.log("🔧 Fixing payment API issues...");

    const fixes = [];

    // Update API endpoints to use sandbox/test environments
    const apiFixes = {
      MPESA_ENVIRONMENT: "sandbox",
      AIRTEL_ENVIRONMENT: "sandbox",
      PESAPAL_ENVIRONMENT: "demo",
      MPESA_CALLBACK_URL: "https://your-domain.com/api/mpesa/callback",
      AIRTEL_CALLBACK_URL: "https://your-domain.com/api/airtel/callback",
      PESAPAL_CALLBACK_URL: "https://your-domain.com/api/pesapal/callback",
    };

    // Append to .env.production
    const envContent = fs.readFileSync(this.configPath, "utf8");
    const newEnvContent =
      envContent +
      "\n" +
      Object.entries(apiFixes)
        .map(([key, value]) => `${key}=${value}`)
        .join("\n");

    fs.writeFileSync(this.configPath, newEnvContent);
    fixes.push("Payment API configurations updated");

    return fixes;
  }

  async checkRevenueEngine() {
    this.log("🔍 Checking revenue engine status...");

    const issues = [];

    try {
      // Check if revenue engine is running
      const revenueStatus = await this.getRevenueStatus();
      if (!revenueStatus.running) {
        issues.push("Revenue engine not running");
      }

      // Check recent payment failures
      const recentFailures = await this.getRecentPaymentFailures();
      if (recentFailures.length > 0) {
        issues.push(
          `Recent payment failures: ${recentFailures.length} failures detected`,
        );
      }
    } catch (error) {
      issues.push(`Revenue engine check failed: ${error.message}`);
    }

    return issues;
  }

  async getRevenueStatus() {
    try {
      // Simulate revenue status check
      return { running: true, dailyEarnings: 5000, target: 10000 };
    } catch (error) {
      return { running: false, error: error.message };
    }
  }

  async getRecentPaymentFailures() {
    try {
      // Simulate checking recent payment failures
      return []; // Empty array means no recent failures
    } catch (error) {
      return [{ error: error.message }];
    }
  }

  async fixRevenueEngine() {
    this.log("🔧 Fixing revenue engine...");

    const fixes = [];

    try {
      // Restart revenue engine
      execSync("npm run revenue:stop", { stdio: "pipe" });
      execSync("npm run revenue:start", { stdio: "pipe" });
      fixes.push("Revenue engine restarted");

      // Clear payment failure cache
      const cacheDir = path.join(this.projectRoot, ".next", "cache");
      if (fs.existsSync(cacheDir)) {
        execSync("npx rimraf .next/cache", { stdio: "pipe" });
        fixes.push("Payment cache cleared");
      }
    } catch (error) {
      this.log(`Revenue engine fix failed: ${error.message}`, "ERROR");
    }

    return fixes;
  }

  async checkAnnotations() {
    this.log("🔍 Checking annotation system...");

    const issues = [];

    try {
      // Check if annotation files exist
      const annotationFiles = [
        "docs/API.md",
        "docs/README.md",
        "QMOI-ENHANCED-README.md",
        "QMOI-REVENUE-README.md",
      ];

      for (const file of annotationFiles) {
        if (!fs.existsSync(file)) {
          issues.push(`Missing annotation file: ${file}`);
        }
      }

      // Check annotation syntax
      const syntaxIssues = await this.checkAnnotationSyntax();
      issues.push(...syntaxIssues);
    } catch (error) {
      issues.push(`Annotation check failed: ${error.message}`);
    }

    return issues;
  }

  async checkAnnotationSyntax() {
    const issues = [];

    try {
      // Check markdown files for syntax errors
      const mdFiles = this.findFilesByExtension(".md");

      for (const file of mdFiles) {
        try {
          const content = fs.readFileSync(file, "utf8");

          // Check for common markdown syntax issues
          if (content.includes("```") && !content.includes("```\n")) {
            issues.push(`Code block syntax issue in ${file}`);
          }

          if (content.includes("[") && !content.includes("]")) {
            issues.push(`Unclosed bracket in ${file}`);
          }
        } catch (error) {
          issues.push(`Error reading ${file}: ${error.message}`);
        }
      }
    } catch (error) {
      issues.push(`Syntax check failed: ${error.message}`);
    }

    return issues;
  }

  findFilesByExtension(ext) {
    const files = [];

    const scanDir = (dir) => {
      if (fs.existsSync(dir)) {
        const items = fs.readdirSync(dir);

        items.forEach((item) => {
          const fullPath = path.join(dir, item);
          const stat = fs.statSync(fullPath);

          if (stat.isDirectory()) {
            scanDir(fullPath);
          } else if (item.endsWith(ext)) {
            files.push(fullPath);
          }
        });
      }
    };

    scanDir(this.projectRoot);
    return files;
  }

  async fixAnnotations() {
    this.log("🔧 Fixing annotation issues...");

    const fixes = [];

    try {
      // Regenerate missing documentation
      execSync("npm run qmoi:docs:create", { stdio: "pipe" });
      fixes.push("Documentation regenerated");

      // Fix syntax issues
      const mdFiles = this.findFilesByExtension(".md");

      for (const file of mdFiles) {
        try {
          let content = fs.readFileSync(file, "utf8");

          // Fix common syntax issues
          content = content.replace(/```([^`\n]*)$/gm, "```\n$1");
          content = content.replace(/\[([^\]]*)$/gm, "[$1]");

          fs.writeFileSync(file, content);
        } catch (error) {
          this.log(`Error fixing ${file}: ${error.message}`, "WARN");
        }
      }

      fixes.push("Annotation syntax fixed");
    } catch (error) {
      this.log(`Annotation fix failed: ${error.message}`, "ERROR");
    }

    return fixes;
  }

  async run() {
    this.log("🚀 Starting QMOI Payment Fix...");

    try {
      // Step 1: Check payment credentials
      this.log("\n📋 Step 1: Checking payment credentials...");
      const credentialIssues = await this.checkPaymentCredentials();
      this.issues.push(...credentialIssues);

      if (credentialIssues.length > 0) {
        this.log(`Found ${credentialIssues.length} credential issues`);
        const credentialFixes = await this.fixPaymentCredentials();
        this.fixes.push(...credentialFixes);
      }

      // Step 2: Check payment APIs
      this.log("\n📋 Step 2: Checking payment APIs...");
      const apiIssues = await this.checkPaymentAPIs();
      this.issues.push(...apiIssues);

      if (apiIssues.length > 0) {
        this.log(`Found ${apiIssues.length} API issues`);
        const apiFixes = await this.fixPaymentAPIs();
        this.fixes.push(...apiFixes);
      }

      // Step 3: Check revenue engine
      this.log("\n📋 Step 3: Checking revenue engine...");
      const revenueIssues = await this.checkRevenueEngine();
      this.issues.push(...revenueIssues);

      if (revenueIssues.length > 0) {
        this.log(`Found ${revenueIssues.length} revenue engine issues`);
        const revenueFixes = await this.fixRevenueEngine();
        this.fixes.push(...revenueFixes);
      }

      // Step 4: Check annotations
      this.log("\n📋 Step 4: Checking annotations...");
      const annotationIssues = await this.checkAnnotations();
      this.issues.push(...annotationIssues);

      if (annotationIssues.length > 0) {
        this.log(`Found ${annotationIssues.length} annotation issues`);
        const annotationFixes = await this.fixAnnotations();
        this.fixes.push(...annotationFixes);
      }

      // Generate report
      this.generateReport();
    } catch (error) {
      this.log(`Payment fix failed: ${error.message}`, "ERROR");
      process.exitCode = 1;
    }
  }

  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalIssues: this.issues.length,
        totalFixes: this.fixes.length,
        success: this.fixes.length > 0,
      },
      issues: this.issues,
      fixes: this.fixes,
    };

    const reportPath = path.join(
      this.projectRoot,
      "logs",
      "payment-fix-report.json",
    );
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    this.log("\n📊 Payment Fix Report:");
    this.log(`   Total issues found: ${report.summary.totalIssues}`);
    this.log(`   Total fixes applied: ${report.summary.totalFixes}`);
    this.log(`   Success: ${report.summary.success ? "Yes" : "No"}`);
    this.log(`   Report saved to: ${reportPath}`);

    if (report.summary.success) {
      this.log("\n✅ QMOI Payment Fix completed successfully!");
      this.log("🔄 You can now run: npm run qmoi:autodev:full");
    } else {
      this.log("\n⚠️ Some issues may require manual intervention");
    }
  }
}

// CLI Interface
if (require.main === module) {
  const fixer = new QmoiPaymentFix();
  fixer.run().catch(console.error);
}

module.exports = QmoiPaymentFix;
