import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { log } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const zone = searchParams.get('zone') || 'all';

    // Get thermal cameras from database
    const cameras = await prisma.camera.findMany({
      where: {
        type: 'thermal',
        ...(zone !== 'all' && { zone }),
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        zone: true,
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
        type: 'thermal',
        nightVision: true,
        heatDetection: true,
        count: cameras.length,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error){
    log.error('Thermal camera API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve thermal camera data' },
      { status: 500 }
    );
  }
}