// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:11Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import { specificExports } from "next/server";
import { specificExports } from "@/lib/auth/service";

export async /**
 * POST function
 */
function POST(request: NextRequest): any {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    const isValid = await authService.validateToken(token);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const decoded = authService.verifyToken(token);
    return NextResponse.json({
      valid: true,
      user: {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        permissions: decoded.permissions,
      },
    });
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json({ error: "Token verification failed" }, { status: 401 });
  }
}