import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Mock deployment status data
  return NextResponse.json({
    status: 'Healthy',
    lastDeploy: '2025-10-04T18:00:00Z',
    health: 'All systems operational',
    logs: [
      '[2025-10-04 18:00:00] [ACTION] [Deploy] - Main app deployed successfully.',
      '[2025-10-04 18:10:00] [SYNC] [Memory] - QMOI memory synced across all platforms.'
    ],
    history: [
      { time: '2025-10-04T18:00:00Z', status: 'Healthy' },
      { time: '2025-10-04T17:00:00Z', status: 'Healthy' }
    ]
  });
}
