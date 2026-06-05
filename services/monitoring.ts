/**
 * Production Monitoring & Alerting Service
 * Real-time metrics collection, anomaly detection, and alerting
 */

import { createHmac } from 'crypto';

interface Metric {
  timestamp: number;
  name: string;
  value: number;
  tags?: Record<string, string>;
}

interface Alert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: number;
  resolved?: boolean;
}

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: number;
  metrics: Record<string, number>;
  lastError?: string;
}

export class MonitoringService {
  private metrics: Metric[] = [];
  private alerts: Alert[] = [];
  private healthChecks: Map<string, HealthStatus> = new Map();
  private readonly maxMetrics = 10000;
  private alertThresholds = {
    tradingErrorRate: 5, // > 5% = alert
    apiLatency: 1000, // > 1000ms = alert
    walletBalance: 100, // < $100 = alert
    failedTransactions: 3, // > 3 failed in 5min = alert
  };

  constructor() {
    this.initializeHealthChecks();
  }

  /**
   * Initialize health check endpoints
   */
  private initializeHealthChecks(): void {
    const checks = [
      'api-gateway',
      'trading-engine',
      'wallet-service',
      'exchange-adapters',
      'webhook-processor',
    ];

    checks.forEach(check => {
      this.healthChecks.set(check, {
        status: 'healthy',
        timestamp: Date.now(),
        metrics: {},
      });
    });
  }

  /**
   * Record metric
   */
  recordMetric(name: string, value: number, tags?: Record<string, string>): void {
    const metric: Metric = {
      timestamp: Date.now(),
      name,
      value,
      tags,
    };

    this.metrics.push(metric);

    // Trim old metrics if exceeding max
    if (this.metrics.length > this.maxMetrics) {
      const cutoff = Date.now() - 3600000; // 1 hour
      this.metrics = this.metrics.filter(m => m.timestamp > cutoff);
    }

    // Check thresholds and alert if needed
    this.checkThreshold(name, value);
  }

  /**
   * Check metric thresholds
   */
  private checkThreshold(name: string, value: number): void {
    const thresholds: Record<string, { max?: number; min?: number; severity: Alert['severity'] }> = {
      'trading.error_rate': { max: this.alertThresholds.tradingErrorRate, severity: 'warning' },
      'api.latency_ms': { max: this.alertThresholds.apiLatency, severity: 'warning' },
      'wallet.balance_usd': { min: this.alertThresholds.walletBalance, severity: 'critical' },
      'transactions.failed_count': { max: this.alertThresholds.failedTransactions, severity: 'warning' },
    };

    const threshold = thresholds[name];
    if (!threshold) return;

    if ((threshold.max && value > threshold.max) || (threshold.min && value < threshold.min)) {
      this.createAlert(threshold.severity, `Threshold exceeded: ${name}`, `Value: ${value}`);
    }
  }

  /**
   * Create alert
   */
  createAlert(severity: Alert['severity'], title: string, message: string): Alert {
    const alert: Alert = {
      id: this.generateAlertId(),
      severity,
      title,
      message,
      timestamp: Date.now(),
    };

    this.alerts.push(alert);

    // Keep only recent alerts (24 hours)
    const cutoff = Date.now() - 86400000;
    this.alerts = this.alerts.filter(a => a.timestamp > cutoff);

    // Notify on critical alerts
    if (severity === 'critical') {
      this.notifyMaster(alert);
    }

    return alert;
  }

  /**
   * Generate unique alert ID
   */
  private generateAlertId(): string {
    return `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Notify master of critical alert (via Slack/Discord/WhatsApp)
   */
  private notifyMaster(alert: Alert): void {
    const message = `🚨 CRITICAL: ${alert.title}\n${alert.message}`;

    // Would integrate with Slack/Discord/WhatsApp here
    console.error(`[ALERT] ${message}`);

    // In production, would post to SLACK_WEBHOOK_URL, DISCORD_WEBHOOK_URL, WHATSAPP_WEBHOOK_URL
  }

  /**
   * Update health status
   */
  updateHealthStatus(
    service: string,
    status: HealthStatus['status'],
    metrics: Record<string, number>,
    lastError?: string
  ): void {
    this.healthChecks.set(service, {
      status,
      timestamp: Date.now(),
      metrics,
      lastError,
    });

    if (status === 'unhealthy') {
      this.createAlert('critical', `Service unhealthy: ${service}`, lastError || 'No error details');
    }
  }

  /**
   * Get metrics for time range
   */
  getMetrics(startTime: number, endTime: number): Metric[] {
    return this.metrics.filter(m => m.timestamp >= startTime && m.timestamp <= endTime);
  }

  /**
   * Get metric statistics
   */
  getMetricStats(name: string, windowMinutes: number = 60): any {
    const cutoff = Date.now() - windowMinutes * 60000;
    const filtered = this.metrics.filter(m => m.name === name && m.timestamp > cutoff);

    if (filtered.length === 0) {
      return { count: 0, average: 0, min: 0, max: 0, latest: 0 };
    }

    const values = filtered.map(m => m.value);
    return {
      count: filtered.length,
      average: values.reduce((a, b) => a + b, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      latest: values[values.length - 1],
      percentile95: values.sort((a, b) => a - b)[Math.floor(values.length * 0.95)],
    };
  }

  /**
   * Get all active alerts
   */
  getActiveAlerts(): Alert[] {
    return this.alerts.filter(a => !a.resolved);
  }

  /**
   * Resolve alert
   */
  resolveAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
    }
  }

  /**
   * Get health status for all services
   */
  getHealthStatus(): Map<string, HealthStatus> {
    return this.healthChecks;
  }

  /**
   * Overall system health
   */
  getSystemHealth(): HealthStatus {
    const statuses = Array.from(this.healthChecks.values());
    const allHealthy = statuses.every(s => s.status === 'healthy');
    const anyUnhealthy = statuses.some(s => s.status === 'unhealthy');

    return {
      status: anyUnhealthy ? 'unhealthy' : allHealthy ? 'healthy' : 'degraded',
      timestamp: Date.now(),
      metrics: {
        healthy_services: statuses.filter(s => s.status === 'healthy').length,
        degraded_services: statuses.filter(s => s.status === 'degraded').length,
        unhealthy_services: statuses.filter(s => s.status === 'unhealthy').length,
        active_alerts: this.getActiveAlerts().length,
        critical_alerts: this.getActiveAlerts().filter(a => a.severity === 'critical').length,
      },
    };
  }

  /**
   * Generate health check signature for webhook
   */
  generateHealthCheckSignature(secret: string): string {
    const health = this.getSystemHealth();
    const payload = JSON.stringify(health);
    return createHmac('sha256', secret).update(payload).digest('base64');
  }
}

// Singleton instance
export const monitoringService = new MonitoringService();
