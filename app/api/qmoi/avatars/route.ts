import { NextRequest, NextResponse } from "next/server";
import {
  getAvatarSelection,
  setAvatarSelection,
  getRequestUserId,
} from "@/lib/qmoi/persistence";

const avatars = [
  { id: "avatar-default", name: "Default Avatar", category: "default" },
  { id: "avatar-creative", name: "Creative Avatar", category: "creative" },
  { id: "avatar-professional", name: "Professional Avatar", category: "professional" },
];

export async function GET(req: NextRequest) {
  const userId = getRequestUserId(req) || new URL(req.url).searchParams.get("userId");
  const selectedAvatar = userId ? await getAvatarSelection(userId) : null;

  return NextResponse.json({
    success: true,
    avatars,
    total: avatars.length,
    categories: Array.from(new Set(avatars.map((avatar) => avatar.category))),
    engines: ["default"],
    qualityLevels: ["standard"],
    selectedAvatar,
  });
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid JSON payload" },
      { status: 400 },
    );
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json(
      { success: false, error: "Request body must be an object" },
      { status: 400 },
    );
  }

  const payload = body as Record<string, unknown>;
  const action = typeof payload.action === "string" ? payload.action : null;
  const avatarId = typeof payload.avatarId === "string" ? payload.avatarId : null;
  const userId = getRequestUserId(req, payload);

  if (!action) {
    return NextResponse.json(
      { success: false, error: "Avatar action is required" },
      { status: 400 },
    );
  }

  switch (action) {
    case "select":
      if (!avatarId) {
        return NextResponse.json(
          { success: false, error: "avatarId is required for select action" },
          { status: 400 },
        );
      }
      if (!userId) {
        return NextResponse.json(
          { success: false, error: "Authentication or explicit userId is required to select an avatar" },
          { status: 401 },
        );
      }

      const matchingAvatar = avatars.find((avatar) => avatar.id === avatarId) || null;
      if (!matchingAvatar) {
        return NextResponse.json(
          { success: false, error: `Avatar not found: ${avatarId}` },
          { status: 404 },
        );
      }

      await setAvatarSelection(userId, avatarId);
      return NextResponse.json({
        success: true,
        message: "Avatar selected successfully",
        selectedAvatar: matchingAvatar,
      });

    case "list":
      return NextResponse.json({
        success: true,
        message: "Avatar list retrieved successfully",
        avatars,
      });

    default:
      return NextResponse.json(
        { success: false, error: `Unsupported avatar action: ${action}` },
        { status: 400 },
      );
  }
}
