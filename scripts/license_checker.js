/* eslint-env node */
import { execSync } from 'child_process';
import fs from 'fs';

const allowed = 'MIT;Apache-2.0;BSD-2-Clause;BSD-3-Clause;CC0-1.0;CCO-1.0;ISC;Python-2.0';

function generateReport() {
  try {
    execSync('npx license-checker --production --json > license-report.json', { stdio: 'inherit', shell: true });
    return true;
  } catch (e) {
    console.error('Failed to generate license report:', e.message);
    return false;
  }
}

function checkCompliance() {
  try {
    execSync(`npx license-checker --production --onlyAllow="${allowed}"`, { stdio: 'inherit', shell: true });
    return true;
  } catch (e) {
    return false;
  }
}

function autoFix() {
  try {
    const report = JSON.parse(fs.readFileSync('license-report.json', 'utf-8'));
    const offenders = Object.entries(report).filter(([pkg, meta]) => {
      const allowedArr = allowed.split(';');
      return meta.licenses && !allowedArr.includes(meta.licenses);
    });
    if (offenders.length === 0) {
      console.log('No non-compliant packages found.');
      return true;
    }
    for (const [pkg, meta] of offenders) {
      console.log(`Auto-removing non-compliant package: ${pkg} (${meta.licenses})`);
      try {
        execSync(`yarn remove ${pkg.split('@')[0]}`);
      } catch (e) {
        console.error(`Failed to remove ${pkg}:`, e.message);
      }
    }
    return true;
  } catch (e) {
    console.error('Failed to parse license report:', e.message);
    return false;
  }
}

// Main logic
console.log('Generating license report...');
generateReport();
console.log('Checking license compliance...');
if (checkCompliance()) {
  console.log('All licenses are compliant.');
  process.exit(0);
} else {
  console.warn('Non-compliant licenses found. Attempting auto-fix...');
  autoFix();
  // Re-generate report and re-check
  generateReport();
  if (checkCompliance()) {
    console.log('All licenses are compliant after auto-fix.');
    process.exit(0);
  } else {
    console.error('Non-compliant licenses remain after auto-fix.');
    process.exit(1);
  }
} 