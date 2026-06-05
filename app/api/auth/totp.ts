import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/db/prisma";
import { authService } from "../../../lib/auth/service";
import crypto from 'crypto';
import logger from "@/lib/logger";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Generate TOTP secret and QR code setup
export async function GET(req: NextRequest) {
  try {
    // Get user from auth token
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = authService.decodeToken(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    // Check if user already has TOTP enabled
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        twoFactorEnabled: true,
        totpSecret: true,
        totpBackupCodes: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    if (user.twoFactorEnabled) {
      return NextResponse.json(
        { success: false, error: "TOTP is already enabled for this account" },
        { status: 400 }
      );
    }

    // Generate new TOTP secret
    const secret = crypto.randomBytes(32).toString('hex').toUpperCase();
    const issuer = 'QMOI Enhanced';
    const accountName = user.email;

    // Generate QR code URL (otpauth:// format)
    const otpauthUrl = `otpauth://totp/${issuer}:${accountName}?secret=${secret}&issuer=${issuer}&algorithm=SHA1&digits=6&period=30`;

    // Generate backup codes
    const backupCodes = [];
    for (let i = 0; i < 10; i++) {
      backupCodes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
    }

    // Store TOTP secret pending verification via user-provided code
    await prisma.user.update({
      where: { id: user.id },
      data: {
        totpSecret: secret,
        totpBackupCodes: JSON.stringify(backupCodes),
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        username: user.email,
        action: 'totp_setup_init',
        resource: 'auth',
        details: JSON.stringify({
          userAgent: req.headers.get('user-agent'),
          ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
        }),
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
        riskLevel: 'medium',
        status: 'success',
      } as any,
    });

    return NextResponse.json({
      success: true,
      message: "TOTP setup initialized",
      totp: {
        secret,
        otpauthUrl,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauthUrl)}`,
        backupCodes,
      },
      instructions: {
        step1: "Install an authenticator app (Google Authenticator, Authy, etc.)",
        step2: "Scan the QR code or manually enter the secret key",
        step3: "Enter the 6-digit code from your app to verify setup",
        step4: "Save your backup codes in a secure location",
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('TOTP GET error:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to initialize TOTP setup",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// Verify and enable TOTP
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, action } = body;

    // Get user from auth token
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = authService.decodeToken(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        twoFactorEnabled: true,
        totpSecret: true,
        totpBackupCodes: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    if (action === 'verify') {
      if (!code) {
        return NextResponse.json(
          { success: false, error: "Verification code is required" },
          { status: 400 }
        );
      }

      if (!user.totpSecret) {
        return NextResponse.json(
          { success: false, error: "TOTP setup not initialized. Please setup TOTP first." },
          { status: 400 }
        );
      }

      // Verify TOTP code
      const isValid = verifyTOTP(user.totpSecret, code);

      if (!isValid) {
        // Create failed verification audit log
        await prisma.auditLog.create({
          data: {
            userId: user.id,
            username: user.email,
            action: 'totp_verify_failed',
            resource: 'auth',
            details: JSON.stringify({
              userAgent: req.headers.get('user-agent'),
              ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
            }),
            ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
            riskLevel: 'high',
            status: 'failure',
          } as any,
        });

        return NextResponse.json(
          { success: false, error: "Invalid TOTP code" },
          { status: 400 }
        );
      }

      // Enable TOTP
      await prisma.user.update({
        where: { id: user.id },
        data: { twoFactorEnabled: true },
      });

      // Create success audit log
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          username: user.email,
          action: 'totp_enabled',
          resource: 'auth',
          details: JSON.stringify({
            userAgent: req.headers.get('user-agent'),
            ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
          }),
          ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
          riskLevel: 'medium',
          status: 'success',
        } as any,
      });

      return NextResponse.json({
        success: true,
        message: "TOTP enabled successfully",
        backupCodes: JSON.parse(user.totpBackupCodes || '[]'),
        timestamp: new Date().toISOString()
      });

    } else if (action === 'disable') {
      if (!user.twoFactorEnabled) {
        return NextResponse.json(
          { success: false, error: "TOTP is not enabled for this account" },
          { status: 400 }
        );
      }

      // Verify code before disabling
      if (!code) {
        return NextResponse.json(
          { success: false, error: "Current TOTP code is required to disable 2FA" },
          { status: 400 }
        );
      }

      const isValid = verifyTOTP(user.totpSecret || '', code);

      if (!isValid) {
        await prisma.auditLog.create({
          data: {
            userId: user.id,
            username: user.email,
            action: 'totp_disable_failed',
            resource: 'auth',
            details: JSON.stringify({
              userAgent: req.headers.get('user-agent'),
              ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
            }),
            ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
            riskLevel: 'high',
            status: 'failure',
          } as any,
        });

        return NextResponse.json(
          { success: false, error: "Invalid TOTP code" },
          { status: 400 }
        );
      }

      // Disable TOTP
      await prisma.user.update({
        where: { id: user.id },
        data: {
          twoFactorEnabled: false,
          totpSecret: null,
          totpBackupCodes: null,
        },
      });

      // Create audit log
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          username: user.email,
          action: 'totp_disabled',
          resource: 'auth',
          details: JSON.stringify({
            userAgent: req.headers.get('user-agent'),
            ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
          }),
          ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
          riskLevel: 'high',
          status: 'success',
        } as any,
      });

      return NextResponse.json({
        success: true,
        message: "TOTP disabled successfully",
        timestamp: new Date().toISOString()
      });

    } else if (action === 'regenerate-backup') {
      if (!user.twoFactorEnabled) {
        return NextResponse.json(
          { success: false, error: "TOTP must be enabled to regenerate backup codes" },
          { status: 400 }
        );
      }

      // Verify code before regenerating
      if (!code) {
        return NextResponse.json(
          { success: false, error: "Current TOTP code is required to regenerate backup codes" },
          { status: 400 }
        );
      }

      const isValid = verifyTOTP(user.totpSecret || '', code);

      if (!isValid) {
        return NextResponse.json(
          { success: false, error: "Invalid TOTP code" },
          { status: 400 }
        );
      }

      // Generate new backup codes
      const newBackupCodes = [];
      for (let i = 0; i < 10; i++) {
        newBackupCodes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { totpBackupCodes: JSON.stringify(newBackupCodes) },
      });

      // Create audit log
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          username: user.email,
          action: 'totp_backup_regenerate',
          resource: 'auth',
          details: JSON.stringify({
            userAgent: req.headers.get('user-agent'),
            ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
          }),
          ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
          riskLevel: 'medium',
          status: 'success',
        } as any,
      });

      return NextResponse.json({
        success: true,
        message: "Backup codes regenerated successfully",
        backupCodes: newBackupCodes,
        timestamp: new Date().toISOString()
      });

    } else {
      return NextResponse.json(
        { success: false, error: "Invalid action. Supported: verify, disable, regenerate-backup" },
        { status: 400 }
      );
    }

  } catch (error) {
    logger.error('TOTP POST error:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process TOTP request",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// Helper function to verify TOTP code
function verifyTOTP(secret: string, code: string): boolean {
  try {
    // Verify TOTP code using standard HMAC-SHA1 time-based algorithm.
    const timeStep = 30;
    const digits = 6;
    const currentTime = Math.floor(Date.now() / 1000);
    const timeWindow = 1; // Check current and adjacent time windows

    for (let i = -timeWindow; i <= timeWindow; i++) {
      const timeCounter = Math.floor((currentTime + i * timeStep) / timeStep);
      const hmac = crypto.createHmac('sha1', Buffer.from(secret, 'hex'));
      hmac.update(Buffer.from(timeCounter.toString(16).padStart(16, '0'), 'hex'));

      const hash = hmac.digest();
      const offset = hash[hash.length - 1] & 0xf;

      const binary = ((hash[offset] & 0x7f) << 24) |
                     ((hash[offset + 1] & 0xff) << 16) |
                     ((hash[offset + 2] & 0xff) << 8) |
                     (hash[offset + 3] & 0xff);

      const otp = (binary % Math.pow(10, digits)).toString().padStart(digits, '0');

      if (otp === code) {
        return true;
      }
    }

    return false;
  } catch (error) {
    logger.error('TOTP verification error:', error);
    return false;
  }
}
