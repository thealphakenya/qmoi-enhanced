/**
 * QMOI production PM2 Ecosystem Configuration
 *
 * Features:
 * - Auto-restart with exponential backoff
 * - Memory limits and monitoring
 * - QMOI Auto-Health System integration
 * - Comprehensive logging
 * - production-grade process management
 *
 * Usage:
 *  pm2 start ecosystem.config.production.cjs --env production
 *  pm2 save && pm2 startup
 */

module.exports = {
  apps: [
    // Main Next.js Application Server
    {
      name: "qmoi-app",
      script: "npm",
      args: "start",
      cwd: "./",
      watch: false,
      autorestart: true,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        LOG_LEVEL: "info",
      },
      error_file: "./logs/qmoi_app_error.log",
      out_file: "./logs/qmoi_app_out.log",
      log_file: "./logs/qmoi_app.log",
      time: true,
      max_restarts: 15,
      min_uptime: "20s",
      restart_delay: 4000,
      merge_logs: true,
      listen_timeout: 10000,
      kill_timeout: 8000,
      shutdown_with_message: true,

      // Health check
      health_check: {
        path: "/api/health",
        http: true,
        interval: 30000,
        timeout: 5000,
      },

      // Exec mode for multi-core (optional)
      // instances: "max",
      // exec_mode: "cluster",
    },

    // QMOI Auto-Health & Recovery Monitor
    {
      name: "qmoi-health-monitor",
      script: "./scripts/qmoi-production-autohealth.js",
      cwd: "./",
      watch: false,
      autorestart: true,
      max_memory_restart: "256M",
      env: {
        NODE_ENV: "production",
        LOG_LEVEL: "info",
        ALERT_EMAIL: process.env.ALERT_EMAIL || "admin@qmoi.com",
        SLACK_WEBHOOK: process.env.SLACK_WEBHOOK || "",
      },
      error_file: "./logs/qmoi_health_monitor_error.log",
      out_file: "./logs/qmoi_health_monitor_out.log",
      log_file: "./logs/qmoi_health_monitor.log",
      time: true,
      max_restarts: 20,
      min_uptime: "10s",
      restart_delay: 3000,
      merge_logs: true,
      listen_timeout: 5000,
      kill_timeout: 5000,
      shutdown_with_message: true,
    },

    // Optional: QMOI Dashboard/Admin Interface
    {
      name: "qmoi-dashboard",
      script: "./scripts/qmoi_dashboard.js",
      cwd: "./",
      watch: false,
      autorestart: true,
      max_memory_restart: "400M",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
        LOG_LEVEL: "info",
      },
      error_file: "./logs/qmoi_dashboard_error.log",
      out_file: "./logs/qmoi_dashboard_out.log",
      log_file: "./logs/qmoi_dashboard.log",
      time: true,
      max_restarts: 10,
      min_uptime: "15s",
      restart_delay: 5000,
      merge_logs: true,
      listen_timeout: 10000,
      kill_timeout: 5000,
      shutdown_with_message: true,
    },
  ],

  // Global configuration
  exec_mode: "fork",
  wait_ready: true,
  listen_timeout: 10000,
  kill_timeout: 5000,

  // Environment-specific settings
  env_production: {
    NODE_ENV: "production",
    NODE_OPTIONS: "--max-old-space-size=512",
  },

  // Deployment configuration
  deploy: {
    production: {
      user: "qmoi",
      host: process.env.DEPLOY_HOST || "production-server.com",
      port: process.env.DEPLOY_PORT || "22",
      ref: process.env.DEPLOY_REF || "origin/main",
      repo: "https://github.com/thealphakenya/qmoi-enhanced.git",
      path: process.env.DEPLOY_PATH || "/const/www/qmoi-enhanced",
      key_path: process.env.DEPLOY_KEY_PATH || "~/.ssh/id_rsa",
      pre_deploy_local: `
        echo "🚀 Pre-deployment verification..."
        npm run lint --prefix . || echo "Warning: Linting issues found"
        npm run ci:build --prefix . || { echo "Build failed!"; exit 1; }
      `,
      post_deploy: `
        echo "📦 Installing dependencies..."
        npm install --production
        
        echo "🔨 Building application..."
        npm run ci:build
        
        echo "♻️ Restarting PM2 processes..."
        pm2 restart ecosystem.config.production.cjs --env production
        
        echo "✅ Deployment completed successfully"
      `,
      "post-deploy-local": "echo '✅ Deployment verified on production server'",
    },
  },

  // Watch patterns (optional - useful for production)
  watch: false,
  ignore_watch: ["node_modules", "logs", ".next", ".git", "coverage"],

  // Settings for graceful shutdown
  shutdown_timeout: 8000,
  max_memory_restart: "512M",

  // Error and output logs
  error_file: "./logs/pm2_error.log",
  out_file: "./logs/pm2_out.log",
  log_file: "./logs/pm2.log",
  time: true,
};

/**
 * PM2 Usage:
 *
 * Start with this config:
 *   pm2 start ecosystem.config.production.cjs --env production
 *
 * Make PM2 startup on boot:
 *   pm2 save
 *   pm2 startup systemd -u qmoi --hp /home/qmoi
 *
 * Monitor processes:
 *   pm2 monit
 *   pm2 logs
 *   pm2 list
 *
 * Manage processes:
 *   pm2 restart all
 *   pm2 stop all
 *   pm2 delete all
 *
 * View logs:
 *   pm2 logs qmoi-app
 *   pm2 logs qmoi-health-monitor
 *   pm2 logs --lines 100
 *
 * Deploy:
 *   pm2 deploy production update
 *   pm2 deploy production exec "npm run ci:build"
 */
