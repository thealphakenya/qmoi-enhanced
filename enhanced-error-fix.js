#!/usr/bin/env node
// enhanced-error-fix.ts
const { execSync } = require('child_process');
const path = require('path');
const axios = require('axios');

async function fixFile(file) {
  try {
    // Try local JS/TS/Python fixer first
    execSync(`npx eslint --fix ${file}`, { stdio: 'inherit' });
    console.log(`[Local Fixer] Fixed with ESLint: ${file}`);
    return true;
  } catch (e) {
    console.warn(`[Local Fixer] Failed: ${e.message}`);
  }
  try {
    // Try Rust fixer
    execSync(`node scripts/rust_lint_fix.js ${file}`, { stdio: 'inherit' });
    console.log(`[Rust Fixer] Attempted fix: ${file}`);
    return true;
  } catch (e) {
    console.warn(`[Rust Fixer] Failed: ${e.message}`);
  }
  try {
    // Try QMOI model/AI core endpoint
    const res = await axios.post('http://localhost:5001/qmoi/fix', { file });
    if (res.data && res.data.fixed) {
      require('fs').writeFileSync(file, res.data.fixed);
      console.log(`[QMOI AI Core] Fixed via AI: ${file}`);
      return true;
    }
  } catch (e) {
    console.warn(`[QMOI AI Core] Failed: ${e.message}`);
  }
  console.error(`[Error Fixer] All fixers failed for: ${file}`);
  return false;
}

module.exports = { fixFile };
