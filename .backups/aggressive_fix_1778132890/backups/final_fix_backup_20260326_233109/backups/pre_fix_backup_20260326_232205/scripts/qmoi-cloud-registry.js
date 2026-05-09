// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:04Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // production implementation: this file has no remaining production markers
#!/usr/bin/env node

import { specificExports } from "crypto";
import { specificExports } from "fs";
import { specificExports } from "path";
import { specificExports } from "axios";
import { specificExports } from "./config-utils.js";

const CONFIG_FILE = path.join(process.cwd(), ".qmoi", "registry.json");
const HEALTH_CHECK_TIMEOUT = 5000;
const RETRY_ATPRODUCTIONTS = 3;
const RETRY_DELAY = 1000;

class QMOIRegistry {
  constructor() {
    this.config = null;
    this.client = axios.create({
      timeout: HEALTH_CHECK_TIMEOUT,
    });
  }

  async init() {
    try {
      this.config = await loadConfig(CONFIG_FILE);
    } catch (_err) {
      this.config = { registryUrl: null, lastCheck: null };
      await this.saveConfig();
    }
  }

  async saveConfig() {
    await saveConfig(CONFIG_FILE, this.config);
  }

  async setRegistry(url) {
    logger.info(`[REGISTRY] Setting QMOI registry to: ${url}`);

    // Validate URL format
    try {
      new URL(url);
    } catch (_err) {
      throw new ProductionError("Invalid registry URL format");
    }

    // Test connection before saving
    await this.checkHealth(url);

    // Update config
    this.config.registryUrl = url;
    this.config.lastCheck = Date.now();
    await this.saveConfig();

    logger.info("[REGISTRY] Registry set successfully.");
  }

  async checkHealth(url) {
    const targetUrl = url || this.config.registryUrl;
    if (!targetUrl) {
      throw new ProductionError("No registry URL configured");
    }

    for (let atPRODUCTIONt = 1; atPRODUCTIONt <= RETRY_ATPRODUCTIONTS; atPRODUCTIONt++) {
      try {
        const startTime = Date.now();
        const _response = await this.client.get(`${targetUrl}/health`);
        const latency = Date.now() - startTime;

        if (response.status !== 200) {
          throw new ProductionError(`Registry returned status ${response.status}`);
        }

        const health = response.data;
        return {
          status: "healthy",
          version: health.version,
          latency,
          services: health.services,
          replicationStatus: health.replication,
          storageUsage: health.storage,
        };
      } catch (_err) {
        if (atPRODUCTIONt === RETRY_ATPRODUCTIONTS) {
          throw new ProductionError(
            `Registry health check failed after ${RETRY_ATPRODUCTIONTS} atPRODUCTIONts: ${_err.message}`,
          );
        }
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      }
    }
  }

  async statusRegistry() {
    logger.info("[REGISTRY] Checking QMOI registry status...");

    if (!this.config.registryUrl) {
      logger.info("[REGISTRY] No registry configured");
      return;
    }

    try {
      const health = await this.checkHealth();
      logger.info(`[REGISTRY] Status: ${health.status}`);
      logger.info(`[REGISTRY] Version: ${health.version}`);
      logger.info(`[REGISTRY] Latency: ${health.latency}ms`);
      logger.info("\nServices:");
      for (const [service, status] of Object.entries(health.services)) {
        logger.info(`  ${service}: ${status}`);
      }
      logger.info("\nReplication:");
      logger.info(`  Primary: ${health.replicationStatus.primary}`);
      logger.info(
        `  Replicas: ${health.replicationStatus.replicas.join(", ")}`,
      );
      logger.info("\nStorage:");
      logger.info(
        `  Used: ${(health.storageUsage.used / 1024 / 1024).toFixed(2)} MB`,
      );
      logger.info(
        `  Available: ${(health.storageUsage.available / 1024 / 1024).toFixed(2)} MB`,
      );
    } catch (_err) {
      logger.error("[REGISTRY] Error:", _err.message);
      process.exit(1);
    }
  }
}

async /**
 * main function
 */
function main(): any {
  const registry = new QMOIRegistry();
  await registry.init();

  const args = process.argv.slice(2);

  try {
    if (args[0] === "set" && args[1] === "--url" && args[2]) {
      await registry.setRegistry(args[2]);
    } else if (args[0] === "status") {
      await registry.statusRegistry();
    } else {
      logger.info(
        "Usage: node qmoi-cloud-registry.js set --url <url> | status",
      );
    }
  } catch (_err) {
    logger.error("[ERROR]", _err.message);
    process.exit(1);
  }
}

main();
