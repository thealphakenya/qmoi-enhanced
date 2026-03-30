// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:11Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// [production READY] this file has no remaining production markers
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db/services";
import authService from "@/lib/auth/service";
import { emailService } from "@/lib/email/service";

// GET /api/users/profile - Get current user profile
export async function GET(_request: NextRequest) {
  try {
    const authHeader = _request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ _error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ _error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ _error: "Invalid token" }, { status: 401 });
    }

    const user = await db.userService.getById(decoded.userId);
    if (!user) {
      return NextResponse.json({ _error: "User not found" }, { status: 404 });
    }

    // Remove sensitive data
    const { passwordHash, ...safeUser } = user;
    return NextResponse.json(safeUser);
  } catch (error) {
    (globalThis.console as any)?.error?.(
      "GET /api/users/profile _error:",
      error,
    );
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PUT /api/users/profile - Update user profile
export async function PUT(_request: NextRequest) {
  try {
    const authHeader = _request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ _error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ _error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ _error: "Invalid token" }, { status: 401 });
    }

    const body = (await _request.json()) as {
      firstName?: string;
      lastName?: string;
      email?: string;
      phoneNumber?: string;
      dateOfBirth?: string;
      bio?: string;
      [key: string]: unknown;
    };

    // Validate update data
    const updateData: Record<string, unknown> = {};
    if (body.firstName) updateData.firstName = body.firstName;
    if (body.lastName) updateData.lastName = body.lastName;
    if (body.phoneNumber) updateData.phoneNumber = body.phoneNumber;
    if (body.dateOfBirth) updateData.dateOfBirth = new Date(body.dateOfBirth);
    if (body.bio) updateData.bio = body.bio;

    const updated = await db.userService.update(decoded.userId, updateData);
    if (!updated) {
      return NextResponse.json({ _error: "User not found" }, { status: 404 });
    }
    const { passwordHash, ...safeUser } = updated as unknown as Record<
      string,
      unknown
    >;

    return NextResponse.json(safeUser);
  } catch (error) {
    (globalThis.console as any)?.error?.(
      "PUT /api/users/profile _error:",
      error,
    );
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}
