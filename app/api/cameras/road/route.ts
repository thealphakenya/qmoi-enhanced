import { NextRequest, NextResponse } from 'next/server';

/**
 * Road Camera API
 * Real-time road monitoring and traffic analysis
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const route = searchParams.get('route') || 'all';

    const roadCameras = [
      {
        id: 'road_001',
        name: 'Highway North Entry',
        route: 'highway-north',
        coordinates: { lat: -1.2864, lng: 36.8172 },
        status: 'active',
        resolution: '4K',
        fps: 30,
        features: ['traffic-monitoring', 'incident-detection', 'speed-analysis']
      },
      {
        id: 'road_002',
        name: 'City Ring Road East',
        route: 'ring-road-east',
        coordinates: { lat: -1.2833, lng: 36.8167 },
        status: 'active',
        resolution: '4K',
        fps: 30,
        features: ['congestion-monitoring', 'emergency-vehicle-priority']
      }
    ];

    let filteredCameras = roadCameras;
    if (route !== 'all') {
      filteredCameras = roadCameras.filter(cam => cam.route === route);
    }

    return NextResponse.json({
      success: true,
      data: {
        cameras: filteredCameras,
        type: 'road',
        realTimeMonitoring: true,
        trafficAnalysis: true
      }
    });

  } catch (error) {
    console.error('Road camera API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve road camera data' },
      { status: 500 }
    );
  }
}