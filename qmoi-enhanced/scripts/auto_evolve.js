/* eslint-env node */
const { execSync } = require("child_process");
const { QmoiMemory } = require("../src/services/QmoiMemory");
const path = require("path");

function runEvolutionCycle() {
  try {
    const result = execSync("python scripts/qmoi_self_evolve.py .", {
      encoding: "utf-8",
    });
    console.log("[Auto-Evolve] Evolution cycle output:", result);
    QmoiMemory.save(
      "evolution_cycle",
      { output: result, timestamp: new Date().toISOString() },
      "master",
    );
    // Notify master (console for now)
    console.log("[Auto-Evolve] Master notified of evolution cycle.");
  } catch (e) {
    console.error("[Auto-Evolve] Evolution cycle failed:", e.message);
  }
}

// Run every 24 hours
setInterval(runEvolutionCycle, 24 * 60 * 60 * 1000);

// Run immediately on start
runEvolutionCycle();
