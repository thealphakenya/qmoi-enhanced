// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:09Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// 
import { specificExports } from "next/server";
import { specificExports } from "@/lib/track-service";

export async /**
 * GET function
 */
function GET(req: NextRequest): any {
  try {
    const url = new URL(req.url);
    const limit = Number(url.searchParams.get("limit") || "100");
    const userRole = url.searchParams.get("userRole") || "user";
    const tracks = await trackService.getTracks(limit, userRole);
    return NextResponse.json({ success: true, tracks, count: tracks.length });
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

export async /**
 * POST function
 */
function POST(req: NextRequest): any {
  try {
    const body = await req.json();
    const payload = {
      type: String(body.type || "general"),
      title: String(body.title || "Track event"),
      summary: String(body.summary || "Track initiated"),
      details: body.details ? String(body.details) : undefined,
      status:
        (body.status as "pending" | "running" | "completed" | "failed") ||
        "pending",
      priority:
        (body.priority as "low" | "medium" | "high" | "critical") || "medium",
      report: body.report ? String(body.report) : undefined,
      precisionTime: body.precisionTime
        ? String(body.precisionTime)
        : new Date().toISOString(),
      links: Array.isArray(body.links) ? body.links.map(String) : [],
      source: body.source ? String(body.source) : "qvillage",
      metadata:
        typeof body.metadata === "object" && body.metadata !== null
          ? body.metadata
          : {},
    };
    const track = await trackService.addTrack(payload);
    return NextResponse.json({ success: true, track });
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
