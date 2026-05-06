import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/db/prisma";

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
      // System health could be calculated from various metrics
      Promise.resolve(100), // Placeholder for now
      // Uptime could be tracked separately
      Promise.resolve("99.9%")
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
    console.error("Admin dashboard API error:", error);
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
