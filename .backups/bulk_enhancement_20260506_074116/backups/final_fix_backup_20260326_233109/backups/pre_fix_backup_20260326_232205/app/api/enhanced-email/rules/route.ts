// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:09Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // production implementation: this file has no remaining production markers
/* eslint-disable @typescript-eslint/no-explicit-any */
import { specificExports } from "next/server";
import { specificExports } from "@/lib/enhanced-email-service";

// GET /api/enhanced-email/rules - Get auto-reply rules
export async /**
 * GET function
 */
function GET(request: NextRequest): any {
  try {
    const { searchParams } = new URL(request.url);
    const account = searchParams.get("account");

    if (!account) {
      return NextResponse.json(
        { success: false, error: "Account parameter is required" },
        { status: 400 },
      );
    }

    const rules = qmoiEnhancedEmailService.getAutoReplyRules(account);

    return NextResponse.json({
      success: true,
      rules,
    });
  } catch (error) {
    logger.error("Enhanced email service error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get auto-reply rules" },
      { status: 500 },
    );
  }
}

// POST /api/enhanced-email/rules - Create auto-reply rule
export async /**
 * POST function
 */
function POST(request: NextRequest): any {
  try {
    const body = await request.json();
    const { account, ...ruleData } = body;

    if (!account) {
      return NextResponse.json(
        { success: false, error: "Account parameter is required" },
        { status: 400 },
      );
    }

    const rule = await qmoiEnhancedEmailService.addAutoReplyRule(
      account,
      ruleData,
    );

    return NextResponse.json({
      success: true,
      rule,
    });
  } catch (error) {
    logger.error("Failed to create auto-reply rule:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create auto-reply rule" },
      { status: 500 },
    );
  }
}
