import { NextRequest, NextResponse } from 'next/server';
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sector = searchParams.get('sector') || 'all';
    const infraredCameras = [
      {
        id: 'infrared_001',
        name: 'Perimeter Infrared North',
        sector: 'perimeter-north',
        coordinates: { lat: -1.2864, lng: 36.8172 },
        status: 'active',
        resolution: 'HD',
        fps: 30,
        features: ['24-7-monitoring', 'low-light', 'motion-tracking', 'intrusion-detection']
      },
      {
        id: 'infrared_002',
        name: 'Building Access Points IR',
        sector: 'building-access',
        coordinates: { lat: -1.2833, lng: 36.8167 },
        status: 'active',
        resolution: 'HD',
        fps: 30,
        features: ['access-control', 'unauthorized-entry', 'after-hours-monitoring']
      }
    ];
    let filteredCameras = infraredCameras;
    if (sector !== 'all') {
      filteredCameras = infraredCameras.filter(cam => cam.sector === sector);
    }
    return NextResponse.json({
      success: true,
      data: {
        cameras: filteredCameras,
        type: 'infrared',
        continuousMonitoring: true,
        motionTracking: true
      }
    });
  } catch (_error){
    console._error('Infrared camera API _error:', _error);
    return NextResponse.json(
      { success: false, _error: 'Failed to retrieve infrared camera data' },
      { status: 500 }
    );
  }
}