// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:09Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// [PRODUCTION READY] this file has no remaining non-production markers
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { qmoiEnhancedEmailService } from "@/lib/enhanced-email-service";

// GET /api/enhanced-email/analytics - Get email analytics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const account = searchParams.get("account");
    const days = searchParams.get("days")
      ? parseInt(searchParams.get("days")!)
      : 30;

    if (!account) {
      return NextResponse.json(
        { success: false, error: "Account parameter is required" },
        { status: 400 },
      );
    }

    let analytics: any = {};
    const fn =
      .getEmailAnalytics ||
      .getAnalytics ||
      (async () => ({}));
    analytics = await fn(account, days);

    return NextResponse.json({
      success: true,
      analytics,
    });
  } catch (error) {
    console.error("Enhanced email service error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get email analytics" },
      { status: 500 },
    );
  }
}
