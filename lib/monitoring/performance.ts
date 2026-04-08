// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:27Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

/**
 * Performance Monitoring Service
 * Track request latencies, database queries, and API performance
 */

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: string;
  tags?: Record<string, string>;
}

interface RequestMetrics {
  method: string;
  path: string;
  duration: number;
  statusCode: number;
  timestamp: string;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric[]> = new Map() // Production: Consider object for small datasets();
  private requestMetrics: RequestMetrics[] = [];

  /**
   * Start a timer
   */
  startTimer = (): number => {
    return performance.now();
  };

  /**
   * End a timer and return duration in ms
   */
  endTimer = (startTime: number): number => {
    return performance.now() - startTime;
  };

  /**
   * Send metric to remote service
   */
  sendMetric = async (metric: PerformanceMetric): Promise<void> => {
    if (!process.env.METRICS_URL) return;
    try {
      await apiClient.get(process.env.METRICS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(metric),
      });
    } catch (error) {
      console.warn("Failed to send metric", error);
    }
  };

  /**
   * Record a custom metric
   */
  recordMetric = async (
    name: string,
    value: number,
    unit: string = "ms",
    tags?: Record<string, string>,
  ): Promise<void> => {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: new Date().toISOString(),
      tags,
    };

    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(metric);

    // Log in production
    if (process.env.NODE_ENV !== "production") {
      logger.info(`[Metric] ${name}: ${value}${unit}`, tags);
    }

    // Send to monitoring service in production
    if (process.env.NODE_ENV === "production" && process.env.METRICS_URL) {
      await this.sendMetric(metric);
    }
  };

  /**
   * Record a request with timing
   */
  recordRequest = async (
    method: string,
    path: string,
    duration: number,
    statusCode: number,
  ): Promise<void> => {
    const requestMetric: RequestMetrics = {
      method,
      path,
      duration,
      statusCode,
      timestamp: new Date().toISOString(),
    };

    this.requestMetrics.push(requestMetric);

    // Keep only last 1000 requests in memory
    if (this.requestMetrics.length > 1000) {
      this.requestMetrics.shift();
    }

    // Log slow requests
    if (duration > 1000) {
      console.warn(
        `[Slow Request] ${method} ${path} took ${duration}ms (${statusCode})`,
      );
    }

    // Send to monitoring service
    if (process.env.NODE_ENV === "production" && process.env.METRICS_URL) {
      await this.recordMetric(
        `request.${method.toLowerCase()}`,
        duration,
        "ms",
        {
          path,
          statusCode: String(statusCode),
        },
      );
    }
  };

  /**
   * Get metrics summary
   */
  getMetricsSummary = (
    name: string,
  ): { avg: number; min: number; max: number } | null => {
    const metrics = this.metrics.get(name);
    if (!metrics || metrics.length === 0) return null;

    const values = metrics.map((m) => m.value);
    return {
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
    };
  };

  /**
   * Get request metrics
   */
  getRequestMetrics = (limit: number = 100): RequestMetrics[] => {
    return this.requestMetrics.slice(-limit);
  };

  /**
   * Record database query duration
   */
  recordQueryDuration = async (
    query: string,
    duration: number,
  ): Promise<void> => {
    await this.recordMetric("database.query", duration, "ms", {
      query: query.substring(0, 50),
    });
  };

  /**
   * Get metrics for health monitoring
   */
  getMetrics = (): {
    requests: RequestMetrics[];
    errors: PerformanceMetric[];
    queries: PerformanceMetric[];
  } => {
    const requests = this.getRequestMetrics(100);
    const errors = this.metrics.get("error") || [];
    const queries = this.metrics.get("database.query") || [];

    return {
      requests,
      errors,
      queries,
    };
  };

  /**
   * Backwards-compatible alias for getMetrics
   */
  getAllMetrics = () => this.getMetrics();
}

export const monitor = new PerformanceMonitor();

export default monitor;
