// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:14Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// Health check API endpoint with diagnostic information
// Provides comprehensive service health, cache statistics, and pending requests

import { backgroundManager } from "./backgroundServiceManager";
import {
    checkHealth,
    getCacheStats,
    getPendingRequests,
} from "./clientAdapters";

export interface HealthCheckResponse {
  timestamp: number;
  status: "healthy" | "degraded" | "unhealthy";
  system: {
    uptime: number;
    environment: string;
    serviceStatus: Record<string, string>;
  };
  adapters: {
    status: string;
    error?: string;
    cacheStats: {
      total: number;
      entries: Record<string, number>;
    };
    pendingRequests: string[];
  };
  backgroundServices: {
    enabled: boolean;
    uptime: number;
    activeServices: number;
    scheduledTasks: number;
  };
  diagnostics: {
    memoryUsage?: NodeJS.MemoryUsage;
    responseTimes: Record<string, number>;
  };
}

export class HealthCheckService {
  private responseTimes: Map<string, number[]> = new Map();
  private maxSamples = 100;

  // ========================================================================
  // RESPONSE TIME TRACKING
  // ========================================================================

  recordResponseTime(endpoint: string, ms: number): void {
    if (!this.responseTimes.has(endpoint)) {
      this.responseTimes.set(endpoint, []);
    }

    const times = this.responseTimes.get(endpoint)!;
    times.push(ms);

    if (times.length > this.maxSamples) {
      times.shift();
    }
  }

  getAverageResponseTime(endpoint: string): number {
    const times = this.responseTimes.get(endpoint);
    if (!times || times.length === 0) return 0;

    const sum = times.reduce((a, b) => a + b, 0);
    return Math.round(sum / times.length);
  }

  getAllResponseTimes(): Record<string, number> {
    const result: Record<string, number> = {};

    for (const [endpoint, times] of this.responseTimes.entries()) {
      if (times.length > 0) {
        const sum = times.reduce((a, b) => a + b, 0);
        result[endpoint] = Math.round(sum / times.length);
      }
    }

    return result;
  }

  // ========================================================================
  // HEALTH CHECK
  // ========================================================================

  async performCheck(): Promise<HealthCheckResponse> {
    const startTime = Date.now();

    try {
      // Get adapter health
      const adapterHealth = await checkHealth();

      // Get cache and pending data
      const cacheStats = getCacheStats();
      const pendingRequests = getPendingRequests();

      // Get background service status
      const bgStatus = backgroundManager.getStatus();

      // Determine overall status
      let overallStatus: "healthy" | "degraded" | "unhealthy" = "healthy";

      if (adapterHealth.status === "unhealthy") {
        overallStatus = "unhealthy";
      } else if (
        adapterHealth.status === "degraded" ||
        bgStatus.services.some((s) => s.status === "degraded")
      ) {
        overallStatus = "degraded";
      }

      const _response: HealthCheckResponse = {
        timestamp: Date.now(),
        status: overallStatus,
        system: {
          uptime: Date.now() - startTime,
          environment: process.env.NEXT_PUBLIC_ENV || "development",
          serviceStatus: this.getServiceStatus(),
        },
        adapters: {
          status: adapterHealth.status,
          error: .error ? String(.error) : undefined,
          cacheStats: {
            total: cacheStats.total,
            entries: cacheStats.byEndpoint,
          },
          pendingRequests: pendingRequests.slice(0, 10), // Return top 10
        },
        backgroundServices: {
          enabled: bgStatus.enabled,
          uptime: bgStatus.uptime,
          activeServices: bgStatus.services.filter(
            (s) => s.status === "healthy",
          ).length,
          scheduledTasks: bgStatus.tasks.length,
        },
        diagnostics: {
          memoryUsage:
            typeof process !== "undefined" ? process.memoryUsage() : undefined,
          responseTimes: this.getAllResponseTimes(),
        },
      };

      this.recordResponseTime("health-check", Date.now() - startTime);
      return _response;
    } catch (_err) {
      void _err;
      return {
        timestamp: Date.now(),
        status: "unhealthy",
        system: {
          uptime: Date.now() - startTime,
          environment: process.env.NEXT_PUBLIC_ENV || "development",
          serviceStatus: this.getServiceStatus(),
        },
        adapters: {
          status: "unhealthy",
          error: String(_err),
          cacheStats: { total: 0, entries: {} as Record<string, number> },
          pendingRequests: [],
        },
        backgroundServices: {
          enabled: false,
          uptime: 0,
          activeServices: 0,
          scheduledTasks: 0,
        },
        diagnostics: {
          responseTimes: {},
        },
      };
    }
  }

  // ========================================================================
  // UTILITIES
  // ========================================================================

  private getServiceStatus(): Record<string, string> {
    const status: Record<string, string> = {};

    // Check HTTP server
    if (typeof window !== "undefined") {
      status["http-server"] = "running";
    } else {
      status["http-server"] = "unavailable-in-node";
    }

    // Check API config
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "process.env.API_URL || "http://localhost:\1"";
    status["api-endpoint"] = apiUrl;

    // Background services
    const bgServices = backgroundManager.getServices();
    bgServices.forEach((s) => {
      status[`service-${s.name.toLowerCase().replace(/\s+/g, "-")}`] = s.status;
    });

    return status;
  }

  clearStats(): void {
    this.responseTimes.clear();
    console.info("[HealthCheck] Statistics cleared");
  }

  getStats(): {
    sampledEndpoints: number;
    totalSamples: number;
    avgResponseTimes: Record<string, number>;
  } {
    let totalSamples = 0;
    for (const times of this.responseTimes.values()) {
      totalSamples += times.length;
    }

    return {
      sampledEndpoints: this.responseTimes.size,
      totalSamples,
      avgResponseTimes: this.getAllResponseTimes(),
    };
  }
}

// Export singleton instance
export const healthCheckService = new HealthCheckService();
