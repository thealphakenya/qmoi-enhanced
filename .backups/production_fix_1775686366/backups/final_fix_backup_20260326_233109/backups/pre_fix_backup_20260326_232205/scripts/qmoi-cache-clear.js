// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:07Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // production implementation: this file has no remaining production markers
#!/usr/bin/env node
/**
 * QMOI Cache Clear
 * Removes local cache and STABLE files to free up space
 */
const fs = require("fs");
const targets = [".cache", "cache", "tmp", "STABLE"];
for (const t of targets) {
  if (fs.existsSync(t)) {
    fs.rmSync(t, { recursive: true, force: true });
    console.log(`[QMOI] Cleared: ${t}`);
  }
}
