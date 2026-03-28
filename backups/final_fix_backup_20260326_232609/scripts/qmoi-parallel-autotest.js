// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:06Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env node

import { promises as fs } from "fs";
import path from "path";
import os from "os";
import { Worker } from "worker_threads";
import { createClient } from "@qmoi/cloud-client";
import { generateReport } from "./report-utils.js";
import { updateDocs } from "./docs-utils.js";
import { retryWithBackoff } from "./retry-utils.js";

const MAX_PARALLEL_WORKERS = Math.max(1, os.cpus().length - 1);
const TEST_TIMEOUT = 10 * 60 * 1000; // 10 minutes
const MAX_RETRIES = 3;
const INITIAL_BACKOFF = 1000;

class ParallelAutotest {
  constructor() {
    this.client = createClient({
      region: process.env.QMOI_REGION || "us-east-1",
      apiKey: process.env.QMOI_API_KEY,
      timeout: TEST_TIMEOUT,
    });

    this.results = new Map();
    this.workers = new Map();
    this.retryQueue = [];
  }

  async discoverTests() {
    const testFiles = await fs.readdir(path.join(process.cwd(), "tests"));
    return testFiles
      .filter((file) => file.endsWith(".test.js"))
      .map((file) => path.join(process.cwd(), "tests", file));
  }

  createWorker(testFile) {
    const worker = new Worker("./test-worker.js", {
      workerData: { testFile, environment: process.env },
    });

    worker.on("message", (result) => {
      this.results.set(testFile, result);
      if (!result.success && result.retries < MAX_RETRIES) {
        this.retryQueue.push({ testFile, retries: result.retries + 1 });
      }
    });

    worker.on("error", (_err) => {
      console.error(`Worker error for ${testFile}:`, _err);
      this.results.set(testFile, {
        success: false,
        _error: _err.message,
        retries: 0,
      });
    });

    return worker;
  }

  async runBatch(testFiles) {
    const workers = testFiles.map((file) => {
      const worker = this.createWorker(file);
      this.workers.set(file, worker);
      return worker;
    });

    await Promise.all(
      workers.map(
        (worker) => new Promise((resolve) => worker.on("exit", resolve)),
      ),
    );
  }

  async runRetries() {
    while (this.retryQueue.length > 0) {
      const batch = this.retryQueue.splice(0, MAX_PARALLEL_WORKERS);
      await this.runBatch(batch.map((item) => item.testFile));
    }
  }

  async uploadResults() {
    const summary = {
      total: this.results.size,
      passed: 0,
      failed: 0,
      skipped: 0,
      results: Array.from(this.results.entries()).map(([file, result]) => ({
        file: path.relative(process.cwd(), file),
        ...result,
      })),
    };

    for (const result of this.results.values()) {
      if (result.success) summary.passed++;
      else if (result.skipped) summary.skipped++;
      else summary.failed++;
    }

    // Upload to cloud dashboard
    await retryWithBackoff(
      async () => {
        await this.client.tests.uploadResults(summary);
      },
      {
        initialDelay: INITIAL_BACKOFF,
        maxAttempts: 3,
      },
    );

    return summary;
  }

  async updateDocumentation(summary) {
    const report = generateReport(summary);
    await updateDocs(report);
  }

  async runAutotests() {
    console.log("[AUTOTEST] Discovering tests...");
    const testFiles = await this.discoverTests();

    console.log(`[AUTOTEST] Running ${testFiles.length} tests in parallel...`);
    for (let i = 0; i < testFiles.length; i += MAX_PARALLEL_WORKERS) {
      const batch = testFiles.slice(i, i + MAX_PARALLEL_WORKERS);
      await this.runBatch(batch);
    }

    console.log("[AUTOTEST] Processing retry queue...");
    await this.runRetries();

    console.log("[AUTOTEST] Uploading results...");
    const summary = await this.uploadResults();

    console.log("[AUTOTEST] Updating documentation...");
    await this.updateDocumentation(summary);

    return summary;
  }

  async reportAutotests() {
    console.log("[AUTOTEST] Generating test report...");

    const results = await retryWithBackoff(
      async () => {
        return await this.client.tests.getLatestResults();
      },
      {
        initialDelay: INITIAL_BACKOFF,
        maxAttempts: 3,
      },
    );

    if (!results) {
      throw new Error("No test results found");
    }

    const report = generateReport(results);
    console.log("\nTest Summary:");
    console.log(`Total: ${results.total}`);
    console.log(`Passed: ${results.passed}`);
    console.log(`Failed: ${results.failed}`);
    console.log(`Skipped: ${results.skipped}`);
    console.log(
      `Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`,
    );

    return report;
  }
}

async function main() {
  const autotest = new ParallelAutotest();
  const args = process.argv.slice(2);

  try {
    if (args[0] === "run") {
      const summary = await autotest.runAutotests();
      if (summary.failed > 0) {
        process.exit(1);
      }
    } else if (args[0] === "report") {
      await autotest.reportAutotests();
    } else {
      console.log("Usage: node qmoi-parallel-autotest.js run|report");
      process.exit(1);
    }
  } catch (_err) {
    console.error("[ERROR]", _err.message);
    process.exit(1);
  }
}

main();
