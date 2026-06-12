import { NextRequest, NextResponse } from "next/server";
import { emailService } from "@/lib/email/service";
import { prisma } from "@/lib/db/prisma";
import { log as logger } from "@/lib/logger";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username } = body;

    if (!username) {
      return NextResponse.json({ success: false, error: "Username or recovery identifier is required." }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email: username }],
      },
      select: { id: true, email: true, username: true },
    });

    if (user?.email) {
      await emailService.sendNotification(
        user.email,
        "QMOI Account Recovery Information",
        `Hello ${user.username},\n\nWe received a recovery request for your QMOI account. Your registered email is linked to your user profile and recovery instructions were prepared. If you did not request this, please ignore this message or contact support.`,
      );
    }

    return NextResponse.json({
      success: true,
      message: "If this account exists, recovery instructions have been sent to the registered contact.",
    });
  } catch (error) {
    logger.error("Forgot-email error:", error);
    return NextResponse.json({
      success: false,
      error: "Unable to process email recovery request.",
      message: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 });
  }
}
