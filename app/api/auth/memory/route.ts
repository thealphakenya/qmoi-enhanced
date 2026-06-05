import { NextRequest, NextResponse } from "next/server";
import { qmoiMemoryService } from "@/lib/auth/memory";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userId, key, value, category, sessionId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    switch (action) {
      case "store_memory":
        if (!key) {
          return NextResponse.json(
            { error: "key is required for store_memory action" },
            { status: 400 }
          );
        }
        const storeResult = await qmoiMemoryService.storeMemory(
          userId,
          key,
          value,
          category || "context"
        );
        return NextResponse.json(storeResult);

      case "retrieve_memory":
        if (!key) {
          return NextResponse.json(
            { error: "key is required for retrieve_memory action" },
            { status: 400 }
          );
        }
        const getResult = await qmoiMemoryService.retrieveMemory(userId, key);
        return NextResponse.json(getResult);

      case "get_all_memory":
        const allResult = await qmoiMemoryService.getAllMemory(userId, category);
        return NextResponse.json(allResult);

      case "delete_memory":
        if (!key) {
          return NextResponse.json(
            { error: "key is required for delete_memory action" },
            { status: 400 }
          );
        }
        const deleteResult = await qmoiMemoryService.deleteMemory(userId, key);
        return NextResponse.json(deleteResult);

      case "clear_all_memory":
        const clearResult = await qmoiMemoryService.clearAllMemory(userId);
        return NextResponse.json(clearResult);

      case "get_preferences":
        const prefsResult = await qmoiMemoryService.getUserPreferences(userId);
        return NextResponse.json({ success: true, preferences: prefsResult });

      case "get_role":
        const roleResult = await qmoiMemoryService.getUserRole(userId);
        return NextResponse.json({ success: true, role: roleResult });

      case "create_context":
        if (!sessionId) {
          return NextResponse.json(
            { error: "sessionId is required for create_context action" },
            { status: 400 }
          );
        }
        const contextResult = await qmoiMemoryService.createContext(userId, sessionId);
        return NextResponse.json({ success: true, context: contextResult });

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error?.("Memory service error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get("action");
    const userId = searchParams.get("userId");
    const key = searchParams.get("key");
    const category = searchParams.get("category");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    if (action === "get_all_memory") {
      const result = await qmoiMemoryService.getAllMemory(userId, category || undefined);
      return NextResponse.json(result);
    }

    if (action === "retrieve_memory" && key) {
      const result = await qmoiMemoryService.retrieveMemory(userId, key);
      return NextResponse.json(result);
    }

    if (action === "get_preferences") {
      const result = await qmoiMemoryService.getUserPreferences(userId);
      return NextResponse.json({ success: true, preferences: result });
    }

    if (action === "get_role") {
      const result = await qmoiMemoryService.getUserRole(userId);
      return NextResponse.json({ success: true, role: result });
    }

    return NextResponse.json(
      { error: "Invalid action or missing parameters" },
      { status: 400 }
    );
  } catch (error) {
    console.error?.("Memory service error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
