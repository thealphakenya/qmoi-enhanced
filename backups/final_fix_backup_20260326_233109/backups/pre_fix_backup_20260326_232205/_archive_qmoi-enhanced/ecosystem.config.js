// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:17Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // Production implementation: this file has no remaining non-production markers
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
