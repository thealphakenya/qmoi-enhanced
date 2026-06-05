import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { log } from '@/lib/logger';
import { log as logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const route = searchParams.get('route') || 'all';

    // Get road cameras from database
    const cameras = await prisma.camera.findMany({
      where: {
        type: 'road',
        ...(route !== 'all' && { route }),
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        route: true,
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
        type: 'road',
        realTimeMonitoring: true,
        trafficAnalysis: true,
        count: cameras.length,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error){
    log.error('Road camera API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve road camera data' },
      { status: 500 }
    );
  }
}
