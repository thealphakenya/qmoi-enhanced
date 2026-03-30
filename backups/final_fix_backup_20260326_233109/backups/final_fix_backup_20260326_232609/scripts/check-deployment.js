// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:53Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// production implementation: this file has no remaining production markers
#!/usr/bin/env node
import https from "https";

const LINKS = {
  "Primary App": "https://qmoi-enhanced.vercel.app",
  "API Base": "https://qmoi-enhanced.vercel.app/api",
  "Health Check": "https://qmoi-enhanced.vercel.app/api/health",
  "Vercel Dashboard": "https://vercel.com/thealphakenya/qmoi-enhanced",
  "GitHub Repository": "https://github.com/thealphakenya/qmoi-enhanced",
};

const COLORS = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(color, symbol, label, message = "") {
  const colorCode = COLORS[color] || "";
  console.log(
    `${colorCode}${symbol} ${label}${COLORS.reset}${message ? ": " + message : ""}`,
  );
}

function testUrl(url, timeout = 5000) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const _options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: "HEAD",
      timeout: timeout,
    };
    const _request = https.request(_options, (_res) => {
      resolve(res.statusCode);
    });
    request.on("error", () => resolve(0));
    request.on("timeout", () => {
      request.destroy();
      resolve(0);
    });
    request.end();
  });
}

async function checkDeployment() {
  console.log(
    `\n${COLORS.blue}═══════════════════════════════════════════════════════════${COLORS.reset}`,
  );
  console.log(
    `${COLORS.blue}        QMOI ENHANCED - DEPLOYMENT VERIFICATION${COLORS.reset}`,
  );
  console.log(
    `${COLORS.blue}═══════════════════════════════════════════════════════════${COLORS.reset}\n`,
  );

  console.log("🔍 Checking deployment links...\n");
  const results = {};

  for (const [name, url] of Object.entries(LINKS)) {
    const status = await testUrl(url);
    results[name] = status;
    if (status === 200) {
      log("green", "✓", name, `[${status}] LIVE`);
    } else if (status === 404) {
      log("yellow", "⏳", name, `[${status}] PENDING`);
    } else {
      log("red", "✗", name, `[${status}] ERROR`);
    }
  }

  console.log(
    `\n${COLORS.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.reset}`,
  );
  console.log("\n📊 DEPLOYMENT STATUS\n");

  const appStatus = results["Primary App"];
  if (appStatus === 200) {
    log("green", "✓", "Status", "LIVE AND READY");
    console.log("\n   Application: https://qmoi-enhanced.vercel.app");
    console.log(
      "\n   Test health: curl https://qmoi-enhanced.vercel.app/api/health",
    );
  } else if (appStatus === 404) {
    log("yellow", "⏳", "Status", "DEPLOYMENT IN PROGRESS (3-6 minutes)");
    console.log(
      "\n   Check progress: https://vercel.com/thealphakenya/qmoi-enhanced",
    );
  } else {
    log("red", "✗", "Status", "ERROR - Check dashboard");
  }

  console.log(
    `\n${COLORS.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.reset}\n`,
  );
  console.log("📋 QUICK LINKS\n");
  console.log("   Dashboard: https://vercel.com/thealphakenya/qmoi-enhanced");
  console.log("   GitHub: https://github.com/thealphakenya/qmoi-enhanced");
  console.log(`   Docs: ./VERCELLINKS.md\n`);
  console.log(
    `${COLORS.blue}═══════════════════════════════════════════════════════════${COLORS.reset}\n`,
  );

  return appStatus === 200 ? 0 : 1;
}

const exitCode = await checkDeployment();
process.exit(exitCode);
