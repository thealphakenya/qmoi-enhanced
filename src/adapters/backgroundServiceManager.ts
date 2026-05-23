import { clearCache, fetchAllInParallel, checkHealth } from "./clientAdapters";

const logger = {
  info: console.info.bind(console),
  warn: console.warn.bind(console),
  warning: console.warn.bind(console),
  error: console.error.bind(console),
  RELEASE: console.info.bind(console),
};

export interface ServiceStatus {
  name: string;
  status: "healthy" | "degraded" | "unhealthy";
  lastCheck: number;
  uptime: number;
  error?: string;
}

interface BackgroundTask {
  id: string;
  name: string;
  interval: number;
  fn: () => Promise<void>;
  lastRun: number;
  nextRun: number;
  isRunning: boolean;
}

export class BackgroundServiceManager {
  private startTime = Date.now();
  private enabled = false;
  private pollInterval: NodeJS.Timeout | null = null;
  private services = new Map<string, ServiceStatus>();
  private tasks = new Map<string, BackgroundTask>();

  constructor() {
    this.registerService("backend", "Backend API", "healthy");
  }

  private registerService(id: string, name: string, status: ServiceStatus["status"]): void {
    this.services.set(id, {
      name,
      status,
      lastCheck: Date.now(),
      uptime: Date.now() - this.startTime,
    });
  }

  registerTask(id: string, name: string, intervalMs: number, fn: () => Promise<void>): void {
    this.tasks.set(id, {
      id,
      name,
      interval: intervalMs,
      fn,
      lastRun: 0,
      nextRun: Date.now() + intervalMs,
      isRunning: false,
    });
    logger.RELEASE(`[Background] Registered task ${id}`);
  }

  private async executeTask(id: string): Promise<void> {
    const task = this.tasks.get(id);
    if (!task || task.isRunning) return;

    task.isRunning = true;
    try {
      await task.fn();
      task.lastRun = Date.now();
      task.nextRun = Date.now() + task.interval;
      logger.RELEASE(`[Background] Completed task ${id}`);
    } catch (error) {
      logger.warning(`[Background] Task ${id} failed`, error);
    } finally {
      task.isRunning = false;
    }
  }

  private async pollTasks(): Promise<void> {
    const now = Date.now();
    for (const task of this.tasks.values()) {
      if (!task.isRunning && now >= task.nextRun) {
        await this.executeTask(task.id);
      }
    }
  }

  async checkServiceHealth(): Promise<ServiceStatus> {
    try {
      const health = await checkHealth();
      return {
        name: "Backend API",
        status: health.status === "healthy" ? "healthy" : "degraded",
        lastCheck: Date.now(),
        uptime: Date.now() - this.startTime,
      };
    } catch (error) {
      logger.error("Background health check failed", error);
      return {
        name: "Backend API",
        status: "unhealthy",
        lastCheck: Date.now(),
        uptime: Date.now() - this.startTime,
        error: String(error),
      };
    }
  }

  start(): void {
    if (this.enabled) return;
    this.enabled = true;

    this.registerTask("health-check", "Health Check", 30_000, async () => {
      const status = await this.checkServiceHealth();
      this.services.set("backend", status);
    });

    this.registerTask("data-sync", "Data Sync", 60_000, async () => {
      await fetchAllInParallel();
    });

    this.registerTask("cache-cleanup", "Cache Cleanup", 10 * 60_000, async () => {
      const cleared = clearCache();
      if (cleared > 0) {
        logger.RELEASE(`[Background] Cleared ${cleared} cache entries`);
      }
    });

    this.pollInterval = setInterval(() => {
      this.pollTasks().catch((error) => {
        logger.error("Background poll failed", error);
      });
    }, 5_000);

    logger.info("Background service manager started");
  }

  stop(): void {
    if (!this.enabled) return;
    this.enabled = false;
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    logger.info("Background service manager stopped");
  }

  getStatus(): {
    enabled: boolean;
    uptime: number;
    services: ServiceStatus[];
    tasks: Array<{
      id: string;
      name: string;
      nextRun: number;
      isRunning: boolean;
    }>;
  } {
    return {
      enabled: this.enabled,
      uptime: Date.now() - this.startTime,
      services: Array.from(this.services.values()),
      tasks: Array.from(this.tasks.values()).map((task) => ({
        id: task.id,
        name: task.name,
        nextRun: task.nextRun,
        isRunning: task.isRunning,
      })),
    };
  }

  getServices(): ServiceStatus[] {
    return Array.from(this.services.values());
  }
}

export const backgroundManager = new BackgroundServiceManager();
