import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { log as logger } from "@/lib/logger";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function handleVerification(token: string) {
  if (!token) {
    return NextResponse.json({ success: false, error: "Verification token is required." }, { status: 400 });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerificationExpires: { gt: new Date() },
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid or expired verification token." }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
    });

    return NextResponse.json({ success: true, message: "Email address verified successfully." });
  } catch (error) {
    logger.error("Email verification failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Email verification failed.",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  return handleVerification(token || "");
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  return handleVerification(body?.token || "");
}
