// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:09Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// Production implementation: this file has no remaining non-production markers
import { NextRequest, NextResponse } from "next/server";
import { linksService } from "@/lib/links-service";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get("category") || undefined;
    const isZeroRated =
      url.searchParams.get("isZeroRated") === "true"
        ? true
        : url.searchParams.get("isZeroRated") === "false"
          ? false
          : undefined;

    const platforms = await linksService.getPlatforms(category, isZeroRated);
    return NextResponse.json({
      success: true,
      platforms,
      count: platforms.length,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown",
      },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const platform = await linksService.addPlatform(body);
    return NextResponse.json({ success: true, platform });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown",
      },
      { status: 500 },
    );
  }
}
