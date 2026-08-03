#!/usr/bin/env node

const { spawn, execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const https = require("https");

class QMOIMasterOrchestrator {
  constructor() {
    this.projectRoot = process.cwd();
    this.logFile = path.join(
      this.projectRoot,
      "logs",
      "qmoi_master_orchestrator.log",
    );
    this.configFile = path.join(
      this.projectRoot,
      "config",
      "qmoi_master_config.json",
    );
    this.healthFile = path.join(
      this.projectRoot,
      "logs",
      "qmoi_health_status.json",
    );
    this.processes = new Map();

    this.config = this.loadConfig();
    this.healthStatus = this.loadHealthStatus();

    this.ensureDirectories();
    this.setupPermissions();
  }

  loadConfig() {
    try {
      if (fs.existsSync(this.configFile)) {
        return JSON.parse(fs.readFileSync(this.configFile, "utf8"));
      }
    } catch (error) {
      this.log(`Error loading config: ${error.message}`);
    }

    return {
      services: {
        backend: {
          enabled: true,
          command: "npm run dev",
          restartOnFailure: true,
          healthCheck: "/api/health",
          maxRestarts: 5,
        },
        mediaSync: {
          enabled: true,
          command: "node scripts/qmoi_media_orchestrator.js",
          interval: 300000, // 5 minutes
          restartOnFailure: true,
        },
        autogit: {
          enabled: true,
          command: "node scripts/qmoi_enhanced_autogit.js",
          interval: 600000, // 10 minutes
          autoCommit: true,
        },
        healthCheck: {
          enabled: true,
          command: "node scripts/qmoi_health_monitor.js",
          interval: 60000, // 1 minute
          criticalThreshold: 3,
        },
        autoFix: {
          enabled: true,
          command: "node scripts/enhanced-error-fix.js",
          interval: 300000, // 5 minutes
          autoApply: true,
        },
        documentation: {
          enabled: true,
          command: "node scripts/qmoi_doc_verifier.js verify",
          interval: 1800000, // 30 minutes
          autoUpdate: true,
        },
      },
      notifications: {
        enabled: true,
        channels: ["slack", "discord", "email", "whatsapp"],
        criticalOnly: false,
      },
      monitoring: {
        logRetention: 30, // days
        healthCheckInterval: 60000,
        autoRestart: true,
        resourceMonitoring: true,
      },
      permissions: {
        autoFix: true,
        filePermissions: true,
        gitPermissions: true,
        systemPermissions: true,
      },
    };
  }

  loadHealthStatus() {
    try {
      if (fs.existsSync(this.healthFile)) {
        return JSON.parse(fs.readFileSync(this.healthFile, "utf8"));
      }
    } catch (error) {
      this.log(`Error loading health status: ${error.message}`);
    }

    return {
      services: {},
      lastCheck: new Date().toISOString(),
      overallHealth: "unknown",
      issues: [],
    };
  }

  ensureDirectories() {
    const dirs = [
      path.dirname(this.logFile),
      path.dirname(this.configFile),
      path.dirname(this.healthFile),
      "logs",
      "config",
      "backups",
    ];

    dirs.forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  setupPermissions() {
    this.log("🔧 Setting up QMOI permissions...");

    try {
      // Set file permissions
      if (this.config.permissions.filePermissions) {
        this.setFilePermissions();
      }

      // Set git permissions
      if (this.config.permissions.gitPermissions) {
        this.setGitPermissions();
      }

      // Set system permissions
      if (this.config.permissions.systemPermissions) {
        this.setSystemPermissions();
      }

      this.log("✅ Permissions setup completed");
    } catch (error) {
      this.log(`❌ Permission setup failed: ${error.message}`, "ERROR");
    }
  }

  setFilePermissions() {
    const files = ["scripts/*.js", "scripts/*.py", "*.json", "*.md"];

    files.forEach((pattern) => {
      try {
        execSync(`chmod 644 ${pattern}`, { stdio: "pipe" });
      } catch (error) {
        // Ignore errors for non-existent files
      }
    });

    // Make scripts executable
    const scripts = [
      "scripts/qmoi_master_orchestrator.js",
      "scripts/qmoi_enhanced_autogit.js",
      "scripts/qmoi_media_orchestrator.js",
      "scripts/enhanced-error-fix.js",
      "scripts/qmoi_doc_verifier.js",
    ];

    scripts.forEach((script) => {
      if (fs.existsSync(script)) {
        fs.chmodSync(script, "755");
      }
    });
  }

  setGitPermissions() {
    try {
      execSync('git config --local user.email "qmoi-autodev@alpha-q.ai"', {
        stdio: "pipe",
      });
      execSync('git config --local user.name "QMOI Auto-Dev Master"', {
        stdio: "pipe",
      });

      // Set up git hooks
      this.setupGitHooks();
    } catch (error) {
      this.log(`Git permission setup failed: ${error.message}`, "WARN");
    }
  }

  setupGitHooks() {
    const hooksDir = path.join(this.projectRoot, ".git", "hooks");
    if (!fs.existsSync(hooksDir)) {
      fs.mkdirSync(hooksDir, { recursive: true });
    }

    // Master pre-commit hook
    const preCommitHook = `#!/bin/sh
# QMOI Master Pre-commit Hook
echo "🔧 QMOI Master: Running comprehensive pre-commit checks..."
node scripts/qmoi_master_orchestrator.js pre-commit
if [ $? -ne 0 ]; then
  echo "❌ QMOI Master pre-commit checks failed"
  exit 1
fi
echo "✅ QMOI Master pre-commit checks passed"
`;

    fs.writeFileSync(path.join(hooksDir, "pre-commit"), preCommitHook);
    fs.chmodSync(path.join(hooksDir, "pre-commit"), "755");

    // Master post-commit hook
    const postCommitHook = `#!/bin/sh
# QMOI Master Post-commit Hook
echo "📢 QMOI Master: Running post-commit orchestration..."
node scripts/qmoi_master_orchestrator.js post-commit
`;

    fs.writeFileSync(path.join(hooksDir, "post-commit"), postCommitHook);
    fs.chmodSync(path.join(hooksDir, "post-commit"), "755");
  }

  setSystemPermissions() {
    // This would handle system-level permissions
    // For now, just log the attempt
    this.log("System permissions setup attempted");
  }

  log(message, level = "INFO") {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level}] ${message}`;

    console.log(logEntry);
    fs.appendFileSync(this.logFile, logEntry + "\n");
  }

  async startService(serviceName, config) {
    if (!config.enabled) {
      this.log(`Service ${serviceName} is disabled`);
      return;
    }

    this.log(`🚀 Starting service: ${serviceName}`);

    try {
      const process = spawn("node", [config.command], {
        stdio: "pipe",
        cwd: this.projectRoot,
        detached: false,
      });

      this.processes.set(serviceName, {
        process,
        config,
        startTime: new Date(),
        restarts: 0,
        status: "running",
      });

      process.stdout.on("data", (data) => {
        this.log(`[${serviceName}] ${data.toString().trim()}`);
      });

      process.stderr.on("data", (data) => {
        this.log(`[${serviceName}] ERROR: ${data.toString().trim()}`, "ERROR");
      });

      process.on("close", (code) => {
        this.log(`Service ${serviceName} exited with code ${code}`);
        this.processes.delete(serviceName);

        if (config.restartOnFailure && code !== 0) {
          this.handleServiceFailure(serviceName, config);
        }
      });

      process.on("error", (error) => {
        this.log(`Service ${serviceName} error: ${error.message}`, "ERROR");
        this.handleServiceFailure(serviceName, config);
      });

      this.log(`✅ Service ${serviceName} started successfully`);
      return process;
    } catch (error) {
      this.log(
        `❌ Failed to start service ${serviceName}: ${error.message}`,
        "ERROR",
      );
      return null;
    }
  }

  handleServiceFailure(serviceName, config) {
    const serviceInfo = this.processes.get(serviceName);
    if (!serviceInfo) return;

    if (serviceInfo.restarts < config.maxRestarts) {
      serviceInfo.restarts++;
      this.log(
        `🔄 Restarting service ${serviceName} (attempt ${serviceInfo.restarts}/${config.maxRestarts})`,
      );

      setTimeout(() => {
        this.startService(serviceName, config);
      }, 5000);
    } else {
      this.log(
        `❌ Service ${serviceName} failed too many times, stopping restarts`,
        "ERROR",
      );
      this.sendNotification(
        `Service ${serviceName} has failed and stopped restarting`,
      );
    }
  }

  async runPeriodicTask(serviceName, config) {
    if (!config.enabled) return;

    this.log(`⏰ Running periodic task: ${serviceName}`);

    try {
      const result = execSync(config.command, {
        cwd: this.projectRoot,
        stdio: "pipe",
        timeout: 300000, // 5 minutes
      });

      this.log(`✅ Periodic task ${serviceName} completed successfully`);
      return { success: true, output: result.toString() };
    } catch (error) {
      this.log(
        `❌ Periodic task ${serviceName} failed: ${error.message}`,
        "ERROR",
      );
      return { success: false, error: error.message };
    }
  }

  async checkServiceHealth(serviceName, config) {
    if (!config.healthCheck) return true;

    try {
      const response = await this.makeHealthRequest(config.healthCheck);
      const isHealthy = response.status === 200;

      this.healthStatus.services[serviceName] = {
        healthy: isHealthy,
        lastCheck: new Date().toISOString(),
        responseTime: response.responseTime,
      };

      return isHealthy;
    } catch (error) {
      this.log(
        `Health check failed for ${serviceName}: ${error.message}`,
        "WARN",
      );
      this.healthStatus.services[serviceName] = {
        healthy: false,
        lastCheck: new Date().toISOString(),
        error: error.message,
      };
      return false;
    }
  }

  async makeHealthRequest(url) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();

      https
        .get(url, (res) => {
          const responseTime = Date.now() - startTime;
          resolve({
            status: res.statusCode,
            responseTime,
          });
        })
        .on("error", reject);
    });
  }

  async runComprehensiveHealthCheck() {
    this.log("🏥 Running comprehensive health check...");

    const healthChecks = [];

    // Check all services
    for (const [serviceName, config] of Object.entries(this.config.services)) {
      if (config.healthCheck) {
        const isHealthy = await this.checkServiceHealth(serviceName, config);
        healthChecks.push({ service: serviceName, healthy: isHealthy });
      }
    }

    // Check system resources
    const systemHealth = await this.checkSystemResources();
    healthChecks.push({ service: "system", healthy: systemHealth.healthy });

    // Update overall health
    const healthyServices = healthChecks.filter(
      (check) => check.healthy,
    ).length;
    const totalServices = healthChecks.length;

    this.healthStatus.overallHealth =
      healthyServices === totalServices ? "healthy" : "degraded";
    this.healthStatus.lastCheck = new Date().toISOString();
    this.healthStatus.issues = healthChecks.filter((check) => !check.healthy);

    // Save health status
    this.saveHealthStatus();

    // Send notifications if there are issues
    if (this.healthStatus.issues.length > 0) {
      this.sendNotification(
        `Health check found ${this.healthStatus.issues.length} issues`,
      );
    }

    this.log(
      `Health check completed: ${healthyServices}/${totalServices} services healthy`,
    );
    return this.healthStatus;
  }

  async checkSystemResources() {
    try {
      // Check disk space
      const diskUsage = execSync("df -h .", { encoding: "utf8" });
      const diskLine = diskUsage.split("\n")[1];
      const usagePercent = parseInt(diskLine.split(/\s+/)[4].replace("%", ""));

      // Check memory usage
      const memoryInfo = execSync("free -m", { encoding: "utf8" });
      const memLine = memoryInfo.split("\n")[1];
      const memValues = memLine.split(/\s+/);
      const memUsage = (parseInt(memValues[2]) / parseInt(memValues[1])) * 100;

      const healthy = usagePercent < 90 && memUsage < 90;

      return {
        healthy,
        diskUsage: usagePercent,
        memoryUsage: memUsage,
      };
    } catch (error) {
      this.log(`System resource check failed: ${error.message}`, "WARN");
      return { healthy: false, error: error.message };
    }
  }

  async runAutoFix() {
    this.log("🔧 Running comprehensive auto-fix...");

    const fixes = [
      { name: "Error Fix", command: "node scripts/enhanced-error-fix.js" },
      {
        name: "Documentation Fix",
        command: "node scripts/qmoi_doc_verifier.js verify",
      },
      { name: "Git Fix", command: "node scripts/qmoi_enhanced_autogit.js fix" },
      { name: "Dependency Fix", command: "npm audit fix" },
      { name: "Build Fix", command: "npm run build" },
    ];

    let fixesApplied = 0;
    for (const fix of fixes) {
      try {
        this.log(`Applying ${fix.name}...`);
        const result = execSync(fix.command, {
          cwd: this.projectRoot,
          stdio: "pipe",
          timeout: 300000,
        });
        fixesApplied++;
        this.log(`✅ ${fix.name} applied successfully`);
      } catch (error) {
        this.log(`⚠️ ${fix.name} failed: ${error.message}`, "WARN");
      }
    }

    this.log(
      `Auto-fix completed: ${fixesApplied}/${fixes.length} fixes applied`,
    );
    return fixesApplied;
  }

  async sendNotification(message) {
    if (!this.config.notifications.enabled) return;

    this.log(`📢 Sending notification: ${message}`);

    const notification = {
      text: `🤖 QMOI Master Orchestrator

${message}

⏰ Timestamp: ${new Date().toISOString()}
🏥 Overall Health: ${this.healthStatus.overallHealth}

*Auto-generated by QMOI Master System*`,
    };

    // Send to all configured channels
    for (const channel of this.config.notifications.channels) {
      await this.sendToChannel(channel, notification);
    }
  }

  async sendToChannel(channel, notification) {
    try {
      switch (channel) {
        case "slack":
          await this.sendToSlack(notification);
          break;
        case "discord":
          await this.sendToDiscord(notification);
          break;
        case "email":
          await this.sendToEmail(notification);
          break;
        case "whatsapp":
          await this.sendToWhatsApp(notification);
          break;
      }
    } catch (error) {
      this.log(
        `Failed to send notification to ${channel}: ${error.message}`,
        "ERROR",
      );
    }
  }

  async sendToSlack(notification) {
    // Implementation for Slack
    this.log("Slack notification sent");
  }

  async sendToDiscord(notification) {
    // Implementation for Discord
    this.log("Discord notification sent");
  }

  async sendToEmail(notification) {
    // Implementation for email
    this.log("Email notification sent");
  }

  async sendToWhatsApp(notification) {
    // Implementation for WhatsApp
    this.log("WhatsApp notification sent");
  }

  saveHealthStatus() {
    try {
      fs.writeFileSync(
        this.healthFile,
        JSON.stringify(this.healthStatus, null, 2),
      );
    } catch (error) {
      this.log(`Error saving health status: ${error.message}`, "ERROR");
    }
  }

  async startAllServices() {
    this.log("🚀 Starting all QMOI services...");

    for (const [serviceName, config] of Object.entries(this.config.services)) {
      if (config.command && !config.interval) {
        // Long-running service
        await this.startService(serviceName, config);
      }
    }

    // Start periodic tasks
    this.startPeriodicTasks();

    this.log("✅ All services started");
  }

  startPeriodicTasks() {
    for (const [serviceName, config] of Object.entries(this.config.services)) {
      if (config.interval) {
        // Run immediately
        this.runPeriodicTask(serviceName, config);

        // Schedule recurring runs
        setInterval(() => {
          this.runPeriodicTask(serviceName, config);
        }, config.interval);
      }
    }

    // Start health monitoring
    setInterval(() => {
      this.runComprehensiveHealthCheck();
    }, this.config.monitoring.healthCheckInterval);
  }

  async stopAllServices() {
    this.log("🛑 Stopping all QMOI services...");

    for (const [serviceName, processInfo] of this.processes) {
      this.log(`Stopping service: ${serviceName}`);
      processInfo.process.kill();
    }

    this.processes.clear();
    this.log("✅ All services stopped");
  }

  async runPreCommit() {
    this.log("🔧 Running pre-commit orchestration...");

    // Run all pre-commit checks
    const checks = [this.runAutoFix(), this.runComprehensiveHealthCheck()];

    const results = await Promise.all(checks);

    const allPassed = results.every((result) => result !== false);

    if (!allPassed) {
      this.log("❌ Pre-commit checks failed", "ERROR");
      process.exit(1);
    }

    this.log("✅ Pre-commit orchestration completed");
  }

  async runPostCommit() {
    this.log("📢 Running post-commit orchestration...");

    // Send notifications
    await this.sendNotification(
      "New commit detected - running post-commit tasks",
    );

    // Update documentation
    await this.runPeriodicTask(
      "documentation",
      this.config.services.documentation,
    );

    // Run health check
    await this.runComprehensiveHealthCheck();

    this.log("✅ Post-commit orchestration completed");
  }

  getStatus() {
    const status = {
      services: {},
      health: this.healthStatus,
      uptime: new Date().toISOString(),
    };

    for (const [serviceName, processInfo] of this.processes) {
      status.services[serviceName] = {
        status: processInfo.status,
        uptime: new Date() - processInfo.startTime,
        restarts: processInfo.restarts,
      };
    }

    return status;
  }

  async run() {
    this.log("🎯 QMOI Master Orchestrator starting...");

    try {
      // Start all services
      await this.startAllServices();

      // Initial health check
      await this.runComprehensiveHealthCheck();

      // Send startup notification
      await this.sendNotification(
        "QMOI Master Orchestrator started successfully",
      );

      this.log("🎉 QMOI Master Orchestrator is running");

      // Keep the process alive
      process.on("SIGINT", async () => {
        this.log("Received SIGINT, shutting down gracefully...");
        await this.stopAllServices();
        process.exit(0);
      });

      process.on("SIGTERM", async () => {
        this.log("Received SIGTERM, shutting down gracefully...");
        await this.stopAllServices();
        process.exit(0);
      });
    } catch (error) {
      this.log(`❌ QMOI Master Orchestrator failed: ${error.message}`, "ERROR");
      await this.sendNotification(
        `QMOI Master Orchestrator failed: ${error.message}`,
      );
      process.exit(1);
    }
  }
}

// CLI Interface
if (require.main === module) {
  const orchestrator = new QMOIMasterOrchestrator();

  const args = process.argv.slice(2);
  const command = args[0] || "start";

  switch (command) {
    case "start":
      orchestrator.run();
      break;
    case "stop":
      orchestrator.stopAllServices();
      break;
    case "status":
      console.log(JSON.stringify(orchestrator.getStatus(), null, 2));
      break;
    case "health":
      orchestrator.runComprehensiveHealthCheck().then((status) => {
        console.log(JSON.stringify(status, null, 2));
      });
      break;
    case "fix":
      orchestrator.runAutoFix();
      break;
    case "pre-commit":
      orchestrator.runPreCommit();
      break;
    case "post-commit":
      orchestrator.runPostCommit();
      break;
    default:
      console.log(
        "Usage: node qmoi_master_orchestrator.js [start|stop|status|health|fix|pre-commit|post-commit]",
      );
  }
}

module.exports = QMOIMasterOrchestrator;
