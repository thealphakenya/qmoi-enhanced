import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { log } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sector = searchParams.get('sector') || 'all';

    // Get infrared cameras from database
    const cameras = await prisma.camera.findMany({
      where: {
        type: 'infrared',
        ...(sector !== 'all' && { sector }),
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        sector: true,
        coordinates: true,
        status: true,
        resolution: true,
        fps: true,
        features: true,
        lastActive: true,
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: {
        cameras,
        type: 'infrared',
        continuousMonitoring: true,
        motionTracking: true,
        count: cameras.length,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error){
    log.error('Infrared camera API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve infrared camera data' },
      { status: 500 }
    );
  }
}
