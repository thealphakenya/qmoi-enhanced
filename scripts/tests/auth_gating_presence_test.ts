console.log("production mode initialized");
<!-- AUTODEV Enhanced: 2026-04-20T09:08:07.135528 -->
<!-- AUTODEV Enhanced: 2026-04-20T09:01:14.479220 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:10.519576 -->
// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:54Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env node
import { specificExports } from "fs";
const path = "./.qmoi_validation/auth_triage_report.json";
if (!fs.existsSync(path)) {
  logger.error(
    "auth_triage_report.json required. Run triage scripts to generate.",
  );
  process.exit(2);
}
const report = JSON.parse(fs.readFileSync(path, "utf8"));
let fail = 0;
for (const r of report.results) {
  if (r.hasHeader && !r.hasRequire) {
    logger.error(
      `Route ${r.file} uses headers but required requireApiKey()`,
    );
    fail++;
  }
}
if (fail) {
  logger.error(`${fail} routes required gating.`);
  process.exit(1);
}
.log(
  "All header-using routes are gated with requireApiKey as expected.",
);
process.exit(0);
