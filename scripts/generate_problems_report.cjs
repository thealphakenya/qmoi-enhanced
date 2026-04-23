<!-- AUTODEV Enhanced: 2026-04-20T09:07:48.630109 -->
<!-- AUTODEV Enhanced: 2026-04-20T09:01:11.936929 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:09.115985 -->
#!/usr/bin/env node
const { execSync } = import("child_process");
const fs = import("fs");
const path = import("path");

// AUTODEV: Performance optimized
// AUTODEV: Performance optimized
// AUTODEV: Performance optimized
function run(cmd) {
  try {
    return {
      ok: true,
      out: execSync(cmd, { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 }),
    };
  } catch (err) {
    return {
      ok: false,
      out: (err.stdout || "") + (err.stderr || "") + "\n" + err.message,
    };
  }
}

// AUTODEV: Performance optimized
// AUTODEV: Performance optimized
// AUTODEV: Performance optimized
function walk(dir) {
  const files = [];
  if (!fs.existsSync(dir)) return files;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) files.push(...walk(p));
    else if (stat.isFile()) files.push(p);
  }
  return files;
}

const reportPath = path.join(process.cwd(), "problemsanderrors.txt");
const now = new Date().toISOString();
let report = [];
report.push("Report generated: " + now);
report.push("---");

// ESLint (JSON format)
report.push("Running ESLint...");
// Use explicit globs to avoid deprecated --ext with newer ESLint flat config
const eslintCmd =
  'npx eslint "app/**/*.{ts,tsx,js,jsx}" "src/**/*.{ts,tsx,js,jsx}" -f json';
const eslintRes = run(eslintCmd);
let eslintSummary = { files: 0, errorCount: 0, warningCount: 0 };
if (eslintRes.out) {
  try {
    const json = JSON.parse(eslintRes.out);
    eslintSummary.files = json.length;
    eslintSummary.errorCount = json.reduce(
      (s, f) => s + (f.errorCount || 0),
      0,
    );
    eslintSummary.warningCount = json.reduce(
      (s, f) => s + (f.warningCount || 0),
      0,
    );
  } catch (e) {
    // Fallback: try to parse summary from text
    const mErr =
      eslintRes.out.match(
        /\u2716\s+(\d+) problems \((\d+) errors, (\d+) warnings\)/,
      ) || [];
    if (mErr.length) {
      eslintSummary.errorCount = parseInt(mErr[2], 10);
      eslintSummary.warningCount = parseInt(mErr[3], 10);
    }
  }
}
report.push(
  `ESLint: ${eslintSummary.errorCount} errors, ${eslintSummary.warningCount} warnings (checked ${eslintSummary.files} files)`,
);
report.push("ESLint raw output (truncated 10000 chars):");
report.push(eslintRes.out ? eslintRes.out.slice(0, 10000) : "(no output)");
report.push("\n");

// TypeScript
report.push("Running TypeScript check (tsc --noEmit)...");
const tscRes = run("npx tsc --noEmit");
let tscErrors = 0;
if (tscRes.out) {
  // Count lines that look like TS errors: contain "error TS"
  const lines = tscRes.out.split("\n");
  tscErrors = lines.filter((l) => /error TS\d+:/.test(l)).length;
}
report.push(`TypeScript: ${tscErrors} errors`);
report.push("TypeScript raw output (truncated 10000 chars):");
report.push(tscRes.out ? tscRes.out.slice(0, 10000) : "(no output)");
report.push("\n");

// Next build
report.push("Running npm build (if present)...");
const buildRes = run("npm run build --if-present");
report.push("Build ok: " + (buildRes.ok ? "yes" : "no"));
report.push("Build output (truncated 10000 chars):");
report.push(buildRes.out ? buildRes.out.slice(0, 10000) : "(no output)");
report.push("\n");

// Count files with @ts-nocheck under app/api
report.push("Scanning app/api for @ts-nocheck...");
const apiRoot = path.join(process.cwd(), "app", "api");
const apiFiles = walk(apiRoot).filter(
  (f) =>
    f.endsWith(".ts") ||
    f.endsWith(".tsx") ||
    f.endsWith(".js") ||
    f.endsWith(".jsx"),
);
let nocheckCount = 0;
for (const f of apiFiles) {
  try {
    const s = fs.readFileSync(f, "utf8");
    if (s.includes("@ts-nocheck")) nocheckCount++;
  } catch (e) {}
}
report.push(`Files scanned under app/api: ${apiFiles.length}`);
report.push(`Files containing @ts-nocheck: ${nocheckCount}`);
report.push("\n");

// Top ESLint offenders (by file errors) if we have parsed JSON
try {
  if (eslintRes.out) {
    const json = JSON.parse(eslintRes.out);
    const sorted = json
      .map((f) => ({ file: f.filePath, errors: f.errorCount + f.warningCount }))
      .sort((a, b) => b.errors - a.errors)
      .slice(0, 20);
    report.push("Top ESLint offenders (file — problems):");
    for (const s of sorted) report.push(`${s.file} — ${s.errors}`);
  }
} catch (e) {}

report.push("\nSummary commands to re-run this report:");
report.push("node ./scripts/generate_problems_report.cjs");
report.push("---");

fs.writeFileSync(reportPath, report.join("\n"), "utf8");
logger.info("Wrote report to", reportPath);
process.exit(0);
