/**
 * Error Tracker & Monitoring
 * Production-grade error tracking with structured logging
 */

interface ErrorContext {
  userId?: string;
  endpoint?: string;
  method?: string;
  statusCode?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

interface TrackedError {
  id: string;
  timestamp: string;
  message: string;
  stack?: string;
  context?: ErrorContext;
  severity: "low" | "medium" | "high" | "critical";
}

class ErrorTracker {
  private errors: Map<string, TrackedError> = new Map();

  /**
   * Track an error with context
   */
  track = async (error: Error, context?: ErrorContext): Promise<string> => {
    const id = `err-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const trackedError: TrackedError = {
      id,
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack,
      context,
      severity: this.calculateSeverity(error, context),
    };

    this.errors.set(id, trackedError);

    // Log to console in development
    if (process.env.NODE_ENV !== "production") {
      console.error(`[${id}] Error tracked:`, trackedError);
    }

    // Send to external service (Sentry, DataDog, etc.) in production
    if (
      process.env.NODE_ENV === "production" &&
      process.env.ERROR_TRACKING_URL
    ) {
      await this.sendToExternalService(trackedError);
    }

    return id;
  };

  /**
   * Record an alert/incident
   */
  recordAlert = async (alert: {
    title: string;
    description: string;
    severity: string;
    timestamp?: string;
  }): Promise<string> => {
    const id = `alert-${Date.now()}`;
    console.warn(`[${id}] Alert recorded:`, alert);
    // TODO: Save to database
    return id;
  };

  /**
   * Get recent errors
   */
  getRecentErrors = async (
    limit: number = 10,
    severity?: string,
  ): Promise<TrackedError[]> => {
    let errors = Array.from(this.errors.values())
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
      .slice(0, limit);

    if (severity) {
      errors = errors.filter((e) => e.severity === severity);
    }

    return errors;
  };

  /**
   * Get error details
   */
  getError = async (id: string): Promise<TrackedError | null> => {
    return this.errors.get(id) || null;
  };

  /**
   * Clear old errors (older than 24 hours)
   */
  cleanup = (): void => {
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    for (const [id, error] of this.errors) {
      if (new Date(error.timestamp).getTime() < cutoff) {
        this.errors.delete(id);
      }
    }
  };

  /**
   * Calculate severity based on error type and context
   */
  private calculateSeverity = (
    error: Error,
    context?: ErrorContext,
  ): "low" | "medium" | "high" | "critical" => {
    if (context?.statusCode && context.statusCode >= 500) return "high";
    if (
      error.message.includes("database") ||
      error.message.includes("connection")
    )
      return "critical";
    if (error.message.includes("timeout")) return "medium";
    return "low";
  };

  /**
   * Send error to external tracking service
   */
  private sendToExternalService = async (
    error: TrackedError,
  ): Promise<void> => {
    try {
      const response = await fetch(process.env.ERROR_TRACKING_URL!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ERROR_TRACKING_TOKEN}`,
        },
        body: JSON.stringify(error),
      });

      if (!response.ok) {
        console.error("Failed to send error to tracking service");
      }
    } catch (error) {
      console.error("Error sending to tracking service:", error);
    }
  };
}

export const errorTracker = new ErrorTracker();

// Run cleanup every hour
if (typeof setInterval !== "undefined") {
  setInterval(() => errorTracker.cleanup(), 60 * 60 * 1000);
}

export default errorTracker;
