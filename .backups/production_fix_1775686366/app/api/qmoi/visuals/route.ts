// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:10Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import { NextRequest, NextResponse } from "next/server";
import { QMOIService } from "@/lib/qmoi-service";

/**
 * Visual Customization Endpoint
 * Handles avatar, theme, background, and animation preferences
 */
export async function POST(req: NextRequest) {
  try {
    const { userId, visuals, avatar, theme, background, animation } =
      await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    // Build visual preferences object
    const visualPreferences = {
      avatar: avatar || "default_avatar",
      theme: theme || "light",
      background: background || "gradient-blue",
      animation: animation || "smooth",
      customVisuals: visuals || [],
      appliedAt: new Date(),
    };

    // Store visual preferences in QMOI service
    const result = await QMOIService.updateUserPreferences(
      userId,
      visualPreferences,
    );

    return NextResponse.json({
      success: true,
      message: "Visual preferences updated",
      preferences: visualPreferences,
      result,
    });
  } catch (error) {
    console.error("Visual customization error:", error);
    return NextResponse.json(
      { error: "Failed to update visual preferences" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId") || "anonymous";

    // Retrieve user's visual preferences
    const preferences = await QMOIService.getUserPreferences(userId);

    return NextResponse.json({
      success: true,
      userId,
      preferences: preferences || {
        avatar: "default_avatar",
        theme: "light",
        background: "gradient-blue",
        animation: "smooth",
      },
    });
  } catch (error) {
    console.error("Visual retrieval error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve visual preferences" },
      { status: 500 },
    );
  }
}
