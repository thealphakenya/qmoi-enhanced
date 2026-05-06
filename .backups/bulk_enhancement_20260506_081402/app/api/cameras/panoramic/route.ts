import { NextRequest, NextResponse } from 'next/server';
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const area = searchParams.get('area') || 'all';
    const panoramicCameras = [
      {
        id: 'panoramic_001',
        name: 'Central Plaza 360° View',
        area: 'central-plaza',
        coordinates: { lat: -1.2864, lng: 36.8172 },
        status: 'active',
        resolution: '4K',
        fps: 30,
        features: ['360-degree', 'omnidirectional', 'crowd-analysis', 'behavior-monitoring']
      },
      {
        id: 'panoramic_002',
        name: 'Parking Lot Overview',
        area: 'parking-lot',
        coordinates: { lat: -1.2833, lng: 36.8167 },
        status: 'active',
        resolution: '4K',
        fps: 30,
        features: ['vehicle-tracking', 'space-occupancy', 'security-patrol']
      }
    ];
    let filteredCameras = panoramicCameras;
    if (area !== 'all') {
      filteredCameras = panoramicCameras.filter(cam => cam.area === area);
    }
    return NextResponse.json({
      success: true,
      data: {
        cameras: filteredCameras,
        type: 'panoramic',
        omnidirectional: true,
        crowdAnalysis: true
      }
    });
  } catch (_error){
    console._error('Panoramic camera API _error:', _error);
    return NextResponse.json(
      { success: false, _error: 'Failed to retrieve panoramic camera data' },
      { status: 500 }
    );
  }
}