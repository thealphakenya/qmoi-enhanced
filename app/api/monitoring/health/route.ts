/**
 * POST /api/monitoring/health - System health status endpoint
 * GET /api/monitoring/metrics - Query metrics for time range
 * GET /api/monitoring/alerts - Get active alerts
 */

import { NextRequest, NextResponse } from 'next/server';
import { monitoringService } from '@/services/monitoring';

/**
 * GET /api/monitoring/health - System health check
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  
  // Route to appropriate handler
  if (url.pathname.includes('/alerts')) {
    return handleGetAlerts(req);
  } else if (url.pathname.includes('/metrics')) {
    return handleGetMetrics(req);
  } else {
    return handleGetHealth(req);
  }
}

/**
 * POST /api/monitoring/alerts/resolve - Resolve an alert
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    if (body.action === 'resolve' && body.alertId) {
      monitoringService.resolveAlert(body.alertId);
      return NextResponse.json({
        success: true,
        message: 'Alert resolved',
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process alert' },
      { status: 500 }
    );
  }
}

/**
 * Handle GET /api/monitoring/health
 */
async function handleGetHealth(req: NextRequest) {
  const health = monitoringService.getSystemHealth();
  
  return NextResponse.json({
    status: health.status,
    timestamp: health.timestamp,
    metrics: health.metrics,
    services: Object.fromEntries(monitoringService.getHealthStatus()),
  });
}

/**
 * Handle GET /api/monitoring/metrics
 */
async function handleGetMetrics(req: NextRequest) {
  const url = new URL(req.url);
  const metricName = url.searchParams.get('name');
  const windowMinutes = parseInt(url.searchParams.get('window') || '60');

  if (!metricName) {
    return NextResponse.json(
      { error: 'metric name required' },
      { status: 400 }
    );
  }

  const stats = monitoringService.getMetricStats(metricName, windowMinutes);

  return NextResponse.json({
    metric: metricName,
    window_minutes: windowMinutes,
    stats,
  });
}

/**
 * Handle GET /api/monitoring/alerts
 */
async function handleGetAlerts(req: NextRequest) {
  const alerts = monitoringService.getActiveAlerts();

  return NextResponse.json({
    count: alerts.length,
    critical_count: alerts.filter(a => a.severity === 'critical').length,
    alerts,
  });
}
