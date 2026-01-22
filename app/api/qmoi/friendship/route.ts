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

    const friendshipService = QMOIFriendshipService.getInstance();

    if (action === "list") {
      const friends = friendshipService.getFriends(userId);
      return NextResponse.json({
        success: true,
        friends,
        count: friends.length,
      });
    }

    if (action === "pending") {
      const pending = friendshipService.getPendingRequests(userId);
      return NextResponse.json({
        success: true,
        pending,
        count: pending.length,
      });
    }

    if (action === "stats") {
      const stats = friendshipService.getStats(userId);
      return NextResponse.json({ success: true, stats });
    }

    if (action === "activity") {
      const activity = friendshipService.getActivity(userId, 20);
      return NextResponse.json({ success: true, activity });
    }

    if (action === "get-friend" && friendId) {
      const friend = friendshipService.getFriend(userId, friendId);
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
    const { action, userId, friendId, friendProfile, customMessage, updates } =
      body;

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const friendshipService = QMOIFriendshipService.getInstance();

    if (action === "send-request" && friendProfile) {
      const friend = friendshipService.sendFriendRequest(
        userId,
        friendProfile,
        customMessage,
      );
      return NextResponse.json({
        success: true,
        message: "Friend request sent successfully",
        friend,
      });
    }

    if (action === "accept" && friendId) {
      const friend = friendshipService.acceptFriendRequest(userId, friendId);
      if (!friend) {
        return NextResponse.json(
          { error: "Friend request not found" },
          { status: 404 },
        );
      }
      return NextResponse.json({
        success: true,
        message: "Friend request accepted",
        friend,
      });
    }

    if (action === "remove" && friendId) {
      const removed = friendshipService.removeFriend(userId, friendId);
      if (!removed) {
        return NextResponse.json(
          { error: "Friend not found" },
          { status: 404 },
        );
      }
      return NextResponse.json({
        success: true,
        message: "Friend removed successfully",
      });
    }

    if (action === "block" && friendProfile) {
      const blocked = friendshipService.blockUser(userId, friendProfile);
      return NextResponse.json({
        success: true,
        message: "User blocked successfully",
        friend: blocked,
      });
    }

    if (action === "update" && friendId && updates) {
      const updated = friendshipService.updateFriendInfo(
        userId,
        friendId,
        updates,
      );
      if (!updated) {
        return NextResponse.json(
          { error: "Friend not found" },
          { status: 404 },
        );
      }
      return NextResponse.json({
        success: true,
        message: "Friend info updated",
        friend: updated,
      });
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
