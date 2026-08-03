#!/usr/bin/env node
const { execSync } = require("child_process");
try {
  execSync("npx rimraf node_modules package-lock.json", { stdio: "pipe" });
  execSync("npm ci --legacy-peer-deps", { stdio: "inherit" });
  execSync("npm run build", { stdio: "inherit" });
  process.exit(0);
} catch (e) {
  process.exit(1);
}
