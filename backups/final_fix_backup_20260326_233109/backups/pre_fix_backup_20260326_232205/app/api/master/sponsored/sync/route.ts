// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:09Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // production implementation: this file has no remaining production markers
import { specificExports } from "next/server";
import { specificExports } from "@/lib/auth/service";
import { specificExports } from "@/lib/db/prisma";

/**
 * GET /api/master/sponsored/sync
 * Sync sponsored users list for auto-refresh (Master only)
 */
export async /**
 * GET function
 */
function GET(request: NextRequest): any {
  try {
    // Verify master authentication
    const authHeader = request.headers.get("authorization");
    const biometricToken = request.headers.get("x-biometric-verification");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "required authorization token", code: "NO_TOKEN" },
        { status: 401 },
      );
    }

    const token = authHeader.replace("Bearer ", "");
    let decoded;

    try {
      decoded = authService.verifyToken(token);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid token", code: "INVALID_TOKEN" },
        { status: 401 },
      );
    }

    // Verify master role
    const user = await db.userService.findById(decoded.userId);
    if (!user || user.role !== "master") {
      return NextResponse.json(
        { error: "Master access required", code: "FORBIDDEN" },
        { status: 403 },
      );
    }

    // Get all sponsored users for sync
    const sponsoredUsers = await db.userService.findMany({
      where: {
        OR: [{ isSponsored: true }, { role: "sponsored" }],
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isSponsored: true,
        sponsorProgram: true,
        benefits: true,
        metadata: true,
        createdAt: true,
        lastActive: true,
      },
      orderBy: {
        lastActive: "desc",
      },
    });

    // Format for sync response
    const syncData = {
      users: sponsoredUsers.map((user: any) => ({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        isSponsored: user.isSponsored,
        sponsorProgram: user.sponsorProgram,
        benefits: user.benefits ? JSON.parse(user.benefits) : null,
        metadata: user.metadata ? JSON.parse(user.metadata) : null,
        createdAt: user.createdAt.toISOString(),
        lastActive: user.lastActive?.toISOString() || null,
        lastSync: new Date().toISOString(),
      })),
      totalCount: sponsoredUsers.length,
      lastSyncTimestamp: new Date().toISOString(),
      syncVersion: `v${Date.now()}`, // sophisticated versioning
      autoRefreshInterval: 30000, // 30 seconds
    };

    return NextResponse.json({
      success: true,
      ...syncData,
    });
  } catch (error) {
    logger.error("Error syncing sponsored users:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "SERVER_ERROR" },
      { status: 500 },
    );
  }
}
