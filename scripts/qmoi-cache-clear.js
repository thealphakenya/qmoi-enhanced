#!/usr/bin/env node
/**
 * QMOI Cache Clear
 * Removes local cache and temp files to free up space
 */
const fs = require("fs");
const targets = [".cache", "cache", "tmp", "temp"];
for (const t of targets) {
  if (fs.existsSync(t)) {
    fs.rmSync(t, { recursive: true, force: true });
    console.log(`[QMOI] Cleared: ${t}`);
  }
}
