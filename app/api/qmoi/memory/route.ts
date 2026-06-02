import { NextRequest, NextResponse } from "next/server";
import { qmoiMemoryService } from "@/lib/auth/memory";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get("action");
    const userId = searchParams.get("userId");
    const key = searchParams.get("key");
    const category = searchParams.get("category");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId is required" },
        { status: 400 }
      );
    }

    if (action === "get_all_memory") {
      const result = await qmoiMemoryService.getAllMemory(userId, category || undefined);
      return NextResponse.json(result);
    }

    if (action === "retrieve_memory") {
      if (!key) {
        return NextResponse.json(
          { success: false, error: "key is required for retrieve_memory" },
          { status: 400 }
        );
      }
      const result = await qmoiMemoryService.retrieveMemory(userId, key);
      return NextResponse.json(result);
    }

    if (action === "get_preferences") {
      const result = await qmoiMemoryService.getAllMemory(userId, "preference");
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { success: false, error: "Invalid action or missing parameters" },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userId, key, value, category, sessionId, expiresAt } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId is required" },
        { status: 400 }
      );
    }

    switch (action) {
      case "store_memory": {
        if (!key) {
          return NextResponse.json(
            { success: false, error: "key is required for store_memory" },
            { status: 400 }
          );
        }
        const result = await qmoiMemoryService.storeMemory(
          userId,
          key,
          value,
          category || "context",
          expiresAt ? new Date(expiresAt) : undefined
        );
        return NextResponse.json(result);
      }
      case "delete_memory": {
        if (!key) {
          return NextResponse.json(
            { success: false, error: "key is required for delete_memory" },
            { status: 400 }
          );
        }
        const result = await qmoiMemoryService.deleteMemory(userId, key);
        return NextResponse.json(result);
      }
      case "clear_all_memory": {
        const result = await qmoiMemoryService.clearAllMemory(userId);
        return NextResponse.json(result);
      }
      case "create_context": {
        if (!sessionId) {
          return NextResponse.json(
            { success: false, error: "sessionId is required for create_context" },
            { status: 400 }
          );
        }
        const result = await qmoiMemoryService.createContext(userId, sessionId);
        return NextResponse.json({ success: true, context: result });
      }
      default:
        return NextResponse.json(
          { success: false, error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
