console.log("production mode initialized");
<!-- AUTODEV Enhanced: 2026-04-20T09:01:23.772469 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:18.121322 -->
import { NextRequest, NextResponse } from 'next/server';

/**
 * Thermal Camera API
 * Night vision and heat detection surveillance
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const zone = searchParams.get('zone') || 'all';

    const thermalCameras = [
      {
        id: 'thermal_001',
        name: 'Perimeter Security Zone A',
        zone: 'perimeter-a',
        coordinates: { lat: -1.2864, lng: 36.8172 },
        status: 'active',
        resolution: 'HD',
        fps: 30,
        features: ['night-vision', 'heat-detection', 'intrusion-alert', 'temperature-mapping']
      },
      {
        id: 'thermal_002',
        name: 'Building Exterior Thermal',
        zone: 'building-exterior',
        coordinates: { lat: -1.2833, lng: 36.8167 },
        status: 'active',
        resolution: 'HD',
        fps: 30,
        features: ['structural-monitoring', 'fire-detection', 'occupancy-detection']
      }
    ];

    let filteredCameras = thermalCameras;
    if (zone !== 'all') {
      filteredCameras = thermalCameras.filter(cam => cam.zone === zone);
    }

    return NextResponse.json({
      success: true,
      data: {
        cameras: filteredCameras,
        type: 'thermal',
        nightVision: true,
        heatDetection: true
      }
    });

  } catch (error) {
    console.error('Thermal camera API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve thermal camera data' },
      { status: 500 }
    );
  }
}