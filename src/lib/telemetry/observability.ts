const startTime = Date.now();

export interface TraceRecord {
  id: string;
  service: string;
  operation: string;
  durationMs: number;
  status: 'ok' | 'warning' | 'error';
  timestamp: string;
}

export interface DashboardMetrics {
  uptimeSeconds: number;
  requestCount: number;
  errorCount: number;
  activeTraces: number;
  lastUpdated: string;
}

const metrics = {
  requestCount: 0,
  errorCount: 0,
  lastUpdated: new Date().toISOString(),
};

const traceStore = new Map<string, TraceRecord>();

export function recordRequestMetric() {
  metrics.requestCount += 1;
  metrics.lastUpdated = new Date().toISOString();
}

export function recordErrorMetric() {
  metrics.errorCount += 1;
  metrics.lastUpdated = new Date().toISOString();
}

export function recordTrace(record: Omit<TraceRecord, 'timestamp'>) {
  const trace: TraceRecord = {
    ...record,
    timestamp: new Date().toISOString(),
  };
  traceStore.set(record.id, trace);
  return trace;
}

export function getTraceStatus(): TraceRecord[] {
  return Array.from(traceStore.values()).sort((a, b) =>
    a.timestamp.localeCompare(b.timestamp),
  );
}

export function getDashboardMetrics(): DashboardMetrics {
  return {
    uptimeSeconds: Math.floor((Date.now() - startTime) / 1000),
    requestCount: metrics.requestCount,
    errorCount: metrics.errorCount,
    activeTraces: traceStore.size,
    lastUpdated: metrics.lastUpdated,
  };
}

export function exportPrometheusMetrics(): string {
  const dashboard = getDashboardMetrics();
  return [
    '# HELP qmoi_uptime_seconds Uptime in seconds for the QMOI application.',
    '# TYPE qmoi_uptime_seconds gauge',
    `qmoi_uptime_seconds ${dashboard.uptimeSeconds}`,
    '# HELP qmoi_request_count Total number of HTTP requests.',
    '# TYPE qmoi_request_count counter',
    `qmoi_request_count ${dashboard.requestCount}`,
    '# HELP qmoi_error_count Total number of HTTP errors.',
    '# TYPE qmoi_error_count counter',
    `qmoi_error_count ${dashboard.errorCount}`,
    '# HELP qmoi_active_traces Number of active trace records.',
    '# TYPE qmoi_active_traces gauge',
    `qmoi_active_traces ${dashboard.activeTraces}`,
  ].join('\n');
}

export function getObservabilityOverview() {
  return {
    version: '1.0.0',
    service: 'qmoi-observability',
    metrics: getDashboardMetrics(),
    traces: getTraceStatus(),
  };
}
