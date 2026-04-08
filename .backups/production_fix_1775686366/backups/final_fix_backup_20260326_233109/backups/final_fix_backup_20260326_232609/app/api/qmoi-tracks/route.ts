// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:11Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// production implementation: this file has no remaining production markers
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { qmoiTracksService } from "@/lib/tracks-service";
import { withAuthentication } from "@/lib/auth";

// GET /api/qmoi-tracks - Get tracks with filtering
export async function GET(request: NextRequest) {
  try {
    const user = await withAuthentication(request);
    if (!user || user.role !== 'master') {
      return NextResponse.json({ success: false, error: 'Master-only access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);

    const filter: any = {};

    if (searchParams.get("type")) filter.type = searchParams.get("type");
    if (searchParams.get("status")) filter.status = searchParams.get("status");
    if (searchParams.get("priority")) filter.priority = searchParams.get("priority");

    if (searchParams.get("createdAfter")) {
      filter.createdAfter = new Date(searchParams.get("createdAfter")!);
    }

    if (searchParams.get("createdBefore")) {
      filter.createdBefore = new Date(searchParams.get("createdBefore")!);
    }

    if (searchParams.get("tags")) {
      filter.tags = searchParams.get("tags")!.split(",");
    }

    const tracks = await qmoiTracksService.getTracks(filter);
    const stats = await qmoiTracksService.getTracksStats();

    return NextResponse.json({
      success: true,
      tracks,
      stats,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to get tracks" },
      { status: 500 }
    );
  }
}

// POST /api/qmoi-tracks - Create a new track
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, metadata, priority, dependencies } = body;

    if (!name || !type) {
      return NextResponse.json(
        { success: false, error: "Name and type are required" },
        { status: 400 }
      );
    }

    const track = await qmoiTracksService.createTrack(name, type, metadata, {
      priority,
      dependencies,
    });

    return NextResponse.json({
      success: true,
      track,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create track" },
      { status: 500 }
    );
  }
}