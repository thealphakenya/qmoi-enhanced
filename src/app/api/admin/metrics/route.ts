import { NextResponse } from 'next/server';
import { exportPrometheusMetrics, getDashboardMetrics } from '@/lib/telemetry/observability';

export async function GET(request: Request) {
  const acceptHeader = request.headers.get('accept') || '';
  if (acceptHeader.includes('text/plain')) {
    return new Response(exportPrometheusMetrics(), {
      headers: {
        'Content-Type': 'text/plain; version=0.0.4',
      },
    });
  }

  return NextResponse.json({
    success: true,
    metrics: getDashboardMetrics(),
    timestamp: new Date().toISOString(),
  });
}
