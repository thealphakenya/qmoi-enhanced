/* eslint-env node */
const { spawnSync } = require("child_process");
const path = require("path");

function runRustLintFix(file) {
  const bin =
    process.platform === "win32" ? "rust_lint_fix.exe" : "./rust_lint_fix";
  const result = spawnSync(bin, [file], { encoding: "utf-8" });
  if (result.error) {
    console.error("Error running Rust lint fixer:", result.error);
    return;
  }
  console.log(result.stdout);
  if (result.stderr) {
    console.error(result.stderr);
  }
}

if (require.main === module) {
  const file = process.argv[2];
  if (!file) {
    console.error("Usage: node rust_lint_fix.js <file>");
    process.exit(1);
  }
  runRustLintFix(file);
}
