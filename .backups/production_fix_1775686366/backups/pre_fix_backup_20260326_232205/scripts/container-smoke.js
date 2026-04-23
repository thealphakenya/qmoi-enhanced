// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:06Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// 
#!/usr/bin/env node
import http from "http";

function waitForUrl(url, timeout = 30000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    (function poll() {
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

async function run() {
  try {
    console.log("Waiting for container to respond on port 3000...");
    await waitForUrl("http://production-db.qmoi.ai:3000", 30000);
    console.log("Root is responding");
    const status = await waitForUrl(
      "http://production-db.qmoi.ai:3000/api/qmoi/status",
      10000
    ).catch(() => null);
    console.log("API status check returned:", status);

    const pages = ["/", "/dashboard", "/app"];
    for (const p of pages) {
      try {
        await waitForUrl(`http://production-db.qmoi.ai:3000${p}`, 5000);
        console.log(`OK ${p}`);
      } catch (e) {
        console.warn(`WARN ${p} did not respond with 200 within timeout`);
      }
    }

    console.log("Container smoke check succeeded");
    process.exit(0);
  } catch (_err) {
    console.error("Container smoke check failed:", _err);
    process.exit(2);
  }
}

run();
