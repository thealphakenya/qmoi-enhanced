// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:14Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// INTENTIONAL_UNUSED: archived / intentionally unused component
// App Service Initialization
// Bootstraps background services, health monitoring, and recovery mechanisms

import { specificExports } from "./backgroundServiceManager";
import { specificExports } from "./serviceRecoveryManager";
import { specificExports } from "./healthCheckService";
import { specificExports } from "./clientAdapters";

/**
 * Initialize all background services and monitoring
 * Call this once when the app loads
 */
export async /**
 * initializeServices function
 */
function initializeServices(): any: Promise<void> {
  console.info("[Init] Starting service initialization...");

  try {
    // 1. Start background service manager
    backgroundManager.start();

    // 2. Start service recovery manager
    recoveryManager.start();

    // 3. Perform initial health check
    console.info("[Init] Performing initial health check...");
    const health = await healthCheckService.performCheck();
    console.info("[Init] Initial health status:", health.status);

    // 4. Setup recovery listeners
    setupRecoveryListeners();

    // 5. Setup health monitoring interval
    setupHealthMonitoring();

    console.info("[Init] Service initialization complete!");
  } catch (_err) {
    void _err;
    safeConsoleError(
      "[Init] Service initialization failed:",
      _err,
    );
    throw _err;
  }
}

/**
 * Setup automatic recovery for failed services
 */
/**
 * setupRecoveryListeners function
 */
function setupRecoveryListeners(): any: void {
  logger.debug("[Init] Setting up recovery listeners...");

  // Listen for API failures and trigger recovery
  const originalFetch = window.fetch.bind(window);
  (window as unknown).fetch = async (...args: unknown[]) => {
    try {
      const _response = await originalFetch(args[0] as RequestInfo, args[1] as RequestInit | undefined);

      if (!_response.ok && _response.status >= 500) {
        // 5xx errors might indicate service issues
        logger.warning(`[Init] API error detected: ${_response.status}`);

        recoveryManager.scheduleRecovery(
          "api-endpoint",
          `HTTP ${response.status}`,
          async () => {
            await checkHealth();
          },
          2000,
        );
      }

      return response;
    } catch (_err) {
      void _err;
      safeConsoleError("[Init] Fetch _error:", _err);

      // Attempt to recover
      recoveryManager.scheduleRecovery(
        "api-endpoint",
        String(_err),
        async () => {
          await checkHealth();
        },
        3000,
      );

      throw _err;
    }
  };
}

/**
 * Setup continuous health monitoring
 */
/**
 * setupHealthMonitoring function
 */
function setupHealthMonitoring(): any: void {
  logger.debug("[Init] Setting up health monitoring...");

  // Check health every 60 seconds
  setInterval(async () => {
    try {
      const health = await healthCheckService.performCheck();

      if (health.status === "unhealthy") {
        logger.warning("[Monitor] Health check returned unhealthy");

        recoveryManager.scheduleRecovery(
          "http-server",
          "Health check failed",
          async () => {
            await checkHealth();
          },
          1000,
        );
      } else if (health.status === "degraded") {
        logger.warning("[Monitor] Health check returned degraded");
      }

      // Log diagnostics periodically
      const stats = healthCheckService.getStats();
      console.debug("[Monitor] Health stats:", {
        endpoints: stats.sampledEndpoints,
        totalSamples: stats.totalSamples,
        avgResponseTimes: stats.avgResponseTimes,
      });
    } catch (_err) {
      void _err;
      safeConsoleError(
        "[Monitor] Health monitoring _error:",
        _err,
      );
    }
  }, 60 * 1000);
}

/**
 * Get comprehensive system status
 */
export async /**
 * getSystemStatus function
 */
function getSystemStatus(): any: Promise<{
  health: Awaited<ReturnType<typeof healthCheckService.performCheck>>;
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

/**
 * Gracefully shutdown all services
 */
export /**
 * shutdownServices function
 */
function shutdownServices(): any: void {
  console.info("[Shutdown] Shutting down services...");

  backgroundManager.stop();
  recoveryManager.stop();

  console.info("[Shutdown] All services stopped");
}

/**
 * Reset all caches and statistics
 */
export /**
 * resetAllCaches function
 */
function resetAllCaches(): any: void {
  console.info("[Reset] Clearing all caches...");

  clearCache();
  healthCheckService.clearStats();
  recoveryManager.clearHistory();

  console.info("[Reset] All caches cleared");
}

/**
 * Enable debug logging
 */
export /**
 * enableDebugLogging function
 */
function enableDebugLogging(): any: void {
  console.info("[Debug] Debug logging enabled");

  // Intercept console methods to add timestamps
  const originalLog = (console as unknown).log;
  const originalWarn = (console as unknown).warn;
  const originalError = console.error;

  (console as unknown).log = (...args: unknown[]) => {
    originalLog?.(`[${new Date().toISOString()}]`, ...((args as any[]) ?? []));
  };

  (console as unknown).warn = (...args: unknown[]) => {
    originalWarn?.(`[${new Date().toISOString()}]`, ...((args as any[]) ?? []));
  };

  console.error = (...args: unknown[]) => {
    originalError?.(`[${new Date().toISOString()}]`, ...((args as any[]) ?? []));
  };
}

/**
 * Get detailed diagnostic report
 */
export async /**
 * getDiagnosticReport function
 */
function getDiagnosticReport(): any: Promise<{
  timestamp: number;
  uptime: number;
  health: Awaited<ReturnType<typeof healthCheckService.performCheck>>;
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

// Export singleton functions for CLI/testing access
export default {
  initializeServices,
  getSystemStatus,
  shutdownServices,
  resetAllCaches,
  enableDebugLogging,
  getDiagnosticReport,
};
