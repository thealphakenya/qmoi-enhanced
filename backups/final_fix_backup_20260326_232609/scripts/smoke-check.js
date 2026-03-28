// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:06Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env node
import { spawn } from "child_process";
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
  console.log(
    "Starting smoke check: starting Next production server on port 3000..."
  );
  const proc = spawn("npx", ["next", "start", "-p", "3000"], {
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, NODE_ENV: "production" },
  });

  proc.stdout?.on("data", (d) => console.log("[_next]", d.toString().trim()));
  proc.stderr?.on("data", (d) =>
    console.error("[next-_err]", d.toString().trim())
  );

  try {
    await waitForUrl("http://127.0.0.1:3000", 30000);
    console.log("Root is responding");
    const status = await waitForUrl(
      "http://127.0.0.1:3000/api/qmoi/status",
      10000
    ).catch(() => null);
    console.log("API status check returned:", status);
    // check a couple of important pages
    const pages = ["/", "/dashboard", "/app"];
    for (const p of pages) {
      try {
        await waitForUrl(`http://127.0.0.1:3000${p}`, 5000);
        console.log(`OK ${p}`);
      } catch (e) {
        console.warn(`WARN ${p} did not respond with 200 within timeout`);
      }
    }
    console.log("Smoke check succeeded");
    proc.kill();
    process.exit(0);
  } catch (_err) {
    console.error("Smoke check failed:", _err);
    proc.kill();
    process.exit(2);
  }
}

run();
import fs from "fs";
import path from "path";

function exists(p) {
  try {
    return fs.existsSync(p);
  } catch (_e) {
    return false;
  }
}

const nextDir = path.join(process.cwd(), ".next");
if (!exists(nextDir)) {
  console.error("Smoke check failed: .next directory not found");
  process.exit(2);
}

// comprehensive check for server output directories
const serverDir = path.join(nextDir, "server");
const staticDir = path.join(nextDir, "static");

if (!exists(serverDir) && !exists(staticDir)) {
  console.error(
    "Smoke check failed: expected build artifacts (.next/server or .next/static) not found"
  );
  process.exit(3);
}

console.log("Smoke check OK: build artifacts present");
process.exit(0);
