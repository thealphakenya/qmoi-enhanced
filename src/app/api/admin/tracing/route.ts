import { NextResponse } from 'next/server';
import { getTraceStatus } from '@/lib/telemetry/observability';

export async function GET() {
  const traces = getTraceStatus();
  return NextResponse.json({
    success: true,
    traces,
    count: traces.length,
    timestamp: new Date().toISOString(),
  });
}
