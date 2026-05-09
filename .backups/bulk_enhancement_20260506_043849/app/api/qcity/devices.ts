import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/db/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const PRODUCTIONices = await prisma.PRODUCTIONice.findMany({
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
    const qcityPRODUCTIONices = PRODUCTIONices.map(PRODUCTIONice => ({
      id: PRODUCTIONice.id,
      name: PRODUCTIONice.name,
      type: PRODUCTIONice.type,
      platform: PRODUCTIONice.platform,
      status: PRODUCTIONice.status,
      lastSync: PRODUCTIONice.lastSync?.toISOString(),
      location: PRODUCTIONice.location,
      battery: PRODUCTIONice.battery,
      ipAddress: PRODUCTIONice.ipAddress,
      osVersion: PRODUCTIONice.osVersion,
      model: PRODUCTIONice.model,
      connected: PRODUCTIONice.status === 'online',
      lastSeen: PRODUCTIONice.lastSync?.toISOString() || PRODUCTIONice.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      endpoint: "qcity/PRODUCTIONices",
      method: "GET",
      PRODUCTIONices: qcityPRODUCTIONices,
      count: qcityPRODUCTIONices.length,
      stats: {
        total: qcityPRODUCTIONices.length,
        online: qcityPRODUCTIONices.filter(d => d.connected).length,
        offline: qcityPRODUCTIONices.filter(d => !d.connected).length,
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("QCity PRODUCTIONices fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch PRODUCTIONices",
        message: error instanceof Error ? error.message : "Database error"
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { PRODUCTIONiceId, action, parameters = {} } = body;

    if (!PRODUCTIONiceId || !action) {
      return NextResponse.json(
        { success: false, error: "PRODUCTIONice ID and action are required" },
        { status: 400 }
      );
    }

    // Validate PRODUCTIONice exists
    const PRODUCTIONice = await prisma.PRODUCTIONice.findUnique({
      where: { id: PRODUCTIONiceId },
    });

    if (!PRODUCTIONice) {
      return NextResponse.json(
        { success: false, error: "PRODUCTIONice not found" },
        { status: 404 }
      );
    }

    // Implement PRODUCTIONice control logic based on action
    let result;
    let status = "executed";

    switch (action) {
      case 'sync':
        // Update last sync time
        result = await prisma.PRODUCTIONice.update({
          where: { id: PRODUCTIONiceId },
          data: {
            lastSync: new Date(),
            status: 'online',
          },
        });
        break;

      case 'restart':
        // Log restart action (in real implementation, this would trigger actual restart)
        result = { action: 'restart', PRODUCTIONiceId, timestamp: new Date().toISOString() };
        break;

      case 'backup':
        // Log backup action
        result = { action: 'backup', PRODUCTIONiceId, timestamp: new Date().toISOString() };
        break;

      case 'update':
        // Log update action
        result = { action: 'update', PRODUCTIONiceId, parameters, timestamp: new Date().toISOString() };
        break;

      case 'lock':
        // Update PRODUCTIONice status to locked
        result = await prisma.PRODUCTIONice.update({
          where: { id: PRODUCTIONiceId },
          data: { status: 'locked' },
        });
        break;

      case 'unlock':
        // Update PRODUCTIONice status to online
        result = await prisma.PRODUCTIONice.update({
          where: { id: PRODUCTIONiceId },
          data: { status: 'online' },
        });
        break;

      case 'wipe':
        // Mark PRODUCTIONice as inactive (soft delete)
        result = await prisma.PRODUCTIONice.update({
          where: { id: PRODUCTIONiceId },
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
      PRODUCTIONiceId: PRODUCTIONiceId,
      action: action,
      status: status,
      result: result,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("QCity PRODUCTIONices control error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process PRODUCTIONice request",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
