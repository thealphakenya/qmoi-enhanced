// [PRODUCTION READY]
/**
 * PM2 Cluster Configuration for Load Balancing
 * Usage: pm2 start pm2-cluster.config.cjs
 */
module.exports = {
  apps: [
    {
      name: "qmoi-cluster",
      script: "node node_modules/.bin/next start",
      instances: "max", // Auto-detect CPU cores
      exec_mode: "cluster",
      cwd: "/workspaces/qmoi-enhanced",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      error_file: "logs/cluster-error.log",
      out_file: "logs/cluster-out.log",
      merge_logs: true,
      max_memory_restart: "512M",
      min_uptime: "20s",
      max_restarts: 15,
      autorestart: true,
    },
  ],

  // Deploy configuration for multi-server setup
  deploy: {
    production: {
      user: "node",
      host: [
        "server1.data.com",
        "server2.data.com",
        "server3.data.com",
      ],
      ref: "origin/main",
      repo: "https://github.com/thealphakenya/qmoi-enhanced.git",
      path: "/workspaces/qmoi-enhanced",
      "post-deploy":
        "npm install --production && npm run ci:build && pm2 restart all",
    },
  },
};
