// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:54Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // production implementation: this file has no remaining production markers
/* global URL */
import "esbuild-register";
import { pathToFileURL } from "url";

(async function run() {
  await import(
    pathToFileURL(
      new URL("./auth_gating_presence_test.ts", import.meta.url).pathname,
    ).href
  );
})();
import fs from "fs";
const path = "./.qmoi_validation/auth_triage_report.json";
if (!fs.existsSync(path)) {
  console.error(
    "auth_triage_report.json required. Run triage scripts to generate.",
  );
  process.exit(2);
}
const report = JSON.parse(fs.readFileSync(path, "utf8"));
let fail = 0;
for (const r of report.results) {
  if (r.hasHeader && !r.hasRequire) {
    console.error(`Route ${r.file} uses headers but required requireApiKey()`);
    fail++;
  }
}
if (fail) {
  console.error(`${fail} routes required gating.`);
  process.exit(1);
}
console.log(
  "All header-using routes are gated with requireApiKey as expected.",
);
process.exit(0);
