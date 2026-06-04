import { NextRequest, NextResponse } from "next/server";
import { authFallback, authService } from "../../../../lib/auth/service";
import { prisma } from "@/lib/db/prisma";
import { logApiError } from "@/lib/logger";

const USE_DB = Boolean(process.env.DATABASE_URL);

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { token, newPassword } = await req.json();
    if (!token || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Token and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, message: "New password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    const verification = authService.verifyPasswordResetToken(token);
    if (!verification.ok) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired reset token", error: verification.error },
        { status: 400 }
      );
    }

    const { userId } = verification.payload as { userId: string; email?: string };
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Invalid reset payload" },
        { status: 400 }
      );
    }

    if (USE_DB) {
      const authProfile = await prisma.authProfile.findUnique({ where: { userId } });
      if (authProfile) {
        const hashedPassword = await authService.hashPassword(newPassword);
        await prisma.authProfile.update({ where: { userId }, data: { passwordHash: hashedPassword } });
      } else {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
          return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }
        const hashedPassword = await authService.hashPassword(newPassword);
        await prisma.user.update({ where: { id: userId }, data: { passwordHash: hashedPassword } });
      }
    } else {
      const updated = authFallback.updatePassword(userId, newPassword);
      if (!updated) {
        return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
      }
    }

    return NextResponse.json({ success: true, message: "Password has been reset successfully" });
  } catch (error) {
    logApiError('POST', '/api/auth/confirm-reset', error as Error, {
      operation: 'password_reset_confirm',
    });
    return NextResponse.json(
      {
        success: false,
        error: "Password reset failed",
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
