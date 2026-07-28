// App Service Initialization
// Bootstraps background services, health monitoring, and recovery mechanisms

import { backgroundManager } from "./backgroundServiceManager";
import { recoveryManager } from "./serviceRecoveryManager";
import { healthCheckService } from "./healthCheckService";
import { checkHealth, clearCache } from "./clientAdapters";

/**
 * Initialize all background services and monitoring
 * Call this once when the app loads
 */
export async function initializeServices(): Promise<void> {
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
    (globalThis.console as unknown)?.error?.(
      "[Init] Service initialization failed:",
      _err,
    );
    throw _err;
  }
}

/**
 * Setup automatic recovery for failed services
 */
function setupRecoveryListeners(): void {
  console.debug("[Init] Setting up recovery listeners...");

  // Listen for API failures and trigger recovery
  const originalFetch = window.fetch;
  (window as unknown).fetch = async (...args: unknown[]) => {
    try {
      const _response = await (originalFetch as unknown).apply(
        window,
        args as unknown,
      );

      if (!response.ok && response.status >= 500) {
        // 5xx errors might indicate service issues
        console.warn(`[Init] API error detected: ${response.status}`);

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
      (globalThis.console as unknown)?.error?.("[Init] Fetch _error:", _err);

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
function setupHealthMonitoring(): void {
  console.debug("[Init] Setting up health monitoring...");

  // Check health every 60 seconds
  setInterval(async () => {
    try {
      const health = await healthCheckService.performCheck();

      if (health.status === "unhealthy") {
        console.warn("[Monitor] Health check returned unhealthy");

        recoveryManager.scheduleRecovery(
          "http-server",
          "Health check failed",
          async () => {
            await checkHealth();
          },
          1000,
        );
      } else if (health.status === "degraded") {
        console.warn("[Monitor] Health check returned degraded");
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
      (globalThis.console as unknown)?.error?.(
        "[Monitor] Health monitoring _error:",
        _err,
      );
    }
  }, 60 * 1000);
}

/**
 * Get comprehensive system status
 */
export async function getSystemStatus(): Promise<{
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
export function shutdownServices(): void {
  console.info("[Shutdown] Shutting down services...");

  backgroundManager.stop();
  recoveryManager.stop();

  console.info("[Shutdown] All services stopped");
}

/**
 * Reset all caches and statistics
 */
export function resetAllCaches(): void {
  console.info("[Reset] Clearing all caches...");

  clearCache();
  healthCheckService.clearStats();
  recoveryManager.clearHistory();

  console.info("[Reset] All caches cleared");
}

/**
 * Enable debug logging
 */
export function enableDebugLogging(): void {
  console.info("[Debug] Debug logging enabled");

  // Intercept console methods to add timestamps
  const originalLog = (console as unknown).log;
  const originalWarn = (console as unknown).warn;
  const originalError = (console as unknown).error;

  (console as unknown).log = (...args: unknown[]) => {
    originalLog?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };

  (console as unknown).warn = (...args: unknown[]) => {
    originalWarn?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };

  (console as unknown).error = (...args: unknown[]) => {
    originalError?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };
}

/**
 * Get detailed diagnostic report
 */
export async function getDiagnosticReport(): Promise<{
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/adapters/appServiceInit.ts -->
// App Service Initialization
// Bootstraps background services, health monitoring, and recovery mechanisms

import { backgroundManager } from "./backgroundServiceManager";
import { recoveryManager } from "./serviceRecoveryManager";
import { healthCheckService } from "./healthCheckService";
import { checkHealth, clearCache } from "./clientAdapters";

/**
 * Initialize all background services and monitoring
 * Call this once when the app loads
 */
export async function initializeServices(): Promise<void> {
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
    (globalThis.console as unknown)?.error?.(
      "[Init] Service initialization failed:",
      _err,
    );
    throw _err;
  }
}

/**
 * Setup automatic recovery for failed services
 */
function setupRecoveryListeners(): void {
  console.debug("[Init] Setting up recovery listeners...");

  // Listen for API failures and trigger recovery
  const originalFetch = window.fetch;
  (window as unknown).fetch = async (...args: unknown[]) => {
    try {
      const _response = await (originalFetch as unknown).apply(
        window,
        args as unknown,
      );

      if (!response.ok && response.status >= 500) {
        // 5xx errors might indicate service issues
        console.warn(`[Init] API error detected: ${response.status}`);

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
      (globalThis.console as unknown)?.error?.("[Init] Fetch _error:", _err);

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
function setupHealthMonitoring(): void {
  console.debug("[Init] Setting up health monitoring...");

  // Check health every 60 seconds
  setInterval(async () => {
    try {
      const health = await healthCheckService.performCheck();

      if (health.status === "unhealthy") {
        console.warn("[Monitor] Health check returned unhealthy");

        recoveryManager.scheduleRecovery(
          "http-server",
          "Health check failed",
          async () => {
            await checkHealth();
          },
          1000,
        );
      } else if (health.status === "degraded") {
        console.warn("[Monitor] Health check returned degraded");
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
      (globalThis.console as unknown)?.error?.(
        "[Monitor] Health monitoring _error:",
        _err,
      );
    }
  }, 60 * 1000);
}

/**
 * Get comprehensive system status
 */
export async function getSystemStatus(): Promise<{
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
export function shutdownServices(): void {
  console.info("[Shutdown] Shutting down services...");

  backgroundManager.stop();
  recoveryManager.stop();

  console.info("[Shutdown] All services stopped");
}

/**
 * Reset all caches and statistics
 */
export function resetAllCaches(): void {
  console.info("[Reset] Clearing all caches...");

  clearCache();
  healthCheckService.clearStats();
  recoveryManager.clearHistory();

  console.info("[Reset] All caches cleared");
}

/**
 * Enable debug logging
 */
export function enableDebugLogging(): void {
  console.info("[Debug] Debug logging enabled");

  // Intercept console methods to add timestamps
  const originalLog = (console as unknown).log;
  const originalWarn = (console as unknown).warn;
  const originalError = (console as unknown).error;

  (console as unknown).log = (...args: unknown[]) => {
    originalLog?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };

  (console as unknown).warn = (...args: unknown[]) => {
    originalWarn?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };

  (console as unknown).error = (...args: unknown[]) => {
    originalError?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };
}

/**
 * Get detailed diagnostic report
 */
export async function getDiagnosticReport(): Promise<{
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/adapters/appServiceInit.ts -->
// App Service Initialization
// Bootstraps background services, health monitoring, and recovery mechanisms

import { backgroundManager } from "./backgroundServiceManager";
import { recoveryManager } from "./serviceRecoveryManager";
import { healthCheckService } from "./healthCheckService";
import { checkHealth, clearCache } from "./clientAdapters";

/**
 * Initialize all background services and monitoring
 * Call this once when the app loads
 */
export async function initializeServices(): Promise<void> {
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
    (globalThis.console as unknown)?.error?.(
      "[Init] Service initialization failed:",
      _err,
    );
    throw _err;
  }
}

/**
 * Setup automatic recovery for failed services
 */
function setupRecoveryListeners(): void {
  console.debug("[Init] Setting up recovery listeners...");

  // Listen for API failures and trigger recovery
  const originalFetch = window.fetch;
  (window as unknown).fetch = async (...args: unknown[]) => {
    try {
      const _response = await (originalFetch as unknown).apply(
        window,
        args as unknown,
      );

      if (!response.ok && response.status >= 500) {
        // 5xx errors might indicate service issues
        console.warn(`[Init] API error detected: ${response.status}`);

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
      (globalThis.console as unknown)?.error?.("[Init] Fetch _error:", _err);

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
function setupHealthMonitoring(): void {
  console.debug("[Init] Setting up health monitoring...");

  // Check health every 60 seconds
  setInterval(async () => {
    try {
      const health = await healthCheckService.performCheck();

      if (health.status === "unhealthy") {
        console.warn("[Monitor] Health check returned unhealthy");

        recoveryManager.scheduleRecovery(
          "http-server",
          "Health check failed",
          async () => {
            await checkHealth();
          },
          1000,
        );
      } else if (health.status === "degraded") {
        console.warn("[Monitor] Health check returned degraded");
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
      (globalThis.console as unknown)?.error?.(
        "[Monitor] Health monitoring _error:",
        _err,
      );
    }
  }, 60 * 1000);
}

/**
 * Get comprehensive system status
 */
export async function getSystemStatus(): Promise<{
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
export function shutdownServices(): void {
  console.info("[Shutdown] Shutting down services...");

  backgroundManager.stop();
  recoveryManager.stop();

  console.info("[Shutdown] All services stopped");
}

/**
 * Reset all caches and statistics
 */
export function resetAllCaches(): void {
  console.info("[Reset] Clearing all caches...");

  clearCache();
  healthCheckService.clearStats();
  recoveryManager.clearHistory();

  console.info("[Reset] All caches cleared");
}

/**
 * Enable debug logging
 */
export function enableDebugLogging(): void {
  console.info("[Debug] Debug logging enabled");

  // Intercept console methods to add timestamps
  const originalLog = (console as unknown).log;
  const originalWarn = (console as unknown).warn;
  const originalError = (console as unknown).error;

  (console as unknown).log = (...args: unknown[]) => {
    originalLog?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };

  (console as unknown).warn = (...args: unknown[]) => {
    originalWarn?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };

  (console as unknown).error = (...args: unknown[]) => {
    originalError?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };
}

/**
 * Get detailed diagnostic report
 */
export async function getDiagnosticReport(): Promise<{
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/adapters/appServiceInit.ts -->
// App Service Initialization
// Bootstraps background services, health monitoring, and recovery mechanisms

import { backgroundManager } from "./backgroundServiceManager";
import { recoveryManager } from "./serviceRecoveryManager";
import { healthCheckService } from "./healthCheckService";
import { checkHealth, clearCache } from "./clientAdapters";

/**
 * Initialize all background services and monitoring
 * Call this once when the app loads
 */
export async function initializeServices(): Promise<void> {
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
    (globalThis.console as unknown)?.error?.(
      "[Init] Service initialization failed:",
      _err,
    );
    throw _err;
  }
}

/**
 * Setup automatic recovery for failed services
 */
function setupRecoveryListeners(): void {
  console.debug("[Init] Setting up recovery listeners...");

  // Listen for API failures and trigger recovery
  const originalFetch = window.fetch;
  (window as unknown).fetch = async (...args: unknown[]) => {
    try {
      const _response = await (originalFetch as unknown).apply(
        window,
        args as unknown,
      );

      if (!response.ok && response.status >= 500) {
        // 5xx errors might indicate service issues
        console.warn(`[Init] API error detected: ${response.status}`);

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
      (globalThis.console as unknown)?.error?.("[Init] Fetch _error:", _err);

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
function setupHealthMonitoring(): void {
  console.debug("[Init] Setting up health monitoring...");

  // Check health every 60 seconds
  setInterval(async () => {
    try {
      const health = await healthCheckService.performCheck();

      if (health.status === "unhealthy") {
        console.warn("[Monitor] Health check returned unhealthy");

        recoveryManager.scheduleRecovery(
          "http-server",
          "Health check failed",
          async () => {
            await checkHealth();
          },
          1000,
        );
      } else if (health.status === "degraded") {
        console.warn("[Monitor] Health check returned degraded");
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
      (globalThis.console as unknown)?.error?.(
        "[Monitor] Health monitoring _error:",
        _err,
      );
    }
  }, 60 * 1000);
}

/**
 * Get comprehensive system status
 */
export async function getSystemStatus(): Promise<{
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
export function shutdownServices(): void {
  console.info("[Shutdown] Shutting down services...");

  backgroundManager.stop();
  recoveryManager.stop();

  console.info("[Shutdown] All services stopped");
}

/**
 * Reset all caches and statistics
 */
export function resetAllCaches(): void {
  console.info("[Reset] Clearing all caches...");

  clearCache();
  healthCheckService.clearStats();
  recoveryManager.clearHistory();

  console.info("[Reset] All caches cleared");
}

/**
 * Enable debug logging
 */
export function enableDebugLogging(): void {
  console.info("[Debug] Debug logging enabled");

  // Intercept console methods to add timestamps
  const originalLog = (console as unknown).log;
  const originalWarn = (console as unknown).warn;
  const originalError = (console as unknown).error;

  (console as unknown).log = (...args: unknown[]) => {
    originalLog?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };

  (console as unknown).warn = (...args: unknown[]) => {
    originalWarn?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };

  (console as unknown).error = (...args: unknown[]) => {
    originalError?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };
}

/**
 * Get detailed diagnostic report
 */
export async function getDiagnosticReport(): Promise<{
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/adapters/appServiceInit.ts -->
// App Service Initialization
// Bootstraps background services, health monitoring, and recovery mechanisms

import { backgroundManager } from "./backgroundServiceManager";
import { recoveryManager } from "./serviceRecoveryManager";
import { healthCheckService } from "./healthCheckService";
import { checkHealth, clearCache } from "./clientAdapters";

/**
 * Initialize all background services and monitoring
 * Call this once when the app loads
 */
export async function initializeServices(): Promise<void> {
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
    (globalThis.console as unknown)?.error?.(
      "[Init] Service initialization failed:",
      _err,
    );
    throw _err;
  }
}

/**
 * Setup automatic recovery for failed services
 */
function setupRecoveryListeners(): void {
  console.debug("[Init] Setting up recovery listeners...");

  // Listen for API failures and trigger recovery
  const originalFetch = window.fetch;
  (window as unknown).fetch = async (...args: unknown[]) => {
    try {
      const _response = await (originalFetch as unknown).apply(
        window,
        args as unknown,
      );

      if (!response.ok && response.status >= 500) {
        // 5xx errors might indicate service issues
        console.warn(`[Init] API error detected: ${response.status}`);

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
      (globalThis.console as unknown)?.error?.("[Init] Fetch _error:", _err);

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
function setupHealthMonitoring(): void {
  console.debug("[Init] Setting up health monitoring...");

  // Check health every 60 seconds
  setInterval(async () => {
    try {
      const health = await healthCheckService.performCheck();

      if (health.status === "unhealthy") {
        console.warn("[Monitor] Health check returned unhealthy");

        recoveryManager.scheduleRecovery(
          "http-server",
          "Health check failed",
          async () => {
            await checkHealth();
          },
          1000,
        );
      } else if (health.status === "degraded") {
        console.warn("[Monitor] Health check returned degraded");
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
      (globalThis.console as unknown)?.error?.(
        "[Monitor] Health monitoring _error:",
        _err,
      );
    }
  }, 60 * 1000);
}

/**
 * Get comprehensive system status
 */
export async function getSystemStatus(): Promise<{
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
export function shutdownServices(): void {
  console.info("[Shutdown] Shutting down services...");

  backgroundManager.stop();
  recoveryManager.stop();

  console.info("[Shutdown] All services stopped");
}

/**
 * Reset all caches and statistics
 */
export function resetAllCaches(): void {
  console.info("[Reset] Clearing all caches...");

  clearCache();
  healthCheckService.clearStats();
  recoveryManager.clearHistory();

  console.info("[Reset] All caches cleared");
}

/**
 * Enable debug logging
 */
export function enableDebugLogging(): void {
  console.info("[Debug] Debug logging enabled");

  // Intercept console methods to add timestamps
  const originalLog = (console as unknown).log;
  const originalWarn = (console as unknown).warn;
  const originalError = (console as unknown).error;

  (console as unknown).log = (...args: unknown[]) => {
    originalLog?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };

  (console as unknown).warn = (...args: unknown[]) => {
    originalWarn?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };

  (console as unknown).error = (...args: unknown[]) => {
    originalError?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };
}

/**
 * Get detailed diagnostic report
 */
export async function getDiagnosticReport(): Promise<{
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/adapters/appServiceInit.ts -->
// App Service Initialization
// Bootstraps background services, health monitoring, and recovery mechanisms

import { backgroundManager } from "./backgroundServiceManager";
import { recoveryManager } from "./serviceRecoveryManager";
import { healthCheckService } from "./healthCheckService";
import { checkHealth, clearCache } from "./clientAdapters";

/**
 * Initialize all background services and monitoring
 * Call this once when the app loads
 */
export async function initializeServices(): Promise<void> {
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
    (globalThis.console as unknown)?.error?.(
      "[Init] Service initialization failed:",
      _err,
    );
    throw _err;
  }
}

/**
 * Setup automatic recovery for failed services
 */
function setupRecoveryListeners(): void {
  console.debug("[Init] Setting up recovery listeners...");

  // Listen for API failures and trigger recovery
  const originalFetch = window.fetch;
  (window as unknown).fetch = async (...args: unknown[]) => {
    try {
      const _response = await (originalFetch as unknown).apply(
        window,
        args as unknown,
      );

      if (!response.ok && response.status >= 500) {
        // 5xx errors might indicate service issues
        console.warn(`[Init] API error detected: ${response.status}`);

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
      (globalThis.console as unknown)?.error?.("[Init] Fetch _error:", _err);

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
function setupHealthMonitoring(): void {
  console.debug("[Init] Setting up health monitoring...");

  // Check health every 60 seconds
  setInterval(async () => {
    try {
      const health = await healthCheckService.performCheck();

      if (health.status === "unhealthy") {
        console.warn("[Monitor] Health check returned unhealthy");

        recoveryManager.scheduleRecovery(
          "http-server",
          "Health check failed",
          async () => {
            await checkHealth();
          },
          1000,
        );
      } else if (health.status === "degraded") {
        console.warn("[Monitor] Health check returned degraded");
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
      (globalThis.console as unknown)?.error?.(
        "[Monitor] Health monitoring _error:",
        _err,
      );
    }
  }, 60 * 1000);
}

/**
 * Get comprehensive system status
 */
export async function getSystemStatus(): Promise<{
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
export function shutdownServices(): void {
  console.info("[Shutdown] Shutting down services...");

  backgroundManager.stop();
  recoveryManager.stop();

  console.info("[Shutdown] All services stopped");
}

/**
 * Reset all caches and statistics
 */
export function resetAllCaches(): void {
  console.info("[Reset] Clearing all caches...");

  clearCache();
  healthCheckService.clearStats();
  recoveryManager.clearHistory();

  console.info("[Reset] All caches cleared");
}

/**
 * Enable debug logging
 */
export function enableDebugLogging(): void {
  console.info("[Debug] Debug logging enabled");

  // Intercept console methods to add timestamps
  const originalLog = (console as unknown).log;
  const originalWarn = (console as unknown).warn;
  const originalError = (console as unknown).error;

  (console as unknown).log = (...args: unknown[]) => {
    originalLog?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };

  (console as unknown).warn = (...args: unknown[]) => {
    originalWarn?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };

  (console as unknown).error = (...args: unknown[]) => {
    originalError?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };
}

/**
 * Get detailed diagnostic report
 */
export async function getDiagnosticReport(): Promise<{
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/adapters/appServiceInit.ts -->
// App Service Initialization
// Bootstraps background services, health monitoring, and recovery mechanisms

import { backgroundManager } from "./backgroundServiceManager";
import { recoveryManager } from "./serviceRecoveryManager";
import { healthCheckService } from "./healthCheckService";
import { checkHealth, clearCache } from "./clientAdapters";

/**
 * Initialize all background services and monitoring
 * Call this once when the app loads
 */
export async function initializeServices(): Promise<void> {
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
    (globalThis.console as unknown)?.error?.(
      "[Init] Service initialization failed:",
      _err,
    );
    throw _err;
  }
}

/**
 * Setup automatic recovery for failed services
 */
function setupRecoveryListeners(): void {
  console.debug("[Init] Setting up recovery listeners...");

  // Listen for API failures and trigger recovery
  const originalFetch = window.fetch;
  (window as unknown).fetch = async (...args: unknown[]) => {
    try {
      const _response = await (originalFetch as unknown).apply(
        window,
        args as unknown,
      );

      if (!response.ok && response.status >= 500) {
        // 5xx errors might indicate service issues
        console.warn(`[Init] API error detected: ${response.status}`);

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
      (globalThis.console as unknown)?.error?.("[Init] Fetch _error:", _err);

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
function setupHealthMonitoring(): void {
  console.debug("[Init] Setting up health monitoring...");

  // Check health every 60 seconds
  setInterval(async () => {
    try {
      const health = await healthCheckService.performCheck();

      if (health.status === "unhealthy") {
        console.warn("[Monitor] Health check returned unhealthy");

        recoveryManager.scheduleRecovery(
          "http-server",
          "Health check failed",
          async () => {
            await checkHealth();
          },
          1000,
        );
      } else if (health.status === "degraded") {
        console.warn("[Monitor] Health check returned degraded");
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
      (globalThis.console as unknown)?.error?.(
        "[Monitor] Health monitoring _error:",
        _err,
      );
    }
  }, 60 * 1000);
}

/**
 * Get comprehensive system status
 */
export async function getSystemStatus(): Promise<{
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
export function shutdownServices(): void {
  console.info("[Shutdown] Shutting down services...");

  backgroundManager.stop();
  recoveryManager.stop();

  console.info("[Shutdown] All services stopped");
}

/**
 * Reset all caches and statistics
 */
export function resetAllCaches(): void {
  console.info("[Reset] Clearing all caches...");

  clearCache();
  healthCheckService.clearStats();
  recoveryManager.clearHistory();

  console.info("[Reset] All caches cleared");
}

/**
 * Enable debug logging
 */
export function enableDebugLogging(): void {
  console.info("[Debug] Debug logging enabled");

  // Intercept console methods to add timestamps
  const originalLog = (console as unknown).log;
  const originalWarn = (console as unknown).warn;
  const originalError = (console as unknown).error;

  (console as unknown).log = (...args: unknown[]) => {
    originalLog?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };

  (console as unknown).warn = (...args: unknown[]) => {
    originalWarn?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };

  (console as unknown).error = (...args: unknown[]) => {
    originalError?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };
}

/**
 * Get detailed diagnostic report
 */
export async function getDiagnosticReport(): Promise<{
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/adapters/appServiceInit.ts -->
// App Service Initialization
// Bootstraps background services, health monitoring, and recovery mechanisms

import { backgroundManager } from "./backgroundServiceManager";
import { recoveryManager } from "./serviceRecoveryManager";
import { healthCheckService } from "./healthCheckService";
import { checkHealth, clearCache } from "./clientAdapters";

/**
 * Initialize all background services and monitoring
 * Call this once when the app loads
 */
export async function initializeServices(): Promise<void> {
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
    (globalThis.console as unknown)?.error?.(
      "[Init] Service initialization failed:",
      _err,
    );
    throw _err;
  }
}

/**
 * Setup automatic recovery for failed services
 */
function setupRecoveryListeners(): void {
  console.debug("[Init] Setting up recovery listeners...");

  // Listen for API failures and trigger recovery
  const originalFetch = window.fetch;
  (window as unknown).fetch = async (...args: unknown[]) => {
    try {
      const _response = await (originalFetch as unknown).apply(
        window,
        args as unknown,
      );

      if (!response.ok && response.status >= 500) {
        // 5xx errors might indicate service issues
        console.warn(`[Init] API error detected: ${response.status}`);

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
      (globalThis.console as unknown)?.error?.("[Init] Fetch _error:", _err);

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
function setupHealthMonitoring(): void {
  console.debug("[Init] Setting up health monitoring...");

  // Check health every 60 seconds
  setInterval(async () => {
    try {
      const health = await healthCheckService.performCheck();

      if (health.status === "unhealthy") {
        console.warn("[Monitor] Health check returned unhealthy");

        recoveryManager.scheduleRecovery(
          "http-server",
          "Health check failed",
          async () => {
            await checkHealth();
          },
          1000,
        );
      } else if (health.status === "degraded") {
        console.warn("[Monitor] Health check returned degraded");
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
      (globalThis.console as unknown)?.error?.(
        "[Monitor] Health monitoring _error:",
        _err,
      );
    }
  }, 60 * 1000);
}

/**
 * Get comprehensive system status
 */
export async function getSystemStatus(): Promise<{
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
export function shutdownServices(): void {
  console.info("[Shutdown] Shutting down services...");

  backgroundManager.stop();
  recoveryManager.stop();

  console.info("[Shutdown] All services stopped");
}

/**
 * Reset all caches and statistics
 */
export function resetAllCaches(): void {
  console.info("[Reset] Clearing all caches...");

  clearCache();
  healthCheckService.clearStats();
  recoveryManager.clearHistory();

  console.info("[Reset] All caches cleared");
}

/**
 * Enable debug logging
 */
export function enableDebugLogging(): void {
  console.info("[Debug] Debug logging enabled");

  // Intercept console methods to add timestamps
  const originalLog = (console as unknown).log;
  const originalWarn = (console as unknown).warn;
  const originalError = (console as unknown).error;

  (console as unknown).log = (...args: unknown[]) => {
    originalLog?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };

  (console as unknown).warn = (...args: unknown[]) => {
    originalWarn?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };

  (console as unknown).error = (...args: unknown[]) => {
    originalError?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };
}

/**
 * Get detailed diagnostic report
 */
export async function getDiagnosticReport(): Promise<{
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/adapters/appServiceInit.ts -->
// App Service Initialization
// Bootstraps background services, health monitoring, and recovery mechanisms

import { backgroundManager } from "./backgroundServiceManager";
import { recoveryManager } from "./serviceRecoveryManager";
import { healthCheckService } from "./healthCheckService";
import { checkHealth, clearCache } from "./clientAdapters";

/**
 * Initialize all background services and monitoring
 * Call this once when the app loads
 */
export async function initializeServices(): Promise<void> {
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
    (globalThis.console as unknown)?.error?.(
      "[Init] Service initialization failed:",
      _err,
    );
    throw _err;
  }
}

/**
 * Setup automatic recovery for failed services
 */
function setupRecoveryListeners(): void {
  console.debug("[Init] Setting up recovery listeners...");

  // Listen for API failures and trigger recovery
  const originalFetch = window.fetch;
  (window as unknown).fetch = async (...args: unknown[]) => {
    try {
      const _response = await (originalFetch as unknown).apply(
        window,
        args as unknown,
      );

      if (!response.ok && response.status >= 500) {
        // 5xx errors might indicate service issues
        console.warn(`[Init] API error detected: ${response.status}`);

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
      (globalThis.console as unknown)?.error?.("[Init] Fetch _error:", _err);

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
function setupHealthMonitoring(): void {
  console.debug("[Init] Setting up health monitoring...");

  // Check health every 60 seconds
  setInterval(async () => {
    try {
      const health = await healthCheckService.performCheck();

      if (health.status === "unhealthy") {
        console.warn("[Monitor] Health check returned unhealthy");

        recoveryManager.scheduleRecovery(
          "http-server",
          "Health check failed",
          async () => {
            await checkHealth();
          },
          1000,
        );
      } else if (health.status === "degraded") {
        console.warn("[Monitor] Health check returned degraded");
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
      (globalThis.console as unknown)?.error?.(
        "[Monitor] Health monitoring _error:",
        _err,
      );
    }
  }, 60 * 1000);
}

/**
 * Get comprehensive system status
 */
export async function getSystemStatus(): Promise<{
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
export function shutdownServices(): void {
  console.info("[Shutdown] Shutting down services...");

  backgroundManager.stop();
  recoveryManager.stop();

  console.info("[Shutdown] All services stopped");
}

/**
 * Reset all caches and statistics
 */
export function resetAllCaches(): void {
  console.info("[Reset] Clearing all caches...");

  clearCache();
  healthCheckService.clearStats();
  recoveryManager.clearHistory();

  console.info("[Reset] All caches cleared");
}

/**
 * Enable debug logging
 */
export function enableDebugLogging(): void {
  console.info("[Debug] Debug logging enabled");

  // Intercept console methods to add timestamps
  const originalLog = (console as unknown).log;
  const originalWarn = (console as unknown).warn;
  const originalError = (console as unknown).error;

  (console as unknown).log = (...args: unknown[]) => {
    originalLog?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };

  (console as unknown).warn = (...args: unknown[]) => {
    originalWarn?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };

  (console as unknown).error = (...args: unknown[]) => {
    originalError?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };
}

/**
 * Get detailed diagnostic report
 */
export async function getDiagnosticReport(): Promise<{
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/adapters/appServiceInit.ts -->
// App Service Initialization
// Bootstraps background services, health monitoring, and recovery mechanisms

import { backgroundManager } from "./backgroundServiceManager";
import { recoveryManager } from "./serviceRecoveryManager";
import { healthCheckService } from "./healthCheckService";
import { checkHealth, clearCache } from "./clientAdapters";

/**
 * Initialize all background services and monitoring
 * Call this once when the app loads
 */
export async function initializeServices(): Promise<void> {
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
    (globalThis.console as unknown)?.error?.(
      "[Init] Service initialization failed:",
      _err,
    );
    throw _err;
  }
}

/**
 * Setup automatic recovery for failed services
 */
function setupRecoveryListeners(): void {
  console.debug("[Init] Setting up recovery listeners...");

  // Listen for API failures and trigger recovery
  const originalFetch = window.fetch;
  (window as unknown).fetch = async (...args: unknown[]) => {
    try {
      const _response = await (originalFetch as unknown).apply(
        window,
        args as unknown,
      );

      if (!response.ok && response.status >= 500) {
        // 5xx errors might indicate service issues
        console.warn(`[Init] API error detected: ${response.status}`);

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
      (globalThis.console as unknown)?.error?.("[Init] Fetch _error:", _err);

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
function setupHealthMonitoring(): void {
  console.debug("[Init] Setting up health monitoring...");

  // Check health every 60 seconds
  setInterval(async () => {
    try {
      const health = await healthCheckService.performCheck();

      if (health.status === "unhealthy") {
        console.warn("[Monitor] Health check returned unhealthy");

        recoveryManager.scheduleRecovery(
          "http-server",
          "Health check failed",
          async () => {
            await checkHealth();
          },
          1000,
        );
      } else if (health.status === "degraded") {
        console.warn("[Monitor] Health check returned degraded");
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
      (globalThis.console as unknown)?.error?.(
        "[Monitor] Health monitoring _error:",
        _err,
      );
    }
  }, 60 * 1000);
}

/**
 * Get comprehensive system status
 */
export async function getSystemStatus(): Promise<{
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
export function shutdownServices(): void {
  console.info("[Shutdown] Shutting down services...");

  backgroundManager.stop();
  recoveryManager.stop();

  console.info("[Shutdown] All services stopped");
}

/**
 * Reset all caches and statistics
 */
export function resetAllCaches(): void {
  console.info("[Reset] Clearing all caches...");

  clearCache();
  healthCheckService.clearStats();
  recoveryManager.clearHistory();

  console.info("[Reset] All caches cleared");
}

/**
 * Enable debug logging
 */
export function enableDebugLogging(): void {
  console.info("[Debug] Debug logging enabled");

  // Intercept console methods to add timestamps
  const originalLog = (console as unknown).log;
  const originalWarn = (console as unknown).warn;
  const originalError = (console as unknown).error;

  (console as unknown).log = (...args: unknown[]) => {
    originalLog?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };

  (console as unknown).warn = (...args: unknown[]) => {
    originalWarn?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };

  (console as unknown).error = (...args: unknown[]) => {
    originalError?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };
}

/**
 * Get detailed diagnostic report
 */
export async function getDiagnosticReport(): Promise<{
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/adapters/appServiceInit.ts -->
// App Service Initialization
// Bootstraps background services, health monitoring, and recovery mechanisms

import { backgroundManager } from "./backgroundServiceManager";
import { recoveryManager } from "./serviceRecoveryManager";
import { healthCheckService } from "./healthCheckService";
import { checkHealth, clearCache } from "./clientAdapters";

/**
 * Initialize all background services and monitoring
 * Call this once when the app loads
 */
export async function initializeServices(): Promise<void> {
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
    (globalThis.console as unknown)?.error?.(
      "[Init] Service initialization failed:",
      _err,
    );
    throw _err;
  }
}

/**
 * Setup automatic recovery for failed services
 */
function setupRecoveryListeners(): void {
  console.debug("[Init] Setting up recovery listeners...");

  // Listen for API failures and trigger recovery
  const originalFetch = window.fetch;
  (window as unknown).fetch = async (...args: unknown[]) => {
    try {
      const _response = await (originalFetch as unknown).apply(
        window,
        args as unknown,
      );

      if (!response.ok && response.status >= 500) {
        // 5xx errors might indicate service issues
        console.warn(`[Init] API error detected: ${response.status}`);

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
      (globalThis.console as unknown)?.error?.("[Init] Fetch _error:", _err);

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
function setupHealthMonitoring(): void {
  console.debug("[Init] Setting up health monitoring...");

  // Check health every 60 seconds
  setInterval(async () => {
    try {
      const health = await healthCheckService.performCheck();

      if (health.status === "unhealthy") {
        console.warn("[Monitor] Health check returned unhealthy");

        recoveryManager.scheduleRecovery(
          "http-server",
          "Health check failed",
          async () => {
            await checkHealth();
          },
          1000,
        );
      } else if (health.status === "degraded") {
        console.warn("[Monitor] Health check returned degraded");
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
      (globalThis.console as unknown)?.error?.(
        "[Monitor] Health monitoring _error:",
        _err,
      );
    }
  }, 60 * 1000);
}

/**
 * Get comprehensive system status
 */
export async function getSystemStatus(): Promise<{
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
export function shutdownServices(): void {
  console.info("[Shutdown] Shutting down services...");

  backgroundManager.stop();
  recoveryManager.stop();

  console.info("[Shutdown] All services stopped");
}

/**
 * Reset all caches and statistics
 */
export function resetAllCaches(): void {
  console.info("[Reset] Clearing all caches...");

  clearCache();
  healthCheckService.clearStats();
  recoveryManager.clearHistory();

  console.info("[Reset] All caches cleared");
}

/**
 * Enable debug logging
 */
export function enableDebugLogging(): void {
  console.info("[Debug] Debug logging enabled");

  // Intercept console methods to add timestamps
  const originalLog = (console as unknown).log;
  const originalWarn = (console as unknown).warn;
  const originalError = (console as unknown).error;

  (console as unknown).log = (...args: unknown[]) => {
    originalLog?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };

  (console as unknown).warn = (...args: unknown[]) => {
    originalWarn?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };

  (console as unknown).error = (...args: unknown[]) => {
    originalError?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };
}

/**
 * Get detailed diagnostic report
 */
export async function getDiagnosticReport(): Promise<{
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/adapters/appServiceInit.ts -->
// App Service Initialization
// Bootstraps background services, health monitoring, and recovery mechanisms

import { backgroundManager } from "./backgroundServiceManager";
import { recoveryManager } from "./serviceRecoveryManager";
import { healthCheckService } from "./healthCheckService";
import { checkHealth, clearCache } from "./clientAdapters";

/**
 * Initialize all background services and monitoring
 * Call this once when the app loads
 */
export async function initializeServices(): Promise<void> {
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
    (globalThis.console as unknown)?.error?.(
      "[Init] Service initialization failed:",
      _err,
    );
    throw _err;
  }
}

/**
 * Setup automatic recovery for failed services
 */
function setupRecoveryListeners(): void {
  console.debug("[Init] Setting up recovery listeners...");

  // Listen for API failures and trigger recovery
  const originalFetch = window.fetch;
  (window as unknown).fetch = async (...args: unknown[]) => {
    try {
      const _response = await (originalFetch as unknown).apply(
        window,
        args as unknown,
      );

      if (!response.ok && response.status >= 500) {
        // 5xx errors might indicate service issues
        console.warn(`[Init] API error detected: ${response.status}`);

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
      (globalThis.console as unknown)?.error?.("[Init] Fetch _error:", _err);

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
function setupHealthMonitoring(): void {
  console.debug("[Init] Setting up health monitoring...");

  // Check health every 60 seconds
  setInterval(async () => {
    try {
      const health = await healthCheckService.performCheck();

      if (health.status === "unhealthy") {
        console.warn("[Monitor] Health check returned unhealthy");

        recoveryManager.scheduleRecovery(
          "http-server",
          "Health check failed",
          async () => {
            await checkHealth();
          },
          1000,
        );
      } else if (health.status === "degraded") {
        console.warn("[Monitor] Health check returned degraded");
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
      (globalThis.console as unknown)?.error?.(
        "[Monitor] Health monitoring _error:",
        _err,
      );
    }
  }, 60 * 1000);
}

/**
 * Get comprehensive system status
 */
export async function getSystemStatus(): Promise<{
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
export function shutdownServices(): void {
  console.info("[Shutdown] Shutting down services...");

  backgroundManager.stop();
  recoveryManager.stop();

  console.info("[Shutdown] All services stopped");
}

/**
 * Reset all caches and statistics
 */
export function resetAllCaches(): void {
  console.info("[Reset] Clearing all caches...");

  clearCache();
  healthCheckService.clearStats();
  recoveryManager.clearHistory();

  console.info("[Reset] All caches cleared");
}

/**
 * Enable debug logging
 */
export function enableDebugLogging(): void {
  console.info("[Debug] Debug logging enabled");

  // Intercept console methods to add timestamps
  const originalLog = (console as unknown).log;
  const originalWarn = (console as unknown).warn;
  const originalError = (console as unknown).error;

  (console as unknown).log = (...args: unknown[]) => {
    originalLog?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };

  (console as unknown).warn = (...args: unknown[]) => {
    originalWarn?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };

  (console as unknown).error = (...args: unknown[]) => {
    originalError?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };
}

/**
 * Get detailed diagnostic report
 */
export async function getDiagnosticReport(): Promise<{
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/adapters/appServiceInit.ts -->
// App Service Initialization
// Bootstraps background services, health monitoring, and recovery mechanisms

import { backgroundManager } from "./backgroundServiceManager";
import { recoveryManager } from "./serviceRecoveryManager";
import { healthCheckService } from "./healthCheckService";
import { checkHealth, clearCache } from "./clientAdapters";

/**
 * Initialize all background services and monitoring
 * Call this once when the app loads
 */
export async function initializeServices(): Promise<void> {
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
    (globalThis.console as unknown)?.error?.(
      "[Init] Service initialization failed:",
      _err,
    );
    throw _err;
  }
}

/**
 * Setup automatic recovery for failed services
 */
function setupRecoveryListeners(): void {
  console.debug("[Init] Setting up recovery listeners...");

  // Listen for API failures and trigger recovery
  const originalFetch = window.fetch;
  (window as unknown).fetch = async (...args: unknown[]) => {
    try {
      const _response = await (originalFetch as unknown).apply(
        window,
        args as unknown,
      );

      if (!response.ok && response.status >= 500) {
        // 5xx errors might indicate service issues
        console.warn(`[Init] API error detected: ${response.status}`);

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
      (globalThis.console as unknown)?.error?.("[Init] Fetch _error:", _err);

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
function setupHealthMonitoring(): void {
  console.debug("[Init] Setting up health monitoring...");

  // Check health every 60 seconds
  setInterval(async () => {
    try {
      const health = await healthCheckService.performCheck();

      if (health.status === "unhealthy") {
        console.warn("[Monitor] Health check returned unhealthy");

        recoveryManager.scheduleRecovery(
          "http-server",
          "Health check failed",
          async () => {
            await checkHealth();
          },
          1000,
        );
      } else if (health.status === "degraded") {
        console.warn("[Monitor] Health check returned degraded");
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
      (globalThis.console as unknown)?.error?.(
        "[Monitor] Health monitoring _error:",
        _err,
      );
    }
  }, 60 * 1000);
}

/**
 * Get comprehensive system status
 */
export async function getSystemStatus(): Promise<{
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
export function shutdownServices(): void {
  console.info("[Shutdown] Shutting down services...");

  backgroundManager.stop();
  recoveryManager.stop();

  console.info("[Shutdown] All services stopped");
}

/**
 * Reset all caches and statistics
 */
export function resetAllCaches(): void {
  console.info("[Reset] Clearing all caches...");

  clearCache();
  healthCheckService.clearStats();
  recoveryManager.clearHistory();

  console.info("[Reset] All caches cleared");
}

/**
 * Enable debug logging
 */
export function enableDebugLogging(): void {
  console.info("[Debug] Debug logging enabled");

  // Intercept console methods to add timestamps
  const originalLog = (console as unknown).log;
  const originalWarn = (console as unknown).warn;
  const originalError = (console as unknown).error;

  (console as unknown).log = (...args: unknown[]) => {
    originalLog?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };

  (console as unknown).warn = (...args: unknown[]) => {
    originalWarn?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };

  (console as unknown).error = (...args: unknown[]) => {
    originalError?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };
}

/**
 * Get detailed diagnostic report
 */
export async function getDiagnosticReport(): Promise<{
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/adapters/appServiceInit.ts -->
// App Service Initialization
// Bootstraps background services, health monitoring, and recovery mechanisms

import { backgroundManager } from "./backgroundServiceManager";
import { recoveryManager } from "./serviceRecoveryManager";
import { healthCheckService } from "./healthCheckService";
import { checkHealth, clearCache } from "./clientAdapters";

/**
 * Initialize all background services and monitoring
 * Call this once when the app loads
 */
export async function initializeServices(): Promise<void> {
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
    (globalThis.console as unknown)?.error?.(
      "[Init] Service initialization failed:",
      _err,
    );
    throw _err;
  }
}

/**
 * Setup automatic recovery for failed services
 */
function setupRecoveryListeners(): void {
  console.debug("[Init] Setting up recovery listeners...");

  // Listen for API failures and trigger recovery
  const originalFetch = window.fetch;
  (window as unknown).fetch = async (...args: unknown[]) => {
    try {
      const _response = await (originalFetch as unknown).apply(
        window,
        args as unknown,
      );

      if (!response.ok && response.status >= 500) {
        // 5xx errors might indicate service issues
        console.warn(`[Init] API error detected: ${response.status}`);

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
      (globalThis.console as unknown)?.error?.("[Init] Fetch _error:", _err);

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
function setupHealthMonitoring(): void {
  console.debug("[Init] Setting up health monitoring...");

  // Check health every 60 seconds
  setInterval(async () => {
    try {
      const health = await healthCheckService.performCheck();

      if (health.status === "unhealthy") {
        console.warn("[Monitor] Health check returned unhealthy");

        recoveryManager.scheduleRecovery(
          "http-server",
          "Health check failed",
          async () => {
            await checkHealth();
          },
          1000,
        );
      } else if (health.status === "degraded") {
        console.warn("[Monitor] Health check returned degraded");
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
      (globalThis.console as unknown)?.error?.(
        "[Monitor] Health monitoring _error:",
        _err,
      );
    }
  }, 60 * 1000);
}

/**
 * Get comprehensive system status
 */
export async function getSystemStatus(): Promise<{
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
export function shutdownServices(): void {
  console.info("[Shutdown] Shutting down services...");

  backgroundManager.stop();
  recoveryManager.stop();

  console.info("[Shutdown] All services stopped");
}

/**
 * Reset all caches and statistics
 */
export function resetAllCaches(): void {
  console.info("[Reset] Clearing all caches...");

  clearCache();
  healthCheckService.clearStats();
  recoveryManager.clearHistory();

  console.info("[Reset] All caches cleared");
}

/**
 * Enable debug logging
 */
export function enableDebugLogging(): void {
  console.info("[Debug] Debug logging enabled");

  // Intercept console methods to add timestamps
  const originalLog = (console as unknown).log;
  const originalWarn = (console as unknown).warn;
  const originalError = (console as unknown).error;

  (console as unknown).log = (...args: unknown[]) => {
    originalLog?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };

  (console as unknown).warn = (...args: unknown[]) => {
    originalWarn?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };

  (console as unknown).error = (...args: unknown[]) => {
    originalError?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };
}

/**
 * Get detailed diagnostic report
 */
export async function getDiagnosticReport(): Promise<{
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/adapters/appServiceInit.ts -->
// App Service Initialization
// Bootstraps background services, health monitoring, and recovery mechanisms

import { backgroundManager } from "./backgroundServiceManager";
import { recoveryManager } from "./serviceRecoveryManager";
import { healthCheckService } from "./healthCheckService";
import { checkHealth, clearCache } from "./clientAdapters";

/**
 * Initialize all background services and monitoring
 * Call this once when the app loads
 */
export async function initializeServices(): Promise<void> {
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
    (globalThis.console as unknown)?.error?.(
      "[Init] Service initialization failed:",
      _err,
    );
    throw _err;
  }
}

/**
 * Setup automatic recovery for failed services
 */
function setupRecoveryListeners(): void {
  console.debug("[Init] Setting up recovery listeners...");

  // Listen for API failures and trigger recovery
  const originalFetch = window.fetch;
  (window as unknown).fetch = async (...args: unknown[]) => {
    try {
      const _response = await (originalFetch as unknown).apply(
        window,
        args as unknown,
      );

      if (!response.ok && response.status >= 500) {
        // 5xx errors might indicate service issues
        console.warn(`[Init] API error detected: ${response.status}`);

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
      (globalThis.console as unknown)?.error?.("[Init] Fetch _error:", _err);

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
function setupHealthMonitoring(): void {
  console.debug("[Init] Setting up health monitoring...");

  // Check health every 60 seconds
  setInterval(async () => {
    try {
      const health = await healthCheckService.performCheck();

      if (health.status === "unhealthy") {
        console.warn("[Monitor] Health check returned unhealthy");

        recoveryManager.scheduleRecovery(
          "http-server",
          "Health check failed",
          async () => {
            await checkHealth();
          },
          1000,
        );
      } else if (health.status === "degraded") {
        console.warn("[Monitor] Health check returned degraded");
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
      (globalThis.console as unknown)?.error?.(
        "[Monitor] Health monitoring _error:",
        _err,
      );
    }
  }, 60 * 1000);
}

/**
 * Get comprehensive system status
 */
export async function getSystemStatus(): Promise<{
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
export function shutdownServices(): void {
  console.info("[Shutdown] Shutting down services...");

  backgroundManager.stop();
  recoveryManager.stop();

  console.info("[Shutdown] All services stopped");
}

/**
 * Reset all caches and statistics
 */
export function resetAllCaches(): void {
  console.info("[Reset] Clearing all caches...");

  clearCache();
  healthCheckService.clearStats();
  recoveryManager.clearHistory();

  console.info("[Reset] All caches cleared");
}

/**
 * Enable debug logging
 */
export function enableDebugLogging(): void {
  console.info("[Debug] Debug logging enabled");

  // Intercept console methods to add timestamps
  const originalLog = (console as unknown).log;
  const originalWarn = (console as unknown).warn;
  const originalError = (console as unknown).error;

  (console as unknown).log = (...args: unknown[]) => {
    originalLog?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };

  (console as unknown).warn = (...args: unknown[]) => {
    originalWarn?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };

  (console as unknown).error = (...args: unknown[]) => {
    originalError?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };
}

/**
 * Get detailed diagnostic report
 */
export async function getDiagnosticReport(): Promise<{
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/adapters/appServiceInit.ts -->
// App Service Initialization
// Bootstraps background services, health monitoring, and recovery mechanisms

import { backgroundManager } from "./backgroundServiceManager";
import { recoveryManager } from "./serviceRecoveryManager";
import { healthCheckService } from "./healthCheckService";
import { checkHealth, clearCache } from "./clientAdapters";

/**
 * Initialize all background services and monitoring
 * Call this once when the app loads
 */
export async function initializeServices(): Promise<void> {
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
    (globalThis.console as unknown)?.error?.(
      "[Init] Service initialization failed:",
      _err,
    );
    throw _err;
  }
}

/**
 * Setup automatic recovery for failed services
 */
function setupRecoveryListeners(): void {
  console.debug("[Init] Setting up recovery listeners...");

  // Listen for API failures and trigger recovery
  const originalFetch = window.fetch;
  (window as unknown).fetch = async (...args: unknown[]) => {
    try {
      const _response = await (originalFetch as unknown).apply(
        window,
        args as unknown,
      );

      if (!response.ok && response.status >= 500) {
        // 5xx errors might indicate service issues
        console.warn(`[Init] API error detected: ${response.status}`);

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
      (globalThis.console as unknown)?.error?.("[Init] Fetch _error:", _err);

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
function setupHealthMonitoring(): void {
  console.debug("[Init] Setting up health monitoring...");

  // Check health every 60 seconds
  setInterval(async () => {
    try {
      const health = await healthCheckService.performCheck();

      if (health.status === "unhealthy") {
        console.warn("[Monitor] Health check returned unhealthy");

        recoveryManager.scheduleRecovery(
          "http-server",
          "Health check failed",
          async () => {
            await checkHealth();
          },
          1000,
        );
      } else if (health.status === "degraded") {
        console.warn("[Monitor] Health check returned degraded");
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
      (globalThis.console as unknown)?.error?.(
        "[Monitor] Health monitoring _error:",
        _err,
      );
    }
  }, 60 * 1000);
}

/**
 * Get comprehensive system status
 */
export async function getSystemStatus(): Promise<{
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
export function shutdownServices(): void {
  console.info("[Shutdown] Shutting down services...");

  backgroundManager.stop();
  recoveryManager.stop();

  console.info("[Shutdown] All services stopped");
}

/**
 * Reset all caches and statistics
 */
export function resetAllCaches(): void {
  console.info("[Reset] Clearing all caches...");

  clearCache();
  healthCheckService.clearStats();
  recoveryManager.clearHistory();

  console.info("[Reset] All caches cleared");
}

/**
 * Enable debug logging
 */
export function enableDebugLogging(): void {
  console.info("[Debug] Debug logging enabled");

  // Intercept console methods to add timestamps
  const originalLog = (console as unknown).log;
  const originalWarn = (console as unknown).warn;
  const originalError = (console as unknown).error;

  (console as unknown).log = (...args: unknown[]) => {
    originalLog?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };

  (console as unknown).warn = (...args: unknown[]) => {
    originalWarn?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };

  (console as unknown).error = (...args: unknown[]) => {
    originalError?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };
}

/**
 * Get detailed diagnostic report
 */
export async function getDiagnosticReport(): Promise<{
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/adapters/appServiceInit.ts -->
// App Service Initialization
// Bootstraps background services, health monitoring, and recovery mechanisms

import { backgroundManager } from "./backgroundServiceManager";
import { recoveryManager } from "./serviceRecoveryManager";
import { healthCheckService } from "./healthCheckService";
import { checkHealth, clearCache } from "./clientAdapters";

/**
 * Initialize all background services and monitoring
 * Call this once when the app loads
 */
export async function initializeServices(): Promise<void> {
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
    (globalThis.console as unknown)?.error?.(
      "[Init] Service initialization failed:",
      _err,
    );
    throw _err;
  }
}

/**
 * Setup automatic recovery for failed services
 */
function setupRecoveryListeners(): void {
  console.debug("[Init] Setting up recovery listeners...");

  // Listen for API failures and trigger recovery
  const originalFetch = window.fetch;
  (window as unknown).fetch = async (...args: unknown[]) => {
    try {
      const _response = await (originalFetch as unknown).apply(
        window,
        args as unknown,
      );

      if (!response.ok && response.status >= 500) {
        // 5xx errors might indicate service issues
        console.warn(`[Init] API error detected: ${response.status}`);

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
      (globalThis.console as unknown)?.error?.("[Init] Fetch _error:", _err);

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
function setupHealthMonitoring(): void {
  console.debug("[Init] Setting up health monitoring...");

  // Check health every 60 seconds
  setInterval(async () => {
    try {
      const health = await healthCheckService.performCheck();

      if (health.status === "unhealthy") {
        console.warn("[Monitor] Health check returned unhealthy");

        recoveryManager.scheduleRecovery(
          "http-server",
          "Health check failed",
          async () => {
            await checkHealth();
          },
          1000,
        );
      } else if (health.status === "degraded") {
        console.warn("[Monitor] Health check returned degraded");
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
      (globalThis.console as unknown)?.error?.(
        "[Monitor] Health monitoring _error:",
        _err,
      );
    }
  }, 60 * 1000);
}

/**
 * Get comprehensive system status
 */
export async function getSystemStatus(): Promise<{
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
export function shutdownServices(): void {
  console.info("[Shutdown] Shutting down services...");

  backgroundManager.stop();
  recoveryManager.stop();

  console.info("[Shutdown] All services stopped");
}

/**
 * Reset all caches and statistics
 */
export function resetAllCaches(): void {
  console.info("[Reset] Clearing all caches...");

  clearCache();
  healthCheckService.clearStats();
  recoveryManager.clearHistory();

  console.info("[Reset] All caches cleared");
}

/**
 * Enable debug logging
 */
export function enableDebugLogging(): void {
  console.info("[Debug] Debug logging enabled");

  // Intercept console methods to add timestamps
  const originalLog = (console as unknown).log;
  const originalWarn = (console as unknown).warn;
  const originalError = (console as unknown).error;

  (console as unknown).log = (...args: unknown[]) => {
    originalLog?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };

  (console as unknown).warn = (...args: unknown[]) => {
    originalWarn?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };

  (console as unknown).error = (...args: unknown[]) => {
    originalError?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };
}

/**
 * Get detailed diagnostic report
 */
export async function getDiagnosticReport(): Promise<{
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/adapters/appServiceInit.ts -->
// App Service Initialization
// Bootstraps background services, health monitoring, and recovery mechanisms

import { backgroundManager } from "./backgroundServiceManager";
import { recoveryManager } from "./serviceRecoveryManager";
import { healthCheckService } from "./healthCheckService";
import { checkHealth, clearCache } from "./clientAdapters";

/**
 * Initialize all background services and monitoring
 * Call this once when the app loads
 */
export async function initializeServices(): Promise<void> {
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
    (globalThis.console as unknown)?.error?.(
      "[Init] Service initialization failed:",
      _err,
    );
    throw _err;
  }
}

/**
 * Setup automatic recovery for failed services
 */
function setupRecoveryListeners(): void {
  console.debug("[Init] Setting up recovery listeners...");

  // Listen for API failures and trigger recovery
  const originalFetch = window.fetch;
  (window as unknown).fetch = async (...args: unknown[]) => {
    try {
      const _response = await (originalFetch as unknown).apply(
        window,
        args as unknown,
      );

      if (!response.ok && response.status >= 500) {
        // 5xx errors might indicate service issues
        console.warn(`[Init] API error detected: ${response.status}`);

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
      (globalThis.console as unknown)?.error?.("[Init] Fetch _error:", _err);

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
function setupHealthMonitoring(): void {
  console.debug("[Init] Setting up health monitoring...");

  // Check health every 60 seconds
  setInterval(async () => {
    try {
      const health = await healthCheckService.performCheck();

      if (health.status === "unhealthy") {
        console.warn("[Monitor] Health check returned unhealthy");

        recoveryManager.scheduleRecovery(
          "http-server",
          "Health check failed",
          async () => {
            await checkHealth();
          },
          1000,
        );
      } else if (health.status === "degraded") {
        console.warn("[Monitor] Health check returned degraded");
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
      (globalThis.console as unknown)?.error?.(
        "[Monitor] Health monitoring _error:",
        _err,
      );
    }
  }, 60 * 1000);
}

/**
 * Get comprehensive system status
 */
export async function getSystemStatus(): Promise<{
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
export function shutdownServices(): void {
  console.info("[Shutdown] Shutting down services...");

  backgroundManager.stop();
  recoveryManager.stop();

  console.info("[Shutdown] All services stopped");
}

/**
 * Reset all caches and statistics
 */
export function resetAllCaches(): void {
  console.info("[Reset] Clearing all caches...");

  clearCache();
  healthCheckService.clearStats();
  recoveryManager.clearHistory();

  console.info("[Reset] All caches cleared");
}

/**
 * Enable debug logging
 */
export function enableDebugLogging(): void {
  console.info("[Debug] Debug logging enabled");

  // Intercept console methods to add timestamps
  const originalLog = (console as unknown).log;
  const originalWarn = (console as unknown).warn;
  const originalError = (console as unknown).error;

  (console as unknown).log = (...args: unknown[]) => {
    originalLog?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };

  (console as unknown).warn = (...args: unknown[]) => {
    originalWarn?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };

  (console as unknown).error = (...args: unknown[]) => {
    originalError?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };
}

/**
 * Get detailed diagnostic report
 */
export async function getDiagnosticReport(): Promise<{
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/adapters/appServiceInit.ts -->
// App Service Initialization
// Bootstraps background services, health monitoring, and recovery mechanisms

import { backgroundManager } from "./backgroundServiceManager";
import { recoveryManager } from "./serviceRecoveryManager";
import { healthCheckService } from "./healthCheckService";
import { checkHealth, clearCache } from "./clientAdapters";

/**
 * Initialize all background services and monitoring
 * Call this once when the app loads
 */
export async function initializeServices(): Promise<void> {
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
    (globalThis.console as unknown)?.error?.(
      "[Init] Service initialization failed:",
      _err,
    );
    throw _err;
  }
}

/**
 * Setup automatic recovery for failed services
 */
function setupRecoveryListeners(): void {
  console.debug("[Init] Setting up recovery listeners...");

  // Listen for API failures and trigger recovery
  const originalFetch = window.fetch;
  (window as unknown).fetch = async (...args: unknown[]) => {
    try {
      const _response = await (originalFetch as unknown).apply(
        window,
        args as unknown,
      );

      if (!response.ok && response.status >= 500) {
        // 5xx errors might indicate service issues
        console.warn(`[Init] API error detected: ${response.status}`);

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
      (globalThis.console as unknown)?.error?.("[Init] Fetch _error:", _err);

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
function setupHealthMonitoring(): void {
  console.debug("[Init] Setting up health monitoring...");

  // Check health every 60 seconds
  setInterval(async () => {
    try {
      const health = await healthCheckService.performCheck();

      if (health.status === "unhealthy") {
        console.warn("[Monitor] Health check returned unhealthy");

        recoveryManager.scheduleRecovery(
          "http-server",
          "Health check failed",
          async () => {
            await checkHealth();
          },
          1000,
        );
      } else if (health.status === "degraded") {
        console.warn("[Monitor] Health check returned degraded");
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
      (globalThis.console as unknown)?.error?.(
        "[Monitor] Health monitoring _error:",
        _err,
      );
    }
  }, 60 * 1000);
}

/**
 * Get comprehensive system status
 */
export async function getSystemStatus(): Promise<{
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
export function shutdownServices(): void {
  console.info("[Shutdown] Shutting down services...");

  backgroundManager.stop();
  recoveryManager.stop();

  console.info("[Shutdown] All services stopped");
}

/**
 * Reset all caches and statistics
 */
export function resetAllCaches(): void {
  console.info("[Reset] Clearing all caches...");

  clearCache();
  healthCheckService.clearStats();
  recoveryManager.clearHistory();

  console.info("[Reset] All caches cleared");
}

/**
 * Enable debug logging
 */
export function enableDebugLogging(): void {
  console.info("[Debug] Debug logging enabled");

  // Intercept console methods to add timestamps
  const originalLog = (console as unknown).log;
  const originalWarn = (console as unknown).warn;
  const originalError = (console as unknown).error;

  (console as unknown).log = (...args: unknown[]) => {
    originalLog?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };

  (console as unknown).warn = (...args: unknown[]) => {
    originalWarn?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };

  (console as unknown).error = (...args: unknown[]) => {
    originalError?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };
}

/**
 * Get detailed diagnostic report
 */
export async function getDiagnosticReport(): Promise<{
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/adapters/appServiceInit.ts -->
// App Service Initialization
// Bootstraps background services, health monitoring, and recovery mechanisms

import { backgroundManager } from "./backgroundServiceManager";
import { recoveryManager } from "./serviceRecoveryManager";
import { healthCheckService } from "./healthCheckService";
import { checkHealth, clearCache } from "./clientAdapters";

/**
 * Initialize all background services and monitoring
 * Call this once when the app loads
 */
export async function initializeServices(): Promise<void> {
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
    (globalThis.console as unknown)?.error?.(
      "[Init] Service initialization failed:",
      _err,
    );
    throw _err;
  }
}

/**
 * Setup automatic recovery for failed services
 */
function setupRecoveryListeners(): void {
  console.debug("[Init] Setting up recovery listeners...");

  // Listen for API failures and trigger recovery
  const originalFetch = window.fetch;
  (window as unknown).fetch = async (...args: unknown[]) => {
    try {
      const _response = await (originalFetch as unknown).apply(
        window,
        args as unknown,
      );

      if (!response.ok && response.status >= 500) {
        // 5xx errors might indicate service issues
        console.warn(`[Init] API error detected: ${response.status}`);

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
      (globalThis.console as unknown)?.error?.("[Init] Fetch _error:", _err);

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
function setupHealthMonitoring(): void {
  console.debug("[Init] Setting up health monitoring...");

  // Check health every 60 seconds
  setInterval(async () => {
    try {
      const health = await healthCheckService.performCheck();

      if (health.status === "unhealthy") {
        console.warn("[Monitor] Health check returned unhealthy");

        recoveryManager.scheduleRecovery(
          "http-server",
          "Health check failed",
          async () => {
            await checkHealth();
          },
          1000,
        );
      } else if (health.status === "degraded") {
        console.warn("[Monitor] Health check returned degraded");
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
      (globalThis.console as unknown)?.error?.(
        "[Monitor] Health monitoring _error:",
        _err,
      );
    }
  }, 60 * 1000);
}

/**
 * Get comprehensive system status
 */
export async function getSystemStatus(): Promise<{
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
export function shutdownServices(): void {
  console.info("[Shutdown] Shutting down services...");

  backgroundManager.stop();
  recoveryManager.stop();

  console.info("[Shutdown] All services stopped");
}

/**
 * Reset all caches and statistics
 */
export function resetAllCaches(): void {
  console.info("[Reset] Clearing all caches...");

  clearCache();
  healthCheckService.clearStats();
  recoveryManager.clearHistory();

  console.info("[Reset] All caches cleared");
}

/**
 * Enable debug logging
 */
export function enableDebugLogging(): void {
  console.info("[Debug] Debug logging enabled");

  // Intercept console methods to add timestamps
  const originalLog = (console as unknown).log;
  const originalWarn = (console as unknown).warn;
  const originalError = (console as unknown).error;

  (console as unknown).log = (...args: unknown[]) => {
    originalLog?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };

  (console as unknown).warn = (...args: unknown[]) => {
    originalWarn?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };

  (console as unknown).error = (...args: unknown[]) => {
    originalError?.(`[${new Date().toISOString()}]`, ...(args as unknown));
  };
}

/**
 * Get detailed diagnostic report
 */
export async function getDiagnosticReport(): Promise<{
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
