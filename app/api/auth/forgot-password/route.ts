import { NextRequest, NextResponse } from "next/server";
import { POST as forgotPost } from "../forgot/route";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  return NextResponse.json({
    success: true,
    message: "Use POST to request a password reset at /api/auth/reset-password",
    endpoint: "/api/auth/reset-password",
  });
}

export async function POST(req: NextRequest) {
  return forgotPost(req);
}
