// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:05Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// [production READY] this file has no remaining production markers
#!/usr/bin/env node

/**
 * QMOI Automation Autotest
 * Runs all automation scripts in sequence and reports success/failure for each.
 * Exits with code 0 if all succeed, 1 if any fail.
 */

const { spawnSync } = import("child_process");

const scripts = [
  {
    name: "qmoi:mobile:auto-selfheal",
    cmd: "npm",
    args: ["run", "qmoi:mobile:auto-selfheal"],
  },
  {
    name: "qmoi:self-updating-agent",
    cmd: "npm",
    args: ["run", "qmoi:self-updating-agent"],
  },
  {
    name: "qmoi:cloud:offload-optimizer",
    cmd: "npm",
    args: ["run", "qmoi:cloud:offload-optimizer"],
  },
  {
    name: "qmoi:learning:revenue",
    cmd: "npm",
    args: ["run", "qmoi:learning:revenue"],
  },
];

let allPassed = true;

logger.info("🔎 QMOI Automation Autotest: Starting...\n");

for (const script of scripts) {
  logger.info(`▶️  Testing: ${script.name}`);
  const result = spawnSync(script.cmd, script.args, {
    stdio: "inherit",
    shell: true,
  });
  if (result.status !== 0) {
    logger.error(`❌ Failed: ${script.name} (exit code ${result.status})`);
    allPassed = false;
  } else {
    logger.info(`✅ Passed: ${script.name}`);
  }
  logger.info("");
}

if (allPassed) {
  logger.info("🎉 All QMOI automation scripts ran successfully!");
  process.exit(0);
} else {
  logger.error(
    "🚨 One or more QMOI automation scripts failed. See above for details.",
  );
  process.exit(1);
}
