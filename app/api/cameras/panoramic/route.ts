import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { log } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const area = searchParams.get('area') || 'all';

    // Get panoramic cameras from database
    const cameras = await prisma.camera.findMany({
      where: {
        type: 'panoramic',
        ...(area !== 'all' && { area }),
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        area: true,
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
        type: 'panoramic',
        omnidirectional: true,
        crowdAnalysis: true,
        count: cameras.length,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error){
    log.error('Panoramic camera API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve panoramic camera data' },
      { status: 500 }
    );
  }
}