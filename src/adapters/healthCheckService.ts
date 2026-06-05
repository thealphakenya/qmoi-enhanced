import { checkHealth, getCacheStats, getPendingRequests } from "./clientAdapters";
import { backgroundManager } from "./backgroundServiceManager";
import { log as logger } from "@/lib/logger";

const logger = {
  info: console.info.bind(console),
  warn: console.warn.bind(console),
  warning: console.warn.bind(console),
  error: console.error.bind(console),
  RELEASE: console.info.bind(console),
};

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
  private responseTimes = new Map<string, number[]>();

  recordResponseTime(endpoint: string, ms: number): void {
    const values = this.responseTimes.get(endpoint) ?? [];
    values.push(ms);
    if (values.length > 100) {
      values.shift();
    }
    this.responseTimes.set(endpoint, values);
  }

  getAverageResponseTime(endpoint: string): number {
    const values = this.responseTimes.get(endpoint) ?? [];
    if (values.length === 0) return 0;
    return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
  }

  getAllResponseTimes(): Record<string, number> {
    const result: Record<string, number> = {};
    for (const [endpoint, values] of this.responseTimes.entries()) {
      if (values.length > 0) {
        result[endpoint] = Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
      }
    }
    return result;
  }

  async performCheck(): Promise<HealthCheckResponse> {
    const start = Date.now();
    let overallStatus: "healthy" | "degraded" | "unhealthy" = "healthy";

    try {
      const adapterHealth = await checkHealth();
      const cacheStats = getCacheStats();
      const pendingRequests = getPendingRequests();
      const bgStatus = backgroundManager.getStatus();

      if (adapterHealth.status === "unhealthy") {
        overallStatus = "unhealthy";
      } else if (adapterHealth.status === "degraded" || bgStatus.services.some((s) => s.status !== "healthy")) {
        overallStatus = "degraded";
      }

      const result: HealthCheckResponse = {
        timestamp: Date.now(),
        status: overallStatus,
        system: {
          uptime: Date.now() - start,
          environment: process.env.NODE_ENV || "production",
          serviceStatus: this.getServiceStatus(),
        },
        adapters: {
          status: adapterHealth.status,
          error: adapterHealth.error ? String(adapterHealth.error) : undefined,
          cacheStats: {
            total: cacheStats.total,
            entries: cacheStats.byEndpoint,
          },
          pendingRequests: pendingRequests.slice(0, 10),
        },
        backgroundServices: {
          enabled: bgStatus.enabled,
          uptime: bgStatus.uptime,
          activeServices: bgStatus.services.filter((s) => s.status === "healthy").length,
          scheduledTasks: bgStatus.tasks.length,
        },
        diagnostics: {
          memoryUsage: typeof process !== "undefined" ? process.memoryUsage() : undefined,
          responseTimes: this.getAllResponseTimes(),
        },
      };

      this.recordResponseTime("health-check", Date.now() - start);
      return result;
    } catch (error) {
      logger.error("Health check failed", error);
      return {
        timestamp: Date.now(),
        status: "unhealthy",
        system: {
          uptime: Date.now() - start,
          environment: process.env.NODE_ENV || "production",
          serviceStatus: this.getServiceStatus(),
        },
        adapters: {
          status: "unhealthy",
          error: String(error),
          cacheStats: { total: 0, entries: {} },
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

  clearStats(): void {
    this.responseTimes.clear();
    logger.info("[HealthCheck] cleared response statistics");
  }

  private getServiceStatus(): Record<string, string> {
    const status: Record<string, string> = {
      "api-endpoint": process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "http://localhost:3000",
      "backend": "running",
    };

    const bgServices = backgroundManager.getServices();
    bgServices.forEach((service) => {
      status[`service-${service.name.toLowerCase().replace(/\s+/g, "-")}`] = service.status;
    });

    return status;
  }
}

export const healthCheckService = new HealthCheckService();
