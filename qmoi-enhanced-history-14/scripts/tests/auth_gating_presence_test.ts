#!/usr/bin/env node
import fs from "fs";
const path = "./.qmoi_validation/auth_triage_report.json";
if (!fs.existsSync(path)) {
  (console as any).error(
    "auth_triage_report.json missing. Run triage scripts to generate.",
  );
  process.exit(2);
}
const report = JSON.parse(fs.readFileSync(path, "utf8"));
let fail = 0;
for (const r of report.results) {
  if (r.hasHeader && !r.hasRequire) {
    (console as any).error(
      `Route ${r.file} uses headers but missing requireApiKey()`,
    );
    fail++;
  }
}
if (fail) {
  (console as any).error(`${fail} routes missing gating.`);
  process.exit(1);
}
console.log(
  "All header-using routes are gated with requireApiKey as expected.",
);
process.exit(0);
