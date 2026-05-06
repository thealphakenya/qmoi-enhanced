import { NextRequest, NextResponse } from "next/server";

const avatars = [
  { id: "avatar-default", name: "Default Avatar", category: "default" },
];

export async function GET(req: NextRequest) {
  return NextResponse.json({
    success: true,
    avatars,
    total: avatars.length,
    categories: ["default"],
    engines: ["default"],
    qualityLevels: ["standard"],
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, avatarId } = body;

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
        return NextResponse.json({
          success: true,
          message: "Avatar selected successfully",
          selectedAvatar: avatars.find((avatar) => avatar.id === avatarId) || null,
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
  } catch (_error){
    return NextResponse.json(
      {
        success: false,
        _error: _error instanceof Error ? _error.message : "Unknown _error",
      },
      { status: 500 },
    );
  }
}
