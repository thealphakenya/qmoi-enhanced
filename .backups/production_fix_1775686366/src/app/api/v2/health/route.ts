import { NextResponse } from 'next/server';
import { getObservabilityOverview } from '@/lib/telemetry/observability';

export async function GET() {
  const overview = getObservabilityOverview();
  return NextResponse.json({
    status: 'ok',
    version: 'v2',
    message: 'QMOI API version 2 is available with observability metadata',
    overview,
    timestamp: new Date().toISOString(),
  });
}
