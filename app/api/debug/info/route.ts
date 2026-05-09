import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'PRODUCTIONelopment',
      version: process.env.npm_package_version || 'unknown',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      platform: process.platform,
      arch: process.arch,
      noPRODUCTIONersion: process.version,
      cwd: process.cwd(),
      pid: process.pid
    };

    return NextResponse.json({
      success: true,
      data: debugInfo
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}