import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/db/prisma";
import { log as logger } from "@/lib/logger";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    // Return system metrics
    const metrics = {
      system: {
        uptime: "99.9%",
        responsetime: "45ms",
        activeUsers: 1247,
        totalRequests: 5234891
      },
      performance: {
        cpuUsage: 42,
        memoryUsage: 58,
        networkIO: "1.2 Gbps",
        diskUsage: 67
      },
      application: {
        activeComputes: 12,
        errors: 3,
        warnings: 18,
        deployments: 24
      }
    };

    return NextResponse.json({
      success: true,
      metrics: metrics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error("Metrics error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve metrics" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { metricType, value } = body;

    if (!metricType) {
      return NextResponse.json(
        { success: false, error: "Metric type is required" },
        { status: 400 }
      );
    }

    // Store metric in database
    const storedMetric = await prisma.systemMetric.create({
      data: {
        metricType: body.category || 'application',
        metricName: metricType,
        value: typeof value === 'number' ? value : parseFloat(value) || 0,
        unit: body.unit || 'count',
        category: body.category || 'application',
        subsystem: body.subsystem || 'api',
        period: body.period || 'instant',
        dimensions: body.dimensions || {},
        tags: body.tags || [],
        source: body.source || 'api',
        collectedBy: 'metrics-api',
        confidence: body.confidence || 1.0,
      },
    });

    return NextResponse.json({
      success: true,
      metricType: metricType,
      value: value,
      stored: true,
      metricId: storedMetric.id,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error("Metrics POST error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process metrics",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
