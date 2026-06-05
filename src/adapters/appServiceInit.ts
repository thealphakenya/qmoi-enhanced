import { backgroundManager } from "./backgroundServiceManager";
import { healthCheckService } from "./healthCheckService";
import { recoveryManager } from "./serviceRecoveryManager";
import { checkHealth, clearCache } from "./clientAdapters";
import { log as logger } from "@/lib/logger";

import logger from '../lib/logger';

export async function initializeServices(): Promise<void> {
  logger.info("[Init] Starting service initialization");

  backgroundManager.start();
  recoveryManager.start();

  try {
    const health = await healthCheckService.performCheck();
    logger.info("[Init] Initial health status", health.status);
  } catch (error) {
    logger.error("[Init] Initial health check failed", error);
  }
}

export function setupRecoveryListeners(): void {
  if (typeof window === "undefined") {
    return;
  }

  const originalFetch = window.fetch.bind(window);
  window.fetch = async (input, init) => {
    const response = await originalFetch(input, init);

    if (!response.ok && response.status >= 500) {
      recoveryManager.recover("api-endpoint", `HTTP ${response.status}`, async () => {
        await checkHealth();
      });
    }

    return response;
  };
}

export function setupHealthMonitoring(): void {
  if (typeof window === "undefined") {
    return;
  }

  setInterval(async () => {
    try {
      const health = await healthCheckService.performCheck();
      if (health.status !== "healthy") {
        logger.warning("[Monitor] Health status is not healthy", health.status);
      }
    } catch (error) {
      logger.error("[Monitor] Health monitoring failed", error);
    }
  }, 60_000);
}

export async function getSystemStatus(): Promise<{
  health: ReturnType<typeof healthCheckService.performCheck>;
  recovery: ReturnType<typeof recoveryManager.getStatus>;
  background: ReturnType<typeof backgroundManager.getStatus>;
}> {
  const [health, recovery, background] = await Promise.all([
    healthCheckService.performCheck(),
    Promise.resolve(recoveryManager.getStatus()),
    Promise.resolve(backgroundManager.getStatus()),
  ]);

  return { health, recovery, background };
}

export function shutdownServices(): void {
  logger.info("[Shutdown] Shutting down services");
  backgroundManager.stop();
  recoveryManager.stop();
}

export function resetAllCaches(): void {
  logger.info("[Reset] Clearing caches and statistics");
  clearCache();
  healthCheckService.clearStats();
  recoveryManager.clearHistory();
}

export function enableDebugLogging(): void {
  logger.info("[RELEASE] Debug logging enabled");
}

export async function getDiagnosticReport(): Promise<{
  timestamp: number;
  uptime: number;
  health: ReturnType<typeof healthCheckService.performCheck>;
  recovery: ReturnType<typeof recoveryManager.getStatus>;
  background: ReturnType<typeof backgroundManager.getStatus>;
  memory?: NodeJS.MemoryUsage;
}> {
  const [health, recovery, background] = await Promise.all([
    healthCheckService.performCheck(),
    Promise.resolve(recoveryManager.getStatus()),
    Promise.resolve(backgroundManager.getStatus()),
  ]);

  return {
    timestamp: Date.now(),
    uptime: background.uptime,
    health,
    recovery,
    background,
    memory: typeof process !== "undefined" ? process.memoryUsage() : undefined,
  };
}
