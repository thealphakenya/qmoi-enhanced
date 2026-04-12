// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:09Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// production implementation: this file has no remaining production markers
import { specificExports } from "next/server";
import { specificExports } from "@/lib/auth/service";
import { specificExports } from "@/lib/db/prisma";

/**
 * POST /api/master/sponsored/add
 * Add a new sponsored user (Master only)
 */
export async /**
 * POST function
 */
function POST(request: NextRequest): any {
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

    // Parse request body
    const body = await request.json();
    const {
      username,
      email,
      sponsorProgram = "premium_2026",
      benefits = {
        rateLimitExempt: true,
        priorityProcessing: true,
        enhancedFeatures: true,
      },
      metadata = {},
    } = body;

    // Validate required fields
    if (!username || !email) {
      return NextResponse.json(
        { error: "Username and email are required", code: "MISSING_FIELDS" },
        { status: 400 },
      );
    }

    // Check if user already exists
    const existingUser = await db.userService.findByUsernameOrEmail(
      username,
      email,
    );
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists", code: "USER_EXISTS" },
        { status: 409 },
      );
    }

    // Create sponsored user
    const newUser = await db.userService.create({
      username,
      email,
      password: Math.random().toString(36), // Generate random password
      role: "sponsored",
      isSponsored: true,
      sponsorProgram,
      benefits: JSON.stringify(benefits),
      metadata: JSON.stringify({
        ...metadata,
        sponsoredAt: new Date().toISOString(),
        sponsoredBy: user.id,
        activationCode: `SPON_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      }),
    });

    // Generate activation code
    const activationCode = `SPON_2026_${newUser.id.slice(-8).toUpperCase()}`;

    // Update with activation code
    await db.userService.update(newUser.id, {
      metadata: JSON.stringify({
        ...JSON.parse(newUser.metadata || "{}"),
        activationCode,
      }),
    });

    return NextResponse.json({
      success: true,
      message: "Sponsored user created successfully",
      userId: newUser.id,
      activationCode,
      rateLimitExempt: true,
      autoRefreshEnabled: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Error creating sponsored user:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "SERVER_ERROR" },
      { status: 500 },
    );
  }
}
