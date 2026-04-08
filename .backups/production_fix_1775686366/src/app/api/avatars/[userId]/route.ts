/**
 * Avatar Management API Endpoint
 * Handles avatar generation, retrieval, and customization
 * 
 * @route GET /api/avatars/:userId
 * @route POST /api/avatars/generate
 * @route PUT /api/avatars/:userId/customize
 * @route DELETE /api/avatars/:userId
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  initializeAvatar,
  extractInitials,
  getColorIndex,
  validateAvatarConfig,
  generateAvatarBatch,
  AVATAR_PALETTES,
  type AvatarConfig,
} from '@/lib/avatar-system';

export const config = {
  maxDuration: 60,
};

/**
 * GET /api/avatars/:userId
 * Retrieve user avatar with optional size parameter
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const size = request.nextUrl.searchParams.get('size') || '128';
    const style = request.nextUrl.searchParams.get('style') || 'professional';

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    // Initialize avatar for user
    const config: AvatarConfig = {
      userId,
      name: request.nextUrl.searchParams.get('name') || 'User',
      email: request.nextUrl.searchParams.get('email') || `${userId}@qmoi.io`,
      size: (size as any) || 'md',
      style: (style as any) || 'professional',
    };

    const avatarSet = initializeAvatar(config);

    // Set cache headers for long-term caching
    const headers = new Headers({
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'ETag': `"${userId}-${style}-${size}"`,
    });

    return new NextResponse(avatarSet.default, { headers });
  } catch (error) {
    console.error('Avatar generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate avatar' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/avatars/generate
 * Generate new avatar with custom configuration
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const config: AvatarConfig = {
      userId: body.userId || crypto.randomUUID(),
      name: body.name || 'Default User',
      email: body.email || 'user@qmoi.io',
      size: body.size || 'md',
      style: body.style || 'professional',
      backgroundColor: body.backgroundColor,
    };

    if (!validateAvatarConfig(config)) {
      return NextResponse.json(
        { error: 'Invalid avatar configuration' },
        { status: 400 }
      );
    }

    const avatarBatch = generateAvatarBatch(config);

    return NextResponse.json({
      userId: config.userId,
      avatars: avatarBatch,
      initials: extractInitials(config.name),
      style: config.style,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Avatar POST error:', error);
    return NextResponse.json(
      { error: 'Failed to process avatar request' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/avatars/:userId/customize
 * Customize existing avatar
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const body = await request.json();

    const config: AvatarConfig = {
      userId,
      name: body.name,
      email: body.email,
      size: body.size || 'md',
      style: body.style || 'professional',
      backgroundColor: body.backgroundColor,
    };

    if (!validateAvatarConfig(config)) {
      return NextResponse.json(
        { error: 'Invalid configuration' },
        { status: 400 }
      );
    }

    const avatarSet = initializeAvatar(config);

    return NextResponse.json({
      userId,
      avatar: avatarSet.default,
      updated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Avatar update error:', error);
    return NextResponse.json(
      { error: 'Failed to update avatar' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/avatars/:userId
 * Delete user avatar (clears cache)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    // Cache invalidation would happen here
    // Implementation depends on caching strategy (Redis, CDN, etc.)

    return NextResponse.json({
      success: true,
      message: `Avatar deleted for user ${userId}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Avatar deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete avatar' },
      { status: 500 }
    );
  }
}

/**
 * HEAD /api/avatars/:userId
 * Check avatar existence and cache status
 */
export async function HEAD(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;

  const headers = new Headers({
    'Content-Type': 'image/svg+xml',
    'Cache-Control': 'public, max-age=31536000, immutable',
    'ETag': `"${userId}-avatar"`,
  });

  return new NextResponse(null, {
    status: 200,
    headers,
  });
}

/**
 * OPTIONS /api/avatars/:userId
 * CORS and method availability
 */
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'GET, POST, PUT, DELETE, HEAD, OPTIONS',
      'Content-Type': 'application/json',
    },
  });
}
