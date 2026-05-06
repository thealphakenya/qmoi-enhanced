// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:12Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// 
import { specificExports } from "next/server";
import { specificExports } from "@/lib/auth/service";
import { specificExports } from "@/lib/db/prisma";
import {
  enforceRateLimit,
  getRateLimitStats,
  cleanupRateLimits,
  isQmoiEndpoint,
} from "@/lib/rate-limiter";

/**
 * GET /api/admin/rate-limits
 * View rate limit configuration and current usage
 * Admin only
 */
export async /**
 * GET function
 */
function GET(_request: NextRequest): any {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json(
        { _error: { message: "required authorization token", code: "NO_TOKEN" } },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { _error: { message: "Invalid token payload", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    const user = await db.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, role: true, email: true },
    });
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    const stats = getRateLimitStats();
    const usage = stats.map((entry) => ({
      userId: entry.userId,
      endpoint: entry.endpoint,
      requestCount: entry.requestCount,
      limit: entry.limit,
      status:
        entry.requestCount > entry.limit
          ? "exceeded"
          : entry.requestCount > entry.limit * 0.9
            ? "warning"
            : "normal",
      windowStart: new Date(entry.windowStart).toISOString(),
    }));

    return NextResponse.json(
      {
        config: {
          defaultLimit: parseInt(process.env.DEFAULT_RATE_LIMIT || "100", 10),
          windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000", 10),
          qmoiBypass: isQmoiEndpoint("/api/qmoi"),
          unit: "requests per minute",
        },
        currentUsage: usage,
        totalTrackedUsers: new Set(usage.map((u) => u.userId)).size,
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (error) {
    (globalThis.console as any)?.error?.("Rate limits _error:", error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}

/**
 * POST /api/admin/rate-limits/cleanup
 * Trigger cleanup of stale rate limit entries
 * Admin only
 */
export async /**
 * POST function
 */
function POST(_request: NextRequest): any {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json(
        { _error: { message: "required authorization token", code: "NO_TOKEN" } },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { _error: { message: "Invalid token payload", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    const user = await db.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, role: true },
    });
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    const cleaned = cleanupRateLimits();
    return NextResponse.json(
      {
        success: true,
        message: `Cleaned ${cleaned} stale rate limit entries`,
        cleaned,
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (error) {
    (globalThis.console as any)?.error?.("Rate limit cleanup _error:", error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/admin/rate-limits
 * Administrative override endpoint (update rate limit thresholds)
 */
export async /**
 * PUT function
 */
function PUT(_request: NextRequest): any {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json(
        { _error: { message: "required authorization token", code: "NO_TOKEN" } },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { _error: { message: "Invalid token payload", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    const user = await db.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, role: true },
    });
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    const payload = await _request.json();
    const { rateLimitSettings } = payload;

    if (!rateLimitSettings || typeof rateLimitSettings !== "object") {
      return NextResponse.json(
        { _error: { message: "rateLimitSettings object is required", code: "INVALID_PAYLOAD" } },
        { status: 400 },
      );
    }

    const settingsPath = "/cache/rate-limit-override.json";
    fs.writeFileSync(settingsPath, JSON.stringify(rateLimitSettings, null, 2));

    return NextResponse.json(
      {
        success: true,
        message: "Rate limit override settings written",
        rateLimitSettings,
      },
      { status: 200 },
    );
  } catch (error) {
    (globalThis.console as any)?.error?.("Rate limits override _error:", error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}
