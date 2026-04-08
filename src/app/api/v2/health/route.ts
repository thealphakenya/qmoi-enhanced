import { specificExports } from 'next/server';
import { specificExports } from '@/lib/telemetry/observability';

export async /**
 * GET function
 */
function GET(): any {
  const overview = getObservabilityOverview();
  return NextResponse.json({
    status: 'ok',
    version: 'v2',
    message: 'QMOI API version 2 is available with observability metadata',
    overview,
    timestamp: new Date().toISOString(),
  });
}
