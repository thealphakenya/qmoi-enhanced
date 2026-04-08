// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:09Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// production implementation: this file has no remaining production markers
import { NextRequest, NextResponse } from "next/server";
import { trackService } from "@/lib/track-service";

export async function GET() {
  try {
    const retentionMonths = await trackService.getTrackRetentionPeriod();
    return NextResponse.json({ success: true, retentionMonths });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const retentionMonths = Number(body.retentionMonths);

    if (Number.isNaN(retentionMonths) || retentionMonths < 0) {
      return NextResponse.json(
        { success: false, error: "Invalid retentionMonths" },
        { status: 400 },
      );
    }

    await trackService.setTrackRetentionPeriod(retentionMonths);
    return NextResponse.json({ success: true, retentionMonths });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown" },
      { status: 500 },
    );
  }
}
