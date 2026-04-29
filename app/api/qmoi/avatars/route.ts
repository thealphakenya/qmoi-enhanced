import { NextRequest, NextResponse } from "next/server";

const avatars = [
  { id: "avatar-default", name: "Default Avatar", category: "default" },
];

export async function GET(_request: NextRequest) {
  return NextResponse.json({
    success: true,
    avatars,
    total: avatars.length,
    categories: ["default"],
    engines: ["default"],
    qualityLevels: ["standard"],
  });
}

export async function POST(_request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: "Avatar action processed",
    action: "stub",
  });
}
