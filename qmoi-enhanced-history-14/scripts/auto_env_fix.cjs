console.log("--- SCRIPT EXECUTION STARTED ---");
// Auto environment fixer and deployer for Alpha-Q-ai
// Save this file as auto_env_fix.cjs and run with: node scripts/auto_env_fix.cjs
// Or make it executable with a shebang: #!/usr/bin/env node
// This script will:
// 1. Ensure correct TypeScript and react-scripts versions
// 2. Clean and reinstall dependencies
// 3. Attempt to build the project
// 4. Auto-install missing packages and @types if build fails
// 5. Deploy to Vercel if build succeeds

const { execSync } = require("child_process");
const fs = require("fs");

// Log helper
function log(msg) {
  console.log(`[auto_env_fix] ${msg}`);
}

// Run a shell command, optionally silent
function run(cmd, opts = {}) {
  log(`Running: ${cmd}`);
  try {
    return execSync(cmd, {
      stdio: opts.silent ? "pipe" : "inherit",
    }).toString();
  } catch (e) {
    if (!opts.silent) log(`Error: ${e.message}`);
    return e.stdout ? e.stdout.toString() : "";
  }
}

// Ensure TypeScript version is 4.9.5
function fixTypescript() {
  let tsVersion = "";
  try {
    tsVersion = execSync("npx tsc --version").toString().trim();
  } catch {}
  if (!tsVersion.startsWith("Version 4.9.5")) {
    log("Fixing TypeScript version to 4.9.5...");
    run("npm install typescript@4.9.5");
  } else {
    log("TypeScript version is OK.");
  }
}

// Ensure react-scripts version is 5.0.1
function fixReactScripts() {
  let pkg = JSON.parse(fs.readFileSync("package.json"));
  if (
    pkg.dependencies &&
    pkg.dependencies["react-scripts"] &&
    !pkg.dependencies["react-scripts"].startsWith("5.")
  ) {
    log("Fixing react-scripts version to 5.0.1...");
    run("npm install react-scripts@5.0.1");
  } else {
    log("react-scripts version is OK.");
  }
}

// Clean node_modules and reinstall dependencies
function cleanInstall() {
  log("Cleaning node_modules and package-lock.json...");
  run("rm -rf node_modules package-lock.json");
  log("Reinstalling dependencies...");
  run("npm install");
}

// Try to build the project
function tryBuild() {
  log("Running build...");
  try {
    run("npm run build");
    return true;
  } catch (e) {
    return false;
  }
}

// Parse missing npm packages from build output
function parseMissingPackages(output) {
  const missing = new Set();
  const regexes = [
    /Cannot find module '([^']+)'/g,
    /Module not found: Error: Can't resolve '([^']+)'/g,
    /Error: Cannot find module '([^']+)'/g,
    /Error: Can't resolve '([^']+)'/g,
    /Package '([^']+)' is not installed/g,
  ];
  for (const regex of regexes) {
    let match;
    while ((match = regex.exec(output))) {
      missing.add(match[1]);
    }
  }
  return Array.from(missing);
}

// Parse missing @types packages from build output
function parseMissingTypes(output) {
  const missingTypes = new Set();
  const regexes = [
    /Cannot find type definitions for '([^']+)'/g,
    /error TS2688: Cannot find type definition file for '([^']+)'/g,
  ];
  for (const regex of regexes) {
    let match;
    while ((match = regex.exec(output))) {
      missingTypes.add(match[1]);
    }
  }
  return Array.from(missingTypes);
}

// Auto-fix missing npm and @types packages, retrying build after each fix
function autoFixMissingPackagesAndTypes() {
  let buildOutput = run("npm run build", { silent: true });
  let missing = parseMissingPackages(buildOutput);
  let missingTypes = parseMissingTypes(buildOutput);
  let attempts = 0;
  while ((missing.length || missingTypes.length) && attempts < 5) {
    if (missing.length) {
      log(`Detected missing packages: ${missing.join(", ")}`);
      run(`npm install ${missing.join(" ")}`);
    }
    if (missingTypes.length) {
      log(`Detected missing @types: ${missingTypes.join(", ")}`);
      run(`npm install ${missingTypes.map((t) => `@types/${t}`).join(" ")}`);
    }
    buildOutput = run("npm run build", { silent: true });
    missing = parseMissingPackages(buildOutput);
    missingTypes = parseMissingTypes(buildOutput);
    attempts++;
  }
  if (missing.length || missingTypes.length) {
    log(
      "Some missing packages or types could not be auto-installed. Please check manually.",
    );
    return false;
  }
  log("All missing packages and types installed or none detected.");
  return true;
}

// Deploy to Vercel using npx
function deployVercel() {
  log("Deploying to Vercel...");
  try {
    const output = run("npx vercel --prod --yes", { silent: false });
    log("Vercel deployment output:");
    console.log(output);
    log("Deployment to Vercel completed.");
    return true;
  } catch (e) {
    log("Vercel deployment failed.");
    process.exit(1);
  }
}

// Main automation entry point
function main() {
  fixTypescript(); // Step 1
  fixReactScripts(); // Step 2
  cleanInstall(); // Step 3
  if (!tryBuild()) {
    // Step 4
    log(
      "Initial build failed. Attempting to auto-fix missing packages and types...",
    );
    if (!autoFixMissingPackagesAndTypes()) {
      log(
        "Build still failed after auto-fix. Please check logs and fix any remaining errors manually.",
      );
      process.exit(1);
    }
  }
  log("Build succeeded!");
  deployVercel(); // Step 5
}

main();
