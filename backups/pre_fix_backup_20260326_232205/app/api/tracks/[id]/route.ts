// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:09Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// 
import { NextRequest, NextResponse } from "next/server";
import { trackService } from "@/lib/track-service";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const updates: any = {};

    if (typeof body.isPrivate === "boolean") {
      updates.isPrivate = body.isPrivate;
    }

    if (typeof body.status === "string") {
      updates.status = body.status;
    }

    if (typeof body.priority === "string") {
      updates.priority = body.priority;
    }

    if (typeof body.title === "string") {
      updates.title = body.title;
    }

    if (typeof body.summary === "string") {
      updates.summary = body.summary;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid update fields provided" },
        { status: 400 },
      );
    }

    const track = await trackService.updateTrack(id, updates);
    if (!track) {
      return NextResponse.json(
        { success: false, error: "Track not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, track });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const deleted = await trackService.deleteTrack(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Track not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown" },
      { status: 500 },
    );
  }
}
