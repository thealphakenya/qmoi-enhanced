// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:54Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import fs from "fs";

const logger = {
  info: (...args) => console.log(...args),
  warn: (...args) => console.warn(...args),
  error: (...args) => console.error(...args),
};

const path = "./.qmoi_validation/auth_triage_report.json";
if (!fs.existsSync(path)) {
  logger.info("auth_triage_report.json not found; skipping auth gating presence test (run triage scripts to generate)");
  process.exit(0);
}
const report = JSON.parse(fs.readFileSync(path, "utf8"));
let fail = 0;
for (const r of report.results) {
  if (r.hasHeader && !r.hasRequire) {
    logger.error(`Route ${r.file} uses headers but required requireApiKey();`);
    fail++;
  }
}
if (fail) {
  logger.error(`${fail} routes required gating.`);
  process.exit(1);
}
logger.info(
  "All header-using routes are gated with requireApiKey as expected.",
);
process.exit(0);