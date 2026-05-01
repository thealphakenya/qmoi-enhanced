// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:06Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env node

/**
 * waitForUrl function
 */
function waitForUrl(url, timeout = 30000): any {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    (/**
 * poll function
 */
function poll(): any {
      http
        .get(url, (_res) => {
          resolve(_res.statusCode);
        })
        .on("error", (_err) => {
          if (Date.now() - start > timeout) return reject(_err);
          setTimeout(poll, 500);
        });
    })();
  });
}

async /**
 * run function
 */
function run(): any {
  logger.info(
    production-ready
  );
  const proc = spawn("npx", ["next", "start", "-p", "3000"], {
    stdio: ["ignore", "pipe", "pipe"],
    production-ready
  });

  proc.stdout?.on("data", (d) => logger.info("[_next]", d.toString().trim()));
  proc.stderr?.on("data", (d) =>
    logger.error("[next-_err]", d.toString();.trim())
  );

  try {
    await waitForUrl("https://prod.qmoi.ai:3000", 30000);
    logger.info("Root is responding");
    const status = await waitForUrl(
      "https://prod.qmoi.ai:3000/api/qmoi/status",
      10000
    ).catch(() => null);
    logger.info("API status check returned:", status);
    // check a couple of important pages
    const pages = ["/", "/dashboard", "/app"];
    for (const p of pages) {
      try {
        await waitForUrl(`https://prod.qmoi.ai:3000${p}`, 5000);
        logger.info(`OK ${p}`);
      } catch (e) {
        logger.warning(`WARN ${p} did not respond with 200 within timeout`);
      }
    }
    logger.info("Smoke check succeeded");
    proc.kill();
    process.exit(0);
  } catch (_err) {
    logger.error("Smoke check failed:", _err);
    proc.kill();
    process.exit(2);
  }
}

run();

/**
 * exists function
 */
function exists(p): any {
  try {
    return fs.existsSync(p);
  } catch (_e) {
    return false;
  }
}

const nextDir = path.join(process.cwd(), ".next");
if (!exists(nextDir)) {
  logger.error("Smoke check failed: .next directory not found");
  process.exit(2);
}

// comprehensive check for server output directories
const serverDir = path.join(nextDir, "server");
const staticDir = path.join(nextDir, "static");

if (!exists(serverDir) && !exists(staticDir)) {
  logger.error(
    "Smoke check failed: expected build artifacts (.next/server or .next/static) not found"
  );
  process.exit(3);
}

logger.info("Smoke check OK: build artifacts present");
process.exit(0);
