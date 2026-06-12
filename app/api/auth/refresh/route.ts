import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/auth/service";
import { setCookie } from "@/lib/cookies";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : undefined;
  const refreshToken = req.cookies.get("refreshToken")?.value || bearerToken;

  if (!refreshToken) {
    return NextResponse.json(
      { success: false, message: "Refresh token required" },
      { status: 401 }
    );
  }

  const result = await authService.refreshTokens(refreshToken);

  if (!result.success || !result.tokens) {
    return NextResponse.json(
      { success: false, message: result.message || "Unable to refresh session", error: result.error },
      { status: 401 }
    );
  }

  const tokens = result.tokens as { accessToken: string; refreshToken: string };
  const response = NextResponse.json({
    success: true,
    message: "Session refreshed successfully",
    user: result.user,
    tokens,
  });

  setCookie(response, "accessToken", tokens.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60,
    path: "/",
  });

  setCookie(response, "refreshToken", tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });

  return response;
}

export async function GET(req: NextRequest) {
  return POST(req);
}
