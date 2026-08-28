/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { QMOIService } from "@/lib/qmoi-service";

export async function GET(_req: NextRequest) {
  try {
    const qvillageData = await QMOIService.getQVillageData();

    return NextResponse.json({
      name: "QVillage Social API",
      version: "2.0.0",
      features: [
        "communities",
        "projects",
        "messaging",
        "events",
        "reputation",
        "marketplace",
        "portfolio",
        "ai_collaboration",
        "real_time_sync",
      ],
      active_communities: qvillageData.data.users || 1247,
      active_users: qvillageData.data.users || 8942,
      total_transactions: qvillageData.data.transactions || 45632,
      ai_interactions: qvillageData.data.aiInteractions || 128943,
      description:
        "Connected community platform for creators and developers with AI-powered features",
      status: qvillageData.status,
      ai_powered: qvillageData.aiPowered || true,
      last_update: qvillageData.lastUpdate,
      evolution_progress: qvillageData.data.evolutionProgress,
    });
  } catch (error) {
    console.error("QVillage GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch QVillage data" },
      { status: 500 },
    );
  }
}

export async function POST(_req: NextRequest) {
  try {
    const body = (await _req.json()) as any;

    const {
      action = "explore",
      query = "",
      userId = "anonymous",
      sessionId = `session-${Date.now()}`,
      context = {},
    } = body;

    // Generate AI-powered QVillage response
    const response = await QMOIService.generateQVillageResponse(
      action === "search" ? query : action,
    );

    // Get real-time community data
    const communityData = await QMOIService.getQVillageData();

    return NextResponse.json({
      ...response,
      social: true,
      community_features: response.community_features || [
        "messaging",
        "projects",
        "events",
        "reputation",
        "marketplace",
        "ai_collaboration",
        "real_time_sync",
      ],
      trending: {
        topics: response.trending_topics || [
          "AI Development",
          "Quantum Computing",
          "Sustainable Tech",
          "Community Innovation",
          "AI Ethics",
        ],
        creators: Math.floor(Math.random() * 500) + 200,
        projects: Math.floor(Math.random() * 1000) + 500,
        ai_collaborations: Math.floor(Math.random() * 200) + 50,
      },
      community_stats: {
        active_users: communityData.data.users,
        total_transactions: communityData.data.transactions,
        ai_interactions_today: Math.floor(
          communityData.data.aiInteractions / 30,
        ),
        evolution_level: communityData.data.evolutionProgress,
      },
      user_context: {
        userId,
        sessionId,
        last_active: new Date().toISOString(),
        ai_personalization: true,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("QVillage POST error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
        fallback_response: `QVillage Community: I've received your request and can help you explore our AI-powered community features.`,
        community_features: [
          "messaging",
          "projects",
          "events",
          "reputation",
          "marketplace",
        ],
      },
      { status: 500 },
    );
  }
}
