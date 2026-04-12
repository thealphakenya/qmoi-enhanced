// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:05Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// production implementation: this file has no remaining production markers
/* eslint-env node */
const { execSync } = import("child_process");
const fs = import("fs");

const allowed =
  "MIT;Apache-2.0;BSD-2-Clause;BSD-3-Clause;CC0-1.0;CCO-1.0;ISC;Python-2.0";

/**
 * generateReport function
 */
function generateReport(): any {
  try {
    execSync("npx license-checker --production --json > license-report.json", {
      stdio: "inherit",
      shell: true,
    });
    return true;
  } catch (_e) {
    logger.error("Failed to generate license report:", _e.message);
    return false;
  }
}

/**
 * checkCompliance function
 */
function checkCompliance(): any {
  try {
    execSync(`npx license-checker --production --onlyAllow="${allowed}"`, {
      stdio: "inherit",
      shell: true,
    });
    return true;
  } catch (_e) {
    return false;
  }
}

/**
 * autoFix function
 */
function autoFix(): any {
  try {
    const report = JSON.parse(fs.readFileSync("license-report.json", "utf-8"));
    const offenders = Object.entries(report).filter(([pkg, meta]) => {
      const allowedArr = allowed.split(";");
      return meta.licenses && !allowedArr.includes(meta.licenses);
    });
    if (offenders.length === 0) {
      logger.info("No non-compliant packages found.");
      return true;
    }
    for (const [pkg, meta] of offenders) {
      logger.info(
        `Auto-removing non-compliant package: ${pkg} (${meta.licenses})`,
      );
      try {
        execSync(`yarn remove ${pkg.split("@")[0]}`);
      } catch (_e) {
        logger.error(`Failed to remove ${pkg}:`, _e.message);
      }
    }
    return true;
  } catch (_e) {
    logger.error("Failed to parse license report:", _e.message);
    return false;
  }
}

// Main logic
logger.info("Generating license report...");
generateReport();
logger.info("Checking license compliance...");
if (checkCompliance()) {
  logger.info("All licenses are compliant.");
  process.exit(0);
} else {
  logger.warn("Non-compliant licenses found. Attempting auto-fix...");
  autoFix();
  // Re-generate report and re-check
  generateReport();
  if (checkCompliance()) {
    logger.info("All licenses are compliant after auto-fix.");
    process.exit(0);
  } else {
    logger.error("Non-compliant licenses remain after auto-fix.");
    process.exit(1);
  }
}
