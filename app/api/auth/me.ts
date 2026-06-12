import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { authService } from "@/lib/auth/service";
import { log as logger } from "@/lib/logger";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type AuthenticatedUser = {
  id: string;
  email: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  isActive: boolean;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  profile: {
    avatar?: string | null;
    bio?: string | null;
    timezone?: string | null;
    language?: string | null;
    website?: string | null;
    location?: string | null;
    company?: string | null;
    jobTitle?: string | null;
    socialLinks?: string | null;
    stylePreferences?: any;
  } | null;
  wallets: Array<{
    id: string;
    balance: number;
    currency: string;
    isPrimary: boolean;
  }>;
  _count: {
    transactions: number;
    mediaTasks: number;
    auditLogs: number;
  };
};

function parseToken(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  return authHeader?.startsWith('Bearer ')
    ? authHeader.substring(7)
    : req.cookies.get('accessToken')?.value;
}

async function requireAuthenticatedUser(req: NextRequest): Promise<AuthenticatedUser | null> {
  const token = parseToken(req);
  if (!token) return null;

  const isValid = await authService.validateToken(token);
  if (!isValid) return null;

  const decoded = authService.verifyToken(token);
  if (!decoded?.userId) return null;

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
          stylePreferences: true,
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

  if (!user || !user.isActive) {
    return null;
  }

  return user;
}

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const recentActivity = await prisma.auditLog.findMany({
      where: { userId: user.id },
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

    const stats = {
      totalTransactions: user._count.transactions,
      totalMediaTasks: user._count.mediaTasks,
      totalAuditLogs: user._count.auditLogs,
      accountAge: Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)),
      lastActivity: user.lastLoginAt,
    };

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

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
      timestamp: new Date().toISOString(),
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
    const user = await requireAuthenticatedUser(req);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
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

      const profileData: any = {};
      if (bio !== undefined) profileData.bio = bio;
      if (timezone !== undefined) profileData.timezone = timezone;
      if (language !== undefined) profileData.language = language;
      if (website !== undefined) profileData.website = website;
      if (location !== undefined) profileData.location = location;
      if (company !== undefined) profileData.company = company;
      if (jobTitle !== undefined) profileData.jobTitle = jobTitle;
      if (socialLinks !== undefined) profileData.socialLinks = JSON.stringify(socialLinks);
      if (updateData.stylePreferences !== undefined) profileData.stylePreferences = updateData.stylePreferences;

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
        timestamp: new Date().toISOString(),
      });
    }

    if (action === 'change-password') {
      const { currentPassword, newPassword } = updateData;

      if (!currentPassword || !newPassword) {
        return NextResponse.json(
          { success: false, error: "Current password and new password are required" },
          { status: 400 }
        );
      }

      const authProfile = await prisma.authProfile.findUnique({
        where: { userId: user.id },
        select: { passwordHash: true },
      });

      if (!authProfile?.passwordHash) {
        return NextResponse.json(
          { success: false, error: "Unable to verify current password" },
          { status: 400 }
        );
      }

      const isValidCurrentPassword = await authService.verifyPassword(currentPassword, authProfile.passwordHash);

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

      const hashedPassword = await authService.hashPassword(newPassword);
      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: hashedPassword },
      });

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
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action. Supported: update-profile, change-password" },
      { status: 400 }
    );
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
