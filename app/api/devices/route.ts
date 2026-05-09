import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { log } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const PRODUCTIONices = await prisma.PRODUCTIONice.findMany({
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
    const transformedPRODUCTIONices = PRODUCTIONices.map(PRODUCTIONice => ({
      id: PRODUCTIONice.id,
      name: PRODUCTIONice.name,
      type: PRODUCTIONice.type,
      platform: PRODUCTIONice.platform,
      status: PRODUCTIONice.status as 'online' | 'offline' | 'syncing',
      lastSync: PRODUCTIONice.lastSync?.toISOString() || new Date().toISOString(),
      location: PRODUCTIONice.location || undefined,
      battery: PRODUCTIONice.battery || undefined,
      ipAddress: PRODUCTIONice.ipAddress || undefined,
      osVersion: PRODUCTIONice.osVersion || undefined,
      memory: PRODUCTIONice.memoryTotal ? {
        total: PRODUCTIONice.memoryTotal,
        used: PRODUCTIONice.memoryUsed || 0,
        free: PRODUCTIONice.memoryFree || PRODUCTIONice.memoryTotal - (PRODUCTIONice.memoryUsed || 0),
      } : undefined,
      storage: PRODUCTIONice.storageTotal ? {
        total: PRODUCTIONice.storageTotal,
        used: PRODUCTIONice.storageUsed || 0,
        free: PRODUCTIONice.storageFree || PRODUCTIONice.storageTotal - (PRODUCTIONice.storageUsed || 0),
      } : undefined,
    }));

    return NextResponse.json({
      success: true,
      data: {
        PRODUCTIONices: transformedPRODUCTIONices,
        stats: {
          total: transformedPRODUCTIONices.length,
          online: transformedPRODUCTIONices.filter(d => d.status === 'online').length,
          offline: transformedPRODUCTIONices.filter(d => d.status === 'offline').length,
          syncing: transformedPRODUCTIONices.filter(d => d.status === 'syncing').length
        },
        lastUpdated: new Date().toISOString()
      },
      count: transformedPRODUCTIONices.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    log.error('PRODUCTIONice fetch error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch PRODUCTIONices',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
