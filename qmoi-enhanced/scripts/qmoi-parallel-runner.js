#!/usr/bin/env node
// QMOI Parallel Runner: Runs all QMOI automations, builds, and health checks in parallel
const { exec } = require("child_process");

const tasks = [
  "node ./scripts/qmoi-auto-setup.js",
  "node ./scripts/qmoi-health-check.js",
  // Add more QMOI automations here
];

function runParallel(tasks) {
  tasks.forEach((cmd) => {
    const proc = exec(cmd);
    proc.stdout.on("data", (data) => process.stdout.write(data));
    proc.stderr.on("data", (data) => process.stderr.write(data));
    proc.on("exit", (code) => {
      if (code === 0) {
        console.log(`[SUCCESS] ${cmd}`);
      } else {
        console.error(`[FAIL] ${cmd} exited with code ${code}`);
      }
    });
  });
}

runParallel(tasks);
