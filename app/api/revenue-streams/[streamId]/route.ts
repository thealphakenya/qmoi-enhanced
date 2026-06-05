import { NextRequest, NextResponse } from 'next/server';
import { validateMasterAuth } from '@/app/lib/auth/validate-master';

// Mock revenue stream database
const REVENUE_STREAMS_DB: Record<string, any> = {
  'cloud-computing': {
    id: 'cloud-computing',
    name: 'Cloud Computing',
    tier: 1,
    dailyRevenue: 12000000,
    monthlyRevenue: 360000000,
    status: 'operational',
    growth: 0.12,
    clients: 5000,
    description: 'Global cloud computing platform',
    expansion: {
      nextRegions: ['africa', 'oceania'],
      targetGrowth: 0.15,
      investmentNeeded: 5000000,
    },
    risks: [
      { level: 'low', description: 'Cloud market competition' },
      { level: 'medium', description: 'Regulatory compliance' },
    ],
  },
  'advertising-network': {
    id: 'advertising-network',
    name: 'Advertising Network',
    tier: 1,
    dailyRevenue: 12500000,
    monthlyRevenue: 375000000,
    status: 'operational',
    growth: 0.15,
    clients: 3500,
    description: 'Global advertising network',
    expansion: {
      nextRegions: [],
      targetGrowth: 0.18,
      investmentNeeded: 3000000,
    },
    risks: [
      { level: 'medium', description: 'Privacy regulations' },
      { level: 'low', description: 'Advertiser churn' },
    ],
  },
};

/**
 * GET /api/revenue-streams/[streamId]
 * Get detailed revenue stream information
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { streamId: string } }
) {
  try {
    const validation = await validateMasterAuth(request);
    if (!validation.authenticated) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Master authentication required' },
        { status: 401 }
      );
    }

    const streamId = params.streamId;
    const stream = REVENUE_STREAMS_DB[streamId];

    if (!stream) {
      return NextResponse.json(
        { success: false, message: `Revenue stream "${streamId}" not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: stream,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error?.('[Get Revenue Stream Error]', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/revenue-streams/[streamId]
 * Update revenue stream
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { streamId: string } }
) {
  try {
    const validation = await validateMasterAuth(request);
    if (!validation.authenticated) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Master authentication required' },
        { status: 401 }
      );
    }

    const streamId = params.streamId;
    const body = await request.json();

    const stream = REVENUE_STREAMS_DB[streamId];
    if (!stream) {
      return NextResponse.json(
        { success: false, message: `Revenue stream "${streamId}" not found` },
        { status: 404 }
      );
    }

    // Update stream properties
    const updatedStream = {
      ...stream,
      ...body,
      updatedAt: new Date().toISOString(),
      updatedBy: validation.masterId,
    };

    // In production, save to database
    REVENUE_STREAMS_DB[streamId] = updatedStream;

    return NextResponse.json({
      success: true,
      data: updatedStream,
      message: 'Revenue stream updated',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error?.('[Update Revenue Stream Error]', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to update revenue stream',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/revenue-streams/[streamId]
 * Delete revenue stream (archive instead)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { streamId: string } }
) {
  try {
    const validation = await validateMasterAuth(request);
    if (!validation.authenticated) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Master authentication required' },
        { status: 401 }
      );
    }

    const streamId = params.streamId;
    const stream = REVENUE_STREAMS_DB[streamId];

    if (!stream) {
      return NextResponse.json(
        { success: false, message: `Revenue stream "${streamId}" not found` },
        { status: 404 }
      );
    }

    // Archive instead of hard delete
    REVENUE_STREAMS_DB[streamId] = {
      ...stream,
      status: 'archived',
      archivedAt: new Date().toISOString(),
      archivedBy: validation.masterId,
    };

    return NextResponse.json({
      success: true,
      message: `Revenue stream "${streamId}" archived`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error?.('[Delete Revenue Stream Error]', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to delete revenue stream',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
