import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { log } from "@/lib/logger";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    // Get real metrics from database
    const [
      totalUsers,
      activeSessions,
      systemHealth,
      uptimeData
    ] = await Promise.all([
      prisma.user.count(),
      prisma.session.count({ where: { isActive: true } }),
      // Calculate system health from recent system metrics
      (async () => {
        const recentMetrics = await prisma.systemMetric.findMany({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 1000
        });

        if (recentMetrics.length === 0) return 100;

        const errorMetrics = recentMetrics.filter((m: { metricName: string }) => 
          m.metricName.includes('error') || m.metricName.includes('failed')
        ).length;

        const healthScore = Math.max(0, 100 - (errorMetrics / recentMetrics.length * 100));
        return Math.round(healthScore);
      })(),
      // Get uptime from system metrics
      (async () => {
        const uptimeMetrics = await prisma.systemMetric.findMany({
          where: {
            metricName: 'uptime_percentage',
            createdAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 1
        });

        if (uptimeMetrics.length === 0) return "99.9%";
        return Math.round(parseFloat(uptimeMetrics[0].value.toString()) * 10) / 10 + "%";
      })()
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        activeSessions,
        systemHealth,
        uptime: uptimeData,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    log.error("Admin dashboard API error", error as Error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch admin dashboard data"
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  return NextResponse.json({
    success: true,
    message: "Admin dashboard POST endpoint",
    method: "POST",
  });
}
