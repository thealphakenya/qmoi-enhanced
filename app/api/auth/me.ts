import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/db/prisma";
import { authService } from "../../../lib/auth/service";
import logger from "../../../lib/logger";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    // Get user from auth token or secure cookie
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.substring(7)
      : req.cookies.get('accessToken')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = authService.decodeToken(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    // Get comprehensive user information
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        emailVerified: true,
        twoFactorEnabled: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        profile: {
          select: {
            avatar: true,
            bio: true,
            timezone: true,
            language: true,
            website: true,
            location: true,
            company: true,
            jobTitle: true,
            socialLinks: true,
          },
        },
        wallets: {
          select: {
            id: true,
            balance: true,
            currency: true,
            isPrimary: true,
          },
          orderBy: { isPrimary: 'desc' },
        },
        _count: {
          select: {
            transactions: true,
            mediaTasks: true,
            auditLogs: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { success: false, error: "Account is deactivated" },
        { status: 403 }
      );
    }

    // Get recent activity (last 10 audit logs)
    const recentActivity = await prisma.auditLog.findMany({
      where: { userId: decoded.userId },
      select: {
        id: true,
        action: true,
        resource: true,
        createdAt: true,
        status: true,
        riskLevel: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // Calculate account statistics
    const stats = {
      totalTransactions: user._count.transactions,
      totalMediaTasks: user._count.mediaTasks,
      totalAuditLogs: user._count.auditLogs,
      accountAge: Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)), // days
      lastActivity: user.lastLoginAt,
    };

    // Update last activity
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Create audit log for profile access
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        username: user.email,
        action: 'profile_access',
        resource: 'auth',
        details: JSON.stringify({
          userAgent: req.headers.get('user-agent'),
          ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
        }),
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
        riskLevel: 'low',
        status: 'success',
      } as any,
    });

    return NextResponse.json({
      success: true,
      message: "User profile retrieved successfully",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        role: user.role,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        twoFactorEnabled: user.twoFactorEnabled,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        profile: user.profile,
        wallets: user.wallets,
        stats,
        recentActivity,
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Auth me GET error:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve user profile",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, ...updateData } = body;

    // Get user from auth token or secure cookie
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.substring(7)
      : req.cookies.get('accessToken')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = authService.decodeToken(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    if (action === 'update-profile') {
      const {
        firstName,
        lastName,
        username,
        bio,
        timezone,
        language,
        website,
        location,
        company,
        jobTitle,
        socialLinks,
      } = updateData;

      // Validate username uniqueness if provided
      if (username) {
        const existingUser = await prisma.user.findFirst({
          where: {
            username,
            id: { not: user.id },
          },
        });

        if (existingUser) {
          return NextResponse.json(
            { success: false, error: "Username is already taken" },
            { status: 400 }
          );
        }
      }

      // Update user basic info
      const updateUserData: any = {};
      if (firstName !== undefined) updateUserData.firstName = firstName;
      if (lastName !== undefined) updateUserData.lastName = lastName;
      if (username !== undefined) updateUserData.username = username;

      if (Object.keys(updateUserData).length > 0) {
        await prisma.user.update({
          where: { id: user.id },
          data: updateUserData,
        });
      }

      // Update or create profile
      const profileData: any = {};
      if (bio !== undefined) profileData.bio = bio;
      if (timezone !== undefined) profileData.timezone = timezone;
      if (language !== undefined) profileData.language = language;
      if (website !== undefined) profileData.website = website;
      if (location !== undefined) profileData.location = location;
      if (company !== undefined) profileData.company = company;
      if (jobTitle !== undefined) profileData.jobTitle = jobTitle;
      if (socialLinks !== undefined) profileData.socialLinks = JSON.stringify(socialLinks);

      if (Object.keys(profileData).length > 0) {
        await prisma.profile.upsert({
          where: { userId: user.id },
          update: profileData,
          create: {
            userId: user.id,
            ...profileData,
          },
        });
      }

      // Create audit log
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          username: user.email,
          action: 'profile_update',
          resource: 'auth',
          details: JSON.stringify({
            updatedFields: Object.keys({ ...updateUserData, ...profileData }),
            userAgent: req.headers.get('user-agent'),
            ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
          }),
          ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
          riskLevel: 'low',
          status: 'success',
        } as any,
      });

      return NextResponse.json({
        success: true,
        message: "Profile updated successfully",
        timestamp: new Date().toISOString()
      });

    } else if (action === 'change-password') {
      const { currentPassword, newPassword } = updateData;

      if (!currentPassword || !newPassword) {
        return NextResponse.json(
          { success: false, error: "Current password and new password are required" },
          { status: 400 }
        );
      }

      // Verify current password using stored hash from authProfile or legacy user record
      const authProfile = await prisma.authProfile.findUnique({
        where: { userId: user.id },
        select: { passwordHash: true },
      });

      const userRecord = await prisma.user.findUnique({
        where: { id: user.id },
        select: { passwordHash: true, password: true },
      });

      const currentHash = authProfile?.passwordHash || userRecord?.passwordHash || userRecord?.password || '';
      const isValidCurrentPassword = currentHash
        ? await authService.verifyPassword(currentPassword, currentHash)
        : false;

      if (!isValidCurrentPassword) {
        await prisma.auditLog.create({
          data: {
            userId: user.id,
            username: user.email,
            action: 'password_change_failed',
            resource: 'auth',
            details: JSON.stringify({
              reason: 'invalid_current_password',
              userAgent: req.headers.get('user-agent'),
              ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
            }),
            ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
            riskLevel: 'high',
            status: 'failure',
          } as any,
        });

        return NextResponse.json(
          { success: false, error: "Current password is incorrect" },
          { status: 400 }
        );
      }

      // Update password
      const hashedPassword = await authService.hashPassword(newPassword);
      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: hashedPassword },
      });

      // Create audit log
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          username: user.email,
          action: 'password_change',
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
        message: "Password changed successfully",
        timestamp: new Date().toISOString()
      });

    } else {
      return NextResponse.json(
        { success: false, error: "Invalid action. Supported: update-profile, change-password" },
        { status: 400 }
      );
    }

  } catch (error) {
    logger.error('Auth me POST error:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update profile",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
