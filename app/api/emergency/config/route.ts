import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { log } from '@/lib/logger';
import { log as logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    const config = await prisma.emergencyConfig.findFirst({
      orderBy: { updatedAt: 'desc' },
    });

    if (!config) {
      return NextResponse.json({
        success: true,
        data: {
          enabled: false,
          alertThresholds: {
            cpu: 90,
            memory: 85,
            storage: 95,
            battery: 15,
          },
          autoActions: {
            restartServices: true,
            clearCache: true,
            notifyAdmins: true,
          },
          notificationChannels: ['email', 'sms'],
          emergencyContacts: [],
        },
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: config.id,
        enabled: config.enabled,
        alertThresholds: config.alertThresholds,
        autoActions: config.autoActions,
        notificationChannels: config.notificationChannels,
        emergencyContacts: config.emergencyContacts,
        createdAt: config.createdAt.toISOString(),
        updatedAt: config.updatedAt.toISOString(),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    log.error('Emergency config fetch error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch emergency config',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      enabled,
      alertThresholds,
      autoActions,
      notificationChannels,
      emergencyContacts,
    } = body;

    const config = await prisma.emergencyConfig.upsert({
      where: { id: 'default' },
      update: {
        enabled,
        alertThresholds,
        autoActions,
        notificationChannels,
        emergencyContacts,
        updatedAt: new Date(),
      },
      create: {
        id: 'default',
        enabled,
        alertThresholds,
        autoActions,
        notificationChannels,
        emergencyContacts,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: config.id,
        enabled: config.enabled,
        alertThresholds: config.alertThresholds,
        autoActions: config.autoActions,
        notificationChannels: config.notificationChannels,
        emergencyContacts: config.emergencyContacts,
        createdAt: config.createdAt.toISOString(),
        updatedAt: config.updatedAt.toISOString(),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    log.error('Emergency config update error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update emergency config',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  return POST(request);
}

export async function DELETE(request: NextRequest) {
  try {
    await prisma.emergencyConfig.deleteMany({});
    
    return NextResponse.json({
      success: true,
      message: 'Emergency config reset to defaults',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    log.error('Emergency config delete error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to reset emergency config',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
