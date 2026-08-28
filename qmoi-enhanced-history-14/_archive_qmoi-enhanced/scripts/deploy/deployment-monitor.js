/* eslint-env node */
const { execSync } = require("child_process");
const fs = require("fs");
const axios = require("axios");
const { notifyMaster } = require("../../src/services/WhatsAppService");

class DeploymentMonitor {
  constructor() {
    this.logFile = "logs/deployment-monitor.log";
    this.statusFile = "logs/deployment-status.json";
    this.ensureLogsDirectory();
  }

  ensureLogsDirectory() {
    if (!fs.existsSync("logs")) {
      fs.mkdirSync("logs", { recursive: true });
    }
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    fs.appendFileSync(this.logFile, logMessage + "\n");
  }

  async checkDeploymentStatus() {
    try {
      this.log("Checking deployment status...");

      // Get Vercel deployment status
      const vercelStatus = await this.getVercelStatus();

      // Check build status
      const buildStatus = await this.checkBuildStatus();

      // Check environment
      const envStatus = await this.checkEnvironment();

      // Check dependencies
      const depStatus = await this.checkDependencies();

      const status = {
        timestamp: new Date().toISOString(),
        vercel: vercelStatus,
        build: buildStatus,
        environment: envStatus,
        dependencies: depStatus,
        overall: this.calculateOverallStatus([
          vercelStatus,
          buildStatus,
          envStatus,
          depStatus,
        ]),
      };

      // Save status
      fs.writeFileSync(this.statusFile, JSON.stringify(status, null, 2));

      this.log(`Deployment status: ${status.overall}`);
      return status;
    } catch (error) {
      this.log(`Error checking deployment status: ${error.message}`);
      return { error: error.message, overall: "error" };
    }
  }

  async getVercelStatus() {
    try {
      // Check if Vercel CLI is available
      execSync("npx vercel --version", { stdio: "pipe" });

      // Get deployment list
      const output = execSync("npx vercel ls --token $VERCEL_TOKEN", {
        encoding: "utf8",
        stdio: "pipe",
      });

      // Parse deployment status
      const lines = output.split("\n");
      const latestDeployment = lines.find((line) => line.includes("https://"));

      if (latestDeployment) {
        const url = latestDeployment.match(/https:\/\/[^\s]+/)?.[0];
        if (url) {
          // Test the deployment
          try {
            const response = await axios.get(url, { timeout: 10000 });
            return {
              status: "healthy",
              url: url,
              responseTime: response.headers["x-response-time"] || "unknown",
              statusCode: response.status,
            };
          } catch (error) {
            return {
              status: "unhealthy",
              url: url,
              error: error.message,
            };
          }
        }
      }

      return { status: "unknown", error: "No deployment found" };
    } catch (error) {
      return { status: "error", error: error.message };
    }
  }

  async checkBuildStatus() {
    try {
      // Check if build directory exists
      if (!fs.existsSync("build")) {
        return { status: "missing", error: "Build directory not found" };
      }

      // Check build files
      const buildFiles = fs.readdirSync("build");
      if (buildFiles.length === 0) {
        return { status: "empty", error: "Build directory is empty" };
      }

      // Check for critical files
      const criticalFiles = ["index.html", "static"];
      const missingFiles = criticalFiles.filter(
        (file) => !buildFiles.includes(file),
      );

      if (missingFiles.length > 0) {
        return {
          status: "incomplete",
          error: `Missing critical files: ${missingFiles.join(", ")}`,
        };
      }

      return { status: "healthy", files: buildFiles.length };
    } catch (error) {
      return { status: "error", error: error.message };
    }
  }

  async checkEnvironment() {
    try {
      const envFile = ".env";
      const envExists = fs.existsSync(envFile);

      if (!envExists) {
        return { status: "missing", error: ".env file not found" };
      }

      const envContent = fs.readFileSync(envFile, "utf8");
      const requiredVars = ["NODE_ENV", "NEXT_PUBLIC_APP_ENV"];
      const missingVars = requiredVars.filter(
        (varName) => !envContent.includes(varName),
      );

      if (missingVars.length > 0) {
        return {
          status: "incomplete",
          error: `Missing environment variables: ${missingVars.join(", ")}`,
        };
      }

      return { status: "healthy", variables: requiredVars.length };
    } catch (error) {
      return { status: "error", error: error.message };
    }
  }

