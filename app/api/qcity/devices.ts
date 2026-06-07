import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/db/prisma";
import { log } from '@/lib/logger';
import { log as logger } from "@/lib/logger";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const devices = await prisma.device.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        type: true,
        platform: true,
        status: true,
        lastSync: true,
        location: true,
        battery: true,
        ipAddress: true,
        osVersion: true,
        model: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { lastSync: 'desc' },
    });

    // Transform for QCity-specific response format
    const qcityDevices = devices.map((device: any) => ({
      id: device.id,
      name: device.name,
      type: device.type,
      platform: device.platform,
      status: device.status,
      lastSync: device.lastSync?.toISOString(),
      location: device.location,
      battery: device.battery,
      ipAddress: device.ipAddress,
      osVersion: device.osVersion,
      model: device.model,
      connected: device.status === 'online',
      lastSeen: device.lastSync?.toISOString() || device.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      endpoint: "qcity/devices",
      method: "GET",
      devices: qcityDevices,
      count: qcityDevices.length,
      stats: {
        total: qcityDevices.length,
        online: qcityDevices.filter((d: any) => d.connected).length,
        offline: qcityDevices.filter((d: any) => !d.connected).length,
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    log.error("QCity devices fetch error:", error as Error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch devices",
        message: error instanceof Error ? error.message : "Database error"
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { deviceId, action, parameters = {} } = body;

    if (!deviceId || !action) {
      return NextResponse.json(
        { success: false, error: "device ID and action are required" },
        { status: 400 }
      );
    }

    // Validate device exists
    const device = await prisma.device.findUnique({
      where: { id: deviceId },
    });

    if (!device) {
      return NextResponse.json(
        { success: false, error: "Device not found" },
        { status: 404 }
      );
    }

    // Implement device control logic based on action
    let result;
    const status = "executed";

    switch (action) {
      case 'sync':
        // Update last sync time
        result = await prisma.device.update({
          where: { id: deviceId },
          data: {
            lastSync: new Date(),
            status: 'online',
          },
        });
        break;

      case 'restart':
        // Log restart action (in real implementation, this would trigger actual restart)
        result = { action: 'restart', deviceId, timestamp: new Date().toISOString() };
        break;

      case 'backup':
        // Log backup action
        result = { action: 'backup', deviceId, timestamp: new Date().toISOString() };
        break;

      case 'update':
        // Log update action
        result = { action: 'update', deviceId, parameters, timestamp: new Date().toISOString() };
        break;

      case 'lock':
        // Update device status to locked
        result = await prisma.device.update({
          where: { id: deviceId },
          data: { status: 'locked' },
        });
        break;

      case 'unlock':
        // Update device status to online
        result = await prisma.device.update({
          where: { id: deviceId },
          data: { status: 'online' },
        });
        break;

      case 'wipe':
        // Mark device as inactive (soft delete)
        result = await prisma.device.update({
          where: { id: deviceId },
          data: { isActive: false },
        });
        break;

      default:
        return NextResponse.json(
          { success: false, error: `Unsupported action: ${action}` },
          { status: 400 }
        );
    }

    const response = {
      success: true,
      deviceId: deviceId,
      action: action,
      status: status,
      result: result,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response);
  } catch (error) {
    log.error("QCity devices control error:", error as Error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process device request",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
