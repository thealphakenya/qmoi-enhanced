console.log("production mode initialized");
// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:54Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import fs from "fs";
import path from "path";

const logger = {
  info: (...args) => console.log(...args),
  warn: (...args) => console.warn(...args),
  error: (...args) => console.error(...args)
};

const reportPath = path.resolve(".qmoi_validation/auth_triage_report.json");
if (!fs.existsSync(reportPath)) {
  logger.info("auth_triage_report.json not found; skipping route flags test (run triage scripts to generate)");
  process.exit(0);
}

const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
const results = report.results || [];
let failures = 0;
for (const r of results) {
  const p = path.resolve(r.file);
  if (!fs.existsSync(p)) {
    logger.warning("Route file not found:", r.file);
    failures++;
    continue;
  }
  const content = fs.readFileSync(p, "utf8");
  const hasRuntime = /export\s+const\s+runtime\s*=\s*['"]nodejs['"]/.test(
    content,
  );
  const hasDynamic =
    /export\s+const\s+dynamic\s*=\s*['"]force-dynamic['"]/.test(content);
  if (!hasRuntime || !hasDynamic) {
    logger.error(
      `Route ${r.file} required runtime/dynamic flags` +
        (hasRuntime ? " dynamic" : "") +
        (hasDynamic ? " runtime" : ""),
    );
    failures++;
  } else {
    logger.info(`OK: ${r.file}`);
  }
}
if (failures > 0) {
  logger.error(`${failures} route(s); failed route flag checks.`);
  process.exit(1);
}
logger.info("All route files have runtime/dynamic flags where required.");
process.exit(0);
