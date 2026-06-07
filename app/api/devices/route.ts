import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { log } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const devices = await prisma.device.findMany({
      where: { isActive: true },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
      },
      orderBy: { lastSync: 'desc' },
    });

    // Transform to match the expected API response format
    const transformedDevices = devices.map((device: any) => ({
      id: device.id,
      name: device.name,
      type: device.type,
      platform: device.platform,
      status: device.status as 'online' | 'offline' | 'syncing',
      lastSync: device.lastSync?.toISOString() || new Date().toISOString(),
      location: device.location || undefined,
      battery: device.battery || undefined,
      ipAddress: device.ipAddress || undefined,
      osVersion: device.osVersion || undefined,
      memory: device.memoryTotal ? {
        total: device.memoryTotal,
        used: device.memoryUsed || 0,
        free: device.memoryFree || device.memoryTotal - (device.memoryUsed || 0),
      } : undefined,
      storage: device.storageTotal ? {
        total: device.storageTotal,
        used: device.storageUsed || 0,
        free: device.storageFree || device.storageTotal - (device.storageUsed || 0),
      } : undefined,
    }));

    return NextResponse.json({
      success: true,
      data: {
        devices: transformedDevices,
        stats: {
          total: transformedDevices.length,
          online: transformedDevices.filter((d: any) => d.status === 'online').length,
          offline: transformedDevices.filter((d: any) => d.status === 'offline').length,
          syncing: transformedDevices.filter((d: any) => d.status === 'syncing').length
        },
        lastUpdated: new Date().toISOString()
      },
      count: transformedDevices.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    log.error('Device fetch error:', error as Error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch devices',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
