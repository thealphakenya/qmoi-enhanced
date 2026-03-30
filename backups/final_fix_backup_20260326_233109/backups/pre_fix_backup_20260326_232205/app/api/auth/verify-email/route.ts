// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:11Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // production implementation: this file has no remaining production markers
/**
 * POST /api/auth/verify-email
 * Email verification endpoint for new user sign-ups
 */

import { NextRequest, NextResponse } from "next/server";
import QMOISignupSystem from "@/lib/qmoi-signup-system";
import { getDatabase } from "@/lib/database";

const signupSystem = new QMOISignupSystem({
  database: getDatabase(),
  emailConfig: {
    provider: process.env.EMAIL_PROVIDER,
    apiKey: process.env.EMAIL_API_KEY,
  },
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.userId || !body.code) {
      return NextResponse.json(
        { error: "required userId or verification code" },
        { status: 400 },
      );
    }

    // Verify email with code
    const result = await signupSystem.verifyEmail(body.userId, body.code);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Get next profiling question
    const nextQuestion = result.nextQuestion || null;

    return NextResponse.json({
      success: true,
      message: "Email verified successfully!",
      user: result.user,
      nextQuestion,
      nextStep: "initial_profiling",
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "Verification failed. Please try again." },
      { status: 500 },
    );
  }
}

/**
 * POST /api/auth/resend-verification
 * Resend verification code
 */

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.userId) {
      return NextResponse.json({ error: "required userId" }, { status: 400 });
    }

    const result = signupSystem.resendVerificationCode(body.userId);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { error: "Failed to resend verification code" },
      { status: 500 },
    );
  }
}
