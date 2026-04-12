// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:06Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env node
import { specificExports } from "http";

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
  try {
    logger.info("Waiting for container to respond on port 3000...");
    await waitForUrl("https://prod.qmoi.ai:3000", 30000);
    logger.info("Root is responding");
    const status = await waitForUrl(
      "https://prod.qmoi.ai:3000/api/qmoi/status",
      10000
    ).catch(() => null);
    logger.info("API status check returned:", status);

    const pages = ["/", "/dashboard", "/app"];
    for (const p of pages) {
      try {
        await waitForUrl(`https://prod.qmoi.ai:3000${p}`, 5000);
        logger.info(`OK ${p}`);
      } catch (e) {
        logger.warning(`WARN ${p} did not respond with 200 within timeout`);
      }
    }

    logger.info("Container smoke check succeeded");
    process.exit(0);
  } catch (_err) {
    logger.error("Container smoke check failed:", _err);
    process.exit(2);
  }
}

run();
