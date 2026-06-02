import { NextRequest, NextResponse } from "next/server";
import { authService } from "../../../../lib/auth/service";
import { emailService } from "@/lib/email/service";
import { prisma } from "@/lib/db/prisma";
import { logApiError } from "@/lib/logger";

const USE_DB = Boolean(process.env.DATABASE_URL);
const fallbackUsers = [
  {
    email: 'victor@kwemoi.com',
    username: 'master',
    fullName: 'Victor',
    role: 'master',
    permissions: ['*'],
    password: 'Victor9798!',
    userId: 'master',
  },
  {
    email: 'leah@chebet.com',
    username: 'sister',
    fullName: 'Leah',
    role: 'sister',
    permissions: ['family', 'chat'],
    password: 'Ashlehael',
    userId: 'sister',
  },
];

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { email, username } = await req.json();
    if (!email && !username) {
      return NextResponse.json(
        { success: false, message: "Email or username is required" },
        { status: 400 }
      );
    }

    const identifier = email || username;
    let user: { id: string; email: string; username: string } | null = null;

    if (USE_DB) {
      const authProfile = await prisma.authProfile.findFirst({
        where: {
          OR: [
            { email: identifier },
            { username: identifier },
          ],
        },
      });
      if (authProfile) {
        user = { id: authProfile.userId, email: authProfile.email, username: authProfile.username };
      } else {
        const dbUser = await prisma.user.findFirst({
          where: {
            OR: [
              { email: identifier },
              { username: identifier },
            ],
          },
        });
        if (dbUser) {
          user = { id: dbUser.id, email: dbUser.email, username: dbUser.username };
        }
      }
    } else {
      user = fallbackUsers.find((u) => u.email === identifier || u.username === identifier) || null;
    }

    const resetToken = user
      ? authService.generatePasswordResetToken(user.id, user.email)
      : null;

    if (user) {
      try {
        await emailService.sendPasswordReset(user.email, resetToken as string);
      } catch (emailError) {
        // best-effort email delivery, continue to avoid leaking account existence
        logApiError('POST', '/api/auth/reset-password', emailError as Error, {
          operation: 'password_reset_email',
          email: user.email,
        });
      }
    }

    const responsePayload: any = {
      success: true,
      message: "If that account exists, a password reset link has been sent.",
    };

    if (process.env.NODE_ENV !== 'production') {
      responsePayload.debugToken = resetToken;
    }

    return NextResponse.json(responsePayload);
  } catch (error) {
    logApiError('POST', '/api/auth/reset-password', error as Error, {
      operation: 'password_reset_request',
    });
    return NextResponse.json(
      {
        success: false,
        error: "Password reset request failed",
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
