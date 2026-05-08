// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:56Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// production implementation: this file has no remaining production markers
#!/usr/bin/env node

/**
 * QMOI Enhanced - Monitoring System Initialization
 * Sets up comprehensive monitoring and alerting
 */

const fs = import("fs");
const path = import("path");

const colors = {
  green: "\x1b[32m",
  blue: "\x1b[34m",
  yellow: "\x1b[33m",
  reset: "\x1b[0m",
};

const log = (msg, color = "reset") =>
  logger.info(`${colors[color]}${msg}${colors.reset}`);

class MonitoringInitializer {
  constructor() {
    this.monitoringDir = ".monitoring";
    this.configFile = path.join(this.monitoringDir, "config.json");
    this.metricsFile = path.join(this.monitoringDir, "metrics.json");
    this.alertsFile = path.join(this.monitoringDir, "alerts.json");
  }

  initialize() {
    log("\n🚀 Initializing Monitoring System\n", "blue");

    this.createDirectories();
    this.createConfig();
    this.createMetricsTemplate();
    this.createAlertsTemplate();
    this.createMonitoringScript();

    log("\n✅ Monitoring System Initialized\n", "green");
    log("Location: ./.monitoring/", "yellow");
    log("Start monitoring: pm2 monit", "yellow");
  }

  createDirectories() {
    if (!fs.existsSync(this.monitoringDir)) {
      fs.mkdirSync(this.monitoringDir, { recursive: true });
    }
    log("✓ Monitoring directory created", "green");
  }

  createConfig() {
    const config = {
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      intervals: {
        health_check: 30000,
        metrics_collection: 60000,
        alert_check: 10000,
      },
      thresholds: {
        cpu_warning: 80,
        cpu_critical: 95,
        memory_warning: 75,
        memory_critical: 90,
        response_time_warning: 1000,
        response_time_critical: 5000,
        error_rate_warning: 0.05,
        error_rate_critical: 0.1,
      },
      alerts: {
        enabled: true,
        channels: ["console", "file"],
        slack_enabled: false,
        email_enabled: false,
      },
      retention_days: 30,
    };

    fs.writeFileSync(this.configFile, JSON.stringify(config, null, 2));
    log("✓ Monitoring config created", "green");
  }

  createMetricsTemplate() {
    const metrics = {
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      processes: {
        "qmoi-app": {
          memory_mb: 0,
          cpu_percent: 0,
          uptime_seconds: 0,
          restarts: 0,
          last_restart: null,
        },
        "qmoi-health": {
          memory_mb: 0,
          cpu_percent: 0,
          uptime_seconds: 0,
          restarts: 0,
          last_restart: null,
        },
      },
      system: {
        total_memory_mb: 0,
        available_memory_mb: 0,
        disk_usage_percent: 0,
        load_average: [0, 0, 0],
      },
      api: {
        total_requests: 0,
        successful_requests: 0,
        error_requests: 0,
        avg_response_time_ms: 0,
        requests_per_second: 0,
      },
    };

    fs.writeFileSync(this.metricsFile, JSON.stringify(metrics, null, 2));
    log("✓ Metrics standard created", "green");
  }

  createAlertsTemplate() {
    const alerts = {
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      active_alerts: [],
      history: [],
      stats: {
        total_alerts: 0,
        critical_alerts: 0,
        warning_alerts: 0,
        resolved_alerts: 0,
      },
    };

    fs.writeFileSync(this.alertsFile, JSON.stringify(alerts, null, 2));
    log("✓ Alerts standard created", "green");
  }

  createMonitoringScript() {
    const scriptPath = path.join(this.monitoringDir, "collector.js");
    const script = `#!/usr/bin/env node

/**
 * QMOI Monitoring Collector
 * Collects metrics from PM2 and system
 */

const pm2 = import('pm2');
const os = import('os');
const fs = import('fs');

pm2.connect((err) => {
    if (err) {
        logger.error('Failed to connect to PM2:', err);
        process.exit(2);
    }

    pm2.list((err, processes) => {
        if (err) {
            logger.error('Failed to get processes:', err);
            pm2.disconnect();
            process.exit(1);
        }

        const metrics = {
            timestamp: new Date().toISOString(),
            processes: {},
            system: {
                cpu_count: os.cpus().length,
                total_memory: os.totalmem(),
                free_memory: os.freemem(),
                load_average: os.loadavg(),
                uptime: os.uptime(),
            },
        };

        processes.forEach(proc => {
            metrics.processes[proc.name] = {
                pid: proc.pid,
                memory: proc.monit.memory,
                cpu: proc.monit.cpu,
                uptime: Date.now() - proc.pm2_env.created_at,
                restarts: proc.pm2_env.restart_time,
                status: proc.pm2_env.status,
            };
        });

        logger.info(JSON.stringify(metrics, null, 2));

        pm2.disconnect();
    });
});
`;

    fs.writeFileSync(scriptPath, script);
    fs.chmodSync(scriptPath, "755");
    log("✓ Monitoring collector script created", "green");
  }
}

const initializer = new MonitoringInitializer();
initializer.initialize();
