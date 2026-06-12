import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { authService } from "@/lib/auth/service";
import { log as logger } from "@/lib/logger";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const AUTH_PROFILE_FIELDS = [
  "avatar",
  "bio",
  "timezone",
  "language",
  "website",
  "location",
  "company",
  "jobTitle",
  "socialLinks",
  "stylePreferences",
] as const;

type AuthProfileField = (typeof AUTH_PROFILE_FIELDS)[number];

function parseToken(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7)
    : req.cookies.get("accessToken")?.value;
  return token || null;
}

async function requireAuthenticatedUser(req: NextRequest) {
  const token = parseToken(req);
  if (!token) {
    return null;
  }

  const tokenIsValid = await authService.validateToken(token);
  if (!tokenIsValid) {
    return null;
  }

  const decoded = authService.verifyToken(token);
  if (!decoded?.userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      accountStatus: true,
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
    },
  });

  if (!user || user.accountStatus !== "active") {
    return null;
  }

  return user;
}

function buildProfilePayload(body: any) {
  const profileData: Record<string, unknown> = {};

  AUTH_PROFILE_FIELDS.forEach((field) => {
    if (body[field] !== undefined) {
      if (field === "socialLinks") {
        profileData.socialLinks = typeof body.socialLinks === "string"
          ? body.socialLinks
          : JSON.stringify(body.socialLinks || {});
      } else {
        profileData[field] = body[field];
      }
    }
  });

  return profileData;
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

    return NextResponse.json({
      success: true,
      profile: user.profile || {},
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Auth profile GET error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch profile",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return await PUT(req);
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requireAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const profileData = buildProfilePayload(body);

    if (Object.keys(profileData).length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid profile fields provided" },
        { status: 400 }
      );
    }

    const profile = await prisma.profile.upsert({
      where: { userId: user.id },
      update: profileData,
      create: {
        userId: user.id,
        ...profileData,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        username: user.email,
        action: 'profile_update',
        resource: 'auth_profile',
        details: JSON.stringify({
          updated: Object.keys(profileData),
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
      profile,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Auth profile PUT error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update profile",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