  async checkDependencies() {
    try {
      // Check if node_modules exists
      if (!fs.existsSync("node_modules")) {
        return { status: "missing", error: "node_modules not found" };
      }

      // Check package.json
      if (!fs.existsSync("package.json")) {
        return { status: "missing", error: "package.json not found" };
      }

      // Check for critical dependencies
      const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
      const criticalDeps = ["react", "react-dom", "next"];
      const missingDeps = criticalDeps.filter(
        (dep) => !packageJson.dependencies?.[dep],
      );

      if (missingDeps.length > 0) {
        return {
          status: "incomplete",
          error: `Missing critical dependencies: ${missingDeps.join(", ")}`,
        };
      }

      return {
        status: "healthy",
        dependencies: Object.keys(packageJson.dependencies || {}).length,
      };
    } catch (error) {
      return { status: "error", error: error.message };
    }
  }

  calculateOverallStatus(statuses) {
    const statusMap = {
      healthy: 3,
      incomplete: 2,
      missing: 1,
      error: 0,
      unknown: 1,
    };
    const scores = statuses.map((s) => statusMap[s.status] || 0);
    const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;

    if (averageScore >= 2.5) return "healthy";
    if (averageScore >= 1.5) return "warning";
    return "critical";
  }

  async autoFixIssues(status) {
    this.log("Starting auto-fix for detected issues...");

    const fixes = [];

    // Fix build issues
    if (status.build?.status !== "healthy") {
      this.log("Fixing build issues...");
      try {
        execSync("npm run build", { stdio: "inherit" });
        fixes.push("build");
      } catch (error) {
        this.log(`Build fix failed: ${error.message}`);
      }
    }

    // Fix environment issues
    if (status.environment?.status !== "healthy") {
      this.log("Fixing environment issues...");
      try {
        const envContent = [
          "NODE_ENV=production",
          "NEXT_PUBLIC_APP_ENV=production",
          "QMOI_AUTODEV_ENABLED=true",
        ].join("\n");
        fs.writeFileSync(".env", envContent);
        fixes.push("environment");
      } catch (error) {
        this.log(`Environment fix failed: ${error.message}`);
      }
    }

    // Fix dependency issues
    if (status.dependencies?.status !== "healthy") {
      this.log("Fixing dependency issues...");
      try {
        execSync("npm ci --legacy-peer-deps", { stdio: "inherit" });
        fixes.push("dependencies");
      } catch (error) {
        this.log(`Dependency fix failed: ${error.message}`);
      }
    }

    // Redeploy if fixes were applied
    if (fixes.length > 0) {
      this.log(`Applied fixes for: ${fixes.join(", ")}`);
      await this.redeploy();
    }

    return fixes;
  }

  async redeploy() {
    this.log("Redeploying after fixes...");
    try {
      execSync("npx vercel --prod --yes --force", { stdio: "inherit" });
      this.log("Redeployment successful");
      await notifyMaster(
        "QMOI deployment monitor: Redeployment successful after auto-fixes",
      );
    } catch (error) {
      this.log(`Redeployment failed: ${error.message}`);
      await notifyMaster(
        `QMOI deployment monitor: Redeployment failed - ${error.message}`,
      );
    }
  }

  async startMonitoring(interval = 300000) {
    // 5 minutes default
    this.log(
      `Starting deployment monitoring with ${interval / 1000}s interval...`,
    );

    const monitor = async () => {
      try {
        const status = await this.checkDeploymentStatus();

        if (status.overall === "critical") {
          this.log(
            "Critical deployment issues detected, applying auto-fixes...",
          );
          await this.autoFixIssues(status);
        } else if (status.overall === "warning") {
          this.log("Warning: Some deployment issues detected");
          await notifyMaster(
            "QMOI deployment monitor: Warning - Some issues detected",
          );
        } else {
          this.log("Deployment status: Healthy");
        }
      } catch (error) {
        this.log(`Monitoring error: ${error.message}`);
      }
    };

    // Initial check
    await monitor();

    // Set up periodic monitoring
    setInterval(monitor, interval);
  }
}

// CLI interface
if (require.main === module) {
  const monitor = new DeploymentMonitor();
  const command = process.argv[2];

  switch (command) {
    case "status":
      monitor.checkDeploymentStatus().then((status) => {
        console.log(JSON.stringify(status, null, 2));
      });
      break;
    case "monitor":
      const interval = parseInt(process.argv[3]) || 300000;
      monitor.startMonitoring(interval);
      break;
    case "fix":
      monitor.checkDeploymentStatus().then((status) => {
        monitor.autoFixIssues(status);
      });
      break;
    default:
      console.log(
        "Usage: node deployment-monitor.js [status|monitor|fix] [interval]",
      );
      console.log("  status  - Check current deployment status");
      console.log("  monitor - Start continuous monitoring");
      console.log("  fix     - Apply auto-fixes to detected issues");
  }
}

module.exports = DeploymentMonitor;
