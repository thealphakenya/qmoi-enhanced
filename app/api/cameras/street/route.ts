import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { log } from '@/lib/logger';
import { log as logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location') || 'all';

    // Get street cameras from database
    const cameras = await prisma.camera.findMany({
      where: {
        type: 'street',
        ...(location !== 'all' && { location }),
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        location: true,
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
        type: 'street',
        globalCoverage: true,
        realTimeSync: true,
        count: cameras.length,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error){
    log.error('Street camera API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve street camera data' },
      { status: 500 }
    );
  }
}
