import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const QCAMERA_TYPES = {
  street: {
    type: 'street',
    description: 'High-resolution street surveillance with live AI analytics and handsfree controls.',
    platforms: ['desktop', 'mobile', 'embedded'],
    features: ['real-time-sync', 'global-coverage', 'motion-detection', 'handsfree-voice-control']
  },
  road: {
    type: 'road',
    description: 'Traffic monitoring for highway and route management with adaptive machine detection.',
    platforms: ['desktop', 'mobile', 'vehicle', 'edge'],
    features: ['route-analysis', 'incident-detection', 'speed-monitoring', 'traffic-optimization']
  },
  thermal: {
    type: 'thermal',
    description: 'Night and heat detection for secure perimeter and safety monitoring.',
    platforms: ['desktop', 'mobile', 'embedded'],
    features: ['heat-signature', 'low-light-vision', 'intrusion-alerts', 'environmental-sensing']
  },
  panoramic: {
    type: 'panoramic',
    description: '360-degree omnidirectional monitoring for plazas, venues and multi-zone sites.',
    platforms: ['desktop', 'mobile', 'control-room'],
    features: ['omnidirectional-view', 'crowd-analysis', 'panorama-stitching', 'arena-monitoring']
  },
  infrared: {
    type: 'infrared',
    description: 'Persistent low-light and perimeter monitoring with motion-activated reporting.',
    platforms: ['desktop', 'mobile', 'security-device'],
    features: ['low-light', '24-7-monitoring', 'motion-tracking', 'energy-efficient']
  }
};

const QSTORE_APPS = [
  {
    id: 'qbrowser',
    name: 'Qbrowser',
    category: 'productivity',
    version: '1.2.0',
    platforms: ['windows', 'mac', 'linux', 'android', 'ios'],
    icon: '🌐',
    features: ['customizable UI', 'animated icons', 'prodice-optimized performance'],
  },
  {
    id: 'qfilemanager',
    name: 'QFileManager',
    category: 'utilities',
    version: '2.0.1',
    platforms: ['windows', 'mac', 'linux', 'android', 'ios'],
    icon: '🗂️',
    features: ['file sync', 'auto-organization', 'secure storage'],
  },
  {
    id: 'qclock',
    name: 'QClock',
    category: 'utility',
    version: '1.1.0',
    platforms: ['windows', 'mac', 'linux', 'android', 'ios'],
    icon: '🕰️',
    features: ['world clock', 'AI alarm', 'schedule sync'],
  },
  {
    id: 'qmap',
    name: 'QMap',
    category: 'navigation',
    version: '3.0.0',
    platforms: ['windows', 'mac', 'linux', 'android', 'ios'],
    icon: '🗺️',
    features: ['AR view', 'live traffic', 'route planning'],
  },
  {
    id: 'qsearch',
    name: 'QSearch',
    category: 'search',
    version: '1.0.5',
    platforms: ['windows', 'mac', 'linux', 'android', 'ios'],
    icon: '🔍',
    features: ['voice search', 'image search', 'AI discovery'],
  },
  {
    id: 'qcamera',
    name: 'Qcamera Hub',
    category: 'hardware',
    version: '1.0.0',
    platforms: ['windows', 'mac', 'linux', 'android', 'ios', 'chromebook', 'raspberry-pi'],
    icon: '📷',
    features: ['handsfree remote control', 'camera device management', 'platform-aware packages'],
  },
];

const ICON_PATHS = {
  qstore: 'assets/icons/qstore.svg',
  qstore_128: 'assets/icons/qstore-128.svg',
  qstore_512: 'assets/icons/qstore-512.svg',
  qstore_release: 'tools/release_templates/icons/qstore.svg',
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const platform = searchParams.get('platform');

  let availableApps = QSTORE_APPS;
  if (category) {
    availableApps = availableApps.filter((app) => app.category === category);
  }
  if (platform) {
    availableApps = availableApps.filter((app) => app.platforms.includes(platform));
  }

  return NextResponse.json({
    success: true,
    route: '/api/qstore',
    method: 'GET',
    data: {
      store: {
        name: 'Qstore',
        description: 'Central QMOI app and hardware marketplace with platform-aware downloads, app icons, and metadata.',
        supportedPlatforms: ['windows', 'mac', 'linux', 'android', 'ios', 'chromebook', 'raspberry-pi'],
        icons: ICON_PATHS,
        cameraIntegration: {
          supported: true,
          types: Object.keys(QCAMERA_TYPES),
          defaultFeatures: ['remote-control', 'handsfree-operation', 'ai-diagnostics'],
        },
      },
      apps: availableApps,
      qcamera: {
        categories: QCAMERA_TYPES,
        devices: [
          'street-camera',
          'road-camera',
          'thermal-camera',
          'panoramic-camera',
          'infrared-camera',
        ],
      },
      metadata: {
        updatedAt: new Date().toISOString(),
        totalApps: availableApps.length,
        totalCameraTypes: Object.keys(QCAMERA_TYPES).length,
      },
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, appId, cameraType, targetPlatform } = body;

    if (!action) {
      return NextResponse.json(
        { success: false, error: 'Action is required for Qstore operations.' },
        { status: 400 }
      );
    }

    const response = {
      action,
      appId: appId || null,
      cameraType: cameraType || null,
      targetPlatform: targetPlatform || null,
      status: 'executed',
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      route: '/api/qstore',
      method: 'POST',
      data: response,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to execute Qstore action.' },
      { status: 500 }
    );
  }
}
