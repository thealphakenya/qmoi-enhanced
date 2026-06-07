import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const allowDebug = process.env.ENABLE_DEBUG_ROUTES === "true" || process.env.NODE_ENV !== "production";
  if (!allowDebug) {
    return NextResponse.json(
      { success: false, error: "Debug endpoints are disabled in production." },
      { status: 404 }
    );
  }

  try {
    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production',
      version: process.env.npm_package_version || 'unknown',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version,
      cwd: process.cwd(),
      pid: process.pid
    };

    return NextResponse.json({
      success: true,
      data: debugInfo
    });
  } catch (error: unknown) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}