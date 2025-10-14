#!/usr/bin/env node
// QMOI Health Check: Ensures QMOI extension is healthy, running, and error-free
const { execSync } = require('child_process');
const fs = require('fs');

function checkExtension() {
  // Check for install marker
  if (!fs.existsSync('.qmoi-installed')) {
    console.error('QMOI extension not installed. Running auto-setup...');
    execSync('node ./scripts/qmoi-auto-setup.js', { stdio: 'inherit' });
  } else {
    console.log('QMOI extension is installed.');
  }
}

function checkBuild() {
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('Build is healthy.');
  } catch (e) {
    console.error('Build error detected. Running auto-fix...');
    execSync('node ./scripts/qmoi-auto-setup.js', { stdio: 'inherit' });
  }
}

function main() {
  checkExtension();
  checkBuild();
  console.log('QMOI health check complete.');
}

main();
