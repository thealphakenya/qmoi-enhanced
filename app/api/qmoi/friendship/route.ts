// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:10Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { QMOIFriendshipService } from "@/lib/friendship-service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");
    const userId = searchParams.get("userId");
    const friendId = searchParams.get("friendId");

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    if (action === "get") {
      const result = await QMOIFriendshipService.getFriendships(userId);
      return NextResponse.json({
        success: true,
        friendships: result.friendships,
        pendingRequests: result.pendingRequests,
        userProfile: result.userProfile,
      });
    }

    if (action === "list") {
      const result = await QMOIFriendshipService.getFriendships(userId);
      return NextResponse.json({
        success: true,
        friends: result.friendships,
        count: result.friendships.length,
      });
    }

    if (action === "pending") {
      const result = await QMOIFriendshipService.getFriendships(userId);
      return NextResponse.json({
        success: true,
        pending: result.pendingRequests,
        count: result.pendingRequests.length,
      });
    }

    if (action === "stats") {
      const result = await QMOIFriendshipService.getFriendships(userId);
      const stats = {
        totalFriends: result.friendships.length,
        pendingRequests: result.pendingRequests.length,
        socialScore: result.userProfile?.socialScore || 0,
        friendshipCount: result.userProfile?.friendshipCount || 0,
      };
      return NextResponse.json({ success: true, stats });
    }

    if (action === "activity") {
      const voiceHistory =
        (await QMOIFriendshipService.getVoiceHistory?.(userId, 20)) || [];
      return NextResponse.json({ success: true, activity: voiceHistory });
    }

    if (action === "get-friend" && friendId) {
      const result = await QMOIFriendshipService.getFriendships(userId);
      const friend = result.friendships.find(
        // @ts-ignore
        (f) => f.friendId === friendId || f.userId === friendId,
      );
      if (!friend) {
        return NextResponse.json(
          { error: "Friend not found" },
          { status: 404 },
        );
      }
      return NextResponse.json({ success: true, friend });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Friendship API GET error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      action,
      userId,
      friendId,
      friendProfile,
      customMessage,
      updates,
      friendshipId,
    } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    if (action === "create" && friendId) {
      const result = await QMOIFriendshipService.createFriendship({
        userId,
        friendId,
        initialMessage: customMessage,
      });
      return NextResponse.json(result);
    }

    if (action === "accept" && friendshipId) {
      const result = await QMOIFriendshipService.acceptFriendship(
        friendshipId,
        userId,
      );
      return NextResponse.json(result);
    }

    if (action === "update" && friendshipId && updates) {
      const result = await QMOIFriendshipService.updateFriendship(
        friendshipId,
        updates,
      );
      return NextResponse.json(result);
    }

    if (action === "delete" && friendshipId) {
      const result = await QMOIFriendshipService.deleteFriendship(friendshipId);
      return NextResponse.json(result);
    }

    if (action === "identify-user" && friendProfile) {
      const userProfile =
        await QMOIFriendshipService.identifyUser(friendProfile);
      return NextResponse.json({ success: true, userProfile });
    }

    if (action === "get-recommendations") {
      const recommendations =
        await QMOIFriendshipService.getSocialRecommendations(userId);
      return NextResponse.json({ success: true, recommendations });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Friendship API POST error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 },
    );
  }
}
