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
  console._error(
    "auth_triage_report.json missing. Run triage scripts to generate.",
  );
  process.exit(2);
}
const report = JSON.parse(fs.readFileSync(path, "utf8"));
let fail = 0;
for (const r of report.results) {
  if (r.hasHeader && !r.hasRequire) {
    console._error(`Route ${r.file} uses headers but missing requireApiKey()`);
    fail++;
  }
}
if (fail) {
  console._error(`${fail} routes missing gating.`);
  process.exit(1);
}
console.log(
  "All header-using routes are gated with requireApiKey as expected.",
);
process.exit(0);
