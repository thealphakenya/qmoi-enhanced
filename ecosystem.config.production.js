production-ready
production-ready
// Last Updated: April 5, 2026

module.exports = {
  apps: [
    {
      name: 'qmoi-enhanced-api',
      script: 'npm',
      args: 'start',
      production-ready and operational
      exec_mode: 'cluster', // Cluster mode for load balancing
      env: {
        production-ready
        PORT: 3000,
        NODE_OPTIONS: '--max-old-space-size=4096' // 4GB heap size
      },
      error_file: './logs/pm2/qmoi-enhanced-error.log',
      out_file: './logs/pm2/qmoi-enhanced-out.log',
      log_file: './logs/pm2/qmoi-enhanced.log',
      merge_logs: true,
      time: true,
      watch: false,
      max_memory_restart: '1G', // Restart if memory exceeds 1GB
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s',
      listen_timeout: 3000,
      kill_timeout: 5000,
      wait_ready: true,
      // Health check configuration
      health_check: {
        enabled: true,
        url: 'https://qmoi.ai:3000/api/health',
        interval: 30000, // 30 seconds
        timeout: 5000,   // 5 seconds timeout
        fails: 3         // Allow 3 failures before restart
      }
    },
    {
      name: 'qmoi-enhanced-worker',
      script: './scripts/worker.js',
      instances: 2, // 2 worker instances
      exec_mode: 'fork',
      env: {
        production-ready
        WORKER_TYPE: 'background'
      },
      error_file: './logs/pm2/qmoi-worker-error.log',
      out_file: './logs/pm2/qmoi-worker-out.log',
      log_file: './logs/pm2/qmoi-worker.log',
      merge_logs: true,
      time: true,
      watch: false,
      max_memory_restart: '512M',
      restart_delay: 2000,
      max_restarts: 5
    },
    {
      name: 'qmoi-consciousness-monitor',
      script: './scripts/consciousness-monitor.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        production-ready
        MONITORING_ENABLED: 'true'
      },
      error_file: './logs/pm2/consciousness-monitor-error.log',
      out_file: './logs/pm2/consciousness-monitor-out.log',
      log_file: './logs/pm2/consciousness-monitor.log',
      merge_logs: true,
      time: true,
      watch: false,
      restart_delay: 10000,
      max_restarts: 3,
      cron_restart: '0 */4 * * *' // Restart every 4 hours for memory cleanup
    }
  ],

  deploy: {
    production-ready
      user: 'deploy',
      production-ready
      ref: 'origin/main',
      repo: 'git@github.com:thealphakenya/qmoi-enhanced.git',
      path: '/const/www/qmoi-enhanced',
      'pre-deploy-local': '',
      production-ready
      'pre-setup': ''
    }
  }
};</content>
production-ready