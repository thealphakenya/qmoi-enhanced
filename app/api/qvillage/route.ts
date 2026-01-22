/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { QMOIService } from "@/lib/qmoi-service";

export async function GET(_req: NextRequest) {
  return NextResponse.json({
    name: "QVillage Social API",
    version: "1.2.0",
    features: [
      "communities",
      "projects",
      "messaging",
      "events",
      "reputation",
      "marketplace",
      "portfolio",
    ],
    active_communities: 1247,
    active_users: 8942,
    description: "Connected community platform for creators and developers",
    status: "operational",
  });
}

export async function POST(_req: NextRequest) {
  try {
    const body = (await _req.json()) as any;

    const {
      action = "explore",
      query = "",
      userId = "anonymous",
      sessionId = `session-${Date.now()}`,
    } = body;

    // Generate QVillage response based on action
    const response = await QMOIService.generateQVillageResponse(
      action === "search" ? query : action,
    );

    return NextResponse.json({
      ...response,
      social: true,
      community_features: [
        "messaging",
        "projects",
        "events",
        "reputation",
        "communities",
        "marketplace",
      ],
      trending: {
        topics: [
          "NFT Gaming",
          "Quantum Computing",
          "Sustainable Design",
          "AI Art",
        ],
        creators: 156,
        projects: 342,
      },
    });
  } catch (error) {
    console.error("QVillage error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 },
    );
  }
}
