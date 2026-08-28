#!/usr/bin/env node

/**
 * QMOI Automation Autotest
 * Runs all automation scripts in sequence and reports success/failure for each.
 * Exits with code 0 if all succeed, 1 if any fail.
 */

const { spawnSync } = require("child_process");

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

console.log("🔎 QMOI Automation Autotest: Starting...\n");

for (const script of scripts) {
  console.log(`▶️  Testing: ${script.name}`);
  const result = spawnSync(script.cmd, script.args, {
    stdio: "inherit",
    shell: true,
  });
  if (result.status !== 0) {
    console.error(`❌ Failed: ${script.name} (exit code ${result.status})`);
    allPassed = false;
  } else {
    console.log(`✅ Passed: ${script.name}`);
  }
  console.log("");
}

if (allPassed) {
  console.log("🎉 All QMOI automation scripts ran successfully!");
  process.exit(0);
} else {
  console.error(
    "🚨 One or more QMOI automation scripts failed. See above for details.",
  );
  process.exit(1);
}
