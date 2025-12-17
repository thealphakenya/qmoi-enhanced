#!/usr/bin/env node
const { execSync } = require("child_process");
try {
  execSync("npx vercel --clear-cache", { stdio: "pipe" });
  execSync("npx vercel --prod --yes --force", { stdio: "inherit" });
  process.exit(0);
} catch (e) {
  process.exit(1);
}
