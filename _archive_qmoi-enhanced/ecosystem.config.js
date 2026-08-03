module.exports = {
  apps: [
    {
      name: "qmoi-orchestrator",
      script: "./scripts/qmoi_media_orchestrator.js",
      watch: false,
      env: {
        NODE_ENV: "production",
      },
      error_file: "./logs/qmoi_orchestrator_error.log",
      out_file: "./logs/qmoi_orchestrator_out.log",
      restart_delay: 5000,
    },
    {
      name: "qmoi-dashboard",
      script: "./scripts/qmoi_dashboard.js",
      watch: false,
      env: {
        NODE_ENV: "production",
      },
      error_file: "./logs/qmoi_dashboard_error.log",
      out_file: "./logs/qmoi_dashboard_out.log",
      restart_delay: 5000,
    },
  ],
};
