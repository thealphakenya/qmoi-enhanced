import { NextRequest, NextResponse } from 'next/server';

/**
 * Device Management API
 * Comprehensive device connectivity and management
 */

interface Device {
  id: string;
  name: string;
  type: string;
  platform: string;
  status: 'online' | 'offline' | 'syncing';
  lastSync: string;
  location?: string;
  battery?: number;
  ipAddress?: string;
  macAddress?: string;
  osVersion?: string;
  memory?: {
    total: number;
    used: number;
    free: number;
  };
  storage?: {
    total: number;
    used: number;
    free: number;
  };
}

// Mock device database - in production, this would be a real database
const devices: Device[] = [
  {
    id: 'dev_001',
    name: 'iPhone 15 Pro',
    type: 'mobile',
    platform: 'iOS',
    status: 'online',
    lastSync: new Date().toISOString(),
    location: 'Nairobi, Kenya',
    battery: 85,
    ipAddress: '192.168.1.100',
    osVersion: '17.4.1',
    memory: { total: 8192, used: 2048, free: 6144 },
    storage: { total: 256000, used: 120000, free: 136000 }
  },
  {
    id: 'dev_002',
    name: 'MacBook Pro M3',
    type: 'laptop',
    platform: 'macOS',
    status: 'online',
    lastSync: new Date().toISOString(),
    battery: 92,
    ipAddress: '192.168.1.101',
    osVersion: '14.4.1',
    memory: { total: 32768, used: 8192, free: 24576 },
    storage: { total: 1000000, used: 450000, free: 550000 }
  },
  {
    id: 'dev_003',
    name: 'Smart TV LG',
    type: 'smart-tv',
    platform: 'webOS',
    status: 'online',
    lastSync: new Date().toISOString(),
    ipAddress: '192.168.1.102',
    osVersion: '7.3.1'
  },
  {
    id: 'dev_004',
    name: 'Apple Watch Ultra',
    type: 'wearable',
    platform: 'watchOS',
    status: 'syncing',
    lastSync: new Date().toISOString(),
    battery: 78,
    osVersion: '10.4'
  },
  {
    id: 'dev_005',
    name: 'HomePod Mini',
    type: 'smart-speaker',
    platform: 'iOS',
    status: 'online',
    lastSync: new Date().toISOString(),
    ipAddress: '192.168.1.103',
    osVersion: '16.5'
  },
  {
    id: 'dev_006',
    name: 'iPad Pro',
    type: 'tablet',
    platform: 'iPadOS',
    status: 'offline',
    lastSync: new Date(Date.now() - 3600000).toISOString(),
    battery: 45,
    ipAddress: '192.168.1.104',
    osVersion: '17.4.1',
    memory: { total: 8192, used: 3072, free: 5120 },
    storage: { total: 256000, used: 80000, free: 176000 }
  }
];

/**
 * GET /api/devices
 * List all devices with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const platform = searchParams.get('platform');

    let filteredDevices = devices;

    if (type) {
      filteredDevices = filteredDevices.filter(d => d.type === type);
    }

    if (status) {
      filteredDevices = filteredDevices.filter(d => d.status === status);
    }

    if (platform) {
      filteredDevices = filteredDevices.filter(d => d.platform === platform);
    }

    // Calculate stats
    const stats = {
      total: devices.length,
      online: devices.filter(d => d.status === 'online').length,
      offline: devices.filter(d => d.status === 'offline').length,
      syncing: devices.filter(d => d.status === 'syncing').length,
      types: [...new Set(devices.map(d => d.type))],
      platforms: [...new Set(devices.map(d => d.platform))]
    };

    return NextResponse.json({
      success: true,
      data: {
        devices: filteredDevices,
        stats,
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Device API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve devices' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/devices
 * Control device operations (sync, restart, update, etc.)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { deviceId, action, parameters } = body;

    if (!deviceId || !action) {
      return NextResponse.json(
        { success: false, error: 'Device ID and action are required' },
        { status: 400 }
      );
    }

    // Find device
    const device = devices.find(d => d.id === deviceId);
    if (!device) {
      return NextResponse.json(
        { success: false, error: 'Device not found' },
        { status: 404 }
      );
    }

    // Mock action response
    const response = {
      deviceId,
      action,
      status: 'executed',
      timestamp: new Date().toISOString(),
      parameters: parameters || {},
      result: `Action '${action}' executed successfully on ${device.name}`
    };

    // Log the action
    console.log(`Device control: ${deviceId} - ${action}`, parameters);

    return NextResponse.json({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('Device control error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to control device' },
      { status: 500 }
    );
  }
}