import { checkHealth } from "./clientAdapters";

const logger = {
  info: console.info.bind(console),
  warn: console.warn.bind(console),
  warning: console.warn.bind(console),
  error: console.error.bind(console),
  RELEASE: console.info.bind(console),
};

export interface RecoveryStrategy {
  name: string;
  maxAttempts: number;
  backoffMs: number;
  exponentialBackoff: boolean;
}

export interface RecoveryEvent {
  service: string;
  timestamp: number;
  reason: string;
  attempt: number;
  success: boolean;
}

export class ServiceRecoveryManager {
  private recoveryHistory: RecoveryEvent[] = [];
  private activeRecoveries = new Map<string, NodeJS.Timeout>();
  private enabled = false;
  private strategies = new Map<string, RecoveryStrategy>([
    ["http-server", { name: "HTTP Server", maxAttempts: 3, backoffMs: 2000, exponentialBackoff: true }],
    ["api-endpoint", { name: "API Endpoint", maxAttempts: 5, backoffMs: 1000, exponentialBackoff: true }],
    ["cache-service", { name: "Cache Service", maxAttempts: 2, backoffMs: 1000, exponentialBackoff: false }],
    ["background-tasks", { name: "Background Tasks", maxAttempts: 3, backoffMs: 500, exponentialBackoff: true }],
  ]);

  start(): void {
    this.enabled = true;
    logger.info("Service recovery manager started");
  }

  stop(): void {
    this.enabled = false;
    for (const timer of this.activeRecoveries.values()) {
      clearTimeout(timer);
    }
    this.activeRecoveries.clear();
    logger.info("Service recovery manager stopped");
  }

  async recover(service: string, reason: string, recoveryFn: () => Promise<void>): Promise<boolean> {
    if (!this.enabled) {
      logger.warning("Recovery manager not enabled");
      return false;
    }

    const strategy = this.strategies.get(service) ?? { name: service, maxAttempts: 3, backoffMs: 1000, exponentialBackoff: true };

    for (let attempt = 1; attempt <= strategy.maxAttempts; attempt += 1) {
      try {
        await recoveryFn();
        this.recordRecoveryEvent({ service, timestamp: Date.now(), reason, attempt, success: true });
        logger.info(`Recovered ${service} on attempt ${attempt}`);
        return true;
      } catch (error) {
        this.recordRecoveryEvent({ service, timestamp: Date.now(), reason, attempt, success: false });
        logger.warning(`Recovery attempt ${attempt} for ${service} failed`, error);

        if (attempt === strategy.maxAttempts) {
          break;
        }

        const delay = strategy.exponentialBackoff ? strategy.backoffMs * Math.pow(2, attempt - 1) : strategy.backoffMs;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    return false;
  }

  cancelRecovery(service: string): void {
    const timer = this.activeRecoveries.get(service);
    if (timer) {
      clearTimeout(timer);
      this.activeRecoveries.delete(service);
    }
  }

  private recordRecoveryEvent(event: RecoveryEvent): void {
    this.recoveryHistory.push(event);
    if (this.recoveryHistory.length > 1000) {
      this.recoveryHistory.shift();
    }
  }

  getStatus(): {
    enabled: boolean;
    history: RecoveryEvent[];
  } {
    return {
      enabled: this.enabled,
      history: [...this.recoveryHistory],
    };
  }

  clearHistory(): void {
    this.recoveryHistory = [];
    logger.info("Service recovery history cleared");
  }
}

export const recoveryManager = new ServiceRecoveryManager();
