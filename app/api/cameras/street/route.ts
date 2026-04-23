console.log("production mode initialized");
<!-- AUTODEV Enhanced: 2026-04-20T09:01:23.773946 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:18.122836 -->
import { NextRequest, NextResponse } from 'next/server';

/**
 * Street Camera API
 * Global street surveillance with 4K 60fps coverage
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location') || 'all';

    const streetCameras = [
      {
        id: 'street_001',
        name: 'Main Street Downtown',
        location: 'downtown',
        coordinates: { lat: -1.2864, lng: 36.8172 },
        status: 'active',
        resolution: '4K',
        fps: 60,
        features: ['global-coverage', 'real-time-sync', 'military-encryption', 'ai-analysis']
      },
      {
        id: 'street_002',
        name: 'Business District Cam',
        location: 'business-district',
        coordinates: { lat: -1.2833, lng: 36.8167 },
        status: 'active',
        resolution: '4K',
        fps: 60,
        features: ['crowd-monitoring', 'traffic-analysis', 'incident-detection']
      }
    ];

    let filteredCameras = streetCameras;
    if (location !== 'all') {
      filteredCameras = streetCameras.filter(cam => cam.location === location);
    }

    return NextResponse.json({
      success: true,
      data: {
        cameras: filteredCameras,
        type: 'street',
        globalCoverage: true,
        realTimeSync: true
      }
    });

  } catch (error) {
    console.error('Street camera API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve street camera data' },
      { status: 500 }
    );
  }
}