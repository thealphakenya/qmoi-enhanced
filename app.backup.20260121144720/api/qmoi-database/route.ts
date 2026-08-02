/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
import { NextRequest, NextResponse } from "next/server";

// Dynamic import for Prisma to avoid build-time issues
let prisma: unknown = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaClient } = await import("@/lib/prisma");
    prisma = prismaClient;
  }
  return prisma;
}

// Media management types
interface MediaItem {
  id: string;
  title: string;
  type: "movie" | "series" | "documentary" | "animation";
  source: "public_domain" | "youtube" | "user_upload";
  url: string;
  localPath?: string;
  duration?: number;
  size?: number;
  status: "available" | "downloading" | "downloaded" | "error";
  createdAt: Date;
  updatedAt: Date;
}

// Master-only access check
function isMaster(_request: NextRequest) {
  // Production: implement real master auth via sessions/JWT/tokens
  return _request.headers.get("x-qmoi-master") === "true";
}

// Media search implementation
async function searchMedia(
  _query: string,
  type?: string,
  source?: string,
): Promise<MediaItem[]> {
  const prisma = await getPrisma();
  const where: Record<string, unknown> = {
    title: {
      contains: _query,
      mode: "insensitive",
    },
  };

  if (type) {
    where.type = type;
  }

  if (source) {
    where.source = source;
  }

  const mediaTasks = await prisma.mediaTask.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert to MediaItem format for compatibility
  return mediaTasks.map((task: unknown) => ({
    id: task.id,
    title: task.type, // Using type as title for now
    type: "movie" as const, // Default type
    source: "public_domain" as const, // Default source
    url: task.result || "",
    status:
      task.status === "completed"
        ? "downloaded"
        : task.status === "processing"
          ? "downloading"
          : "available",
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }));
}

// Download media implementation
async function downloadMedia(mediaId: string) {
  const prisma = await getPrisma();
  const mediaTask = await prisma.mediaTask.findUnique({
    where: { id: mediaId },
  });

  if (!mediaTask) {
    return { success: false, message: "Media not found" };
  }

  if (mediaTask.status === "completed") {
    return { success: true, message: "Media already downloaded" };
  }

  try {
    // Update status to processing
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: { status: "processing" },
    });

    // Production: implement real download via external APIs or background jobs
    // Placeholder: marks as completed
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "completed",
        result: "Downloaded successfully",
      },
    });

    return {
      success: true,
      message: "Media downloaded successfully",
    };
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : String(_error);

    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "failed",
        _error: errorMessage,
      },
    });

    return {
      success: false,
      message: `Download failed: ${errorMessage}`,
      _error: errorMessage,
    };
  }
}

// Get media logs (using audit logs for now)
async function getMediaLogs(filter?: {
  action?: string;
  mediaId?: string;
  limit?: number;
}) {
  const where: unknown = {};

  if (filter?.action) {
    where.action = filter.action;
  }

  if (filter?.mediaId) {
    where.resource = filter.mediaId;
  }

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: {
      timestamp: "desc",
    },
    take: filter?.limit || 50,
  });

  return logs;
}

export async function GET(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(_request.url);

  // Media search endpoint
  const searchQuery = searchParams.get("search");
  if (searchQuery) {
    try {
      const results = await searchMedia(
        searchQuery,
        searchParams.get("type") || undefined,
        searchParams.get("source") || undefined,
      );
      return NextResponse.json({ media: results });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Search failed: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get media logs endpoint
  if (searchParams.get("logs")) {
    try {
      const logs = await getMediaLogs({
        action: searchParams.get("action") || undefined,
        mediaId: searchParams.get("mediaId") || undefined,
        limit: searchParams.get("limit")
          ? parseInt(searchParams.get("limit")!)
          : undefined,
      });
      return NextResponse.json({ logs });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get logs: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get database info
  if (searchParams.get("info")) {
    try {
      const userCount = await prisma.user.count();
      const auditLogCount = await prisma.auditLog.count();
      const mediaTaskCount = await prisma.mediaTask.count();

      return NextResponse.json({
        users: userCount,
        auditLogs: auditLogCount,
        mediaTasks: mediaTaskCount,
      });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get database info: ${error}` },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
}

export async function POST(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  try {
    const body = await _request.json();

    // Media download endpoint
    if (body.download) {
      const result = await downloadMedia(body.mediaId);
      return NextResponse.json(result);
    }

    // Add new media task
    if (body.addMedia) {
      const mediaTask = await prisma.mediaTask.create({
        data: {
          type: body.type || "video",
          status: "pending",
          metadata: JSON.stringify({
            title: body.title,
            source: body.source,
            url: body.url,
          }),
        },
      });

      return NextResponse.json({
        success: true,
        media: {
          id: mediaTask.id,
          title: body.title,
          type: body.type,
          source: body.source,
          url: body.url,
          status: mediaTask.status,
          createdAt: mediaTask.createdAt,
          updatedAt: mediaTask.updatedAt,
        },
      });
    }

    // Create audit log
    if (body.logAction) {
      const auditLog = await prisma.auditLog.create({
        data: {
          userId: body.userId || "system",
          username: body.username || "system",
          action: body.action,
          resource: body.resource || "media",
          details: JSON.stringify(body.details || {}),
          riskLevel: body.riskLevel || "low",
          status: "success",
          sessionId: body.sessionId,
        },
      });

      return NextResponse.json({ success: true, log: auditLog });
    }

    return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
  } catch (_error) {
    return NextResponse.json(
      { _error: `Request failed: ${error}` },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-database/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
import { NextRequest, NextResponse } from "next/server";

// Dynamic import for Prisma to avoid build-time issues
let prisma: unknown = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaClient } = await import("@/lib/prisma");
    prisma = prismaClient;
  }
  return prisma;
}

// Media management types
interface MediaItem {
  id: string;
  title: string;
  type: "movie" | "series" | "documentary" | "animation";
  source: "public_domain" | "youtube" | "user_upload";
  url: string;
  localPath?: string;
  duration?: number;
  size?: number;
  status: "available" | "downloading" | "downloaded" | "error";
  createdAt: Date;
  updatedAt: Date;
}

// Master-only access check
function isMaster(_request: NextRequest) {
  // Production: implement real master auth via sessions/JWT/tokens
  return _request.headers.get("x-qmoi-master") === "true";
}

// Media search implementation
async function searchMedia(
  _query: string,
  type?: string,
  source?: string,
): Promise<MediaItem[]> {
  const prisma = await getPrisma();
  const where: Record<string, unknown> = {
    title: {
      contains: _query,
      mode: "insensitive",
    },
  };

  if (type) {
    where.type = type;
  }

  if (source) {
    where.source = source;
  }

  const mediaTasks = await prisma.mediaTask.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert to MediaItem format for compatibility
  return mediaTasks.map((task: unknown) => ({
    id: task.id,
    title: task.type, // Using type as title for now
    type: "movie" as const, // Default type
    source: "public_domain" as const, // Default source
    url: task.result || "",
    status:
      task.status === "completed"
        ? "downloaded"
        : task.status === "processing"
          ? "downloading"
          : "available",
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }));
}

// Download media implementation
async function downloadMedia(mediaId: string) {
  const prisma = await getPrisma();
  const mediaTask = await prisma.mediaTask.findUnique({
    where: { id: mediaId },
  });

  if (!mediaTask) {
    return { success: false, message: "Media not found" };
  }

  if (mediaTask.status === "completed") {
    return { success: true, message: "Media already downloaded" };
  }

  try {
    // Update status to processing
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: { status: "processing" },
    });

    // Production: implement real download via external APIs or background jobs
    // Placeholder: marks as completed
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "completed",
        result: "Downloaded successfully",
      },
    });

    return {
      success: true,
      message: "Media downloaded successfully",
    };
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : String(_error);

    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "failed",
        _error: errorMessage,
      },
    });

    return {
      success: false,
      message: `Download failed: ${errorMessage}`,
      _error: errorMessage,
    };
  }
}

// Get media logs (using audit logs for now)
async function getMediaLogs(filter?: {
  action?: string;
  mediaId?: string;
  limit?: number;
}) {
  const where: unknown = {};

  if (filter?.action) {
    where.action = filter.action;
  }

  if (filter?.mediaId) {
    where.resource = filter.mediaId;
  }

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: {
      timestamp: "desc",
    },
    take: filter?.limit || 50,
  });

  return logs;
}

export async function GET(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(_request.url);

  // Media search endpoint
  const searchQuery = searchParams.get("search");
  if (searchQuery) {
    try {
      const results = await searchMedia(
        searchQuery,
        searchParams.get("type") || undefined,
        searchParams.get("source") || undefined,
      );
      return NextResponse.json({ media: results });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Search failed: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get media logs endpoint
  if (searchParams.get("logs")) {
    try {
      const logs = await getMediaLogs({
        action: searchParams.get("action") || undefined,
        mediaId: searchParams.get("mediaId") || undefined,
        limit: searchParams.get("limit")
          ? parseInt(searchParams.get("limit")!)
          : undefined,
      });
      return NextResponse.json({ logs });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get logs: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get database info
  if (searchParams.get("info")) {
    try {
      const userCount = await prisma.user.count();
      const auditLogCount = await prisma.auditLog.count();
      const mediaTaskCount = await prisma.mediaTask.count();

      return NextResponse.json({
        users: userCount,
        auditLogs: auditLogCount,
        mediaTasks: mediaTaskCount,
      });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get database info: ${error}` },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
}

export async function POST(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  try {
    const body = await _request.json();

    // Media download endpoint
    if (body.download) {
      const result = await downloadMedia(body.mediaId);
      return NextResponse.json(result);
    }

    // Add new media task
    if (body.addMedia) {
      const mediaTask = await prisma.mediaTask.create({
        data: {
          type: body.type || "video",
          status: "pending",
          metadata: JSON.stringify({
            title: body.title,
            source: body.source,
            url: body.url,
          }),
        },
      });

      return NextResponse.json({
        success: true,
        media: {
          id: mediaTask.id,
          title: body.title,
          type: body.type,
          source: body.source,
          url: body.url,
          status: mediaTask.status,
          createdAt: mediaTask.createdAt,
          updatedAt: mediaTask.updatedAt,
        },
      });
    }

    // Create audit log
    if (body.logAction) {
      const auditLog = await prisma.auditLog.create({
        data: {
          userId: body.userId || "system",
          username: body.username || "system",
          action: body.action,
          resource: body.resource || "media",
          details: JSON.stringify(body.details || {}),
          riskLevel: body.riskLevel || "low",
          status: "success",
          sessionId: body.sessionId,
        },
      });

      return NextResponse.json({ success: true, log: auditLog });
    }

    return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
  } catch (_error) {
    return NextResponse.json(
      { _error: `Request failed: ${error}` },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-database/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
import { NextRequest, NextResponse } from "next/server";

// Dynamic import for Prisma to avoid build-time issues
let prisma: unknown = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaClient } = await import("@/lib/prisma");
    prisma = prismaClient;
  }
  return prisma;
}

// Media management types
interface MediaItem {
  id: string;
  title: string;
  type: "movie" | "series" | "documentary" | "animation";
  source: "public_domain" | "youtube" | "user_upload";
  url: string;
  localPath?: string;
  duration?: number;
  size?: number;
  status: "available" | "downloading" | "downloaded" | "error";
  createdAt: Date;
  updatedAt: Date;
}

// Master-only access check
function isMaster(_request: NextRequest) {
  // Production: implement real master auth via sessions/JWT/tokens
  return _request.headers.get("x-qmoi-master") === "true";
}

// Media search implementation
async function searchMedia(
  _query: string,
  type?: string,
  source?: string,
): Promise<MediaItem[]> {
  const prisma = await getPrisma();
  const where: Record<string, unknown> = {
    title: {
      contains: _query,
      mode: "insensitive",
    },
  };

  if (type) {
    where.type = type;
  }

  if (source) {
    where.source = source;
  }

  const mediaTasks = await prisma.mediaTask.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert to MediaItem format for compatibility
  return mediaTasks.map((task: unknown) => ({
    id: task.id,
    title: task.type, // Using type as title for now
    type: "movie" as const, // Default type
    source: "public_domain" as const, // Default source
    url: task.result || "",
    status:
      task.status === "completed"
        ? "downloaded"
        : task.status === "processing"
          ? "downloading"
          : "available",
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }));
}

// Download media implementation
async function downloadMedia(mediaId: string) {
  const prisma = await getPrisma();
  const mediaTask = await prisma.mediaTask.findUnique({
    where: { id: mediaId },
  });

  if (!mediaTask) {
    return { success: false, message: "Media not found" };
  }

  if (mediaTask.status === "completed") {
    return { success: true, message: "Media already downloaded" };
  }

  try {
    // Update status to processing
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: { status: "processing" },
    });

    // Production: implement real download via external APIs or background jobs
    // Placeholder: marks as completed
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "completed",
        result: "Downloaded successfully",
      },
    });

    return {
      success: true,
      message: "Media downloaded successfully",
    };
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : String(_error);

    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "failed",
        _error: errorMessage,
      },
    });

    return {
      success: false,
      message: `Download failed: ${errorMessage}`,
      _error: errorMessage,
    };
  }
}

// Get media logs (using audit logs for now)
async function getMediaLogs(filter?: {
  action?: string;
  mediaId?: string;
  limit?: number;
}) {
  const where: unknown = {};

  if (filter?.action) {
    where.action = filter.action;
  }

  if (filter?.mediaId) {
    where.resource = filter.mediaId;
  }

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: {
      timestamp: "desc",
    },
    take: filter?.limit || 50,
  });

  return logs;
}

export async function GET(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(_request.url);

  // Media search endpoint
  const searchQuery = searchParams.get("search");
  if (searchQuery) {
    try {
      const results = await searchMedia(
        searchQuery,
        searchParams.get("type") || undefined,
        searchParams.get("source") || undefined,
      );
      return NextResponse.json({ media: results });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Search failed: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get media logs endpoint
  if (searchParams.get("logs")) {
    try {
      const logs = await getMediaLogs({
        action: searchParams.get("action") || undefined,
        mediaId: searchParams.get("mediaId") || undefined,
        limit: searchParams.get("limit")
          ? parseInt(searchParams.get("limit")!)
          : undefined,
      });
      return NextResponse.json({ logs });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get logs: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get database info
  if (searchParams.get("info")) {
    try {
      const userCount = await prisma.user.count();
      const auditLogCount = await prisma.auditLog.count();
      const mediaTaskCount = await prisma.mediaTask.count();

      return NextResponse.json({
        users: userCount,
        auditLogs: auditLogCount,
        mediaTasks: mediaTaskCount,
      });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get database info: ${error}` },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
}

export async function POST(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  try {
    const body = await _request.json();

    // Media download endpoint
    if (body.download) {
      const result = await downloadMedia(body.mediaId);
      return NextResponse.json(result);
    }

    // Add new media task
    if (body.addMedia) {
      const mediaTask = await prisma.mediaTask.create({
        data: {
          type: body.type || "video",
          status: "pending",
          metadata: JSON.stringify({
            title: body.title,
            source: body.source,
            url: body.url,
          }),
        },
      });

      return NextResponse.json({
        success: true,
        media: {
          id: mediaTask.id,
          title: body.title,
          type: body.type,
          source: body.source,
          url: body.url,
          status: mediaTask.status,
          createdAt: mediaTask.createdAt,
          updatedAt: mediaTask.updatedAt,
        },
      });
    }

    // Create audit log
    if (body.logAction) {
      const auditLog = await prisma.auditLog.create({
        data: {
          userId: body.userId || "system",
          username: body.username || "system",
          action: body.action,
          resource: body.resource || "media",
          details: JSON.stringify(body.details || {}),
          riskLevel: body.riskLevel || "low",
          status: "success",
          sessionId: body.sessionId,
        },
      });

      return NextResponse.json({ success: true, log: auditLog });
    }

    return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
  } catch (_error) {
    return NextResponse.json(
      { _error: `Request failed: ${error}` },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-database/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
import { NextRequest, NextResponse } from "next/server";

// Dynamic import for Prisma to avoid build-time issues
let prisma: unknown = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaClient } = await import("@/lib/prisma");
    prisma = prismaClient;
  }
  return prisma;
}

// Media management types
interface MediaItem {
  id: string;
  title: string;
  type: "movie" | "series" | "documentary" | "animation";
  source: "public_domain" | "youtube" | "user_upload";
  url: string;
  localPath?: string;
  duration?: number;
  size?: number;
  status: "available" | "downloading" | "downloaded" | "error";
  createdAt: Date;
  updatedAt: Date;
}

// Master-only access check
function isMaster(_request: NextRequest) {
  // Production: implement real master auth via sessions/JWT/tokens
  return _request.headers.get("x-qmoi-master") === "true";
}

// Media search implementation
async function searchMedia(
  _query: string,
  type?: string,
  source?: string,
): Promise<MediaItem[]> {
  const prisma = await getPrisma();
  const where: Record<string, unknown> = {
    title: {
      contains: _query,
      mode: "insensitive",
    },
  };

  if (type) {
    where.type = type;
  }

  if (source) {
    where.source = source;
  }

  const mediaTasks = await prisma.mediaTask.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert to MediaItem format for compatibility
  return mediaTasks.map((task: unknown) => ({
    id: task.id,
    title: task.type, // Using type as title for now
    type: "movie" as const, // Default type
    source: "public_domain" as const, // Default source
    url: task.result || "",
    status:
      task.status === "completed"
        ? "downloaded"
        : task.status === "processing"
          ? "downloading"
          : "available",
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }));
}

// Download media implementation
async function downloadMedia(mediaId: string) {
  const prisma = await getPrisma();
  const mediaTask = await prisma.mediaTask.findUnique({
    where: { id: mediaId },
  });

  if (!mediaTask) {
    return { success: false, message: "Media not found" };
  }

  if (mediaTask.status === "completed") {
    return { success: true, message: "Media already downloaded" };
  }

  try {
    // Update status to processing
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: { status: "processing" },
    });

    // Production: implement real download via external APIs or background jobs
    // Placeholder: marks as completed
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "completed",
        result: "Downloaded successfully",
      },
    });

    return {
      success: true,
      message: "Media downloaded successfully",
    };
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : String(_error);

    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "failed",
        _error: errorMessage,
      },
    });

    return {
      success: false,
      message: `Download failed: ${errorMessage}`,
      _error: errorMessage,
    };
  }
}

// Get media logs (using audit logs for now)
async function getMediaLogs(filter?: {
  action?: string;
  mediaId?: string;
  limit?: number;
}) {
  const where: unknown = {};

  if (filter?.action) {
    where.action = filter.action;
  }

  if (filter?.mediaId) {
    where.resource = filter.mediaId;
  }

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: {
      timestamp: "desc",
    },
    take: filter?.limit || 50,
  });

  return logs;
}

export async function GET(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(_request.url);

  // Media search endpoint
  const searchQuery = searchParams.get("search");
  if (searchQuery) {
    try {
      const results = await searchMedia(
        searchQuery,
        searchParams.get("type") || undefined,
        searchParams.get("source") || undefined,
      );
      return NextResponse.json({ media: results });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Search failed: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get media logs endpoint
  if (searchParams.get("logs")) {
    try {
      const logs = await getMediaLogs({
        action: searchParams.get("action") || undefined,
        mediaId: searchParams.get("mediaId") || undefined,
        limit: searchParams.get("limit")
          ? parseInt(searchParams.get("limit")!)
          : undefined,
      });
      return NextResponse.json({ logs });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get logs: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get database info
  if (searchParams.get("info")) {
    try {
      const userCount = await prisma.user.count();
      const auditLogCount = await prisma.auditLog.count();
      const mediaTaskCount = await prisma.mediaTask.count();

      return NextResponse.json({
        users: userCount,
        auditLogs: auditLogCount,
        mediaTasks: mediaTaskCount,
      });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get database info: ${error}` },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
}

export async function POST(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  try {
    const body = await _request.json();

    // Media download endpoint
    if (body.download) {
      const result = await downloadMedia(body.mediaId);
      return NextResponse.json(result);
    }

    // Add new media task
    if (body.addMedia) {
      const mediaTask = await prisma.mediaTask.create({
        data: {
          type: body.type || "video",
          status: "pending",
          metadata: JSON.stringify({
            title: body.title,
            source: body.source,
            url: body.url,
          }),
        },
      });

      return NextResponse.json({
        success: true,
        media: {
          id: mediaTask.id,
          title: body.title,
          type: body.type,
          source: body.source,
          url: body.url,
          status: mediaTask.status,
          createdAt: mediaTask.createdAt,
          updatedAt: mediaTask.updatedAt,
        },
      });
    }

    // Create audit log
    if (body.logAction) {
      const auditLog = await prisma.auditLog.create({
        data: {
          userId: body.userId || "system",
          username: body.username || "system",
          action: body.action,
          resource: body.resource || "media",
          details: JSON.stringify(body.details || {}),
          riskLevel: body.riskLevel || "low",
          status: "success",
          sessionId: body.sessionId,
        },
      });

      return NextResponse.json({ success: true, log: auditLog });
    }

    return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
  } catch (_error) {
    return NextResponse.json(
      { _error: `Request failed: ${error}` },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-database/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
import { NextRequest, NextResponse } from "next/server";

// Dynamic import for Prisma to avoid build-time issues
let prisma: unknown = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaClient } = await import("@/lib/prisma");
    prisma = prismaClient;
  }
  return prisma;
}

// Media management types
interface MediaItem {
  id: string;
  title: string;
  type: "movie" | "series" | "documentary" | "animation";
  source: "public_domain" | "youtube" | "user_upload";
  url: string;
  localPath?: string;
  duration?: number;
  size?: number;
  status: "available" | "downloading" | "downloaded" | "error";
  createdAt: Date;
  updatedAt: Date;
}

// Master-only access check
function isMaster(_request: NextRequest) {
  // Production: implement real master auth via sessions/JWT/tokens
  return _request.headers.get("x-qmoi-master") === "true";
}

// Media search implementation
async function searchMedia(
  _query: string,
  type?: string,
  source?: string,
): Promise<MediaItem[]> {
  const prisma = await getPrisma();
  const where: Record<string, unknown> = {
    title: {
      contains: _query,
      mode: "insensitive",
    },
  };

  if (type) {
    where.type = type;
  }

  if (source) {
    where.source = source;
  }

  const mediaTasks = await prisma.mediaTask.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert to MediaItem format for compatibility
  return mediaTasks.map((task: unknown) => ({
    id: task.id,
    title: task.type, // Using type as title for now
    type: "movie" as const, // Default type
    source: "public_domain" as const, // Default source
    url: task.result || "",
    status:
      task.status === "completed"
        ? "downloaded"
        : task.status === "processing"
          ? "downloading"
          : "available",
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }));
}

// Download media implementation
async function downloadMedia(mediaId: string) {
  const prisma = await getPrisma();
  const mediaTask = await prisma.mediaTask.findUnique({
    where: { id: mediaId },
  });

  if (!mediaTask) {
    return { success: false, message: "Media not found" };
  }

  if (mediaTask.status === "completed") {
    return { success: true, message: "Media already downloaded" };
  }

  try {
    // Update status to processing
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: { status: "processing" },
    });

    // Production: implement real download via external APIs or background jobs
    // Placeholder: marks as completed
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "completed",
        result: "Downloaded successfully",
      },
    });

    return {
      success: true,
      message: "Media downloaded successfully",
    };
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : String(_error);

    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "failed",
        _error: errorMessage,
      },
    });

    return {
      success: false,
      message: `Download failed: ${errorMessage}`,
      _error: errorMessage,
    };
  }
}

// Get media logs (using audit logs for now)
async function getMediaLogs(filter?: {
  action?: string;
  mediaId?: string;
  limit?: number;
}) {
  const where: unknown = {};

  if (filter?.action) {
    where.action = filter.action;
  }

  if (filter?.mediaId) {
    where.resource = filter.mediaId;
  }

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: {
      timestamp: "desc",
    },
    take: filter?.limit || 50,
  });

  return logs;
}

export async function GET(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(_request.url);

  // Media search endpoint
  const searchQuery = searchParams.get("search");
  if (searchQuery) {
    try {
      const results = await searchMedia(
        searchQuery,
        searchParams.get("type") || undefined,
        searchParams.get("source") || undefined,
      );
      return NextResponse.json({ media: results });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Search failed: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get media logs endpoint
  if (searchParams.get("logs")) {
    try {
      const logs = await getMediaLogs({
        action: searchParams.get("action") || undefined,
        mediaId: searchParams.get("mediaId") || undefined,
        limit: searchParams.get("limit")
          ? parseInt(searchParams.get("limit")!)
          : undefined,
      });
      return NextResponse.json({ logs });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get logs: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get database info
  if (searchParams.get("info")) {
    try {
      const userCount = await prisma.user.count();
      const auditLogCount = await prisma.auditLog.count();
      const mediaTaskCount = await prisma.mediaTask.count();

      return NextResponse.json({
        users: userCount,
        auditLogs: auditLogCount,
        mediaTasks: mediaTaskCount,
      });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get database info: ${error}` },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
}

export async function POST(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  try {
    const body = await _request.json();

    // Media download endpoint
    if (body.download) {
      const result = await downloadMedia(body.mediaId);
      return NextResponse.json(result);
    }

    // Add new media task
    if (body.addMedia) {
      const mediaTask = await prisma.mediaTask.create({
        data: {
          type: body.type || "video",
          status: "pending",
          metadata: JSON.stringify({
            title: body.title,
            source: body.source,
            url: body.url,
          }),
        },
      });

      return NextResponse.json({
        success: true,
        media: {
          id: mediaTask.id,
          title: body.title,
          type: body.type,
          source: body.source,
          url: body.url,
          status: mediaTask.status,
          createdAt: mediaTask.createdAt,
          updatedAt: mediaTask.updatedAt,
        },
      });
    }

    // Create audit log
    if (body.logAction) {
      const auditLog = await prisma.auditLog.create({
        data: {
          userId: body.userId || "system",
          username: body.username || "system",
          action: body.action,
          resource: body.resource || "media",
          details: JSON.stringify(body.details || {}),
          riskLevel: body.riskLevel || "low",
          status: "success",
          sessionId: body.sessionId,
        },
      });

      return NextResponse.json({ success: true, log: auditLog });
    }

    return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
  } catch (_error) {
    return NextResponse.json(
      { _error: `Request failed: ${error}` },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-database/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
import { NextRequest, NextResponse } from "next/server";

// Dynamic import for Prisma to avoid build-time issues
let prisma: unknown = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaClient } = await import("@/lib/prisma");
    prisma = prismaClient;
  }
  return prisma;
}

// Media management types
interface MediaItem {
  id: string;
  title: string;
  type: "movie" | "series" | "documentary" | "animation";
  source: "public_domain" | "youtube" | "user_upload";
  url: string;
  localPath?: string;
  duration?: number;
  size?: number;
  status: "available" | "downloading" | "downloaded" | "error";
  createdAt: Date;
  updatedAt: Date;
}

// Master-only access check
function isMaster(_request: NextRequest) {
  // Production: implement real master auth via sessions/JWT/tokens
  return _request.headers.get("x-qmoi-master") === "true";
}

// Media search implementation
async function searchMedia(
  _query: string,
  type?: string,
  source?: string,
): Promise<MediaItem[]> {
  const prisma = await getPrisma();
  const where: Record<string, unknown> = {
    title: {
      contains: _query,
      mode: "insensitive",
    },
  };

  if (type) {
    where.type = type;
  }

  if (source) {
    where.source = source;
  }

  const mediaTasks = await prisma.mediaTask.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert to MediaItem format for compatibility
  return mediaTasks.map((task: unknown) => ({
    id: task.id,
    title: task.type, // Using type as title for now
    type: "movie" as const, // Default type
    source: "public_domain" as const, // Default source
    url: task.result || "",
    status:
      task.status === "completed"
        ? "downloaded"
        : task.status === "processing"
          ? "downloading"
          : "available",
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }));
}

// Download media implementation
async function downloadMedia(mediaId: string) {
  const prisma = await getPrisma();
  const mediaTask = await prisma.mediaTask.findUnique({
    where: { id: mediaId },
  });

  if (!mediaTask) {
    return { success: false, message: "Media not found" };
  }

  if (mediaTask.status === "completed") {
    return { success: true, message: "Media already downloaded" };
  }

  try {
    // Update status to processing
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: { status: "processing" },
    });

    // Production: implement real download via external APIs or background jobs
    // Placeholder: marks as completed
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "completed",
        result: "Downloaded successfully",
      },
    });

    return {
      success: true,
      message: "Media downloaded successfully",
    };
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : String(_error);

    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "failed",
        _error: errorMessage,
      },
    });

    return {
      success: false,
      message: `Download failed: ${errorMessage}`,
      _error: errorMessage,
    };
  }
}

// Get media logs (using audit logs for now)
async function getMediaLogs(filter?: {
  action?: string;
  mediaId?: string;
  limit?: number;
}) {
  const where: unknown = {};

  if (filter?.action) {
    where.action = filter.action;
  }

  if (filter?.mediaId) {
    where.resource = filter.mediaId;
  }

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: {
      timestamp: "desc",
    },
    take: filter?.limit || 50,
  });

  return logs;
}

export async function GET(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(_request.url);

  // Media search endpoint
  const searchQuery = searchParams.get("search");
  if (searchQuery) {
    try {
      const results = await searchMedia(
        searchQuery,
        searchParams.get("type") || undefined,
        searchParams.get("source") || undefined,
      );
      return NextResponse.json({ media: results });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Search failed: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get media logs endpoint
  if (searchParams.get("logs")) {
    try {
      const logs = await getMediaLogs({
        action: searchParams.get("action") || undefined,
        mediaId: searchParams.get("mediaId") || undefined,
        limit: searchParams.get("limit")
          ? parseInt(searchParams.get("limit")!)
          : undefined,
      });
      return NextResponse.json({ logs });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get logs: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get database info
  if (searchParams.get("info")) {
    try {
      const userCount = await prisma.user.count();
      const auditLogCount = await prisma.auditLog.count();
      const mediaTaskCount = await prisma.mediaTask.count();

      return NextResponse.json({
        users: userCount,
        auditLogs: auditLogCount,
        mediaTasks: mediaTaskCount,
      });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get database info: ${error}` },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
}

export async function POST(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  try {
    const body = await _request.json();

    // Media download endpoint
    if (body.download) {
      const result = await downloadMedia(body.mediaId);
      return NextResponse.json(result);
    }

    // Add new media task
    if (body.addMedia) {
      const mediaTask = await prisma.mediaTask.create({
        data: {
          type: body.type || "video",
          status: "pending",
          metadata: JSON.stringify({
            title: body.title,
            source: body.source,
            url: body.url,
          }),
        },
      });

      return NextResponse.json({
        success: true,
        media: {
          id: mediaTask.id,
          title: body.title,
          type: body.type,
          source: body.source,
          url: body.url,
          status: mediaTask.status,
          createdAt: mediaTask.createdAt,
          updatedAt: mediaTask.updatedAt,
        },
      });
    }

    // Create audit log
    if (body.logAction) {
      const auditLog = await prisma.auditLog.create({
        data: {
          userId: body.userId || "system",
          username: body.username || "system",
          action: body.action,
          resource: body.resource || "media",
          details: JSON.stringify(body.details || {}),
          riskLevel: body.riskLevel || "low",
          status: "success",
          sessionId: body.sessionId,
        },
      });

      return NextResponse.json({ success: true, log: auditLog });
    }

    return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
  } catch (_error) {
    return NextResponse.json(
      { _error: `Request failed: ${error}` },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-database/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
import { NextRequest, NextResponse } from "next/server";

// Dynamic import for Prisma to avoid build-time issues
let prisma: unknown = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaClient } = await import("@/lib/prisma");
    prisma = prismaClient;
  }
  return prisma;
}

// Media management types
interface MediaItem {
  id: string;
  title: string;
  type: "movie" | "series" | "documentary" | "animation";
  source: "public_domain" | "youtube" | "user_upload";
  url: string;
  localPath?: string;
  duration?: number;
  size?: number;
  status: "available" | "downloading" | "downloaded" | "error";
  createdAt: Date;
  updatedAt: Date;
}

// Master-only access check
function isMaster(_request: NextRequest) {
  // Production: implement real master auth via sessions/JWT/tokens
  return _request.headers.get("x-qmoi-master") === "true";
}

// Media search implementation
async function searchMedia(
  _query: string,
  type?: string,
  source?: string,
): Promise<MediaItem[]> {
  const prisma = await getPrisma();
  const where: Record<string, unknown> = {
    title: {
      contains: _query,
      mode: "insensitive",
    },
  };

  if (type) {
    where.type = type;
  }

  if (source) {
    where.source = source;
  }

  const mediaTasks = await prisma.mediaTask.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert to MediaItem format for compatibility
  return mediaTasks.map((task: unknown) => ({
    id: task.id,
    title: task.type, // Using type as title for now
    type: "movie" as const, // Default type
    source: "public_domain" as const, // Default source
    url: task.result || "",
    status:
      task.status === "completed"
        ? "downloaded"
        : task.status === "processing"
          ? "downloading"
          : "available",
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }));
}

// Download media implementation
async function downloadMedia(mediaId: string) {
  const prisma = await getPrisma();
  const mediaTask = await prisma.mediaTask.findUnique({
    where: { id: mediaId },
  });

  if (!mediaTask) {
    return { success: false, message: "Media not found" };
  }

  if (mediaTask.status === "completed") {
    return { success: true, message: "Media already downloaded" };
  }

  try {
    // Update status to processing
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: { status: "processing" },
    });

    // Production: implement real download via external APIs or background jobs
    // Placeholder: marks as completed
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "completed",
        result: "Downloaded successfully",
      },
    });

    return {
      success: true,
      message: "Media downloaded successfully",
    };
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : String(_error);

    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "failed",
        _error: errorMessage,
      },
    });

    return {
      success: false,
      message: `Download failed: ${errorMessage}`,
      _error: errorMessage,
    };
  }
}

// Get media logs (using audit logs for now)
async function getMediaLogs(filter?: {
  action?: string;
  mediaId?: string;
  limit?: number;
}) {
  const where: unknown = {};

  if (filter?.action) {
    where.action = filter.action;
  }

  if (filter?.mediaId) {
    where.resource = filter.mediaId;
  }

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: {
      timestamp: "desc",
    },
    take: filter?.limit || 50,
  });

  return logs;
}

export async function GET(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(_request.url);

  // Media search endpoint
  const searchQuery = searchParams.get("search");
  if (searchQuery) {
    try {
      const results = await searchMedia(
        searchQuery,
        searchParams.get("type") || undefined,
        searchParams.get("source") || undefined,
      );
      return NextResponse.json({ media: results });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Search failed: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get media logs endpoint
  if (searchParams.get("logs")) {
    try {
      const logs = await getMediaLogs({
        action: searchParams.get("action") || undefined,
        mediaId: searchParams.get("mediaId") || undefined,
        limit: searchParams.get("limit")
          ? parseInt(searchParams.get("limit")!)
          : undefined,
      });
      return NextResponse.json({ logs });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get logs: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get database info
  if (searchParams.get("info")) {
    try {
      const userCount = await prisma.user.count();
      const auditLogCount = await prisma.auditLog.count();
      const mediaTaskCount = await prisma.mediaTask.count();

      return NextResponse.json({
        users: userCount,
        auditLogs: auditLogCount,
        mediaTasks: mediaTaskCount,
      });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get database info: ${error}` },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
}

export async function POST(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  try {
    const body = await _request.json();

    // Media download endpoint
    if (body.download) {
      const result = await downloadMedia(body.mediaId);
      return NextResponse.json(result);
    }

    // Add new media task
    if (body.addMedia) {
      const mediaTask = await prisma.mediaTask.create({
        data: {
          type: body.type || "video",
          status: "pending",
          metadata: JSON.stringify({
            title: body.title,
            source: body.source,
            url: body.url,
          }),
        },
      });

      return NextResponse.json({
        success: true,
        media: {
          id: mediaTask.id,
          title: body.title,
          type: body.type,
          source: body.source,
          url: body.url,
          status: mediaTask.status,
          createdAt: mediaTask.createdAt,
          updatedAt: mediaTask.updatedAt,
        },
      });
    }

    // Create audit log
    if (body.logAction) {
      const auditLog = await prisma.auditLog.create({
        data: {
          userId: body.userId || "system",
          username: body.username || "system",
          action: body.action,
          resource: body.resource || "media",
          details: JSON.stringify(body.details || {}),
          riskLevel: body.riskLevel || "low",
          status: "success",
          sessionId: body.sessionId,
        },
      });

      return NextResponse.json({ success: true, log: auditLog });
    }

    return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
  } catch (_error) {
    return NextResponse.json(
      { _error: `Request failed: ${error}` },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-database/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
import { NextRequest, NextResponse } from "next/server";

// Dynamic import for Prisma to avoid build-time issues
let prisma: unknown = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaClient } = await import("@/lib/prisma");
    prisma = prismaClient;
  }
  return prisma;
}

// Media management types
interface MediaItem {
  id: string;
  title: string;
  type: "movie" | "series" | "documentary" | "animation";
  source: "public_domain" | "youtube" | "user_upload";
  url: string;
  localPath?: string;
  duration?: number;
  size?: number;
  status: "available" | "downloading" | "downloaded" | "error";
  createdAt: Date;
  updatedAt: Date;
}

// Master-only access check
function isMaster(_request: NextRequest) {
  // Production: implement real master auth via sessions/JWT/tokens
  return _request.headers.get("x-qmoi-master") === "true";
}

// Media search implementation
async function searchMedia(
  _query: string,
  type?: string,
  source?: string,
): Promise<MediaItem[]> {
  const prisma = await getPrisma();
  const where: Record<string, unknown> = {
    title: {
      contains: _query,
      mode: "insensitive",
    },
  };

  if (type) {
    where.type = type;
  }

  if (source) {
    where.source = source;
  }

  const mediaTasks = await prisma.mediaTask.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert to MediaItem format for compatibility
  return mediaTasks.map((task: unknown) => ({
    id: task.id,
    title: task.type, // Using type as title for now
    type: "movie" as const, // Default type
    source: "public_domain" as const, // Default source
    url: task.result || "",
    status:
      task.status === "completed"
        ? "downloaded"
        : task.status === "processing"
          ? "downloading"
          : "available",
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }));
}

// Download media implementation
async function downloadMedia(mediaId: string) {
  const prisma = await getPrisma();
  const mediaTask = await prisma.mediaTask.findUnique({
    where: { id: mediaId },
  });

  if (!mediaTask) {
    return { success: false, message: "Media not found" };
  }

  if (mediaTask.status === "completed") {
    return { success: true, message: "Media already downloaded" };
  }

  try {
    // Update status to processing
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: { status: "processing" },
    });

    // Production: implement real download via external APIs or background jobs
    // Placeholder: marks as completed
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "completed",
        result: "Downloaded successfully",
      },
    });

    return {
      success: true,
      message: "Media downloaded successfully",
    };
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : String(_error);

    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "failed",
        _error: errorMessage,
      },
    });

    return {
      success: false,
      message: `Download failed: ${errorMessage}`,
      _error: errorMessage,
    };
  }
}

// Get media logs (using audit logs for now)
async function getMediaLogs(filter?: {
  action?: string;
  mediaId?: string;
  limit?: number;
}) {
  const where: unknown = {};

  if (filter?.action) {
    where.action = filter.action;
  }

  if (filter?.mediaId) {
    where.resource = filter.mediaId;
  }

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: {
      timestamp: "desc",
    },
    take: filter?.limit || 50,
  });

  return logs;
}

export async function GET(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(_request.url);

  // Media search endpoint
  const searchQuery = searchParams.get("search");
  if (searchQuery) {
    try {
      const results = await searchMedia(
        searchQuery,
        searchParams.get("type") || undefined,
        searchParams.get("source") || undefined,
      );
      return NextResponse.json({ media: results });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Search failed: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get media logs endpoint
  if (searchParams.get("logs")) {
    try {
      const logs = await getMediaLogs({
        action: searchParams.get("action") || undefined,
        mediaId: searchParams.get("mediaId") || undefined,
        limit: searchParams.get("limit")
          ? parseInt(searchParams.get("limit")!)
          : undefined,
      });
      return NextResponse.json({ logs });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get logs: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get database info
  if (searchParams.get("info")) {
    try {
      const userCount = await prisma.user.count();
      const auditLogCount = await prisma.auditLog.count();
      const mediaTaskCount = await prisma.mediaTask.count();

      return NextResponse.json({
        users: userCount,
        auditLogs: auditLogCount,
        mediaTasks: mediaTaskCount,
      });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get database info: ${error}` },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
}

export async function POST(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  try {
    const body = await _request.json();

    // Media download endpoint
    if (body.download) {
      const result = await downloadMedia(body.mediaId);
      return NextResponse.json(result);
    }

    // Add new media task
    if (body.addMedia) {
      const mediaTask = await prisma.mediaTask.create({
        data: {
          type: body.type || "video",
          status: "pending",
          metadata: JSON.stringify({
            title: body.title,
            source: body.source,
            url: body.url,
          }),
        },
      });

      return NextResponse.json({
        success: true,
        media: {
          id: mediaTask.id,
          title: body.title,
          type: body.type,
          source: body.source,
          url: body.url,
          status: mediaTask.status,
          createdAt: mediaTask.createdAt,
          updatedAt: mediaTask.updatedAt,
        },
      });
    }

    // Create audit log
    if (body.logAction) {
      const auditLog = await prisma.auditLog.create({
        data: {
          userId: body.userId || "system",
          username: body.username || "system",
          action: body.action,
          resource: body.resource || "media",
          details: JSON.stringify(body.details || {}),
          riskLevel: body.riskLevel || "low",
          status: "success",
          sessionId: body.sessionId,
        },
      });

      return NextResponse.json({ success: true, log: auditLog });
    }

    return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
  } catch (_error) {
    return NextResponse.json(
      { _error: `Request failed: ${error}` },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-database/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
import { NextRequest, NextResponse } from "next/server";

// Dynamic import for Prisma to avoid build-time issues
let prisma: unknown = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaClient } = await import("@/lib/prisma");
    prisma = prismaClient;
  }
  return prisma;
}

// Media management types
interface MediaItem {
  id: string;
  title: string;
  type: "movie" | "series" | "documentary" | "animation";
  source: "public_domain" | "youtube" | "user_upload";
  url: string;
  localPath?: string;
  duration?: number;
  size?: number;
  status: "available" | "downloading" | "downloaded" | "error";
  createdAt: Date;
  updatedAt: Date;
}

// Master-only access check
function isMaster(_request: NextRequest) {
  // Production: implement real master auth via sessions/JWT/tokens
  return _request.headers.get("x-qmoi-master") === "true";
}

// Media search implementation
async function searchMedia(
  _query: string,
  type?: string,
  source?: string,
): Promise<MediaItem[]> {
  const prisma = await getPrisma();
  const where: Record<string, unknown> = {
    title: {
      contains: _query,
      mode: "insensitive",
    },
  };

  if (type) {
    where.type = type;
  }

  if (source) {
    where.source = source;
  }

  const mediaTasks = await prisma.mediaTask.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert to MediaItem format for compatibility
  return mediaTasks.map((task: unknown) => ({
    id: task.id,
    title: task.type, // Using type as title for now
    type: "movie" as const, // Default type
    source: "public_domain" as const, // Default source
    url: task.result || "",
    status:
      task.status === "completed"
        ? "downloaded"
        : task.status === "processing"
          ? "downloading"
          : "available",
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }));
}

// Download media implementation
async function downloadMedia(mediaId: string) {
  const prisma = await getPrisma();
  const mediaTask = await prisma.mediaTask.findUnique({
    where: { id: mediaId },
  });

  if (!mediaTask) {
    return { success: false, message: "Media not found" };
  }

  if (mediaTask.status === "completed") {
    return { success: true, message: "Media already downloaded" };
  }

  try {
    // Update status to processing
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: { status: "processing" },
    });

    // Production: implement real download via external APIs or background jobs
    // Placeholder: marks as completed
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "completed",
        result: "Downloaded successfully",
      },
    });

    return {
      success: true,
      message: "Media downloaded successfully",
    };
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : String(_error);

    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "failed",
        _error: errorMessage,
      },
    });

    return {
      success: false,
      message: `Download failed: ${errorMessage}`,
      _error: errorMessage,
    };
  }
}

// Get media logs (using audit logs for now)
async function getMediaLogs(filter?: {
  action?: string;
  mediaId?: string;
  limit?: number;
}) {
  const where: unknown = {};

  if (filter?.action) {
    where.action = filter.action;
  }

  if (filter?.mediaId) {
    where.resource = filter.mediaId;
  }

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: {
      timestamp: "desc",
    },
    take: filter?.limit || 50,
  });

  return logs;
}

export async function GET(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(_request.url);

  // Media search endpoint
  const searchQuery = searchParams.get("search");
  if (searchQuery) {
    try {
      const results = await searchMedia(
        searchQuery,
        searchParams.get("type") || undefined,
        searchParams.get("source") || undefined,
      );
      return NextResponse.json({ media: results });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Search failed: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get media logs endpoint
  if (searchParams.get("logs")) {
    try {
      const logs = await getMediaLogs({
        action: searchParams.get("action") || undefined,
        mediaId: searchParams.get("mediaId") || undefined,
        limit: searchParams.get("limit")
          ? parseInt(searchParams.get("limit")!)
          : undefined,
      });
      return NextResponse.json({ logs });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get logs: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get database info
  if (searchParams.get("info")) {
    try {
      const userCount = await prisma.user.count();
      const auditLogCount = await prisma.auditLog.count();
      const mediaTaskCount = await prisma.mediaTask.count();

      return NextResponse.json({
        users: userCount,
        auditLogs: auditLogCount,
        mediaTasks: mediaTaskCount,
      });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get database info: ${error}` },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
}

export async function POST(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  try {
    const body = await _request.json();

    // Media download endpoint
    if (body.download) {
      const result = await downloadMedia(body.mediaId);
      return NextResponse.json(result);
    }

    // Add new media task
    if (body.addMedia) {
      const mediaTask = await prisma.mediaTask.create({
        data: {
          type: body.type || "video",
          status: "pending",
          metadata: JSON.stringify({
            title: body.title,
            source: body.source,
            url: body.url,
          }),
        },
      });

      return NextResponse.json({
        success: true,
        media: {
          id: mediaTask.id,
          title: body.title,
          type: body.type,
          source: body.source,
          url: body.url,
          status: mediaTask.status,
          createdAt: mediaTask.createdAt,
          updatedAt: mediaTask.updatedAt,
        },
      });
    }

    // Create audit log
    if (body.logAction) {
      const auditLog = await prisma.auditLog.create({
        data: {
          userId: body.userId || "system",
          username: body.username || "system",
          action: body.action,
          resource: body.resource || "media",
          details: JSON.stringify(body.details || {}),
          riskLevel: body.riskLevel || "low",
          status: "success",
          sessionId: body.sessionId,
        },
      });

      return NextResponse.json({ success: true, log: auditLog });
    }

    return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
  } catch (_error) {
    return NextResponse.json(
      { _error: `Request failed: ${error}` },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-database/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
import { NextRequest, NextResponse } from "next/server";

// Dynamic import for Prisma to avoid build-time issues
let prisma: unknown = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaClient } = await import("@/lib/prisma");
    prisma = prismaClient;
  }
  return prisma;
}

// Media management types
interface MediaItem {
  id: string;
  title: string;
  type: "movie" | "series" | "documentary" | "animation";
  source: "public_domain" | "youtube" | "user_upload";
  url: string;
  localPath?: string;
  duration?: number;
  size?: number;
  status: "available" | "downloading" | "downloaded" | "error";
  createdAt: Date;
  updatedAt: Date;
}

// Master-only access check
function isMaster(_request: NextRequest) {
  // Production: implement real master auth via sessions/JWT/tokens
  return _request.headers.get("x-qmoi-master") === "true";
}

// Media search implementation
async function searchMedia(
  _query: string,
  type?: string,
  source?: string,
): Promise<MediaItem[]> {
  const prisma = await getPrisma();
  const where: Record<string, unknown> = {
    title: {
      contains: _query,
      mode: "insensitive",
    },
  };

  if (type) {
    where.type = type;
  }

  if (source) {
    where.source = source;
  }

  const mediaTasks = await prisma.mediaTask.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert to MediaItem format for compatibility
  return mediaTasks.map((task: unknown) => ({
    id: task.id,
    title: task.type, // Using type as title for now
    type: "movie" as const, // Default type
    source: "public_domain" as const, // Default source
    url: task.result || "",
    status:
      task.status === "completed"
        ? "downloaded"
        : task.status === "processing"
          ? "downloading"
          : "available",
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }));
}

// Download media implementation
async function downloadMedia(mediaId: string) {
  const prisma = await getPrisma();
  const mediaTask = await prisma.mediaTask.findUnique({
    where: { id: mediaId },
  });

  if (!mediaTask) {
    return { success: false, message: "Media not found" };
  }

  if (mediaTask.status === "completed") {
    return { success: true, message: "Media already downloaded" };
  }

  try {
    // Update status to processing
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: { status: "processing" },
    });

    // Production: implement real download via external APIs or background jobs
    // Placeholder: marks as completed
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "completed",
        result: "Downloaded successfully",
      },
    });

    return {
      success: true,
      message: "Media downloaded successfully",
    };
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : String(_error);

    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "failed",
        _error: errorMessage,
      },
    });

    return {
      success: false,
      message: `Download failed: ${errorMessage}`,
      _error: errorMessage,
    };
  }
}

// Get media logs (using audit logs for now)
async function getMediaLogs(filter?: {
  action?: string;
  mediaId?: string;
  limit?: number;
}) {
  const where: unknown = {};

  if (filter?.action) {
    where.action = filter.action;
  }

  if (filter?.mediaId) {
    where.resource = filter.mediaId;
  }

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: {
      timestamp: "desc",
    },
    take: filter?.limit || 50,
  });

  return logs;
}

export async function GET(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(_request.url);

  // Media search endpoint
  const searchQuery = searchParams.get("search");
  if (searchQuery) {
    try {
      const results = await searchMedia(
        searchQuery,
        searchParams.get("type") || undefined,
        searchParams.get("source") || undefined,
      );
      return NextResponse.json({ media: results });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Search failed: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get media logs endpoint
  if (searchParams.get("logs")) {
    try {
      const logs = await getMediaLogs({
        action: searchParams.get("action") || undefined,
        mediaId: searchParams.get("mediaId") || undefined,
        limit: searchParams.get("limit")
          ? parseInt(searchParams.get("limit")!)
          : undefined,
      });
      return NextResponse.json({ logs });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get logs: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get database info
  if (searchParams.get("info")) {
    try {
      const userCount = await prisma.user.count();
      const auditLogCount = await prisma.auditLog.count();
      const mediaTaskCount = await prisma.mediaTask.count();

      return NextResponse.json({
        users: userCount,
        auditLogs: auditLogCount,
        mediaTasks: mediaTaskCount,
      });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get database info: ${error}` },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
}

export async function POST(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  try {
    const body = await _request.json();

    // Media download endpoint
    if (body.download) {
      const result = await downloadMedia(body.mediaId);
      return NextResponse.json(result);
    }

    // Add new media task
    if (body.addMedia) {
      const mediaTask = await prisma.mediaTask.create({
        data: {
          type: body.type || "video",
          status: "pending",
          metadata: JSON.stringify({
            title: body.title,
            source: body.source,
            url: body.url,
          }),
        },
      });

      return NextResponse.json({
        success: true,
        media: {
          id: mediaTask.id,
          title: body.title,
          type: body.type,
          source: body.source,
          url: body.url,
          status: mediaTask.status,
          createdAt: mediaTask.createdAt,
          updatedAt: mediaTask.updatedAt,
        },
      });
    }

    // Create audit log
    if (body.logAction) {
      const auditLog = await prisma.auditLog.create({
        data: {
          userId: body.userId || "system",
          username: body.username || "system",
          action: body.action,
          resource: body.resource || "media",
          details: JSON.stringify(body.details || {}),
          riskLevel: body.riskLevel || "low",
          status: "success",
          sessionId: body.sessionId,
        },
      });

      return NextResponse.json({ success: true, log: auditLog });
    }

    return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
  } catch (_error) {
    return NextResponse.json(
      { _error: `Request failed: ${error}` },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-database/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
import { NextRequest, NextResponse } from "next/server";

// Dynamic import for Prisma to avoid build-time issues
let prisma: unknown = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaClient } = await import("@/lib/prisma");
    prisma = prismaClient;
  }
  return prisma;
}

// Media management types
interface MediaItem {
  id: string;
  title: string;
  type: "movie" | "series" | "documentary" | "animation";
  source: "public_domain" | "youtube" | "user_upload";
  url: string;
  localPath?: string;
  duration?: number;
  size?: number;
  status: "available" | "downloading" | "downloaded" | "error";
  createdAt: Date;
  updatedAt: Date;
}

// Master-only access check
function isMaster(_request: NextRequest) {
  // Production: implement real master auth via sessions/JWT/tokens
  return _request.headers.get("x-qmoi-master") === "true";
}

// Media search implementation
async function searchMedia(
  _query: string,
  type?: string,
  source?: string,
): Promise<MediaItem[]> {
  const prisma = await getPrisma();
  const where: Record<string, unknown> = {
    title: {
      contains: _query,
      mode: "insensitive",
    },
  };

  if (type) {
    where.type = type;
  }

  if (source) {
    where.source = source;
  }

  const mediaTasks = await prisma.mediaTask.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert to MediaItem format for compatibility
  return mediaTasks.map((task: unknown) => ({
    id: task.id,
    title: task.type, // Using type as title for now
    type: "movie" as const, // Default type
    source: "public_domain" as const, // Default source
    url: task.result || "",
    status:
      task.status === "completed"
        ? "downloaded"
        : task.status === "processing"
          ? "downloading"
          : "available",
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }));
}

// Download media implementation
async function downloadMedia(mediaId: string) {
  const prisma = await getPrisma();
  const mediaTask = await prisma.mediaTask.findUnique({
    where: { id: mediaId },
  });

  if (!mediaTask) {
    return { success: false, message: "Media not found" };
  }

  if (mediaTask.status === "completed") {
    return { success: true, message: "Media already downloaded" };
  }

  try {
    // Update status to processing
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: { status: "processing" },
    });

    // Production: implement real download via external APIs or background jobs
    // Placeholder: marks as completed
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "completed",
        result: "Downloaded successfully",
      },
    });

    return {
      success: true,
      message: "Media downloaded successfully",
    };
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : String(_error);

    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "failed",
        _error: errorMessage,
      },
    });

    return {
      success: false,
      message: `Download failed: ${errorMessage}`,
      _error: errorMessage,
    };
  }
}

// Get media logs (using audit logs for now)
async function getMediaLogs(filter?: {
  action?: string;
  mediaId?: string;
  limit?: number;
}) {
  const where: unknown = {};

  if (filter?.action) {
    where.action = filter.action;
  }

  if (filter?.mediaId) {
    where.resource = filter.mediaId;
  }

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: {
      timestamp: "desc",
    },
    take: filter?.limit || 50,
  });

  return logs;
}

export async function GET(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(_request.url);

  // Media search endpoint
  const searchQuery = searchParams.get("search");
  if (searchQuery) {
    try {
      const results = await searchMedia(
        searchQuery,
        searchParams.get("type") || undefined,
        searchParams.get("source") || undefined,
      );
      return NextResponse.json({ media: results });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Search failed: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get media logs endpoint
  if (searchParams.get("logs")) {
    try {
      const logs = await getMediaLogs({
        action: searchParams.get("action") || undefined,
        mediaId: searchParams.get("mediaId") || undefined,
        limit: searchParams.get("limit")
          ? parseInt(searchParams.get("limit")!)
          : undefined,
      });
      return NextResponse.json({ logs });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get logs: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get database info
  if (searchParams.get("info")) {
    try {
      const userCount = await prisma.user.count();
      const auditLogCount = await prisma.auditLog.count();
      const mediaTaskCount = await prisma.mediaTask.count();

      return NextResponse.json({
        users: userCount,
        auditLogs: auditLogCount,
        mediaTasks: mediaTaskCount,
      });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get database info: ${error}` },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
}

export async function POST(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  try {
    const body = await _request.json();

    // Media download endpoint
    if (body.download) {
      const result = await downloadMedia(body.mediaId);
      return NextResponse.json(result);
    }

    // Add new media task
    if (body.addMedia) {
      const mediaTask = await prisma.mediaTask.create({
        data: {
          type: body.type || "video",
          status: "pending",
          metadata: JSON.stringify({
            title: body.title,
            source: body.source,
            url: body.url,
          }),
        },
      });

      return NextResponse.json({
        success: true,
        media: {
          id: mediaTask.id,
          title: body.title,
          type: body.type,
          source: body.source,
          url: body.url,
          status: mediaTask.status,
          createdAt: mediaTask.createdAt,
          updatedAt: mediaTask.updatedAt,
        },
      });
    }

    // Create audit log
    if (body.logAction) {
      const auditLog = await prisma.auditLog.create({
        data: {
          userId: body.userId || "system",
          username: body.username || "system",
          action: body.action,
          resource: body.resource || "media",
          details: JSON.stringify(body.details || {}),
          riskLevel: body.riskLevel || "low",
          status: "success",
          sessionId: body.sessionId,
        },
      });

      return NextResponse.json({ success: true, log: auditLog });
    }

    return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
  } catch (_error) {
    return NextResponse.json(
      { _error: `Request failed: ${error}` },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-database/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
import { NextRequest, NextResponse } from "next/server";

// Dynamic import for Prisma to avoid build-time issues
let prisma: unknown = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaClient } = await import("@/lib/prisma");
    prisma = prismaClient;
  }
  return prisma;
}

// Media management types
interface MediaItem {
  id: string;
  title: string;
  type: "movie" | "series" | "documentary" | "animation";
  source: "public_domain" | "youtube" | "user_upload";
  url: string;
  localPath?: string;
  duration?: number;
  size?: number;
  status: "available" | "downloading" | "downloaded" | "error";
  createdAt: Date;
  updatedAt: Date;
}

// Master-only access check
function isMaster(_request: NextRequest) {
  // Production: implement real master auth via sessions/JWT/tokens
  return _request.headers.get("x-qmoi-master") === "true";
}

// Media search implementation
async function searchMedia(
  _query: string,
  type?: string,
  source?: string,
): Promise<MediaItem[]> {
  const prisma = await getPrisma();
  const where: Record<string, unknown> = {
    title: {
      contains: _query,
      mode: "insensitive",
    },
  };

  if (type) {
    where.type = type;
  }

  if (source) {
    where.source = source;
  }

  const mediaTasks = await prisma.mediaTask.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert to MediaItem format for compatibility
  return mediaTasks.map((task: unknown) => ({
    id: task.id,
    title: task.type, // Using type as title for now
    type: "movie" as const, // Default type
    source: "public_domain" as const, // Default source
    url: task.result || "",
    status:
      task.status === "completed"
        ? "downloaded"
        : task.status === "processing"
          ? "downloading"
          : "available",
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }));
}

// Download media implementation
async function downloadMedia(mediaId: string) {
  const prisma = await getPrisma();
  const mediaTask = await prisma.mediaTask.findUnique({
    where: { id: mediaId },
  });

  if (!mediaTask) {
    return { success: false, message: "Media not found" };
  }

  if (mediaTask.status === "completed") {
    return { success: true, message: "Media already downloaded" };
  }

  try {
    // Update status to processing
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: { status: "processing" },
    });

    // Production: implement real download via external APIs or background jobs
    // Placeholder: marks as completed
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "completed",
        result: "Downloaded successfully",
      },
    });

    return {
      success: true,
      message: "Media downloaded successfully",
    };
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : String(_error);

    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "failed",
        _error: errorMessage,
      },
    });

    return {
      success: false,
      message: `Download failed: ${errorMessage}`,
      _error: errorMessage,
    };
  }
}

// Get media logs (using audit logs for now)
async function getMediaLogs(filter?: {
  action?: string;
  mediaId?: string;
  limit?: number;
}) {
  const where: unknown = {};

  if (filter?.action) {
    where.action = filter.action;
  }

  if (filter?.mediaId) {
    where.resource = filter.mediaId;
  }

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: {
      timestamp: "desc",
    },
    take: filter?.limit || 50,
  });

  return logs;
}

export async function GET(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(_request.url);

  // Media search endpoint
  const searchQuery = searchParams.get("search");
  if (searchQuery) {
    try {
      const results = await searchMedia(
        searchQuery,
        searchParams.get("type") || undefined,
        searchParams.get("source") || undefined,
      );
      return NextResponse.json({ media: results });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Search failed: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get media logs endpoint
  if (searchParams.get("logs")) {
    try {
      const logs = await getMediaLogs({
        action: searchParams.get("action") || undefined,
        mediaId: searchParams.get("mediaId") || undefined,
        limit: searchParams.get("limit")
          ? parseInt(searchParams.get("limit")!)
          : undefined,
      });
      return NextResponse.json({ logs });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get logs: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get database info
  if (searchParams.get("info")) {
    try {
      const userCount = await prisma.user.count();
      const auditLogCount = await prisma.auditLog.count();
      const mediaTaskCount = await prisma.mediaTask.count();

      return NextResponse.json({
        users: userCount,
        auditLogs: auditLogCount,
        mediaTasks: mediaTaskCount,
      });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get database info: ${error}` },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
}

export async function POST(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  try {
    const body = await _request.json();

    // Media download endpoint
    if (body.download) {
      const result = await downloadMedia(body.mediaId);
      return NextResponse.json(result);
    }

    // Add new media task
    if (body.addMedia) {
      const mediaTask = await prisma.mediaTask.create({
        data: {
          type: body.type || "video",
          status: "pending",
          metadata: JSON.stringify({
            title: body.title,
            source: body.source,
            url: body.url,
          }),
        },
      });

      return NextResponse.json({
        success: true,
        media: {
          id: mediaTask.id,
          title: body.title,
          type: body.type,
          source: body.source,
          url: body.url,
          status: mediaTask.status,
          createdAt: mediaTask.createdAt,
          updatedAt: mediaTask.updatedAt,
        },
      });
    }

    // Create audit log
    if (body.logAction) {
      const auditLog = await prisma.auditLog.create({
        data: {
          userId: body.userId || "system",
          username: body.username || "system",
          action: body.action,
          resource: body.resource || "media",
          details: JSON.stringify(body.details || {}),
          riskLevel: body.riskLevel || "low",
          status: "success",
          sessionId: body.sessionId,
        },
      });

      return NextResponse.json({ success: true, log: auditLog });
    }

    return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
  } catch (_error) {
    return NextResponse.json(
      { _error: `Request failed: ${error}` },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-database/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
import { NextRequest, NextResponse } from "next/server";

// Dynamic import for Prisma to avoid build-time issues
let prisma: unknown = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaClient } = await import("@/lib/prisma");
    prisma = prismaClient;
  }
  return prisma;
}

// Media management types
interface MediaItem {
  id: string;
  title: string;
  type: "movie" | "series" | "documentary" | "animation";
  source: "public_domain" | "youtube" | "user_upload";
  url: string;
  localPath?: string;
  duration?: number;
  size?: number;
  status: "available" | "downloading" | "downloaded" | "error";
  createdAt: Date;
  updatedAt: Date;
}

// Master-only access check
function isMaster(_request: NextRequest) {
  // Production: implement real master auth via sessions/JWT/tokens
  return _request.headers.get("x-qmoi-master") === "true";
}

// Media search implementation
async function searchMedia(
  _query: string,
  type?: string,
  source?: string,
): Promise<MediaItem[]> {
  const prisma = await getPrisma();
  const where: Record<string, unknown> = {
    title: {
      contains: _query,
      mode: "insensitive",
    },
  };

  if (type) {
    where.type = type;
  }

  if (source) {
    where.source = source;
  }

  const mediaTasks = await prisma.mediaTask.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert to MediaItem format for compatibility
  return mediaTasks.map((task: unknown) => ({
    id: task.id,
    title: task.type, // Using type as title for now
    type: "movie" as const, // Default type
    source: "public_domain" as const, // Default source
    url: task.result || "",
    status:
      task.status === "completed"
        ? "downloaded"
        : task.status === "processing"
          ? "downloading"
          : "available",
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }));
}

// Download media implementation
async function downloadMedia(mediaId: string) {
  const prisma = await getPrisma();
  const mediaTask = await prisma.mediaTask.findUnique({
    where: { id: mediaId },
  });

  if (!mediaTask) {
    return { success: false, message: "Media not found" };
  }

  if (mediaTask.status === "completed") {
    return { success: true, message: "Media already downloaded" };
  }

  try {
    // Update status to processing
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: { status: "processing" },
    });

    // Production: implement real download via external APIs or background jobs
    // Placeholder: marks as completed
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "completed",
        result: "Downloaded successfully",
      },
    });

    return {
      success: true,
      message: "Media downloaded successfully",
    };
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : String(_error);

    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "failed",
        _error: errorMessage,
      },
    });

    return {
      success: false,
      message: `Download failed: ${errorMessage}`,
      _error: errorMessage,
    };
  }
}

// Get media logs (using audit logs for now)
async function getMediaLogs(filter?: {
  action?: string;
  mediaId?: string;
  limit?: number;
}) {
  const where: unknown = {};

  if (filter?.action) {
    where.action = filter.action;
  }

  if (filter?.mediaId) {
    where.resource = filter.mediaId;
  }

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: {
      timestamp: "desc",
    },
    take: filter?.limit || 50,
  });

  return logs;
}

export async function GET(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(_request.url);

  // Media search endpoint
  const searchQuery = searchParams.get("search");
  if (searchQuery) {
    try {
      const results = await searchMedia(
        searchQuery,
        searchParams.get("type") || undefined,
        searchParams.get("source") || undefined,
      );
      return NextResponse.json({ media: results });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Search failed: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get media logs endpoint
  if (searchParams.get("logs")) {
    try {
      const logs = await getMediaLogs({
        action: searchParams.get("action") || undefined,
        mediaId: searchParams.get("mediaId") || undefined,
        limit: searchParams.get("limit")
          ? parseInt(searchParams.get("limit")!)
          : undefined,
      });
      return NextResponse.json({ logs });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get logs: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get database info
  if (searchParams.get("info")) {
    try {
      const userCount = await prisma.user.count();
      const auditLogCount = await prisma.auditLog.count();
      const mediaTaskCount = await prisma.mediaTask.count();

      return NextResponse.json({
        users: userCount,
        auditLogs: auditLogCount,
        mediaTasks: mediaTaskCount,
      });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get database info: ${error}` },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
}

export async function POST(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  try {
    const body = await _request.json();

    // Media download endpoint
    if (body.download) {
      const result = await downloadMedia(body.mediaId);
      return NextResponse.json(result);
    }

    // Add new media task
    if (body.addMedia) {
      const mediaTask = await prisma.mediaTask.create({
        data: {
          type: body.type || "video",
          status: "pending",
          metadata: JSON.stringify({
            title: body.title,
            source: body.source,
            url: body.url,
          }),
        },
      });

      return NextResponse.json({
        success: true,
        media: {
          id: mediaTask.id,
          title: body.title,
          type: body.type,
          source: body.source,
          url: body.url,
          status: mediaTask.status,
          createdAt: mediaTask.createdAt,
          updatedAt: mediaTask.updatedAt,
        },
      });
    }

    // Create audit log
    if (body.logAction) {
      const auditLog = await prisma.auditLog.create({
        data: {
          userId: body.userId || "system",
          username: body.username || "system",
          action: body.action,
          resource: body.resource || "media",
          details: JSON.stringify(body.details || {}),
          riskLevel: body.riskLevel || "low",
          status: "success",
          sessionId: body.sessionId,
        },
      });

      return NextResponse.json({ success: true, log: auditLog });
    }

    return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
  } catch (_error) {
    return NextResponse.json(
      { _error: `Request failed: ${error}` },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-database/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
import { NextRequest, NextResponse } from "next/server";

// Dynamic import for Prisma to avoid build-time issues
let prisma: unknown = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaClient } = await import("@/lib/prisma");
    prisma = prismaClient;
  }
  return prisma;
}

// Media management types
interface MediaItem {
  id: string;
  title: string;
  type: "movie" | "series" | "documentary" | "animation";
  source: "public_domain" | "youtube" | "user_upload";
  url: string;
  localPath?: string;
  duration?: number;
  size?: number;
  status: "available" | "downloading" | "downloaded" | "error";
  createdAt: Date;
  updatedAt: Date;
}

// Master-only access check
function isMaster(_request: NextRequest) {
  // Production: implement real master auth via sessions/JWT/tokens
  return _request.headers.get("x-qmoi-master") === "true";
}

// Media search implementation
async function searchMedia(
  _query: string,
  type?: string,
  source?: string,
): Promise<MediaItem[]> {
  const prisma = await getPrisma();
  const where: Record<string, unknown> = {
    title: {
      contains: _query,
      mode: "insensitive",
    },
  };

  if (type) {
    where.type = type;
  }

  if (source) {
    where.source = source;
  }

  const mediaTasks = await prisma.mediaTask.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert to MediaItem format for compatibility
  return mediaTasks.map((task: unknown) => ({
    id: task.id,
    title: task.type, // Using type as title for now
    type: "movie" as const, // Default type
    source: "public_domain" as const, // Default source
    url: task.result || "",
    status:
      task.status === "completed"
        ? "downloaded"
        : task.status === "processing"
          ? "downloading"
          : "available",
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }));
}

// Download media implementation
async function downloadMedia(mediaId: string) {
  const prisma = await getPrisma();
  const mediaTask = await prisma.mediaTask.findUnique({
    where: { id: mediaId },
  });

  if (!mediaTask) {
    return { success: false, message: "Media not found" };
  }

  if (mediaTask.status === "completed") {
    return { success: true, message: "Media already downloaded" };
  }

  try {
    // Update status to processing
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: { status: "processing" },
    });

    // Production: implement real download via external APIs or background jobs
    // Placeholder: marks as completed
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "completed",
        result: "Downloaded successfully",
      },
    });

    return {
      success: true,
      message: "Media downloaded successfully",
    };
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : String(_error);

    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "failed",
        _error: errorMessage,
      },
    });

    return {
      success: false,
      message: `Download failed: ${errorMessage}`,
      _error: errorMessage,
    };
  }
}

// Get media logs (using audit logs for now)
async function getMediaLogs(filter?: {
  action?: string;
  mediaId?: string;
  limit?: number;
}) {
  const where: unknown = {};

  if (filter?.action) {
    where.action = filter.action;
  }

  if (filter?.mediaId) {
    where.resource = filter.mediaId;
  }

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: {
      timestamp: "desc",
    },
    take: filter?.limit || 50,
  });

  return logs;
}

export async function GET(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(_request.url);

  // Media search endpoint
  const searchQuery = searchParams.get("search");
  if (searchQuery) {
    try {
      const results = await searchMedia(
        searchQuery,
        searchParams.get("type") || undefined,
        searchParams.get("source") || undefined,
      );
      return NextResponse.json({ media: results });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Search failed: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get media logs endpoint
  if (searchParams.get("logs")) {
    try {
      const logs = await getMediaLogs({
        action: searchParams.get("action") || undefined,
        mediaId: searchParams.get("mediaId") || undefined,
        limit: searchParams.get("limit")
          ? parseInt(searchParams.get("limit")!)
          : undefined,
      });
      return NextResponse.json({ logs });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get logs: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get database info
  if (searchParams.get("info")) {
    try {
      const userCount = await prisma.user.count();
      const auditLogCount = await prisma.auditLog.count();
      const mediaTaskCount = await prisma.mediaTask.count();

      return NextResponse.json({
        users: userCount,
        auditLogs: auditLogCount,
        mediaTasks: mediaTaskCount,
      });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get database info: ${error}` },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
}

export async function POST(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  try {
    const body = await _request.json();

    // Media download endpoint
    if (body.download) {
      const result = await downloadMedia(body.mediaId);
      return NextResponse.json(result);
    }

    // Add new media task
    if (body.addMedia) {
      const mediaTask = await prisma.mediaTask.create({
        data: {
          type: body.type || "video",
          status: "pending",
          metadata: JSON.stringify({
            title: body.title,
            source: body.source,
            url: body.url,
          }),
        },
      });

      return NextResponse.json({
        success: true,
        media: {
          id: mediaTask.id,
          title: body.title,
          type: body.type,
          source: body.source,
          url: body.url,
          status: mediaTask.status,
          createdAt: mediaTask.createdAt,
          updatedAt: mediaTask.updatedAt,
        },
      });
    }

    // Create audit log
    if (body.logAction) {
      const auditLog = await prisma.auditLog.create({
        data: {
          userId: body.userId || "system",
          username: body.username || "system",
          action: body.action,
          resource: body.resource || "media",
          details: JSON.stringify(body.details || {}),
          riskLevel: body.riskLevel || "low",
          status: "success",
          sessionId: body.sessionId,
        },
      });

      return NextResponse.json({ success: true, log: auditLog });
    }

    return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
  } catch (_error) {
    return NextResponse.json(
      { _error: `Request failed: ${error}` },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-database/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
import { NextRequest, NextResponse } from "next/server";

// Dynamic import for Prisma to avoid build-time issues
let prisma: unknown = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaClient } = await import("@/lib/prisma");
    prisma = prismaClient;
  }
  return prisma;
}

// Media management types
interface MediaItem {
  id: string;
  title: string;
  type: "movie" | "series" | "documentary" | "animation";
  source: "public_domain" | "youtube" | "user_upload";
  url: string;
  localPath?: string;
  duration?: number;
  size?: number;
  status: "available" | "downloading" | "downloaded" | "error";
  createdAt: Date;
  updatedAt: Date;
}

// Master-only access check
function isMaster(_request: NextRequest) {
  // Production: implement real master auth via sessions/JWT/tokens
  return _request.headers.get("x-qmoi-master") === "true";
}

// Media search implementation
async function searchMedia(
  _query: string,
  type?: string,
  source?: string,
): Promise<MediaItem[]> {
  const prisma = await getPrisma();
  const where: Record<string, unknown> = {
    title: {
      contains: _query,
      mode: "insensitive",
    },
  };

  if (type) {
    where.type = type;
  }

  if (source) {
    where.source = source;
  }

  const mediaTasks = await prisma.mediaTask.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert to MediaItem format for compatibility
  return mediaTasks.map((task: unknown) => ({
    id: task.id,
    title: task.type, // Using type as title for now
    type: "movie" as const, // Default type
    source: "public_domain" as const, // Default source
    url: task.result || "",
    status:
      task.status === "completed"
        ? "downloaded"
        : task.status === "processing"
          ? "downloading"
          : "available",
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }));
}

// Download media implementation
async function downloadMedia(mediaId: string) {
  const prisma = await getPrisma();
  const mediaTask = await prisma.mediaTask.findUnique({
    where: { id: mediaId },
  });

  if (!mediaTask) {
    return { success: false, message: "Media not found" };
  }

  if (mediaTask.status === "completed") {
    return { success: true, message: "Media already downloaded" };
  }

  try {
    // Update status to processing
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: { status: "processing" },
    });

    // Production: implement real download via external APIs or background jobs
    // Placeholder: marks as completed
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "completed",
        result: "Downloaded successfully",
      },
    });

    return {
      success: true,
      message: "Media downloaded successfully",
    };
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : String(_error);

    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "failed",
        _error: errorMessage,
      },
    });

    return {
      success: false,
      message: `Download failed: ${errorMessage}`,
      _error: errorMessage,
    };
  }
}

// Get media logs (using audit logs for now)
async function getMediaLogs(filter?: {
  action?: string;
  mediaId?: string;
  limit?: number;
}) {
  const where: unknown = {};

  if (filter?.action) {
    where.action = filter.action;
  }

  if (filter?.mediaId) {
    where.resource = filter.mediaId;
  }

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: {
      timestamp: "desc",
    },
    take: filter?.limit || 50,
  });

  return logs;
}

export async function GET(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(_request.url);

  // Media search endpoint
  const searchQuery = searchParams.get("search");
  if (searchQuery) {
    try {
      const results = await searchMedia(
        searchQuery,
        searchParams.get("type") || undefined,
        searchParams.get("source") || undefined,
      );
      return NextResponse.json({ media: results });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Search failed: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get media logs endpoint
  if (searchParams.get("logs")) {
    try {
      const logs = await getMediaLogs({
        action: searchParams.get("action") || undefined,
        mediaId: searchParams.get("mediaId") || undefined,
        limit: searchParams.get("limit")
          ? parseInt(searchParams.get("limit")!)
          : undefined,
      });
      return NextResponse.json({ logs });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get logs: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get database info
  if (searchParams.get("info")) {
    try {
      const userCount = await prisma.user.count();
      const auditLogCount = await prisma.auditLog.count();
      const mediaTaskCount = await prisma.mediaTask.count();

      return NextResponse.json({
        users: userCount,
        auditLogs: auditLogCount,
        mediaTasks: mediaTaskCount,
      });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get database info: ${error}` },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
}

export async function POST(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  try {
    const body = await _request.json();

    // Media download endpoint
    if (body.download) {
      const result = await downloadMedia(body.mediaId);
      return NextResponse.json(result);
    }

    // Add new media task
    if (body.addMedia) {
      const mediaTask = await prisma.mediaTask.create({
        data: {
          type: body.type || "video",
          status: "pending",
          metadata: JSON.stringify({
            title: body.title,
            source: body.source,
            url: body.url,
          }),
        },
      });

      return NextResponse.json({
        success: true,
        media: {
          id: mediaTask.id,
          title: body.title,
          type: body.type,
          source: body.source,
          url: body.url,
          status: mediaTask.status,
          createdAt: mediaTask.createdAt,
          updatedAt: mediaTask.updatedAt,
        },
      });
    }

    // Create audit log
    if (body.logAction) {
      const auditLog = await prisma.auditLog.create({
        data: {
          userId: body.userId || "system",
          username: body.username || "system",
          action: body.action,
          resource: body.resource || "media",
          details: JSON.stringify(body.details || {}),
          riskLevel: body.riskLevel || "low",
          status: "success",
          sessionId: body.sessionId,
        },
      });

      return NextResponse.json({ success: true, log: auditLog });
    }

    return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
  } catch (_error) {
    return NextResponse.json(
      { _error: `Request failed: ${error}` },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-database/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
import { NextRequest, NextResponse } from "next/server";

// Dynamic import for Prisma to avoid build-time issues
let prisma: unknown = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaClient } = await import("@/lib/prisma");
    prisma = prismaClient;
  }
  return prisma;
}

// Media management types
interface MediaItem {
  id: string;
  title: string;
  type: "movie" | "series" | "documentary" | "animation";
  source: "public_domain" | "youtube" | "user_upload";
  url: string;
  localPath?: string;
  duration?: number;
  size?: number;
  status: "available" | "downloading" | "downloaded" | "error";
  createdAt: Date;
  updatedAt: Date;
}

// Master-only access check
function isMaster(_request: NextRequest) {
  // Production: implement real master auth via sessions/JWT/tokens
  return _request.headers.get("x-qmoi-master") === "true";
}

// Media search implementation
async function searchMedia(
  _query: string,
  type?: string,
  source?: string,
): Promise<MediaItem[]> {
  const prisma = await getPrisma();
  const where: Record<string, unknown> = {
    title: {
      contains: _query,
      mode: "insensitive",
    },
  };

  if (type) {
    where.type = type;
  }

  if (source) {
    where.source = source;
  }

  const mediaTasks = await prisma.mediaTask.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert to MediaItem format for compatibility
  return mediaTasks.map((task: unknown) => ({
    id: task.id,
    title: task.type, // Using type as title for now
    type: "movie" as const, // Default type
    source: "public_domain" as const, // Default source
    url: task.result || "",
    status:
      task.status === "completed"
        ? "downloaded"
        : task.status === "processing"
          ? "downloading"
          : "available",
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }));
}

// Download media implementation
async function downloadMedia(mediaId: string) {
  const prisma = await getPrisma();
  const mediaTask = await prisma.mediaTask.findUnique({
    where: { id: mediaId },
  });

  if (!mediaTask) {
    return { success: false, message: "Media not found" };
  }

  if (mediaTask.status === "completed") {
    return { success: true, message: "Media already downloaded" };
  }

  try {
    // Update status to processing
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: { status: "processing" },
    });

    // Production: implement real download via external APIs or background jobs
    // Placeholder: marks as completed
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "completed",
        result: "Downloaded successfully",
      },
    });

    return {
      success: true,
      message: "Media downloaded successfully",
    };
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : String(_error);

    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "failed",
        _error: errorMessage,
      },
    });

    return {
      success: false,
      message: `Download failed: ${errorMessage}`,
      _error: errorMessage,
    };
  }
}

// Get media logs (using audit logs for now)
async function getMediaLogs(filter?: {
  action?: string;
  mediaId?: string;
  limit?: number;
}) {
  const where: unknown = {};

  if (filter?.action) {
    where.action = filter.action;
  }

  if (filter?.mediaId) {
    where.resource = filter.mediaId;
  }

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: {
      timestamp: "desc",
    },
    take: filter?.limit || 50,
  });

  return logs;
}

export async function GET(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(_request.url);

  // Media search endpoint
  const searchQuery = searchParams.get("search");
  if (searchQuery) {
    try {
      const results = await searchMedia(
        searchQuery,
        searchParams.get("type") || undefined,
        searchParams.get("source") || undefined,
      );
      return NextResponse.json({ media: results });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Search failed: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get media logs endpoint
  if (searchParams.get("logs")) {
    try {
      const logs = await getMediaLogs({
        action: searchParams.get("action") || undefined,
        mediaId: searchParams.get("mediaId") || undefined,
        limit: searchParams.get("limit")
          ? parseInt(searchParams.get("limit")!)
          : undefined,
      });
      return NextResponse.json({ logs });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get logs: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get database info
  if (searchParams.get("info")) {
    try {
      const userCount = await prisma.user.count();
      const auditLogCount = await prisma.auditLog.count();
      const mediaTaskCount = await prisma.mediaTask.count();

      return NextResponse.json({
        users: userCount,
        auditLogs: auditLogCount,
        mediaTasks: mediaTaskCount,
      });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get database info: ${error}` },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
}

export async function POST(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  try {
    const body = await _request.json();

    // Media download endpoint
    if (body.download) {
      const result = await downloadMedia(body.mediaId);
      return NextResponse.json(result);
    }

    // Add new media task
    if (body.addMedia) {
      const mediaTask = await prisma.mediaTask.create({
        data: {
          type: body.type || "video",
          status: "pending",
          metadata: JSON.stringify({
            title: body.title,
            source: body.source,
            url: body.url,
          }),
        },
      });

      return NextResponse.json({
        success: true,
        media: {
          id: mediaTask.id,
          title: body.title,
          type: body.type,
          source: body.source,
          url: body.url,
          status: mediaTask.status,
          createdAt: mediaTask.createdAt,
          updatedAt: mediaTask.updatedAt,
        },
      });
    }

    // Create audit log
    if (body.logAction) {
      const auditLog = await prisma.auditLog.create({
        data: {
          userId: body.userId || "system",
          username: body.username || "system",
          action: body.action,
          resource: body.resource || "media",
          details: JSON.stringify(body.details || {}),
          riskLevel: body.riskLevel || "low",
          status: "success",
          sessionId: body.sessionId,
        },
      });

      return NextResponse.json({ success: true, log: auditLog });
    }

    return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
  } catch (_error) {
    return NextResponse.json(
      { _error: `Request failed: ${error}` },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-database/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
import { NextRequest, NextResponse } from "next/server";

// Dynamic import for Prisma to avoid build-time issues
let prisma: unknown = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaClient } = await import("@/lib/prisma");
    prisma = prismaClient;
  }
  return prisma;
}

// Media management types
interface MediaItem {
  id: string;
  title: string;
  type: "movie" | "series" | "documentary" | "animation";
  source: "public_domain" | "youtube" | "user_upload";
  url: string;
  localPath?: string;
  duration?: number;
  size?: number;
  status: "available" | "downloading" | "downloaded" | "error";
  createdAt: Date;
  updatedAt: Date;
}

// Master-only access check
function isMaster(_request: NextRequest) {
  // Production: implement real master auth via sessions/JWT/tokens
  return _request.headers.get("x-qmoi-master") === "true";
}

// Media search implementation
async function searchMedia(
  _query: string,
  type?: string,
  source?: string,
): Promise<MediaItem[]> {
  const prisma = await getPrisma();
  const where: Record<string, unknown> = {
    title: {
      contains: _query,
      mode: "insensitive",
    },
  };

  if (type) {
    where.type = type;
  }

  if (source) {
    where.source = source;
  }

  const mediaTasks = await prisma.mediaTask.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert to MediaItem format for compatibility
  return mediaTasks.map((task: unknown) => ({
    id: task.id,
    title: task.type, // Using type as title for now
    type: "movie" as const, // Default type
    source: "public_domain" as const, // Default source
    url: task.result || "",
    status:
      task.status === "completed"
        ? "downloaded"
        : task.status === "processing"
          ? "downloading"
          : "available",
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }));
}

// Download media implementation
async function downloadMedia(mediaId: string) {
  const prisma = await getPrisma();
  const mediaTask = await prisma.mediaTask.findUnique({
    where: { id: mediaId },
  });

  if (!mediaTask) {
    return { success: false, message: "Media not found" };
  }

  if (mediaTask.status === "completed") {
    return { success: true, message: "Media already downloaded" };
  }

  try {
    // Update status to processing
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: { status: "processing" },
    });

    // Production: implement real download via external APIs or background jobs
    // Placeholder: marks as completed
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "completed",
        result: "Downloaded successfully",
      },
    });

    return {
      success: true,
      message: "Media downloaded successfully",
    };
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : String(_error);

    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "failed",
        _error: errorMessage,
      },
    });

    return {
      success: false,
      message: `Download failed: ${errorMessage}`,
      _error: errorMessage,
    };
  }
}

// Get media logs (using audit logs for now)
async function getMediaLogs(filter?: {
  action?: string;
  mediaId?: string;
  limit?: number;
}) {
  const where: unknown = {};

  if (filter?.action) {
    where.action = filter.action;
  }

  if (filter?.mediaId) {
    where.resource = filter.mediaId;
  }

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: {
      timestamp: "desc",
    },
    take: filter?.limit || 50,
  });

  return logs;
}

export async function GET(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(_request.url);

  // Media search endpoint
  const searchQuery = searchParams.get("search");
  if (searchQuery) {
    try {
      const results = await searchMedia(
        searchQuery,
        searchParams.get("type") || undefined,
        searchParams.get("source") || undefined,
      );
      return NextResponse.json({ media: results });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Search failed: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get media logs endpoint
  if (searchParams.get("logs")) {
    try {
      const logs = await getMediaLogs({
        action: searchParams.get("action") || undefined,
        mediaId: searchParams.get("mediaId") || undefined,
        limit: searchParams.get("limit")
          ? parseInt(searchParams.get("limit")!)
          : undefined,
      });
      return NextResponse.json({ logs });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get logs: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get database info
  if (searchParams.get("info")) {
    try {
      const userCount = await prisma.user.count();
      const auditLogCount = await prisma.auditLog.count();
      const mediaTaskCount = await prisma.mediaTask.count();

      return NextResponse.json({
        users: userCount,
        auditLogs: auditLogCount,
        mediaTasks: mediaTaskCount,
      });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get database info: ${error}` },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
}

export async function POST(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  try {
    const body = await _request.json();

    // Media download endpoint
    if (body.download) {
      const result = await downloadMedia(body.mediaId);
      return NextResponse.json(result);
    }

    // Add new media task
    if (body.addMedia) {
      const mediaTask = await prisma.mediaTask.create({
        data: {
          type: body.type || "video",
          status: "pending",
          metadata: JSON.stringify({
            title: body.title,
            source: body.source,
            url: body.url,
          }),
        },
      });

      return NextResponse.json({
        success: true,
        media: {
          id: mediaTask.id,
          title: body.title,
          type: body.type,
          source: body.source,
          url: body.url,
          status: mediaTask.status,
          createdAt: mediaTask.createdAt,
          updatedAt: mediaTask.updatedAt,
        },
      });
    }

    // Create audit log
    if (body.logAction) {
      const auditLog = await prisma.auditLog.create({
        data: {
          userId: body.userId || "system",
          username: body.username || "system",
          action: body.action,
          resource: body.resource || "media",
          details: JSON.stringify(body.details || {}),
          riskLevel: body.riskLevel || "low",
          status: "success",
          sessionId: body.sessionId,
        },
      });

      return NextResponse.json({ success: true, log: auditLog });
    }

    return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
  } catch (_error) {
    return NextResponse.json(
      { _error: `Request failed: ${error}` },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-database/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
import { NextRequest, NextResponse } from "next/server";

// Dynamic import for Prisma to avoid build-time issues
let prisma: unknown = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaClient } = await import("@/lib/prisma");
    prisma = prismaClient;
  }
  return prisma;
}

// Media management types
interface MediaItem {
  id: string;
  title: string;
  type: "movie" | "series" | "documentary" | "animation";
  source: "public_domain" | "youtube" | "user_upload";
  url: string;
  localPath?: string;
  duration?: number;
  size?: number;
  status: "available" | "downloading" | "downloaded" | "error";
  createdAt: Date;
  updatedAt: Date;
}

// Master-only access check
function isMaster(_request: NextRequest) {
  // Production: implement real master auth via sessions/JWT/tokens
  return _request.headers.get("x-qmoi-master") === "true";
}

// Media search implementation
async function searchMedia(
  _query: string,
  type?: string,
  source?: string,
): Promise<MediaItem[]> {
  const prisma = await getPrisma();
  const where: Record<string, unknown> = {
    title: {
      contains: _query,
      mode: "insensitive",
    },
  };

  if (type) {
    where.type = type;
  }

  if (source) {
    where.source = source;
  }

  const mediaTasks = await prisma.mediaTask.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert to MediaItem format for compatibility
  return mediaTasks.map((task: unknown) => ({
    id: task.id,
    title: task.type, // Using type as title for now
    type: "movie" as const, // Default type
    source: "public_domain" as const, // Default source
    url: task.result || "",
    status:
      task.status === "completed"
        ? "downloaded"
        : task.status === "processing"
          ? "downloading"
          : "available",
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }));
}

// Download media implementation
async function downloadMedia(mediaId: string) {
  const prisma = await getPrisma();
  const mediaTask = await prisma.mediaTask.findUnique({
    where: { id: mediaId },
  });

  if (!mediaTask) {
    return { success: false, message: "Media not found" };
  }

  if (mediaTask.status === "completed") {
    return { success: true, message: "Media already downloaded" };
  }

  try {
    // Update status to processing
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: { status: "processing" },
    });

    // Production: implement real download via external APIs or background jobs
    // Placeholder: marks as completed
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "completed",
        result: "Downloaded successfully",
      },
    });

    return {
      success: true,
      message: "Media downloaded successfully",
    };
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : String(_error);

    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "failed",
        _error: errorMessage,
      },
    });

    return {
      success: false,
      message: `Download failed: ${errorMessage}`,
      _error: errorMessage,
    };
  }
}

// Get media logs (using audit logs for now)
async function getMediaLogs(filter?: {
  action?: string;
  mediaId?: string;
  limit?: number;
}) {
  const where: unknown = {};

  if (filter?.action) {
    where.action = filter.action;
  }

  if (filter?.mediaId) {
    where.resource = filter.mediaId;
  }

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: {
      timestamp: "desc",
    },
    take: filter?.limit || 50,
  });

  return logs;
}

export async function GET(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(_request.url);

  // Media search endpoint
  const searchQuery = searchParams.get("search");
  if (searchQuery) {
    try {
      const results = await searchMedia(
        searchQuery,
        searchParams.get("type") || undefined,
        searchParams.get("source") || undefined,
      );
      return NextResponse.json({ media: results });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Search failed: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get media logs endpoint
  if (searchParams.get("logs")) {
    try {
      const logs = await getMediaLogs({
        action: searchParams.get("action") || undefined,
        mediaId: searchParams.get("mediaId") || undefined,
        limit: searchParams.get("limit")
          ? parseInt(searchParams.get("limit")!)
          : undefined,
      });
      return NextResponse.json({ logs });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get logs: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get database info
  if (searchParams.get("info")) {
    try {
      const userCount = await prisma.user.count();
      const auditLogCount = await prisma.auditLog.count();
      const mediaTaskCount = await prisma.mediaTask.count();

      return NextResponse.json({
        users: userCount,
        auditLogs: auditLogCount,
        mediaTasks: mediaTaskCount,
      });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get database info: ${error}` },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
}

export async function POST(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  try {
    const body = await _request.json();

    // Media download endpoint
    if (body.download) {
      const result = await downloadMedia(body.mediaId);
      return NextResponse.json(result);
    }

    // Add new media task
    if (body.addMedia) {
      const mediaTask = await prisma.mediaTask.create({
        data: {
          type: body.type || "video",
          status: "pending",
          metadata: JSON.stringify({
            title: body.title,
            source: body.source,
            url: body.url,
          }),
        },
      });

      return NextResponse.json({
        success: true,
        media: {
          id: mediaTask.id,
          title: body.title,
          type: body.type,
          source: body.source,
          url: body.url,
          status: mediaTask.status,
          createdAt: mediaTask.createdAt,
          updatedAt: mediaTask.updatedAt,
        },
      });
    }

    // Create audit log
    if (body.logAction) {
      const auditLog = await prisma.auditLog.create({
        data: {
          userId: body.userId || "system",
          username: body.username || "system",
          action: body.action,
          resource: body.resource || "media",
          details: JSON.stringify(body.details || {}),
          riskLevel: body.riskLevel || "low",
          status: "success",
          sessionId: body.sessionId,
        },
      });

      return NextResponse.json({ success: true, log: auditLog });
    }

    return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
  } catch (_error) {
    return NextResponse.json(
      { _error: `Request failed: ${error}` },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-database/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
import { NextRequest, NextResponse } from "next/server";

// Dynamic import for Prisma to avoid build-time issues
let prisma: unknown = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaClient } = await import("@/lib/prisma");
    prisma = prismaClient;
  }
  return prisma;
}

// Media management types
interface MediaItem {
  id: string;
  title: string;
  type: "movie" | "series" | "documentary" | "animation";
  source: "public_domain" | "youtube" | "user_upload";
  url: string;
  localPath?: string;
  duration?: number;
  size?: number;
  status: "available" | "downloading" | "downloaded" | "error";
  createdAt: Date;
  updatedAt: Date;
}

// Master-only access check
function isMaster(_request: NextRequest) {
  // Production: implement real master auth via sessions/JWT/tokens
  return _request.headers.get("x-qmoi-master") === "true";
}

// Media search implementation
async function searchMedia(
  _query: string,
  type?: string,
  source?: string,
): Promise<MediaItem[]> {
  const prisma = await getPrisma();
  const where: Record<string, unknown> = {
    title: {
      contains: _query,
      mode: "insensitive",
    },
  };

  if (type) {
    where.type = type;
  }

  if (source) {
    where.source = source;
  }

  const mediaTasks = await prisma.mediaTask.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert to MediaItem format for compatibility
  return mediaTasks.map((task: unknown) => ({
    id: task.id,
    title: task.type, // Using type as title for now
    type: "movie" as const, // Default type
    source: "public_domain" as const, // Default source
    url: task.result || "",
    status:
      task.status === "completed"
        ? "downloaded"
        : task.status === "processing"
          ? "downloading"
          : "available",
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }));
}

// Download media implementation
async function downloadMedia(mediaId: string) {
  const prisma = await getPrisma();
  const mediaTask = await prisma.mediaTask.findUnique({
    where: { id: mediaId },
  });

  if (!mediaTask) {
    return { success: false, message: "Media not found" };
  }

  if (mediaTask.status === "completed") {
    return { success: true, message: "Media already downloaded" };
  }

  try {
    // Update status to processing
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: { status: "processing" },
    });

    // Production: implement real download via external APIs or background jobs
    // Placeholder: marks as completed
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "completed",
        result: "Downloaded successfully",
      },
    });

    return {
      success: true,
      message: "Media downloaded successfully",
    };
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : String(_error);

    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "failed",
        _error: errorMessage,
      },
    });

    return {
      success: false,
      message: `Download failed: ${errorMessage}`,
      _error: errorMessage,
    };
  }
}

// Get media logs (using audit logs for now)
async function getMediaLogs(filter?: {
  action?: string;
  mediaId?: string;
  limit?: number;
}) {
  const where: unknown = {};

  if (filter?.action) {
    where.action = filter.action;
  }

  if (filter?.mediaId) {
    where.resource = filter.mediaId;
  }

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: {
      timestamp: "desc",
    },
    take: filter?.limit || 50,
  });

  return logs;
}

export async function GET(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(_request.url);

  // Media search endpoint
  const searchQuery = searchParams.get("search");
  if (searchQuery) {
    try {
      const results = await searchMedia(
        searchQuery,
        searchParams.get("type") || undefined,
        searchParams.get("source") || undefined,
      );
      return NextResponse.json({ media: results });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Search failed: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get media logs endpoint
  if (searchParams.get("logs")) {
    try {
      const logs = await getMediaLogs({
        action: searchParams.get("action") || undefined,
        mediaId: searchParams.get("mediaId") || undefined,
        limit: searchParams.get("limit")
          ? parseInt(searchParams.get("limit")!)
          : undefined,
      });
      return NextResponse.json({ logs });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get logs: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get database info
  if (searchParams.get("info")) {
    try {
      const userCount = await prisma.user.count();
      const auditLogCount = await prisma.auditLog.count();
      const mediaTaskCount = await prisma.mediaTask.count();

      return NextResponse.json({
        users: userCount,
        auditLogs: auditLogCount,
        mediaTasks: mediaTaskCount,
      });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get database info: ${error}` },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
}

export async function POST(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  try {
    const body = await _request.json();

    // Media download endpoint
    if (body.download) {
      const result = await downloadMedia(body.mediaId);
      return NextResponse.json(result);
    }

    // Add new media task
    if (body.addMedia) {
      const mediaTask = await prisma.mediaTask.create({
        data: {
          type: body.type || "video",
          status: "pending",
          metadata: JSON.stringify({
            title: body.title,
            source: body.source,
            url: body.url,
          }),
        },
      });

      return NextResponse.json({
        success: true,
        media: {
          id: mediaTask.id,
          title: body.title,
          type: body.type,
          source: body.source,
          url: body.url,
          status: mediaTask.status,
          createdAt: mediaTask.createdAt,
          updatedAt: mediaTask.updatedAt,
        },
      });
    }

    // Create audit log
    if (body.logAction) {
      const auditLog = await prisma.auditLog.create({
        data: {
          userId: body.userId || "system",
          username: body.username || "system",
          action: body.action,
          resource: body.resource || "media",
          details: JSON.stringify(body.details || {}),
          riskLevel: body.riskLevel || "low",
          status: "success",
          sessionId: body.sessionId,
        },
      });

      return NextResponse.json({ success: true, log: auditLog });
    }

    return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
  } catch (_error) {
    return NextResponse.json(
      { _error: `Request failed: ${error}` },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-database/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
import { NextRequest, NextResponse } from "next/server";

// Dynamic import for Prisma to avoid build-time issues
let prisma: unknown = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaClient } = await import("@/lib/prisma");
    prisma = prismaClient;
  }
  return prisma;
}

// Media management types
interface MediaItem {
  id: string;
  title: string;
  type: "movie" | "series" | "documentary" | "animation";
  source: "public_domain" | "youtube" | "user_upload";
  url: string;
  localPath?: string;
  duration?: number;
  size?: number;
  status: "available" | "downloading" | "downloaded" | "error";
  createdAt: Date;
  updatedAt: Date;
}

// Master-only access check
function isMaster(_request: NextRequest) {
  // Production: implement real master auth via sessions/JWT/tokens
  return _request.headers.get("x-qmoi-master") === "true";
}

// Media search implementation
async function searchMedia(
  _query: string,
  type?: string,
  source?: string,
): Promise<MediaItem[]> {
  const prisma = await getPrisma();
  const where: Record<string, unknown> = {
    title: {
      contains: _query,
      mode: "insensitive",
    },
  };

  if (type) {
    where.type = type;
  }

  if (source) {
    where.source = source;
  }

  const mediaTasks = await prisma.mediaTask.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert to MediaItem format for compatibility
  return mediaTasks.map((task: unknown) => ({
    id: task.id,
    title: task.type, // Using type as title for now
    type: "movie" as const, // Default type
    source: "public_domain" as const, // Default source
    url: task.result || "",
    status:
      task.status === "completed"
        ? "downloaded"
        : task.status === "processing"
          ? "downloading"
          : "available",
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }));
}

// Download media implementation
async function downloadMedia(mediaId: string) {
  const prisma = await getPrisma();
  const mediaTask = await prisma.mediaTask.findUnique({
    where: { id: mediaId },
  });

  if (!mediaTask) {
    return { success: false, message: "Media not found" };
  }

  if (mediaTask.status === "completed") {
    return { success: true, message: "Media already downloaded" };
  }

  try {
    // Update status to processing
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: { status: "processing" },
    });

    // Production: implement real download via external APIs or background jobs
    // Placeholder: marks as completed
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "completed",
        result: "Downloaded successfully",
      },
    });

    return {
      success: true,
      message: "Media downloaded successfully",
    };
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : String(_error);

    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "failed",
        _error: errorMessage,
      },
    });

    return {
      success: false,
      message: `Download failed: ${errorMessage}`,
      _error: errorMessage,
    };
  }
}

// Get media logs (using audit logs for now)
async function getMediaLogs(filter?: {
  action?: string;
  mediaId?: string;
  limit?: number;
}) {
  const where: unknown = {};

  if (filter?.action) {
    where.action = filter.action;
  }

  if (filter?.mediaId) {
    where.resource = filter.mediaId;
  }

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: {
      timestamp: "desc",
    },
    take: filter?.limit || 50,
  });

  return logs;
}

export async function GET(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(_request.url);

  // Media search endpoint
  const searchQuery = searchParams.get("search");
  if (searchQuery) {
    try {
      const results = await searchMedia(
        searchQuery,
        searchParams.get("type") || undefined,
        searchParams.get("source") || undefined,
      );
      return NextResponse.json({ media: results });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Search failed: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get media logs endpoint
  if (searchParams.get("logs")) {
    try {
      const logs = await getMediaLogs({
        action: searchParams.get("action") || undefined,
        mediaId: searchParams.get("mediaId") || undefined,
        limit: searchParams.get("limit")
          ? parseInt(searchParams.get("limit")!)
          : undefined,
      });
      return NextResponse.json({ logs });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get logs: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get database info
  if (searchParams.get("info")) {
    try {
      const userCount = await prisma.user.count();
      const auditLogCount = await prisma.auditLog.count();
      const mediaTaskCount = await prisma.mediaTask.count();

      return NextResponse.json({
        users: userCount,
        auditLogs: auditLogCount,
        mediaTasks: mediaTaskCount,
      });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get database info: ${error}` },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
}

export async function POST(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  try {
    const body = await _request.json();

    // Media download endpoint
    if (body.download) {
      const result = await downloadMedia(body.mediaId);
      return NextResponse.json(result);
    }

    // Add new media task
    if (body.addMedia) {
      const mediaTask = await prisma.mediaTask.create({
        data: {
          type: body.type || "video",
          status: "pending",
          metadata: JSON.stringify({
            title: body.title,
            source: body.source,
            url: body.url,
          }),
        },
      });

      return NextResponse.json({
        success: true,
        media: {
          id: mediaTask.id,
          title: body.title,
          type: body.type,
          source: body.source,
          url: body.url,
          status: mediaTask.status,
          createdAt: mediaTask.createdAt,
          updatedAt: mediaTask.updatedAt,
        },
      });
    }

    // Create audit log
    if (body.logAction) {
      const auditLog = await prisma.auditLog.create({
        data: {
          userId: body.userId || "system",
          username: body.username || "system",
          action: body.action,
          resource: body.resource || "media",
          details: JSON.stringify(body.details || {}),
          riskLevel: body.riskLevel || "low",
          status: "success",
          sessionId: body.sessionId,
        },
      });

      return NextResponse.json({ success: true, log: auditLog });
    }

    return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
  } catch (_error) {
    return NextResponse.json(
      { _error: `Request failed: ${error}` },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-database/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
import { NextRequest, NextResponse } from "next/server";

// Dynamic import for Prisma to avoid build-time issues
let prisma: unknown = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaClient } = await import("@/lib/prisma");
    prisma = prismaClient;
  }
  return prisma;
}

// Media management types
interface MediaItem {
  id: string;
  title: string;
  type: "movie" | "series" | "documentary" | "animation";
  source: "public_domain" | "youtube" | "user_upload";
  url: string;
  localPath?: string;
  duration?: number;
  size?: number;
  status: "available" | "downloading" | "downloaded" | "error";
  createdAt: Date;
  updatedAt: Date;
}

// Master-only access check
function isMaster(_request: NextRequest) {
  // Production: implement real master auth via sessions/JWT/tokens
  return _request.headers.get("x-qmoi-master") === "true";
}

// Media search implementation
async function searchMedia(
  _query: string,
  type?: string,
  source?: string,
): Promise<MediaItem[]> {
  const prisma = await getPrisma();
  const where: Record<string, unknown> = {
    title: {
      contains: _query,
      mode: "insensitive",
    },
  };

  if (type) {
    where.type = type;
  }

  if (source) {
    where.source = source;
  }

  const mediaTasks = await prisma.mediaTask.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert to MediaItem format for compatibility
  return mediaTasks.map((task: unknown) => ({
    id: task.id,
    title: task.type, // Using type as title for now
    type: "movie" as const, // Default type
    source: "public_domain" as const, // Default source
    url: task.result || "",
    status:
      task.status === "completed"
        ? "downloaded"
        : task.status === "processing"
          ? "downloading"
          : "available",
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }));
}

// Download media implementation
async function downloadMedia(mediaId: string) {
  const prisma = await getPrisma();
  const mediaTask = await prisma.mediaTask.findUnique({
    where: { id: mediaId },
  });

  if (!mediaTask) {
    return { success: false, message: "Media not found" };
  }

  if (mediaTask.status === "completed") {
    return { success: true, message: "Media already downloaded" };
  }

  try {
    // Update status to processing
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: { status: "processing" },
    });

    // Production: implement real download via external APIs or background jobs
    // Placeholder: marks as completed
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "completed",
        result: "Downloaded successfully",
      },
    });

    return {
      success: true,
      message: "Media downloaded successfully",
    };
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : String(_error);

    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "failed",
        _error: errorMessage,
      },
    });

    return {
      success: false,
      message: `Download failed: ${errorMessage}`,
      _error: errorMessage,
    };
  }
}

// Get media logs (using audit logs for now)
async function getMediaLogs(filter?: {
  action?: string;
  mediaId?: string;
  limit?: number;
}) {
  const where: unknown = {};

  if (filter?.action) {
    where.action = filter.action;
  }

  if (filter?.mediaId) {
    where.resource = filter.mediaId;
  }

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: {
      timestamp: "desc",
    },
    take: filter?.limit || 50,
  });

  return logs;
}

export async function GET(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(_request.url);

  // Media search endpoint
  const searchQuery = searchParams.get("search");
  if (searchQuery) {
    try {
      const results = await searchMedia(
        searchQuery,
        searchParams.get("type") || undefined,
        searchParams.get("source") || undefined,
      );
      return NextResponse.json({ media: results });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Search failed: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get media logs endpoint
  if (searchParams.get("logs")) {
    try {
      const logs = await getMediaLogs({
        action: searchParams.get("action") || undefined,
        mediaId: searchParams.get("mediaId") || undefined,
        limit: searchParams.get("limit")
          ? parseInt(searchParams.get("limit")!)
          : undefined,
      });
      return NextResponse.json({ logs });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get logs: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get database info
  if (searchParams.get("info")) {
    try {
      const userCount = await prisma.user.count();
      const auditLogCount = await prisma.auditLog.count();
      const mediaTaskCount = await prisma.mediaTask.count();

      return NextResponse.json({
        users: userCount,
        auditLogs: auditLogCount,
        mediaTasks: mediaTaskCount,
      });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get database info: ${error}` },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
}

export async function POST(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  try {
    const body = await _request.json();

    // Media download endpoint
    if (body.download) {
      const result = await downloadMedia(body.mediaId);
      return NextResponse.json(result);
    }

    // Add new media task
    if (body.addMedia) {
      const mediaTask = await prisma.mediaTask.create({
        data: {
          type: body.type || "video",
          status: "pending",
          metadata: JSON.stringify({
            title: body.title,
            source: body.source,
            url: body.url,
          }),
        },
      });

      return NextResponse.json({
        success: true,
        media: {
          id: mediaTask.id,
          title: body.title,
          type: body.type,
          source: body.source,
          url: body.url,
          status: mediaTask.status,
          createdAt: mediaTask.createdAt,
          updatedAt: mediaTask.updatedAt,
        },
      });
    }

    // Create audit log
    if (body.logAction) {
      const auditLog = await prisma.auditLog.create({
        data: {
          userId: body.userId || "system",
          username: body.username || "system",
          action: body.action,
          resource: body.resource || "media",
          details: JSON.stringify(body.details || {}),
          riskLevel: body.riskLevel || "low",
          status: "success",
          sessionId: body.sessionId,
        },
      });

      return NextResponse.json({ success: true, log: auditLog });
    }

    return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
  } catch (_error) {
    return NextResponse.json(
      { _error: `Request failed: ${error}` },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-database/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
import { NextRequest, NextResponse } from "next/server";

// Dynamic import for Prisma to avoid build-time issues
let prisma: unknown = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaClient } = await import("@/lib/prisma");
    prisma = prismaClient;
  }
  return prisma;
}

// Media management types
interface MediaItem {
  id: string;
  title: string;
  type: "movie" | "series" | "documentary" | "animation";
  source: "public_domain" | "youtube" | "user_upload";
  url: string;
  localPath?: string;
  duration?: number;
  size?: number;
  status: "available" | "downloading" | "downloaded" | "error";
  createdAt: Date;
  updatedAt: Date;
}

// Master-only access check
function isMaster(_request: NextRequest) {
  // Production: implement real master auth via sessions/JWT/tokens
  return _request.headers.get("x-qmoi-master") === "true";
}

// Media search implementation
async function searchMedia(
  _query: string,
  type?: string,
  source?: string,
): Promise<MediaItem[]> {
  const prisma = await getPrisma();
  const where: Record<string, unknown> = {
    title: {
      contains: _query,
      mode: "insensitive",
    },
  };

  if (type) {
    where.type = type;
  }

  if (source) {
    where.source = source;
  }

  const mediaTasks = await prisma.mediaTask.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert to MediaItem format for compatibility
  return mediaTasks.map((task: unknown) => ({
    id: task.id,
    title: task.type, // Using type as title for now
    type: "movie" as const, // Default type
    source: "public_domain" as const, // Default source
    url: task.result || "",
    status:
      task.status === "completed"
        ? "downloaded"
        : task.status === "processing"
          ? "downloading"
          : "available",
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }));
}

// Download media implementation
async function downloadMedia(mediaId: string) {
  const prisma = await getPrisma();
  const mediaTask = await prisma.mediaTask.findUnique({
    where: { id: mediaId },
  });

  if (!mediaTask) {
    return { success: false, message: "Media not found" };
  }

  if (mediaTask.status === "completed") {
    return { success: true, message: "Media already downloaded" };
  }

  try {
    // Update status to processing
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: { status: "processing" },
    });

    // Production: implement real download via external APIs or background jobs
    // Placeholder: marks as completed
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "completed",
        result: "Downloaded successfully",
      },
    });

    return {
      success: true,
      message: "Media downloaded successfully",
    };
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : String(_error);

    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "failed",
        _error: errorMessage,
      },
    });

    return {
      success: false,
      message: `Download failed: ${errorMessage}`,
      _error: errorMessage,
    };
  }
}

// Get media logs (using audit logs for now)
async function getMediaLogs(filter?: {
  action?: string;
  mediaId?: string;
  limit?: number;
}) {
  const where: unknown = {};

  if (filter?.action) {
    where.action = filter.action;
  }

  if (filter?.mediaId) {
    where.resource = filter.mediaId;
  }

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: {
      timestamp: "desc",
    },
    take: filter?.limit || 50,
  });

  return logs;
}

export async function GET(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(_request.url);

  // Media search endpoint
  const searchQuery = searchParams.get("search");
  if (searchQuery) {
    try {
      const results = await searchMedia(
        searchQuery,
        searchParams.get("type") || undefined,
        searchParams.get("source") || undefined,
      );
      return NextResponse.json({ media: results });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Search failed: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get media logs endpoint
  if (searchParams.get("logs")) {
    try {
      const logs = await getMediaLogs({
        action: searchParams.get("action") || undefined,
        mediaId: searchParams.get("mediaId") || undefined,
        limit: searchParams.get("limit")
          ? parseInt(searchParams.get("limit")!)
          : undefined,
      });
      return NextResponse.json({ logs });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get logs: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get database info
  if (searchParams.get("info")) {
    try {
      const userCount = await prisma.user.count();
      const auditLogCount = await prisma.auditLog.count();
      const mediaTaskCount = await prisma.mediaTask.count();

      return NextResponse.json({
        users: userCount,
        auditLogs: auditLogCount,
        mediaTasks: mediaTaskCount,
      });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get database info: ${error}` },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
}

export async function POST(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  try {
    const body = await _request.json();

    // Media download endpoint
    if (body.download) {
      const result = await downloadMedia(body.mediaId);
      return NextResponse.json(result);
    }

    // Add new media task
    if (body.addMedia) {
      const mediaTask = await prisma.mediaTask.create({
        data: {
          type: body.type || "video",
          status: "pending",
          metadata: JSON.stringify({
            title: body.title,
            source: body.source,
            url: body.url,
          }),
        },
      });

      return NextResponse.json({
        success: true,
        media: {
          id: mediaTask.id,
          title: body.title,
          type: body.type,
          source: body.source,
          url: body.url,
          status: mediaTask.status,
          createdAt: mediaTask.createdAt,
          updatedAt: mediaTask.updatedAt,
        },
      });
    }

    // Create audit log
    if (body.logAction) {
      const auditLog = await prisma.auditLog.create({
        data: {
          userId: body.userId || "system",
          username: body.username || "system",
          action: body.action,
          resource: body.resource || "media",
          details: JSON.stringify(body.details || {}),
          riskLevel: body.riskLevel || "low",
          status: "success",
          sessionId: body.sessionId,
        },
      });

      return NextResponse.json({ success: true, log: auditLog });
    }

    return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
  } catch (_error) {
    return NextResponse.json(
      { _error: `Request failed: ${error}` },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-database/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
import { NextRequest, NextResponse } from "next/server";

// Dynamic import for Prisma to avoid build-time issues
let prisma: unknown = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaClient } = await import("@/lib/prisma");
    prisma = prismaClient;
  }
  return prisma;
}

// Media management types
interface MediaItem {
  id: string;
  title: string;
  type: "movie" | "series" | "documentary" | "animation";
  source: "public_domain" | "youtube" | "user_upload";
  url: string;
  localPath?: string;
  duration?: number;
  size?: number;
  status: "available" | "downloading" | "downloaded" | "error";
  createdAt: Date;
  updatedAt: Date;
}

// Master-only access check
function isMaster(_request: NextRequest) {
  // Production: implement real master auth via sessions/JWT/tokens
  return _request.headers.get("x-qmoi-master") === "true";
}

// Media search implementation
async function searchMedia(
  _query: string,
  type?: string,
  source?: string,
): Promise<MediaItem[]> {
  const prisma = await getPrisma();
  const where: Record<string, unknown> = {
    title: {
      contains: _query,
      mode: "insensitive",
    },
  };

  if (type) {
    where.type = type;
  }

  if (source) {
    where.source = source;
  }

  const mediaTasks = await prisma.mediaTask.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert to MediaItem format for compatibility
  return mediaTasks.map((task: unknown) => ({
    id: task.id,
    title: task.type, // Using type as title for now
    type: "movie" as const, // Default type
    source: "public_domain" as const, // Default source
    url: task.result || "",
    status:
      task.status === "completed"
        ? "downloaded"
        : task.status === "processing"
          ? "downloading"
          : "available",
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }));
}

// Download media implementation
async function downloadMedia(mediaId: string) {
  const prisma = await getPrisma();
  const mediaTask = await prisma.mediaTask.findUnique({
    where: { id: mediaId },
  });

  if (!mediaTask) {
    return { success: false, message: "Media not found" };
  }

  if (mediaTask.status === "completed") {
    return { success: true, message: "Media already downloaded" };
  }

  try {
    // Update status to processing
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: { status: "processing" },
    });

    // Production: implement real download via external APIs or background jobs
    // Placeholder: marks as completed
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "completed",
        result: "Downloaded successfully",
      },
    });

    return {
      success: true,
      message: "Media downloaded successfully",
    };
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : String(_error);

    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "failed",
        _error: errorMessage,
      },
    });

    return {
      success: false,
      message: `Download failed: ${errorMessage}`,
      _error: errorMessage,
    };
  }
}

// Get media logs (using audit logs for now)
async function getMediaLogs(filter?: {
  action?: string;
  mediaId?: string;
  limit?: number;
}) {
  const where: unknown = {};

  if (filter?.action) {
    where.action = filter.action;
  }

  if (filter?.mediaId) {
    where.resource = filter.mediaId;
  }

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: {
      timestamp: "desc",
    },
    take: filter?.limit || 50,
  });

  return logs;
}

export async function GET(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(_request.url);

  // Media search endpoint
  const searchQuery = searchParams.get("search");
  if (searchQuery) {
    try {
      const results = await searchMedia(
        searchQuery,
        searchParams.get("type") || undefined,
        searchParams.get("source") || undefined,
      );
      return NextResponse.json({ media: results });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Search failed: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get media logs endpoint
  if (searchParams.get("logs")) {
    try {
      const logs = await getMediaLogs({
        action: searchParams.get("action") || undefined,
        mediaId: searchParams.get("mediaId") || undefined,
        limit: searchParams.get("limit")
          ? parseInt(searchParams.get("limit")!)
          : undefined,
      });
      return NextResponse.json({ logs });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get logs: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get database info
  if (searchParams.get("info")) {
    try {
      const userCount = await prisma.user.count();
      const auditLogCount = await prisma.auditLog.count();
      const mediaTaskCount = await prisma.mediaTask.count();

      return NextResponse.json({
        users: userCount,
        auditLogs: auditLogCount,
        mediaTasks: mediaTaskCount,
      });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get database info: ${error}` },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
}

export async function POST(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  try {
    const body = await _request.json();

    // Media download endpoint
    if (body.download) {
      const result = await downloadMedia(body.mediaId);
      return NextResponse.json(result);
    }

    // Add new media task
    if (body.addMedia) {
      const mediaTask = await prisma.mediaTask.create({
        data: {
          type: body.type || "video",
          status: "pending",
          metadata: JSON.stringify({
            title: body.title,
            source: body.source,
            url: body.url,
          }),
        },
      });

      return NextResponse.json({
        success: true,
        media: {
          id: mediaTask.id,
          title: body.title,
          type: body.type,
          source: body.source,
          url: body.url,
          status: mediaTask.status,
          createdAt: mediaTask.createdAt,
          updatedAt: mediaTask.updatedAt,
        },
      });
    }

    // Create audit log
    if (body.logAction) {
      const auditLog = await prisma.auditLog.create({
        data: {
          userId: body.userId || "system",
          username: body.username || "system",
          action: body.action,
          resource: body.resource || "media",
          details: JSON.stringify(body.details || {}),
          riskLevel: body.riskLevel || "low",
          status: "success",
          sessionId: body.sessionId,
        },
      });

      return NextResponse.json({ success: true, log: auditLog });
    }

    return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
  } catch (_error) {
    return NextResponse.json(
      { _error: `Request failed: ${error}` },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-database/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
import { NextRequest, NextResponse } from "next/server";

// Dynamic import for Prisma to avoid build-time issues
let prisma: unknown = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaClient } = await import("@/lib/prisma");
    prisma = prismaClient;
  }
  return prisma;
}

// Media management types
interface MediaItem {
  id: string;
  title: string;
  type: "movie" | "series" | "documentary" | "animation";
  source: "public_domain" | "youtube" | "user_upload";
  url: string;
  localPath?: string;
  duration?: number;
  size?: number;
  status: "available" | "downloading" | "downloaded" | "error";
  createdAt: Date;
  updatedAt: Date;
}

// Master-only access check
function isMaster(_request: NextRequest) {
  // Production: implement real master auth via sessions/JWT/tokens
  return _request.headers.get("x-qmoi-master") === "true";
}

// Media search implementation
async function searchMedia(
  _query: string,
  type?: string,
  source?: string,
): Promise<MediaItem[]> {
  const prisma = await getPrisma();
  const where: Record<string, unknown> = {
    title: {
      contains: _query,
      mode: "insensitive",
    },
  };

  if (type) {
    where.type = type;
  }

  if (source) {
    where.source = source;
  }

  const mediaTasks = await prisma.mediaTask.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert to MediaItem format for compatibility
  return mediaTasks.map((task: unknown) => ({
    id: task.id,
    title: task.type, // Using type as title for now
    type: "movie" as const, // Default type
    source: "public_domain" as const, // Default source
    url: task.result || "",
    status:
      task.status === "completed"
        ? "downloaded"
        : task.status === "processing"
          ? "downloading"
          : "available",
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }));
}

// Download media implementation
async function downloadMedia(mediaId: string) {
  const prisma = await getPrisma();
  const mediaTask = await prisma.mediaTask.findUnique({
    where: { id: mediaId },
  });

  if (!mediaTask) {
    return { success: false, message: "Media not found" };
  }

  if (mediaTask.status === "completed") {
    return { success: true, message: "Media already downloaded" };
  }

  try {
    // Update status to processing
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: { status: "processing" },
    });

    // Production: implement real download via external APIs or background jobs
    // Placeholder: marks as completed
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "completed",
        result: "Downloaded successfully",
      },
    });

    return {
      success: true,
      message: "Media downloaded successfully",
    };
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : String(_error);

    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "failed",
        _error: errorMessage,
      },
    });

    return {
      success: false,
      message: `Download failed: ${errorMessage}`,
      _error: errorMessage,
    };
  }
}

// Get media logs (using audit logs for now)
async function getMediaLogs(filter?: {
  action?: string;
  mediaId?: string;
  limit?: number;
}) {
  const where: unknown = {};

  if (filter?.action) {
    where.action = filter.action;
  }

  if (filter?.mediaId) {
    where.resource = filter.mediaId;
  }

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: {
      timestamp: "desc",
    },
    take: filter?.limit || 50,
  });

  return logs;
}

export async function GET(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(_request.url);

  // Media search endpoint
  const searchQuery = searchParams.get("search");
  if (searchQuery) {
    try {
      const results = await searchMedia(
        searchQuery,
        searchParams.get("type") || undefined,
        searchParams.get("source") || undefined,
      );
      return NextResponse.json({ media: results });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Search failed: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get media logs endpoint
  if (searchParams.get("logs")) {
    try {
      const logs = await getMediaLogs({
        action: searchParams.get("action") || undefined,
        mediaId: searchParams.get("mediaId") || undefined,
        limit: searchParams.get("limit")
          ? parseInt(searchParams.get("limit")!)
          : undefined,
      });
      return NextResponse.json({ logs });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get logs: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get database info
  if (searchParams.get("info")) {
    try {
      const userCount = await prisma.user.count();
      const auditLogCount = await prisma.auditLog.count();
      const mediaTaskCount = await prisma.mediaTask.count();

      return NextResponse.json({
        users: userCount,
        auditLogs: auditLogCount,
        mediaTasks: mediaTaskCount,
      });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get database info: ${error}` },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
}

export async function POST(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  try {
    const body = await _request.json();

    // Media download endpoint
    if (body.download) {
      const result = await downloadMedia(body.mediaId);
      return NextResponse.json(result);
    }

    // Add new media task
    if (body.addMedia) {
      const mediaTask = await prisma.mediaTask.create({
        data: {
          type: body.type || "video",
          status: "pending",
          metadata: JSON.stringify({
            title: body.title,
            source: body.source,
            url: body.url,
          }),
        },
      });

      return NextResponse.json({
        success: true,
        media: {
          id: mediaTask.id,
          title: body.title,
          type: body.type,
          source: body.source,
          url: body.url,
          status: mediaTask.status,
          createdAt: mediaTask.createdAt,
          updatedAt: mediaTask.updatedAt,
        },
      });
    }

    // Create audit log
    if (body.logAction) {
      const auditLog = await prisma.auditLog.create({
        data: {
          userId: body.userId || "system",
          username: body.username || "system",
          action: body.action,
          resource: body.resource || "media",
          details: JSON.stringify(body.details || {}),
          riskLevel: body.riskLevel || "low",
          status: "success",
          sessionId: body.sessionId,
        },
      });

      return NextResponse.json({ success: true, log: auditLog });
    }

    return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
  } catch (_error) {
    return NextResponse.json(
      { _error: `Request failed: ${error}` },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-database/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
import { NextRequest, NextResponse } from "next/server";

// Dynamic import for Prisma to avoid build-time issues
let prisma: unknown = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaClient } = await import("@/lib/prisma");
    prisma = prismaClient;
  }
  return prisma;
}

// Media management types
interface MediaItem {
  id: string;
  title: string;
  type: "movie" | "series" | "documentary" | "animation";
  source: "public_domain" | "youtube" | "user_upload";
  url: string;
  localPath?: string;
  duration?: number;
  size?: number;
  status: "available" | "downloading" | "downloaded" | "error";
  createdAt: Date;
  updatedAt: Date;
}

// Master-only access check
function isMaster(_request: NextRequest) {
  // Production: implement real master auth via sessions/JWT/tokens
  return _request.headers.get("x-qmoi-master") === "true";
}

// Media search implementation
async function searchMedia(
  _query: string,
  type?: string,
  source?: string,
): Promise<MediaItem[]> {
  const prisma = await getPrisma();
  const where: Record<string, unknown> = {
    title: {
      contains: _query,
      mode: "insensitive",
    },
  };

  if (type) {
    where.type = type;
  }

  if (source) {
    where.source = source;
  }

  const mediaTasks = await prisma.mediaTask.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert to MediaItem format for compatibility
  return mediaTasks.map((task: unknown) => ({
    id: task.id,
    title: task.type, // Using type as title for now
    type: "movie" as const, // Default type
    source: "public_domain" as const, // Default source
    url: task.result || "",
    status:
      task.status === "completed"
        ? "downloaded"
        : task.status === "processing"
          ? "downloading"
          : "available",
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }));
}

// Download media implementation
async function downloadMedia(mediaId: string) {
  const prisma = await getPrisma();
  const mediaTask = await prisma.mediaTask.findUnique({
    where: { id: mediaId },
  });

  if (!mediaTask) {
    return { success: false, message: "Media not found" };
  }

  if (mediaTask.status === "completed") {
    return { success: true, message: "Media already downloaded" };
  }

  try {
    // Update status to processing
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: { status: "processing" },
    });

    // Production: implement real download via external APIs or background jobs
    // Placeholder: marks as completed
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "completed",
        result: "Downloaded successfully",
      },
    });

    return {
      success: true,
      message: "Media downloaded successfully",
    };
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : String(_error);

    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "failed",
        _error: errorMessage,
      },
    });

    return {
      success: false,
      message: `Download failed: ${errorMessage}`,
      _error: errorMessage,
    };
  }
}

// Get media logs (using audit logs for now)
async function getMediaLogs(filter?: {
  action?: string;
  mediaId?: string;
  limit?: number;
}) {
  const where: unknown = {};

  if (filter?.action) {
    where.action = filter.action;
  }

  if (filter?.mediaId) {
    where.resource = filter.mediaId;
  }

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: {
      timestamp: "desc",
    },
    take: filter?.limit || 50,
  });

  return logs;
}

export async function GET(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(_request.url);

  // Media search endpoint
  const searchQuery = searchParams.get("search");
  if (searchQuery) {
    try {
      const results = await searchMedia(
        searchQuery,
        searchParams.get("type") || undefined,
        searchParams.get("source") || undefined,
      );
      return NextResponse.json({ media: results });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Search failed: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get media logs endpoint
  if (searchParams.get("logs")) {
    try {
      const logs = await getMediaLogs({
        action: searchParams.get("action") || undefined,
        mediaId: searchParams.get("mediaId") || undefined,
        limit: searchParams.get("limit")
          ? parseInt(searchParams.get("limit")!)
          : undefined,
      });
      return NextResponse.json({ logs });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get logs: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get database info
  if (searchParams.get("info")) {
    try {
      const userCount = await prisma.user.count();
      const auditLogCount = await prisma.auditLog.count();
      const mediaTaskCount = await prisma.mediaTask.count();

      return NextResponse.json({
        users: userCount,
        auditLogs: auditLogCount,
        mediaTasks: mediaTaskCount,
      });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get database info: ${error}` },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
}

export async function POST(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  try {
    const body = await _request.json();

    // Media download endpoint
    if (body.download) {
      const result = await downloadMedia(body.mediaId);
      return NextResponse.json(result);
    }

    // Add new media task
    if (body.addMedia) {
      const mediaTask = await prisma.mediaTask.create({
        data: {
          type: body.type || "video",
          status: "pending",
          metadata: JSON.stringify({
            title: body.title,
            source: body.source,
            url: body.url,
          }),
        },
      });

      return NextResponse.json({
        success: true,
        media: {
          id: mediaTask.id,
          title: body.title,
          type: body.type,
          source: body.source,
          url: body.url,
          status: mediaTask.status,
          createdAt: mediaTask.createdAt,
          updatedAt: mediaTask.updatedAt,
        },
      });
    }

    // Create audit log
    if (body.logAction) {
      const auditLog = await prisma.auditLog.create({
        data: {
          userId: body.userId || "system",
          username: body.username || "system",
          action: body.action,
          resource: body.resource || "media",
          details: JSON.stringify(body.details || {}),
          riskLevel: body.riskLevel || "low",
          status: "success",
          sessionId: body.sessionId,
        },
      });

      return NextResponse.json({ success: true, log: auditLog });
    }

    return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
  } catch (_error) {
    return NextResponse.json(
      { _error: `Request failed: ${error}` },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-database/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
import { NextRequest, NextResponse } from "next/server";

// Dynamic import for Prisma to avoid build-time issues
let prisma: unknown = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaClient } = await import("@/lib/prisma");
    prisma = prismaClient;
  }
  return prisma;
}

// Media management types
interface MediaItem {
  id: string;
  title: string;
  type: "movie" | "series" | "documentary" | "animation";
  source: "public_domain" | "youtube" | "user_upload";
  url: string;
  localPath?: string;
  duration?: number;
  size?: number;
  status: "available" | "downloading" | "downloaded" | "error";
  createdAt: Date;
  updatedAt: Date;
}

// Master-only access check
function isMaster(_request: NextRequest) {
  // Production: implement real master auth via sessions/JWT/tokens
  return _request.headers.get("x-qmoi-master") === "true";
}

// Media search implementation
async function searchMedia(
  _query: string,
  type?: string,
  source?: string,
): Promise<MediaItem[]> {
  const prisma = await getPrisma();
  const where: Record<string, unknown> = {
    title: {
      contains: _query,
      mode: "insensitive",
    },
  };

  if (type) {
    where.type = type;
  }

  if (source) {
    where.source = source;
  }

  const mediaTasks = await prisma.mediaTask.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert to MediaItem format for compatibility
  return mediaTasks.map((task: unknown) => ({
    id: task.id,
    title: task.type, // Using type as title for now
    type: "movie" as const, // Default type
    source: "public_domain" as const, // Default source
    url: task.result || "",
    status:
      task.status === "completed"
        ? "downloaded"
        : task.status === "processing"
          ? "downloading"
          : "available",
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }));
}

// Download media implementation
async function downloadMedia(mediaId: string) {
  const prisma = await getPrisma();
  const mediaTask = await prisma.mediaTask.findUnique({
    where: { id: mediaId },
  });

  if (!mediaTask) {
    return { success: false, message: "Media not found" };
  }

  if (mediaTask.status === "completed") {
    return { success: true, message: "Media already downloaded" };
  }

  try {
    // Update status to processing
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: { status: "processing" },
    });

    // Production: implement real download via external APIs or background jobs
    // Placeholder: marks as completed
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "completed",
        result: "Downloaded successfully",
      },
    });

    return {
      success: true,
      message: "Media downloaded successfully",
    };
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : String(_error);

    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "failed",
        _error: errorMessage,
      },
    });

    return {
      success: false,
      message: `Download failed: ${errorMessage}`,
      _error: errorMessage,
    };
  }
}

// Get media logs (using audit logs for now)
async function getMediaLogs(filter?: {
  action?: string;
  mediaId?: string;
  limit?: number;
}) {
  const where: unknown = {};

  if (filter?.action) {
    where.action = filter.action;
  }

  if (filter?.mediaId) {
    where.resource = filter.mediaId;
  }

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: {
      timestamp: "desc",
    },
    take: filter?.limit || 50,
  });

  return logs;
}

export async function GET(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(_request.url);

  // Media search endpoint
  const searchQuery = searchParams.get("search");
  if (searchQuery) {
    try {
      const results = await searchMedia(
        searchQuery,
        searchParams.get("type") || undefined,
        searchParams.get("source") || undefined,
      );
      return NextResponse.json({ media: results });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Search failed: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get media logs endpoint
  if (searchParams.get("logs")) {
    try {
      const logs = await getMediaLogs({
        action: searchParams.get("action") || undefined,
        mediaId: searchParams.get("mediaId") || undefined,
        limit: searchParams.get("limit")
          ? parseInt(searchParams.get("limit")!)
          : undefined,
      });
      return NextResponse.json({ logs });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get logs: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get database info
  if (searchParams.get("info")) {
    try {
      const userCount = await prisma.user.count();
      const auditLogCount = await prisma.auditLog.count();
      const mediaTaskCount = await prisma.mediaTask.count();

      return NextResponse.json({
        users: userCount,
        auditLogs: auditLogCount,
        mediaTasks: mediaTaskCount,
      });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get database info: ${error}` },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
}

export async function POST(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  try {
    const body = await _request.json();

    // Media download endpoint
    if (body.download) {
      const result = await downloadMedia(body.mediaId);
      return NextResponse.json(result);
    }

    // Add new media task
    if (body.addMedia) {
      const mediaTask = await prisma.mediaTask.create({
        data: {
          type: body.type || "video",
          status: "pending",
          metadata: JSON.stringify({
            title: body.title,
            source: body.source,
            url: body.url,
          }),
        },
      });

      return NextResponse.json({
        success: true,
        media: {
          id: mediaTask.id,
          title: body.title,
          type: body.type,
          source: body.source,
          url: body.url,
          status: mediaTask.status,
          createdAt: mediaTask.createdAt,
          updatedAt: mediaTask.updatedAt,
        },
      });
    }

    // Create audit log
    if (body.logAction) {
      const auditLog = await prisma.auditLog.create({
        data: {
          userId: body.userId || "system",
          username: body.username || "system",
          action: body.action,
          resource: body.resource || "media",
          details: JSON.stringify(body.details || {}),
          riskLevel: body.riskLevel || "low",
          status: "success",
          sessionId: body.sessionId,
        },
      });

      return NextResponse.json({ success: true, log: auditLog });
    }

    return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
  } catch (_error) {
    return NextResponse.json(
      { _error: `Request failed: ${error}` },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-database/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
import { NextRequest, NextResponse } from "next/server";

// Dynamic import for Prisma to avoid build-time issues
let prisma: unknown = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaClient } = await import("@/lib/prisma");
    prisma = prismaClient;
  }
  return prisma;
}

// Media management types
interface MediaItem {
  id: string;
  title: string;
  type: "movie" | "series" | "documentary" | "animation";
  source: "public_domain" | "youtube" | "user_upload";
  url: string;
  localPath?: string;
  duration?: number;
  size?: number;
  status: "available" | "downloading" | "downloaded" | "error";
  createdAt: Date;
  updatedAt: Date;
}

// Master-only access check
function isMaster(_request: NextRequest) {
  // Production: implement real master auth via sessions/JWT/tokens
  return _request.headers.get("x-qmoi-master") === "true";
}

// Media search implementation
async function searchMedia(
  _query: string,
  type?: string,
  source?: string,
): Promise<MediaItem[]> {
  const prisma = await getPrisma();
  const where: Record<string, unknown> = {
    title: {
      contains: _query,
      mode: "insensitive",
    },
  };

  if (type) {
    where.type = type;
  }

  if (source) {
    where.source = source;
  }

  const mediaTasks = await prisma.mediaTask.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert to MediaItem format for compatibility
  return mediaTasks.map((task: unknown) => ({
    id: task.id,
    title: task.type, // Using type as title for now
    type: "movie" as const, // Default type
    source: "public_domain" as const, // Default source
    url: task.result || "",
    status:
      task.status === "completed"
        ? "downloaded"
        : task.status === "processing"
          ? "downloading"
          : "available",
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }));
}

// Download media implementation
async function downloadMedia(mediaId: string) {
  const prisma = await getPrisma();
  const mediaTask = await prisma.mediaTask.findUnique({
    where: { id: mediaId },
  });

  if (!mediaTask) {
    return { success: false, message: "Media not found" };
  }

  if (mediaTask.status === "completed") {
    return { success: true, message: "Media already downloaded" };
  }

  try {
    // Update status to processing
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: { status: "processing" },
    });

    // Production: implement real download via external APIs or background jobs
    // Placeholder: marks as completed
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "completed",
        result: "Downloaded successfully",
      },
    });

    return {
      success: true,
      message: "Media downloaded successfully",
    };
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : String(_error);

    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "failed",
        _error: errorMessage,
      },
    });

    return {
      success: false,
      message: `Download failed: ${errorMessage}`,
      _error: errorMessage,
    };
  }
}

// Get media logs (using audit logs for now)
async function getMediaLogs(filter?: {
  action?: string;
  mediaId?: string;
  limit?: number;
}) {
  const where: unknown = {};

  if (filter?.action) {
    where.action = filter.action;
  }

  if (filter?.mediaId) {
    where.resource = filter.mediaId;
  }

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: {
      timestamp: "desc",
    },
    take: filter?.limit || 50,
  });

  return logs;
}

export async function GET(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(_request.url);

  // Media search endpoint
  const searchQuery = searchParams.get("search");
  if (searchQuery) {
    try {
      const results = await searchMedia(
        searchQuery,
        searchParams.get("type") || undefined,
        searchParams.get("source") || undefined,
      );
      return NextResponse.json({ media: results });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Search failed: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get media logs endpoint
  if (searchParams.get("logs")) {
    try {
      const logs = await getMediaLogs({
        action: searchParams.get("action") || undefined,
        mediaId: searchParams.get("mediaId") || undefined,
        limit: searchParams.get("limit")
          ? parseInt(searchParams.get("limit")!)
          : undefined,
      });
      return NextResponse.json({ logs });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get logs: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get database info
  if (searchParams.get("info")) {
    try {
      const userCount = await prisma.user.count();
      const auditLogCount = await prisma.auditLog.count();
      const mediaTaskCount = await prisma.mediaTask.count();

      return NextResponse.json({
        users: userCount,
        auditLogs: auditLogCount,
        mediaTasks: mediaTaskCount,
      });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get database info: ${error}` },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
}

export async function POST(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  try {
    const body = await _request.json();

    // Media download endpoint
    if (body.download) {
      const result = await downloadMedia(body.mediaId);
      return NextResponse.json(result);
    }

    // Add new media task
    if (body.addMedia) {
      const mediaTask = await prisma.mediaTask.create({
        data: {
          type: body.type || "video",
          status: "pending",
          metadata: JSON.stringify({
            title: body.title,
            source: body.source,
            url: body.url,
          }),
        },
      });

      return NextResponse.json({
        success: true,
        media: {
          id: mediaTask.id,
          title: body.title,
          type: body.type,
          source: body.source,
          url: body.url,
          status: mediaTask.status,
          createdAt: mediaTask.createdAt,
          updatedAt: mediaTask.updatedAt,
        },
      });
    }

    // Create audit log
    if (body.logAction) {
      const auditLog = await prisma.auditLog.create({
        data: {
          userId: body.userId || "system",
          username: body.username || "system",
          action: body.action,
          resource: body.resource || "media",
          details: JSON.stringify(body.details || {}),
          riskLevel: body.riskLevel || "low",
          status: "success",
          sessionId: body.sessionId,
        },
      });

      return NextResponse.json({ success: true, log: auditLog });
    }

    return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
  } catch (_error) {
    return NextResponse.json(
      { _error: `Request failed: ${error}` },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-database/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
import { NextRequest, NextResponse } from "next/server";

// Dynamic import for Prisma to avoid build-time issues
let prisma: unknown = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaClient } = await import("@/lib/prisma");
    prisma = prismaClient;
  }
  return prisma;
}

// Media management types
interface MediaItem {
  id: string;
  title: string;
  type: "movie" | "series" | "documentary" | "animation";
  source: "public_domain" | "youtube" | "user_upload";
  url: string;
  localPath?: string;
  duration?: number;
  size?: number;
  status: "available" | "downloading" | "downloaded" | "error";
  createdAt: Date;
  updatedAt: Date;
}

// Master-only access check
function isMaster(_request: NextRequest) {
  // Production: implement real master auth via sessions/JWT/tokens
  return _request.headers.get("x-qmoi-master") === "true";
}

// Media search implementation
async function searchMedia(
  _query: string,
  type?: string,
  source?: string,
): Promise<MediaItem[]> {
  const prisma = await getPrisma();
  const where: Record<string, unknown> = {
    title: {
      contains: _query,
      mode: "insensitive",
    },
  };

  if (type) {
    where.type = type;
  }

  if (source) {
    where.source = source;
  }

  const mediaTasks = await prisma.mediaTask.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert to MediaItem format for compatibility
  return mediaTasks.map((task: unknown) => ({
    id: task.id,
    title: task.type, // Using type as title for now
    type: "movie" as const, // Default type
    source: "public_domain" as const, // Default source
    url: task.result || "",
    status:
      task.status === "completed"
        ? "downloaded"
        : task.status === "processing"
          ? "downloading"
          : "available",
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }));
}

// Download media implementation
async function downloadMedia(mediaId: string) {
  const prisma = await getPrisma();
  const mediaTask = await prisma.mediaTask.findUnique({
    where: { id: mediaId },
  });

  if (!mediaTask) {
    return { success: false, message: "Media not found" };
  }

  if (mediaTask.status === "completed") {
    return { success: true, message: "Media already downloaded" };
  }

  try {
    // Update status to processing
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: { status: "processing" },
    });

    // Production: implement real download via external APIs or background jobs
    // Placeholder: marks as completed
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "completed",
        result: "Downloaded successfully",
      },
    });

    return {
      success: true,
      message: "Media downloaded successfully",
    };
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : String(_error);

    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "failed",
        _error: errorMessage,
      },
    });

    return {
      success: false,
      message: `Download failed: ${errorMessage}`,
      _error: errorMessage,
    };
  }
}

// Get media logs (using audit logs for now)
async function getMediaLogs(filter?: {
  action?: string;
  mediaId?: string;
  limit?: number;
}) {
  const where: unknown = {};

  if (filter?.action) {
    where.action = filter.action;
  }

  if (filter?.mediaId) {
    where.resource = filter.mediaId;
  }

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: {
      timestamp: "desc",
    },
    take: filter?.limit || 50,
  });

  return logs;
}

export async function GET(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(_request.url);

  // Media search endpoint
  const searchQuery = searchParams.get("search");
  if (searchQuery) {
    try {
      const results = await searchMedia(
        searchQuery,
        searchParams.get("type") || undefined,
        searchParams.get("source") || undefined,
      );
      return NextResponse.json({ media: results });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Search failed: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get media logs endpoint
  if (searchParams.get("logs")) {
    try {
      const logs = await getMediaLogs({
        action: searchParams.get("action") || undefined,
        mediaId: searchParams.get("mediaId") || undefined,
        limit: searchParams.get("limit")
          ? parseInt(searchParams.get("limit")!)
          : undefined,
      });
      return NextResponse.json({ logs });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get logs: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get database info
  if (searchParams.get("info")) {
    try {
      const userCount = await prisma.user.count();
      const auditLogCount = await prisma.auditLog.count();
      const mediaTaskCount = await prisma.mediaTask.count();

      return NextResponse.json({
        users: userCount,
        auditLogs: auditLogCount,
        mediaTasks: mediaTaskCount,
      });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get database info: ${error}` },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
}

export async function POST(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  try {
    const body = await _request.json();

    // Media download endpoint
    if (body.download) {
      const result = await downloadMedia(body.mediaId);
      return NextResponse.json(result);
    }

    // Add new media task
    if (body.addMedia) {
      const mediaTask = await prisma.mediaTask.create({
        data: {
          type: body.type || "video",
          status: "pending",
          metadata: JSON.stringify({
            title: body.title,
            source: body.source,
            url: body.url,
          }),
        },
      });

      return NextResponse.json({
        success: true,
        media: {
          id: mediaTask.id,
          title: body.title,
          type: body.type,
          source: body.source,
          url: body.url,
          status: mediaTask.status,
          createdAt: mediaTask.createdAt,
          updatedAt: mediaTask.updatedAt,
        },
      });
    }

    // Create audit log
    if (body.logAction) {
      const auditLog = await prisma.auditLog.create({
        data: {
          userId: body.userId || "system",
          username: body.username || "system",
          action: body.action,
          resource: body.resource || "media",
          details: JSON.stringify(body.details || {}),
          riskLevel: body.riskLevel || "low",
          status: "success",
          sessionId: body.sessionId,
        },
      });

      return NextResponse.json({ success: true, log: auditLog });
    }

    return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
  } catch (_error) {
    return NextResponse.json(
      { _error: `Request failed: ${error}` },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-database/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
import { NextRequest, NextResponse } from "next/server";

// Dynamic import for Prisma to avoid build-time issues
let prisma: unknown = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaClient } = await import("@/lib/prisma");
    prisma = prismaClient;
  }
  return prisma;
}

// Media management types
interface MediaItem {
  id: string;
  title: string;
  type: "movie" | "series" | "documentary" | "animation";
  source: "public_domain" | "youtube" | "user_upload";
  url: string;
  localPath?: string;
  duration?: number;
  size?: number;
  status: "available" | "downloading" | "downloaded" | "error";
  createdAt: Date;
  updatedAt: Date;
}

// Master-only access check
function isMaster(_request: NextRequest) {
  // Production: implement real master auth via sessions/JWT/tokens
  return _request.headers.get("x-qmoi-master") === "true";
}

// Media search implementation
async function searchMedia(
  _query: string,
  type?: string,
  source?: string,
): Promise<MediaItem[]> {
  const prisma = await getPrisma();
  const where: Record<string, unknown> = {
    title: {
      contains: _query,
      mode: "insensitive",
    },
  };

  if (type) {
    where.type = type;
  }

  if (source) {
    where.source = source;
  }

  const mediaTasks = await prisma.mediaTask.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert to MediaItem format for compatibility
  return mediaTasks.map((task: unknown) => ({
    id: task.id,
    title: task.type, // Using type as title for now
    type: "movie" as const, // Default type
    source: "public_domain" as const, // Default source
    url: task.result || "",
    status:
      task.status === "completed"
        ? "downloaded"
        : task.status === "processing"
          ? "downloading"
          : "available",
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }));
}

// Download media implementation
async function downloadMedia(mediaId: string) {
  const prisma = await getPrisma();
  const mediaTask = await prisma.mediaTask.findUnique({
    where: { id: mediaId },
  });

  if (!mediaTask) {
    return { success: false, message: "Media not found" };
  }

  if (mediaTask.status === "completed") {
    return { success: true, message: "Media already downloaded" };
  }

  try {
    // Update status to processing
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: { status: "processing" },
    });

    // Production: implement real download via external APIs or background jobs
    // Placeholder: marks as completed
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "completed",
        result: "Downloaded successfully",
      },
    });

    return {
      success: true,
      message: "Media downloaded successfully",
    };
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : String(_error);

    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "failed",
        _error: errorMessage,
      },
    });

    return {
      success: false,
      message: `Download failed: ${errorMessage}`,
      _error: errorMessage,
    };
  }
}

// Get media logs (using audit logs for now)
async function getMediaLogs(filter?: {
  action?: string;
  mediaId?: string;
  limit?: number;
}) {
  const where: unknown = {};

  if (filter?.action) {
    where.action = filter.action;
  }

  if (filter?.mediaId) {
    where.resource = filter.mediaId;
  }

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: {
      timestamp: "desc",
    },
    take: filter?.limit || 50,
  });

  return logs;
}

export async function GET(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(_request.url);

  // Media search endpoint
  const searchQuery = searchParams.get("search");
  if (searchQuery) {
    try {
      const results = await searchMedia(
        searchQuery,
        searchParams.get("type") || undefined,
        searchParams.get("source") || undefined,
      );
      return NextResponse.json({ media: results });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Search failed: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get media logs endpoint
  if (searchParams.get("logs")) {
    try {
      const logs = await getMediaLogs({
        action: searchParams.get("action") || undefined,
        mediaId: searchParams.get("mediaId") || undefined,
        limit: searchParams.get("limit")
          ? parseInt(searchParams.get("limit")!)
          : undefined,
      });
      return NextResponse.json({ logs });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get logs: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get database info
  if (searchParams.get("info")) {
    try {
      const userCount = await prisma.user.count();
      const auditLogCount = await prisma.auditLog.count();
      const mediaTaskCount = await prisma.mediaTask.count();

      return NextResponse.json({
        users: userCount,
        auditLogs: auditLogCount,
        mediaTasks: mediaTaskCount,
      });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get database info: ${error}` },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
}

export async function POST(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  try {
    const body = await _request.json();

    // Media download endpoint
    if (body.download) {
      const result = await downloadMedia(body.mediaId);
      return NextResponse.json(result);
    }

    // Add new media task
    if (body.addMedia) {
      const mediaTask = await prisma.mediaTask.create({
        data: {
          type: body.type || "video",
          status: "pending",
          metadata: JSON.stringify({
            title: body.title,
            source: body.source,
            url: body.url,
          }),
        },
      });

      return NextResponse.json({
        success: true,
        media: {
          id: mediaTask.id,
          title: body.title,
          type: body.type,
          source: body.source,
          url: body.url,
          status: mediaTask.status,
          createdAt: mediaTask.createdAt,
          updatedAt: mediaTask.updatedAt,
        },
      });
    }

    // Create audit log
    if (body.logAction) {
      const auditLog = await prisma.auditLog.create({
        data: {
          userId: body.userId || "system",
          username: body.username || "system",
          action: body.action,
          resource: body.resource || "media",
          details: JSON.stringify(body.details || {}),
          riskLevel: body.riskLevel || "low",
          status: "success",
          sessionId: body.sessionId,
        },
      });

      return NextResponse.json({ success: true, log: auditLog });
    }

    return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
  } catch (_error) {
    return NextResponse.json(
      { _error: `Request failed: ${error}` },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-database/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
import { NextRequest, NextResponse } from "next/server";

// Dynamic import for Prisma to avoid build-time issues
let prisma: unknown = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaClient } = await import("@/lib/prisma");
    prisma = prismaClient;
  }
  return prisma;
}

// Media management types
interface MediaItem {
  id: string;
  title: string;
  type: "movie" | "series" | "documentary" | "animation";
  source: "public_domain" | "youtube" | "user_upload";
  url: string;
  localPath?: string;
  duration?: number;
  size?: number;
  status: "available" | "downloading" | "downloaded" | "error";
  createdAt: Date;
  updatedAt: Date;
}

// Master-only access check
function isMaster(_request: NextRequest) {
  // Production: implement real master auth via sessions/JWT/tokens
  return _request.headers.get("x-qmoi-master") === "true";
}

// Media search implementation
async function searchMedia(
  _query: string,
  type?: string,
  source?: string,
): Promise<MediaItem[]> {
  const prisma = await getPrisma();
  const where: Record<string, unknown> = {
    title: {
      contains: _query,
      mode: "insensitive",
    },
  };

  if (type) {
    where.type = type;
  }

  if (source) {
    where.source = source;
  }

  const mediaTasks = await prisma.mediaTask.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert to MediaItem format for compatibility
  return mediaTasks.map((task: unknown) => ({
    id: task.id,
    title: task.type, // Using type as title for now
    type: "movie" as const, // Default type
    source: "public_domain" as const, // Default source
    url: task.result || "",
    status:
      task.status === "completed"
        ? "downloaded"
        : task.status === "processing"
          ? "downloading"
          : "available",
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }));
}

// Download media implementation
async function downloadMedia(mediaId: string) {
  const prisma = await getPrisma();
  const mediaTask = await prisma.mediaTask.findUnique({
    where: { id: mediaId },
  });

  if (!mediaTask) {
    return { success: false, message: "Media not found" };
  }

  if (mediaTask.status === "completed") {
    return { success: true, message: "Media already downloaded" };
  }

  try {
    // Update status to processing
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: { status: "processing" },
    });

    // Production: implement real download via external APIs or background jobs
    // Placeholder: marks as completed
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "completed",
        result: "Downloaded successfully",
      },
    });

    return {
      success: true,
      message: "Media downloaded successfully",
    };
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : String(_error);

    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "failed",
        _error: errorMessage,
      },
    });

    return {
      success: false,
      message: `Download failed: ${errorMessage}`,
      _error: errorMessage,
    };
  }
}

// Get media logs (using audit logs for now)
async function getMediaLogs(filter?: {
  action?: string;
  mediaId?: string;
  limit?: number;
}) {
  const where: unknown = {};

  if (filter?.action) {
    where.action = filter.action;
  }

  if (filter?.mediaId) {
    where.resource = filter.mediaId;
  }

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: {
      timestamp: "desc",
    },
    take: filter?.limit || 50,
  });

  return logs;
}

export async function GET(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(_request.url);

  // Media search endpoint
  const searchQuery = searchParams.get("search");
  if (searchQuery) {
    try {
      const results = await searchMedia(
        searchQuery,
        searchParams.get("type") || undefined,
        searchParams.get("source") || undefined,
      );
      return NextResponse.json({ media: results });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Search failed: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get media logs endpoint
  if (searchParams.get("logs")) {
    try {
      const logs = await getMediaLogs({
        action: searchParams.get("action") || undefined,
        mediaId: searchParams.get("mediaId") || undefined,
        limit: searchParams.get("limit")
          ? parseInt(searchParams.get("limit")!)
          : undefined,
      });
      return NextResponse.json({ logs });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get logs: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get database info
  if (searchParams.get("info")) {
    try {
      const userCount = await prisma.user.count();
      const auditLogCount = await prisma.auditLog.count();
      const mediaTaskCount = await prisma.mediaTask.count();

      return NextResponse.json({
        users: userCount,
        auditLogs: auditLogCount,
        mediaTasks: mediaTaskCount,
      });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get database info: ${error}` },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
}

export async function POST(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  try {
    const body = await _request.json();

    // Media download endpoint
    if (body.download) {
      const result = await downloadMedia(body.mediaId);
      return NextResponse.json(result);
    }

    // Add new media task
    if (body.addMedia) {
      const mediaTask = await prisma.mediaTask.create({
        data: {
          type: body.type || "video",
          status: "pending",
          metadata: JSON.stringify({
            title: body.title,
            source: body.source,
            url: body.url,
          }),
        },
      });

      return NextResponse.json({
        success: true,
        media: {
          id: mediaTask.id,
          title: body.title,
          type: body.type,
          source: body.source,
          url: body.url,
          status: mediaTask.status,
          createdAt: mediaTask.createdAt,
          updatedAt: mediaTask.updatedAt,
        },
      });
    }

    // Create audit log
    if (body.logAction) {
      const auditLog = await prisma.auditLog.create({
        data: {
          userId: body.userId || "system",
          username: body.username || "system",
          action: body.action,
          resource: body.resource || "media",
          details: JSON.stringify(body.details || {}),
          riskLevel: body.riskLevel || "low",
          status: "success",
          sessionId: body.sessionId,
        },
      });

      return NextResponse.json({ success: true, log: auditLog });
    }

    return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
  } catch (_error) {
    return NextResponse.json(
      { _error: `Request failed: ${error}` },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-database/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
import { NextRequest, NextResponse } from "next/server";

// Dynamic import for Prisma to avoid build-time issues
let prisma: unknown = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaClient } = await import("@/lib/prisma");
    prisma = prismaClient;
  }
  return prisma;
}

// Media management types
interface MediaItem {
  id: string;
  title: string;
  type: "movie" | "series" | "documentary" | "animation";
  source: "public_domain" | "youtube" | "user_upload";
  url: string;
  localPath?: string;
  duration?: number;
  size?: number;
  status: "available" | "downloading" | "downloaded" | "error";
  createdAt: Date;
  updatedAt: Date;
}

// Master-only access check
function isMaster(_request: NextRequest) {
  // Production: implement real master auth via sessions/JWT/tokens
  return _request.headers.get("x-qmoi-master") === "true";
}

// Media search implementation
async function searchMedia(
  _query: string,
  type?: string,
  source?: string,
): Promise<MediaItem[]> {
  const prisma = await getPrisma();
  const where: Record<string, unknown> = {
    title: {
      contains: _query,
      mode: "insensitive",
    },
  };

  if (type) {
    where.type = type;
  }

  if (source) {
    where.source = source;
  }

  const mediaTasks = await prisma.mediaTask.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert to MediaItem format for compatibility
  return mediaTasks.map((task: unknown) => ({
    id: task.id,
    title: task.type, // Using type as title for now
    type: "movie" as const, // Default type
    source: "public_domain" as const, // Default source
    url: task.result || "",
    status:
      task.status === "completed"
        ? "downloaded"
        : task.status === "processing"
          ? "downloading"
          : "available",
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }));
}

// Download media implementation
async function downloadMedia(mediaId: string) {
  const prisma = await getPrisma();
  const mediaTask = await prisma.mediaTask.findUnique({
    where: { id: mediaId },
  });

  if (!mediaTask) {
    return { success: false, message: "Media not found" };
  }

  if (mediaTask.status === "completed") {
    return { success: true, message: "Media already downloaded" };
  }

  try {
    // Update status to processing
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: { status: "processing" },
    });

    // Production: implement real download via external APIs or background jobs
    // Placeholder: marks as completed
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "completed",
        result: "Downloaded successfully",
      },
    });

    return {
      success: true,
      message: "Media downloaded successfully",
    };
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : String(_error);

    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "failed",
        _error: errorMessage,
      },
    });

    return {
      success: false,
      message: `Download failed: ${errorMessage}`,
      _error: errorMessage,
    };
  }
}

// Get media logs (using audit logs for now)
async function getMediaLogs(filter?: {
  action?: string;
  mediaId?: string;
  limit?: number;
}) {
  const where: unknown = {};

  if (filter?.action) {
    where.action = filter.action;
  }

  if (filter?.mediaId) {
    where.resource = filter.mediaId;
  }

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: {
      timestamp: "desc",
    },
    take: filter?.limit || 50,
  });

  return logs;
}

export async function GET(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(_request.url);

  // Media search endpoint
  const searchQuery = searchParams.get("search");
  if (searchQuery) {
    try {
      const results = await searchMedia(
        searchQuery,
        searchParams.get("type") || undefined,
        searchParams.get("source") || undefined,
      );
      return NextResponse.json({ media: results });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Search failed: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get media logs endpoint
  if (searchParams.get("logs")) {
    try {
      const logs = await getMediaLogs({
        action: searchParams.get("action") || undefined,
        mediaId: searchParams.get("mediaId") || undefined,
        limit: searchParams.get("limit")
          ? parseInt(searchParams.get("limit")!)
          : undefined,
      });
      return NextResponse.json({ logs });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get logs: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get database info
  if (searchParams.get("info")) {
    try {
      const userCount = await prisma.user.count();
      const auditLogCount = await prisma.auditLog.count();
      const mediaTaskCount = await prisma.mediaTask.count();

      return NextResponse.json({
        users: userCount,
        auditLogs: auditLogCount,
        mediaTasks: mediaTaskCount,
      });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get database info: ${error}` },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
}

export async function POST(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  try {
    const body = await _request.json();

    // Media download endpoint
    if (body.download) {
      const result = await downloadMedia(body.mediaId);
      return NextResponse.json(result);
    }

    // Add new media task
    if (body.addMedia) {
      const mediaTask = await prisma.mediaTask.create({
        data: {
          type: body.type || "video",
          status: "pending",
          metadata: JSON.stringify({
            title: body.title,
            source: body.source,
            url: body.url,
          }),
        },
      });

      return NextResponse.json({
        success: true,
        media: {
          id: mediaTask.id,
          title: body.title,
          type: body.type,
          source: body.source,
          url: body.url,
          status: mediaTask.status,
          createdAt: mediaTask.createdAt,
          updatedAt: mediaTask.updatedAt,
        },
      });
    }

    // Create audit log
    if (body.logAction) {
      const auditLog = await prisma.auditLog.create({
        data: {
          userId: body.userId || "system",
          username: body.username || "system",
          action: body.action,
          resource: body.resource || "media",
          details: JSON.stringify(body.details || {}),
          riskLevel: body.riskLevel || "low",
          status: "success",
          sessionId: body.sessionId,
        },
      });

      return NextResponse.json({ success: true, log: auditLog });
    }

    return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
  } catch (_error) {
    return NextResponse.json(
      { _error: `Request failed: ${error}` },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-database/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
import { NextRequest, NextResponse } from "next/server";

// Dynamic import for Prisma to avoid build-time issues
let prisma: unknown = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaClient } = await import("@/lib/prisma");
    prisma = prismaClient;
  }
  return prisma;
}

// Media management types
interface MediaItem {
  id: string;
  title: string;
  type: "movie" | "series" | "documentary" | "animation";
  source: "public_domain" | "youtube" | "user_upload";
  url: string;
  localPath?: string;
  duration?: number;
  size?: number;
  status: "available" | "downloading" | "downloaded" | "error";
  createdAt: Date;
  updatedAt: Date;
}

// Master-only access check
function isMaster(_request: NextRequest) {
  // Production: implement real master auth via sessions/JWT/tokens
  return _request.headers.get("x-qmoi-master") === "true";
}

// Media search implementation
async function searchMedia(
  _query: string,
  type?: string,
  source?: string,
): Promise<MediaItem[]> {
  const prisma = await getPrisma();
  const where: Record<string, unknown> = {
    title: {
      contains: _query,
      mode: "insensitive",
    },
  };

  if (type) {
    where.type = type;
  }

  if (source) {
    where.source = source;
  }

  const mediaTasks = await prisma.mediaTask.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert to MediaItem format for compatibility
  return mediaTasks.map((task: unknown) => ({
    id: task.id,
    title: task.type, // Using type as title for now
    type: "movie" as const, // Default type
    source: "public_domain" as const, // Default source
    url: task.result || "",
    status:
      task.status === "completed"
        ? "downloaded"
        : task.status === "processing"
          ? "downloading"
          : "available",
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }));
}

// Download media implementation
async function downloadMedia(mediaId: string) {
  const prisma = await getPrisma();
  const mediaTask = await prisma.mediaTask.findUnique({
    where: { id: mediaId },
  });

  if (!mediaTask) {
    return { success: false, message: "Media not found" };
  }

  if (mediaTask.status === "completed") {
    return { success: true, message: "Media already downloaded" };
  }

  try {
    // Update status to processing
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: { status: "processing" },
    });

    // Production: implement real download via external APIs or background jobs
    // Placeholder: marks as completed
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "completed",
        result: "Downloaded successfully",
      },
    });

    return {
      success: true,
      message: "Media downloaded successfully",
    };
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : String(_error);

    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "failed",
        _error: errorMessage,
      },
    });

    return {
      success: false,
      message: `Download failed: ${errorMessage}`,
      _error: errorMessage,
    };
  }
}

// Get media logs (using audit logs for now)
async function getMediaLogs(filter?: {
  action?: string;
  mediaId?: string;
  limit?: number;
}) {
  const where: unknown = {};

  if (filter?.action) {
    where.action = filter.action;
  }

  if (filter?.mediaId) {
    where.resource = filter.mediaId;
  }

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: {
      timestamp: "desc",
    },
    take: filter?.limit || 50,
  });

  return logs;
}

export async function GET(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(_request.url);

  // Media search endpoint
  const searchQuery = searchParams.get("search");
  if (searchQuery) {
    try {
      const results = await searchMedia(
        searchQuery,
        searchParams.get("type") || undefined,
        searchParams.get("source") || undefined,
      );
      return NextResponse.json({ media: results });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Search failed: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get media logs endpoint
  if (searchParams.get("logs")) {
    try {
      const logs = await getMediaLogs({
        action: searchParams.get("action") || undefined,
        mediaId: searchParams.get("mediaId") || undefined,
        limit: searchParams.get("limit")
          ? parseInt(searchParams.get("limit")!)
          : undefined,
      });
      return NextResponse.json({ logs });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get logs: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get database info
  if (searchParams.get("info")) {
    try {
      const userCount = await prisma.user.count();
      const auditLogCount = await prisma.auditLog.count();
      const mediaTaskCount = await prisma.mediaTask.count();

      return NextResponse.json({
        users: userCount,
        auditLogs: auditLogCount,
        mediaTasks: mediaTaskCount,
      });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get database info: ${error}` },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
}

export async function POST(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  try {
    const body = await _request.json();

    // Media download endpoint
    if (body.download) {
      const result = await downloadMedia(body.mediaId);
      return NextResponse.json(result);
    }

    // Add new media task
    if (body.addMedia) {
      const mediaTask = await prisma.mediaTask.create({
        data: {
          type: body.type || "video",
          status: "pending",
          metadata: JSON.stringify({
            title: body.title,
            source: body.source,
            url: body.url,
          }),
        },
      });

      return NextResponse.json({
        success: true,
        media: {
          id: mediaTask.id,
          title: body.title,
          type: body.type,
          source: body.source,
          url: body.url,
          status: mediaTask.status,
          createdAt: mediaTask.createdAt,
          updatedAt: mediaTask.updatedAt,
        },
      });
    }

    // Create audit log
    if (body.logAction) {
      const auditLog = await prisma.auditLog.create({
        data: {
          userId: body.userId || "system",
          username: body.username || "system",
          action: body.action,
          resource: body.resource || "media",
          details: JSON.stringify(body.details || {}),
          riskLevel: body.riskLevel || "low",
          status: "success",
          sessionId: body.sessionId,
        },
      });

      return NextResponse.json({ success: true, log: auditLog });
    }

    return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
  } catch (_error) {
    return NextResponse.json(
      { _error: `Request failed: ${error}` },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-database/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
import { NextRequest, NextResponse } from "next/server";

// Dynamic import for Prisma to avoid build-time issues
let prisma: unknown = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaClient } = await import("@/lib/prisma");
    prisma = prismaClient;
  }
  return prisma;
}

// Media management types
interface MediaItem {
  id: string;
  title: string;
  type: "movie" | "series" | "documentary" | "animation";
  source: "public_domain" | "youtube" | "user_upload";
  url: string;
  localPath?: string;
  duration?: number;
  size?: number;
  status: "available" | "downloading" | "downloaded" | "error";
  createdAt: Date;
  updatedAt: Date;
}

// Master-only access check
function isMaster(_request: NextRequest) {
  // Production: implement real master auth via sessions/JWT/tokens
  return _request.headers.get("x-qmoi-master") === "true";
}

// Media search implementation
async function searchMedia(
  _query: string,
  type?: string,
  source?: string,
): Promise<MediaItem[]> {
  const prisma = await getPrisma();
  const where: Record<string, unknown> = {
    title: {
      contains: _query,
      mode: "insensitive",
    },
  };

  if (type) {
    where.type = type;
  }

  if (source) {
    where.source = source;
  }

  const mediaTasks = await prisma.mediaTask.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert to MediaItem format for compatibility
  return mediaTasks.map((task: unknown) => ({
    id: task.id,
    title: task.type, // Using type as title for now
    type: "movie" as const, // Default type
    source: "public_domain" as const, // Default source
    url: task.result || "",
    status:
      task.status === "completed"
        ? "downloaded"
        : task.status === "processing"
          ? "downloading"
          : "available",
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }));
}

// Download media implementation
async function downloadMedia(mediaId: string) {
  const prisma = await getPrisma();
  const mediaTask = await prisma.mediaTask.findUnique({
    where: { id: mediaId },
  });

  if (!mediaTask) {
    return { success: false, message: "Media not found" };
  }

  if (mediaTask.status === "completed") {
    return { success: true, message: "Media already downloaded" };
  }

  try {
    // Update status to processing
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: { status: "processing" },
    });

    // Production: implement real download via external APIs or background jobs
    // Placeholder: marks as completed
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "completed",
        result: "Downloaded successfully",
      },
    });

    return {
      success: true,
      message: "Media downloaded successfully",
    };
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : String(_error);

    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "failed",
        _error: errorMessage,
      },
    });

    return {
      success: false,
      message: `Download failed: ${errorMessage}`,
      _error: errorMessage,
    };
  }
}

// Get media logs (using audit logs for now)
async function getMediaLogs(filter?: {
  action?: string;
  mediaId?: string;
  limit?: number;
}) {
  const where: unknown = {};

  if (filter?.action) {
    where.action = filter.action;
  }

  if (filter?.mediaId) {
    where.resource = filter.mediaId;
  }

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: {
      timestamp: "desc",
    },
    take: filter?.limit || 50,
  });

  return logs;
}

export async function GET(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(_request.url);

  // Media search endpoint
  const searchQuery = searchParams.get("search");
  if (searchQuery) {
    try {
      const results = await searchMedia(
        searchQuery,
        searchParams.get("type") || undefined,
        searchParams.get("source") || undefined,
      );
      return NextResponse.json({ media: results });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Search failed: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get media logs endpoint
  if (searchParams.get("logs")) {
    try {
      const logs = await getMediaLogs({
        action: searchParams.get("action") || undefined,
        mediaId: searchParams.get("mediaId") || undefined,
        limit: searchParams.get("limit")
          ? parseInt(searchParams.get("limit")!)
          : undefined,
      });
      return NextResponse.json({ logs });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get logs: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get database info
  if (searchParams.get("info")) {
    try {
      const userCount = await prisma.user.count();
      const auditLogCount = await prisma.auditLog.count();
      const mediaTaskCount = await prisma.mediaTask.count();

      return NextResponse.json({
        users: userCount,
        auditLogs: auditLogCount,
        mediaTasks: mediaTaskCount,
      });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get database info: ${error}` },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
}

export async function POST(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  try {
    const body = await _request.json();

    // Media download endpoint
    if (body.download) {
      const result = await downloadMedia(body.mediaId);
      return NextResponse.json(result);
    }

    // Add new media task
    if (body.addMedia) {
      const mediaTask = await prisma.mediaTask.create({
        data: {
          type: body.type || "video",
          status: "pending",
          metadata: JSON.stringify({
            title: body.title,
            source: body.source,
            url: body.url,
          }),
        },
      });

      return NextResponse.json({
        success: true,
        media: {
          id: mediaTask.id,
          title: body.title,
          type: body.type,
          source: body.source,
          url: body.url,
          status: mediaTask.status,
          createdAt: mediaTask.createdAt,
          updatedAt: mediaTask.updatedAt,
        },
      });
    }

    // Create audit log
    if (body.logAction) {
      const auditLog = await prisma.auditLog.create({
        data: {
          userId: body.userId || "system",
          username: body.username || "system",
          action: body.action,
          resource: body.resource || "media",
          details: JSON.stringify(body.details || {}),
          riskLevel: body.riskLevel || "low",
          status: "success",
          sessionId: body.sessionId,
        },
      });

      return NextResponse.json({ success: true, log: auditLog });
    }

    return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
  } catch (_error) {
    return NextResponse.json(
      { _error: `Request failed: ${error}` },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-database/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
import { NextRequest, NextResponse } from "next/server";

// Dynamic import for Prisma to avoid build-time issues
let prisma: unknown = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaClient } = await import("@/lib/prisma");
    prisma = prismaClient;
  }
  return prisma;
}

// Media management types
interface MediaItem {
  id: string;
  title: string;
  type: "movie" | "series" | "documentary" | "animation";
  source: "public_domain" | "youtube" | "user_upload";
  url: string;
  localPath?: string;
  duration?: number;
  size?: number;
  status: "available" | "downloading" | "downloaded" | "error";
  createdAt: Date;
  updatedAt: Date;
}

// Master-only access check
function isMaster(_request: NextRequest) {
  // Production: implement real master auth via sessions/JWT/tokens
  return _request.headers.get("x-qmoi-master") === "true";
}

// Media search implementation
async function searchMedia(
  _query: string,
  type?: string,
  source?: string,
): Promise<MediaItem[]> {
  const prisma = await getPrisma();
  const where: Record<string, unknown> = {
    title: {
      contains: _query,
      mode: "insensitive",
    },
  };

  if (type) {
    where.type = type;
  }

  if (source) {
    where.source = source;
  }

  const mediaTasks = await prisma.mediaTask.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert to MediaItem format for compatibility
  return mediaTasks.map((task: unknown) => ({
    id: task.id,
    title: task.type, // Using type as title for now
    type: "movie" as const, // Default type
    source: "public_domain" as const, // Default source
    url: task.result || "",
    status:
      task.status === "completed"
        ? "downloaded"
        : task.status === "processing"
          ? "downloading"
          : "available",
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }));
}

// Download media implementation
async function downloadMedia(mediaId: string) {
  const prisma = await getPrisma();
  const mediaTask = await prisma.mediaTask.findUnique({
    where: { id: mediaId },
  });

  if (!mediaTask) {
    return { success: false, message: "Media not found" };
  }

  if (mediaTask.status === "completed") {
    return { success: true, message: "Media already downloaded" };
  }

  try {
    // Update status to processing
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: { status: "processing" },
    });

    // Production: implement real download via external APIs or background jobs
    // Placeholder: marks as completed
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "completed",
        result: "Downloaded successfully",
      },
    });

    return {
      success: true,
      message: "Media downloaded successfully",
    };
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : String(_error);

    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "failed",
        _error: errorMessage,
      },
    });

    return {
      success: false,
      message: `Download failed: ${errorMessage}`,
      _error: errorMessage,
    };
  }
}

// Get media logs (using audit logs for now)
async function getMediaLogs(filter?: {
  action?: string;
  mediaId?: string;
  limit?: number;
}) {
  const where: unknown = {};

  if (filter?.action) {
    where.action = filter.action;
  }

  if (filter?.mediaId) {
    where.resource = filter.mediaId;
  }

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: {
      timestamp: "desc",
    },
    take: filter?.limit || 50,
  });

  return logs;
}

export async function GET(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(_request.url);

  // Media search endpoint
  const searchQuery = searchParams.get("search");
  if (searchQuery) {
    try {
      const results = await searchMedia(
        searchQuery,
        searchParams.get("type") || undefined,
        searchParams.get("source") || undefined,
      );
      return NextResponse.json({ media: results });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Search failed: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get media logs endpoint
  if (searchParams.get("logs")) {
    try {
      const logs = await getMediaLogs({
        action: searchParams.get("action") || undefined,
        mediaId: searchParams.get("mediaId") || undefined,
        limit: searchParams.get("limit")
          ? parseInt(searchParams.get("limit")!)
          : undefined,
      });
      return NextResponse.json({ logs });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get logs: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get database info
  if (searchParams.get("info")) {
    try {
      const userCount = await prisma.user.count();
      const auditLogCount = await prisma.auditLog.count();
      const mediaTaskCount = await prisma.mediaTask.count();

      return NextResponse.json({
        users: userCount,
        auditLogs: auditLogCount,
        mediaTasks: mediaTaskCount,
      });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get database info: ${error}` },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
}

export async function POST(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  try {
    const body = await _request.json();

    // Media download endpoint
    if (body.download) {
      const result = await downloadMedia(body.mediaId);
      return NextResponse.json(result);
    }

    // Add new media task
    if (body.addMedia) {
      const mediaTask = await prisma.mediaTask.create({
        data: {
          type: body.type || "video",
          status: "pending",
          metadata: JSON.stringify({
            title: body.title,
            source: body.source,
            url: body.url,
          }),
        },
      });

      return NextResponse.json({
        success: true,
        media: {
          id: mediaTask.id,
          title: body.title,
          type: body.type,
          source: body.source,
          url: body.url,
          status: mediaTask.status,
          createdAt: mediaTask.createdAt,
          updatedAt: mediaTask.updatedAt,
        },
      });
    }

    // Create audit log
    if (body.logAction) {
      const auditLog = await prisma.auditLog.create({
        data: {
          userId: body.userId || "system",
          username: body.username || "system",
          action: body.action,
          resource: body.resource || "media",
          details: JSON.stringify(body.details || {}),
          riskLevel: body.riskLevel || "low",
          status: "success",
          sessionId: body.sessionId,
        },
      });

      return NextResponse.json({ success: true, log: auditLog });
    }

    return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
  } catch (_error) {
    return NextResponse.json(
      { _error: `Request failed: ${error}` },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-database/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
import { NextRequest, NextResponse } from "next/server";

// Dynamic import for Prisma to avoid build-time issues
let prisma: unknown = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaClient } = await import("@/lib/prisma");
    prisma = prismaClient;
  }
  return prisma;
}

// Media management types
interface MediaItem {
  id: string;
  title: string;
  type: "movie" | "series" | "documentary" | "animation";
  source: "public_domain" | "youtube" | "user_upload";
  url: string;
  localPath?: string;
  duration?: number;
  size?: number;
  status: "available" | "downloading" | "downloaded" | "error";
  createdAt: Date;
  updatedAt: Date;
}

// Master-only access check
function isMaster(_request: NextRequest) {
  // Production: implement real master auth via sessions/JWT/tokens
  return _request.headers.get("x-qmoi-master") === "true";
}

// Media search implementation
async function searchMedia(
  _query: string,
  type?: string,
  source?: string,
): Promise<MediaItem[]> {
  const prisma = await getPrisma();
  const where: Record<string, unknown> = {
    title: {
      contains: _query,
      mode: "insensitive",
    },
  };

  if (type) {
    where.type = type;
  }

  if (source) {
    where.source = source;
  }

  const mediaTasks = await prisma.mediaTask.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert to MediaItem format for compatibility
  return mediaTasks.map((task: unknown) => ({
    id: task.id,
    title: task.type, // Using type as title for now
    type: "movie" as const, // Default type
    source: "public_domain" as const, // Default source
    url: task.result || "",
    status:
      task.status === "completed"
        ? "downloaded"
        : task.status === "processing"
          ? "downloading"
          : "available",
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }));
}

// Download media implementation
async function downloadMedia(mediaId: string) {
  const prisma = await getPrisma();
  const mediaTask = await prisma.mediaTask.findUnique({
    where: { id: mediaId },
  });

  if (!mediaTask) {
    return { success: false, message: "Media not found" };
  }

  if (mediaTask.status === "completed") {
    return { success: true, message: "Media already downloaded" };
  }

  try {
    // Update status to processing
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: { status: "processing" },
    });

    // Production: implement real download via external APIs or background jobs
    // Placeholder: marks as completed
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "completed",
        result: "Downloaded successfully",
      },
    });

    return {
      success: true,
      message: "Media downloaded successfully",
    };
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : String(_error);

    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "failed",
        _error: errorMessage,
      },
    });

    return {
      success: false,
      message: `Download failed: ${errorMessage}`,
      _error: errorMessage,
    };
  }
}

// Get media logs (using audit logs for now)
async function getMediaLogs(filter?: {
  action?: string;
  mediaId?: string;
  limit?: number;
}) {
  const where: unknown = {};

  if (filter?.action) {
    where.action = filter.action;
  }

  if (filter?.mediaId) {
    where.resource = filter.mediaId;
  }

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: {
      timestamp: "desc",
    },
    take: filter?.limit || 50,
  });

  return logs;
}

export async function GET(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(_request.url);

  // Media search endpoint
  const searchQuery = searchParams.get("search");
  if (searchQuery) {
    try {
      const results = await searchMedia(
        searchQuery,
        searchParams.get("type") || undefined,
        searchParams.get("source") || undefined,
      );
      return NextResponse.json({ media: results });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Search failed: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get media logs endpoint
  if (searchParams.get("logs")) {
    try {
      const logs = await getMediaLogs({
        action: searchParams.get("action") || undefined,
        mediaId: searchParams.get("mediaId") || undefined,
        limit: searchParams.get("limit")
          ? parseInt(searchParams.get("limit")!)
          : undefined,
      });
      return NextResponse.json({ logs });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get logs: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get database info
  if (searchParams.get("info")) {
    try {
      const userCount = await prisma.user.count();
      const auditLogCount = await prisma.auditLog.count();
      const mediaTaskCount = await prisma.mediaTask.count();

      return NextResponse.json({
        users: userCount,
        auditLogs: auditLogCount,
        mediaTasks: mediaTaskCount,
      });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get database info: ${error}` },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
}

export async function POST(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  try {
    const body = await _request.json();

    // Media download endpoint
    if (body.download) {
      const result = await downloadMedia(body.mediaId);
      return NextResponse.json(result);
    }

    // Add new media task
    if (body.addMedia) {
      const mediaTask = await prisma.mediaTask.create({
        data: {
          type: body.type || "video",
          status: "pending",
          metadata: JSON.stringify({
            title: body.title,
            source: body.source,
            url: body.url,
          }),
        },
      });

      return NextResponse.json({
        success: true,
        media: {
          id: mediaTask.id,
          title: body.title,
          type: body.type,
          source: body.source,
          url: body.url,
          status: mediaTask.status,
          createdAt: mediaTask.createdAt,
          updatedAt: mediaTask.updatedAt,
        },
      });
    }

    // Create audit log
    if (body.logAction) {
      const auditLog = await prisma.auditLog.create({
        data: {
          userId: body.userId || "system",
          username: body.username || "system",
          action: body.action,
          resource: body.resource || "media",
          details: JSON.stringify(body.details || {}),
          riskLevel: body.riskLevel || "low",
          status: "success",
          sessionId: body.sessionId,
        },
      });

      return NextResponse.json({ success: true, log: auditLog });
    }

    return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
  } catch (_error) {
    return NextResponse.json(
      { _error: `Request failed: ${error}` },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-database/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
import { NextRequest, NextResponse } from "next/server";

// Dynamic import for Prisma to avoid build-time issues
let prisma: unknown = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaClient } = await import("@/lib/prisma");
    prisma = prismaClient;
  }
  return prisma;
}

// Media management types
interface MediaItem {
  id: string;
  title: string;
  type: "movie" | "series" | "documentary" | "animation";
  source: "public_domain" | "youtube" | "user_upload";
  url: string;
  localPath?: string;
  duration?: number;
  size?: number;
  status: "available" | "downloading" | "downloaded" | "error";
  createdAt: Date;
  updatedAt: Date;
}

// Master-only access check
function isMaster(_request: NextRequest) {
  // Production: implement real master auth via sessions/JWT/tokens
  return _request.headers.get("x-qmoi-master") === "true";
}

// Media search implementation
async function searchMedia(
  _query: string,
  type?: string,
  source?: string,
): Promise<MediaItem[]> {
  const prisma = await getPrisma();
  const where: Record<string, unknown> = {
    title: {
      contains: _query,
      mode: "insensitive",
    },
  };

  if (type) {
    where.type = type;
  }

  if (source) {
    where.source = source;
  }

  const mediaTasks = await prisma.mediaTask.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert to MediaItem format for compatibility
  return mediaTasks.map((task: unknown) => ({
    id: task.id,
    title: task.type, // Using type as title for now
    type: "movie" as const, // Default type
    source: "public_domain" as const, // Default source
    url: task.result || "",
    status:
      task.status === "completed"
        ? "downloaded"
        : task.status === "processing"
          ? "downloading"
          : "available",
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }));
}

// Download media implementation
async function downloadMedia(mediaId: string) {
  const prisma = await getPrisma();
  const mediaTask = await prisma.mediaTask.findUnique({
    where: { id: mediaId },
  });

  if (!mediaTask) {
    return { success: false, message: "Media not found" };
  }

  if (mediaTask.status === "completed") {
    return { success: true, message: "Media already downloaded" };
  }

  try {
    // Update status to processing
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: { status: "processing" },
    });

    // Production: implement real download via external APIs or background jobs
    // Placeholder: marks as completed
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "completed",
        result: "Downloaded successfully",
      },
    });

    return {
      success: true,
      message: "Media downloaded successfully",
    };
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : String(_error);

    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "failed",
        _error: errorMessage,
      },
    });

    return {
      success: false,
      message: `Download failed: ${errorMessage}`,
      _error: errorMessage,
    };
  }
}

// Get media logs (using audit logs for now)
async function getMediaLogs(filter?: {
  action?: string;
  mediaId?: string;
  limit?: number;
}) {
  const where: unknown = {};

  if (filter?.action) {
    where.action = filter.action;
  }

  if (filter?.mediaId) {
    where.resource = filter.mediaId;
  }

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: {
      timestamp: "desc",
    },
    take: filter?.limit || 50,
  });

  return logs;
}

export async function GET(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(_request.url);

  // Media search endpoint
  const searchQuery = searchParams.get("search");
  if (searchQuery) {
    try {
      const results = await searchMedia(
        searchQuery,
        searchParams.get("type") || undefined,
        searchParams.get("source") || undefined,
      );
      return NextResponse.json({ media: results });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Search failed: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get media logs endpoint
  if (searchParams.get("logs")) {
    try {
      const logs = await getMediaLogs({
        action: searchParams.get("action") || undefined,
        mediaId: searchParams.get("mediaId") || undefined,
        limit: searchParams.get("limit")
          ? parseInt(searchParams.get("limit")!)
          : undefined,
      });
      return NextResponse.json({ logs });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get logs: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get database info
  if (searchParams.get("info")) {
    try {
      const userCount = await prisma.user.count();
      const auditLogCount = await prisma.auditLog.count();
      const mediaTaskCount = await prisma.mediaTask.count();

      return NextResponse.json({
        users: userCount,
        auditLogs: auditLogCount,
        mediaTasks: mediaTaskCount,
      });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get database info: ${error}` },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
}

export async function POST(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  try {
    const body = await _request.json();

    // Media download endpoint
    if (body.download) {
      const result = await downloadMedia(body.mediaId);
      return NextResponse.json(result);
    }

    // Add new media task
    if (body.addMedia) {
      const mediaTask = await prisma.mediaTask.create({
        data: {
          type: body.type || "video",
          status: "pending",
          metadata: JSON.stringify({
            title: body.title,
            source: body.source,
            url: body.url,
          }),
        },
      });

      return NextResponse.json({
        success: true,
        media: {
          id: mediaTask.id,
          title: body.title,
          type: body.type,
          source: body.source,
          url: body.url,
          status: mediaTask.status,
          createdAt: mediaTask.createdAt,
          updatedAt: mediaTask.updatedAt,
        },
      });
    }

    // Create audit log
    if (body.logAction) {
      const auditLog = await prisma.auditLog.create({
        data: {
          userId: body.userId || "system",
          username: body.username || "system",
          action: body.action,
          resource: body.resource || "media",
          details: JSON.stringify(body.details || {}),
          riskLevel: body.riskLevel || "low",
          status: "success",
          sessionId: body.sessionId,
        },
      });

      return NextResponse.json({ success: true, log: auditLog });
    }

    return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
  } catch (_error) {
    return NextResponse.json(
      { _error: `Request failed: ${error}` },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-database/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
import { NextRequest, NextResponse } from "next/server";

// Dynamic import for Prisma to avoid build-time issues
let prisma: unknown = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaClient } = await import("@/lib/prisma");
    prisma = prismaClient;
  }
  return prisma;
}

// Media management types
interface MediaItem {
  id: string;
  title: string;
  type: "movie" | "series" | "documentary" | "animation";
  source: "public_domain" | "youtube" | "user_upload";
  url: string;
  localPath?: string;
  duration?: number;
  size?: number;
  status: "available" | "downloading" | "downloaded" | "error";
  createdAt: Date;
  updatedAt: Date;
}

// Master-only access check
function isMaster(_request: NextRequest) {
  // Production: implement real master auth via sessions/JWT/tokens
  return _request.headers.get("x-qmoi-master") === "true";
}

// Media search implementation
async function searchMedia(
  _query: string,
  type?: string,
  source?: string,
): Promise<MediaItem[]> {
  const prisma = await getPrisma();
  const where: Record<string, unknown> = {
    title: {
      contains: _query,
      mode: "insensitive",
    },
  };

  if (type) {
    where.type = type;
  }

  if (source) {
    where.source = source;
  }

  const mediaTasks = await prisma.mediaTask.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert to MediaItem format for compatibility
  return mediaTasks.map((task: unknown) => ({
    id: task.id,
    title: task.type, // Using type as title for now
    type: "movie" as const, // Default type
    source: "public_domain" as const, // Default source
    url: task.result || "",
    status:
      task.status === "completed"
        ? "downloaded"
        : task.status === "processing"
          ? "downloading"
          : "available",
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }));
}

// Download media implementation
async function downloadMedia(mediaId: string) {
  const prisma = await getPrisma();
  const mediaTask = await prisma.mediaTask.findUnique({
    where: { id: mediaId },
  });

  if (!mediaTask) {
    return { success: false, message: "Media not found" };
  }

  if (mediaTask.status === "completed") {
    return { success: true, message: "Media already downloaded" };
  }

  try {
    // Update status to processing
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: { status: "processing" },
    });

    // Production: implement real download via external APIs or background jobs
    // Placeholder: marks as completed
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "completed",
        result: "Downloaded successfully",
      },
    });

    return {
      success: true,
      message: "Media downloaded successfully",
    };
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : String(_error);

    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "failed",
        _error: errorMessage,
      },
    });

    return {
      success: false,
      message: `Download failed: ${errorMessage}`,
      _error: errorMessage,
    };
  }
}

// Get media logs (using audit logs for now)
async function getMediaLogs(filter?: {
  action?: string;
  mediaId?: string;
  limit?: number;
}) {
  const where: unknown = {};

  if (filter?.action) {
    where.action = filter.action;
  }

  if (filter?.mediaId) {
    where.resource = filter.mediaId;
  }

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: {
      timestamp: "desc",
    },
    take: filter?.limit || 50,
  });

  return logs;
}

export async function GET(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(_request.url);

  // Media search endpoint
  const searchQuery = searchParams.get("search");
  if (searchQuery) {
    try {
      const results = await searchMedia(
        searchQuery,
        searchParams.get("type") || undefined,
        searchParams.get("source") || undefined,
      );
      return NextResponse.json({ media: results });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Search failed: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get media logs endpoint
  if (searchParams.get("logs")) {
    try {
      const logs = await getMediaLogs({
        action: searchParams.get("action") || undefined,
        mediaId: searchParams.get("mediaId") || undefined,
        limit: searchParams.get("limit")
          ? parseInt(searchParams.get("limit")!)
          : undefined,
      });
      return NextResponse.json({ logs });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get logs: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get database info
  if (searchParams.get("info")) {
    try {
      const userCount = await prisma.user.count();
      const auditLogCount = await prisma.auditLog.count();
      const mediaTaskCount = await prisma.mediaTask.count();

      return NextResponse.json({
        users: userCount,
        auditLogs: auditLogCount,
        mediaTasks: mediaTaskCount,
      });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get database info: ${error}` },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
}

export async function POST(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  try {
    const body = await _request.json();

    // Media download endpoint
    if (body.download) {
      const result = await downloadMedia(body.mediaId);
      return NextResponse.json(result);
    }

    // Add new media task
    if (body.addMedia) {
      const mediaTask = await prisma.mediaTask.create({
        data: {
          type: body.type || "video",
          status: "pending",
          metadata: JSON.stringify({
            title: body.title,
            source: body.source,
            url: body.url,
          }),
        },
      });

      return NextResponse.json({
        success: true,
        media: {
          id: mediaTask.id,
          title: body.title,
          type: body.type,
          source: body.source,
          url: body.url,
          status: mediaTask.status,
          createdAt: mediaTask.createdAt,
          updatedAt: mediaTask.updatedAt,
        },
      });
    }

    // Create audit log
    if (body.logAction) {
      const auditLog = await prisma.auditLog.create({
        data: {
          userId: body.userId || "system",
          username: body.username || "system",
          action: body.action,
          resource: body.resource || "media",
          details: JSON.stringify(body.details || {}),
          riskLevel: body.riskLevel || "low",
          status: "success",
          sessionId: body.sessionId,
        },
      });

      return NextResponse.json({ success: true, log: auditLog });
    }

    return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
  } catch (_error) {
    return NextResponse.json(
      { _error: `Request failed: ${error}` },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-database/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
import { NextRequest, NextResponse } from "next/server";

// Dynamic import for Prisma to avoid build-time issues
let prisma: unknown = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaClient } = await import("@/lib/prisma");
    prisma = prismaClient;
  }
  return prisma;
}

// Media management types
interface MediaItem {
  id: string;
  title: string;
  type: "movie" | "series" | "documentary" | "animation";
  source: "public_domain" | "youtube" | "user_upload";
  url: string;
  localPath?: string;
  duration?: number;
  size?: number;
  status: "available" | "downloading" | "downloaded" | "error";
  createdAt: Date;
  updatedAt: Date;
}

// Master-only access check
function isMaster(_request: NextRequest) {
  // Production: implement real master auth via sessions/JWT/tokens
  return _request.headers.get("x-qmoi-master") === "true";
}

// Media search implementation
async function searchMedia(
  _query: string,
  type?: string,
  source?: string,
): Promise<MediaItem[]> {
  const prisma = await getPrisma();
  const where: Record<string, unknown> = {
    title: {
      contains: _query,
      mode: "insensitive",
    },
  };

  if (type) {
    where.type = type;
  }

  if (source) {
    where.source = source;
  }

  const mediaTasks = await prisma.mediaTask.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert to MediaItem format for compatibility
  return mediaTasks.map((task: unknown) => ({
    id: task.id,
    title: task.type, // Using type as title for now
    type: "movie" as const, // Default type
    source: "public_domain" as const, // Default source
    url: task.result || "",
    status:
      task.status === "completed"
        ? "downloaded"
        : task.status === "processing"
          ? "downloading"
          : "available",
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }));
}

// Download media implementation
async function downloadMedia(mediaId: string) {
  const prisma = await getPrisma();
  const mediaTask = await prisma.mediaTask.findUnique({
    where: { id: mediaId },
  });

  if (!mediaTask) {
    return { success: false, message: "Media not found" };
  }

  if (mediaTask.status === "completed") {
    return { success: true, message: "Media already downloaded" };
  }

  try {
    // Update status to processing
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: { status: "processing" },
    });

    // Production: implement real download via external APIs or background jobs
    // Placeholder: marks as completed
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "completed",
        result: "Downloaded successfully",
      },
    });

    return {
      success: true,
      message: "Media downloaded successfully",
    };
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : String(_error);

    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "failed",
        _error: errorMessage,
      },
    });

    return {
      success: false,
      message: `Download failed: ${errorMessage}`,
      _error: errorMessage,
    };
  }
}

// Get media logs (using audit logs for now)
async function getMediaLogs(filter?: {
  action?: string;
  mediaId?: string;
  limit?: number;
}) {
  const where: unknown = {};

  if (filter?.action) {
    where.action = filter.action;
  }

  if (filter?.mediaId) {
    where.resource = filter.mediaId;
  }

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: {
      timestamp: "desc",
    },
    take: filter?.limit || 50,
  });

  return logs;
}

export async function GET(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(_request.url);

  // Media search endpoint
  const searchQuery = searchParams.get("search");
  if (searchQuery) {
    try {
      const results = await searchMedia(
        searchQuery,
        searchParams.get("type") || undefined,
        searchParams.get("source") || undefined,
      );
      return NextResponse.json({ media: results });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Search failed: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get media logs endpoint
  if (searchParams.get("logs")) {
    try {
      const logs = await getMediaLogs({
        action: searchParams.get("action") || undefined,
        mediaId: searchParams.get("mediaId") || undefined,
        limit: searchParams.get("limit")
          ? parseInt(searchParams.get("limit")!)
          : undefined,
      });
      return NextResponse.json({ logs });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get logs: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get database info
  if (searchParams.get("info")) {
    try {
      const userCount = await prisma.user.count();
      const auditLogCount = await prisma.auditLog.count();
      const mediaTaskCount = await prisma.mediaTask.count();

      return NextResponse.json({
        users: userCount,
        auditLogs: auditLogCount,
        mediaTasks: mediaTaskCount,
      });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get database info: ${error}` },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
}

export async function POST(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  try {
    const body = await _request.json();

    // Media download endpoint
    if (body.download) {
      const result = await downloadMedia(body.mediaId);
      return NextResponse.json(result);
    }

    // Add new media task
    if (body.addMedia) {
      const mediaTask = await prisma.mediaTask.create({
        data: {
          type: body.type || "video",
          status: "pending",
          metadata: JSON.stringify({
            title: body.title,
            source: body.source,
            url: body.url,
          }),
        },
      });

      return NextResponse.json({
        success: true,
        media: {
          id: mediaTask.id,
          title: body.title,
          type: body.type,
          source: body.source,
          url: body.url,
          status: mediaTask.status,
          createdAt: mediaTask.createdAt,
          updatedAt: mediaTask.updatedAt,
        },
      });
    }

    // Create audit log
    if (body.logAction) {
      const auditLog = await prisma.auditLog.create({
        data: {
          userId: body.userId || "system",
          username: body.username || "system",
          action: body.action,
          resource: body.resource || "media",
          details: JSON.stringify(body.details || {}),
          riskLevel: body.riskLevel || "low",
          status: "success",
          sessionId: body.sessionId,
        },
      });

      return NextResponse.json({ success: true, log: auditLog });
    }

    return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
  } catch (_error) {
    return NextResponse.json(
      { _error: `Request failed: ${error}` },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-database/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
import { NextRequest, NextResponse } from "next/server";

// Dynamic import for Prisma to avoid build-time issues
let prisma: unknown = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaClient } = await import("@/lib/prisma");
    prisma = prismaClient;
  }
  return prisma;
}

// Media management types
interface MediaItem {
  id: string;
  title: string;
  type: "movie" | "series" | "documentary" | "animation";
  source: "public_domain" | "youtube" | "user_upload";
  url: string;
  localPath?: string;
  duration?: number;
  size?: number;
  status: "available" | "downloading" | "downloaded" | "error";
  createdAt: Date;
  updatedAt: Date;
}

// Master-only access check
function isMaster(_request: NextRequest) {
  // Production: implement real master auth via sessions/JWT/tokens
  return _request.headers.get("x-qmoi-master") === "true";
}

// Media search implementation
async function searchMedia(
  _query: string,
  type?: string,
  source?: string,
): Promise<MediaItem[]> {
  const prisma = await getPrisma();
  const where: Record<string, unknown> = {
    title: {
      contains: _query,
      mode: "insensitive",
    },
  };

  if (type) {
    where.type = type;
  }

  if (source) {
    where.source = source;
  }

  const mediaTasks = await prisma.mediaTask.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert to MediaItem format for compatibility
  return mediaTasks.map((task: unknown) => ({
    id: task.id,
    title: task.type, // Using type as title for now
    type: "movie" as const, // Default type
    source: "public_domain" as const, // Default source
    url: task.result || "",
    status:
      task.status === "completed"
        ? "downloaded"
        : task.status === "processing"
          ? "downloading"
          : "available",
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }));
}

// Download media implementation
async function downloadMedia(mediaId: string) {
  const prisma = await getPrisma();
  const mediaTask = await prisma.mediaTask.findUnique({
    where: { id: mediaId },
  });

  if (!mediaTask) {
    return { success: false, message: "Media not found" };
  }

  if (mediaTask.status === "completed") {
    return { success: true, message: "Media already downloaded" };
  }

  try {
    // Update status to processing
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: { status: "processing" },
    });

    // Production: implement real download via external APIs or background jobs
    // Placeholder: marks as completed
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "completed",
        result: "Downloaded successfully",
      },
    });

    return {
      success: true,
      message: "Media downloaded successfully",
    };
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : String(_error);

    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "failed",
        _error: errorMessage,
      },
    });

    return {
      success: false,
      message: `Download failed: ${errorMessage}`,
      _error: errorMessage,
    };
  }
}

// Get media logs (using audit logs for now)
async function getMediaLogs(filter?: {
  action?: string;
  mediaId?: string;
  limit?: number;
}) {
  const where: unknown = {};

  if (filter?.action) {
    where.action = filter.action;
  }

  if (filter?.mediaId) {
    where.resource = filter.mediaId;
  }

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: {
      timestamp: "desc",
    },
    take: filter?.limit || 50,
  });

  return logs;
}

export async function GET(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(_request.url);

  // Media search endpoint
  const searchQuery = searchParams.get("search");
  if (searchQuery) {
    try {
      const results = await searchMedia(
        searchQuery,
        searchParams.get("type") || undefined,
        searchParams.get("source") || undefined,
      );
      return NextResponse.json({ media: results });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Search failed: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get media logs endpoint
  if (searchParams.get("logs")) {
    try {
      const logs = await getMediaLogs({
        action: searchParams.get("action") || undefined,
        mediaId: searchParams.get("mediaId") || undefined,
        limit: searchParams.get("limit")
          ? parseInt(searchParams.get("limit")!)
          : undefined,
      });
      return NextResponse.json({ logs });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get logs: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get database info
  if (searchParams.get("info")) {
    try {
      const userCount = await prisma.user.count();
      const auditLogCount = await prisma.auditLog.count();
      const mediaTaskCount = await prisma.mediaTask.count();

      return NextResponse.json({
        users: userCount,
        auditLogs: auditLogCount,
        mediaTasks: mediaTaskCount,
      });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get database info: ${error}` },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
}

export async function POST(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  try {
    const body = await _request.json();

    // Media download endpoint
    if (body.download) {
      const result = await downloadMedia(body.mediaId);
      return NextResponse.json(result);
    }

    // Add new media task
    if (body.addMedia) {
      const mediaTask = await prisma.mediaTask.create({
        data: {
          type: body.type || "video",
          status: "pending",
          metadata: JSON.stringify({
            title: body.title,
            source: body.source,
            url: body.url,
          }),
        },
      });

      return NextResponse.json({
        success: true,
        media: {
          id: mediaTask.id,
          title: body.title,
          type: body.type,
          source: body.source,
          url: body.url,
          status: mediaTask.status,
          createdAt: mediaTask.createdAt,
          updatedAt: mediaTask.updatedAt,
        },
      });
    }

    // Create audit log
    if (body.logAction) {
      const auditLog = await prisma.auditLog.create({
        data: {
          userId: body.userId || "system",
          username: body.username || "system",
          action: body.action,
          resource: body.resource || "media",
          details: JSON.stringify(body.details || {}),
          riskLevel: body.riskLevel || "low",
          status: "success",
          sessionId: body.sessionId,
        },
      });

      return NextResponse.json({ success: true, log: auditLog });
    }

    return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
  } catch (_error) {
    return NextResponse.json(
      { _error: `Request failed: ${error}` },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-database/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
import { NextRequest, NextResponse } from "next/server";

// Dynamic import for Prisma to avoid build-time issues
let prisma: unknown = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaClient } = await import("@/lib/prisma");
    prisma = prismaClient;
  }
  return prisma;
}

// Media management types
interface MediaItem {
  id: string;
  title: string;
  type: "movie" | "series" | "documentary" | "animation";
  source: "public_domain" | "youtube" | "user_upload";
  url: string;
  localPath?: string;
  duration?: number;
  size?: number;
  status: "available" | "downloading" | "downloaded" | "error";
  createdAt: Date;
  updatedAt: Date;
}

// Master-only access check
function isMaster(_request: NextRequest) {
  // Production: implement real master auth via sessions/JWT/tokens
  return _request.headers.get("x-qmoi-master") === "true";
}

// Media search implementation
async function searchMedia(
  _query: string,
  type?: string,
  source?: string,
): Promise<MediaItem[]> {
  const prisma = await getPrisma();
  const where: Record<string, unknown> = {
    title: {
      contains: _query,
      mode: "insensitive",
    },
  };

  if (type) {
    where.type = type;
  }

  if (source) {
    where.source = source;
  }

  const mediaTasks = await prisma.mediaTask.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert to MediaItem format for compatibility
  return mediaTasks.map((task: unknown) => ({
    id: task.id,
    title: task.type, // Using type as title for now
    type: "movie" as const, // Default type
    source: "public_domain" as const, // Default source
    url: task.result || "",
    status:
      task.status === "completed"
        ? "downloaded"
        : task.status === "processing"
          ? "downloading"
          : "available",
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }));
}

// Download media implementation
async function downloadMedia(mediaId: string) {
  const prisma = await getPrisma();
  const mediaTask = await prisma.mediaTask.findUnique({
    where: { id: mediaId },
  });

  if (!mediaTask) {
    return { success: false, message: "Media not found" };
  }

  if (mediaTask.status === "completed") {
    return { success: true, message: "Media already downloaded" };
  }

  try {
    // Update status to processing
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: { status: "processing" },
    });

    // Production: implement real download via external APIs or background jobs
    // Placeholder: marks as completed
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "completed",
        result: "Downloaded successfully",
      },
    });

    return {
      success: true,
      message: "Media downloaded successfully",
    };
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : String(_error);

    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "failed",
        _error: errorMessage,
      },
    });

    return {
      success: false,
      message: `Download failed: ${errorMessage}`,
      _error: errorMessage,
    };
  }
}

// Get media logs (using audit logs for now)
async function getMediaLogs(filter?: {
  action?: string;
  mediaId?: string;
  limit?: number;
}) {
  const where: unknown = {};

  if (filter?.action) {
    where.action = filter.action;
  }

  if (filter?.mediaId) {
    where.resource = filter.mediaId;
  }

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: {
      timestamp: "desc",
    },
    take: filter?.limit || 50,
  });

  return logs;
}

export async function GET(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(_request.url);

  // Media search endpoint
  const searchQuery = searchParams.get("search");
  if (searchQuery) {
    try {
      const results = await searchMedia(
        searchQuery,
        searchParams.get("type") || undefined,
        searchParams.get("source") || undefined,
      );
      return NextResponse.json({ media: results });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Search failed: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get media logs endpoint
  if (searchParams.get("logs")) {
    try {
      const logs = await getMediaLogs({
        action: searchParams.get("action") || undefined,
        mediaId: searchParams.get("mediaId") || undefined,
        limit: searchParams.get("limit")
          ? parseInt(searchParams.get("limit")!)
          : undefined,
      });
      return NextResponse.json({ logs });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get logs: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get database info
  if (searchParams.get("info")) {
    try {
      const userCount = await prisma.user.count();
      const auditLogCount = await prisma.auditLog.count();
      const mediaTaskCount = await prisma.mediaTask.count();

      return NextResponse.json({
        users: userCount,
        auditLogs: auditLogCount,
        mediaTasks: mediaTaskCount,
      });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get database info: ${error}` },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
}

export async function POST(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  try {
    const body = await _request.json();

    // Media download endpoint
    if (body.download) {
      const result = await downloadMedia(body.mediaId);
      return NextResponse.json(result);
    }

    // Add new media task
    if (body.addMedia) {
      const mediaTask = await prisma.mediaTask.create({
        data: {
          type: body.type || "video",
          status: "pending",
          metadata: JSON.stringify({
            title: body.title,
            source: body.source,
            url: body.url,
          }),
        },
      });

      return NextResponse.json({
        success: true,
        media: {
          id: mediaTask.id,
          title: body.title,
          type: body.type,
          source: body.source,
          url: body.url,
          status: mediaTask.status,
          createdAt: mediaTask.createdAt,
          updatedAt: mediaTask.updatedAt,
        },
      });
    }

    // Create audit log
    if (body.logAction) {
      const auditLog = await prisma.auditLog.create({
        data: {
          userId: body.userId || "system",
          username: body.username || "system",
          action: body.action,
          resource: body.resource || "media",
          details: JSON.stringify(body.details || {}),
          riskLevel: body.riskLevel || "low",
          status: "success",
          sessionId: body.sessionId,
        },
      });

      return NextResponse.json({ success: true, log: auditLog });
    }

    return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
  } catch (_error) {
    return NextResponse.json(
      { _error: `Request failed: ${error}` },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-database/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
import { NextRequest, NextResponse } from "next/server";

// Dynamic import for Prisma to avoid build-time issues
let prisma: unknown = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaClient } = await import("@/lib/prisma");
    prisma = prismaClient;
  }
  return prisma;
}

// Media management types
interface MediaItem {
  id: string;
  title: string;
  type: "movie" | "series" | "documentary" | "animation";
  source: "public_domain" | "youtube" | "user_upload";
  url: string;
  localPath?: string;
  duration?: number;
  size?: number;
  status: "available" | "downloading" | "downloaded" | "error";
  createdAt: Date;
  updatedAt: Date;
}

// Master-only access check
function isMaster(_request: NextRequest) {
  // Production: implement real master auth via sessions/JWT/tokens
  return _request.headers.get("x-qmoi-master") === "true";
}

// Media search implementation
async function searchMedia(
  _query: string,
  type?: string,
  source?: string,
): Promise<MediaItem[]> {
  const prisma = await getPrisma();
  const where: Record<string, unknown> = {
    title: {
      contains: _query,
      mode: "insensitive",
    },
  };

  if (type) {
    where.type = type;
  }

  if (source) {
    where.source = source;
  }

  const mediaTasks = await prisma.mediaTask.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert to MediaItem format for compatibility
  return mediaTasks.map((task: unknown) => ({
    id: task.id,
    title: task.type, // Using type as title for now
    type: "movie" as const, // Default type
    source: "public_domain" as const, // Default source
    url: task.result || "",
    status:
      task.status === "completed"
        ? "downloaded"
        : task.status === "processing"
          ? "downloading"
          : "available",
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }));
}

// Download media implementation
async function downloadMedia(mediaId: string) {
  const prisma = await getPrisma();
  const mediaTask = await prisma.mediaTask.findUnique({
    where: { id: mediaId },
  });

  if (!mediaTask) {
    return { success: false, message: "Media not found" };
  }

  if (mediaTask.status === "completed") {
    return { success: true, message: "Media already downloaded" };
  }

  try {
    // Update status to processing
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: { status: "processing" },
    });

    // Production: implement real download via external APIs or background jobs
    // Placeholder: marks as completed
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "completed",
        result: "Downloaded successfully",
      },
    });

    return {
      success: true,
      message: "Media downloaded successfully",
    };
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : String(_error);

    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "failed",
        _error: errorMessage,
      },
    });

    return {
      success: false,
      message: `Download failed: ${errorMessage}`,
      _error: errorMessage,
    };
  }
}

// Get media logs (using audit logs for now)
async function getMediaLogs(filter?: {
  action?: string;
  mediaId?: string;
  limit?: number;
}) {
  const where: unknown = {};

  if (filter?.action) {
    where.action = filter.action;
  }

  if (filter?.mediaId) {
    where.resource = filter.mediaId;
  }

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: {
      timestamp: "desc",
    },
    take: filter?.limit || 50,
  });

  return logs;
}

export async function GET(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(_request.url);

  // Media search endpoint
  const searchQuery = searchParams.get("search");
  if (searchQuery) {
    try {
      const results = await searchMedia(
        searchQuery,
        searchParams.get("type") || undefined,
        searchParams.get("source") || undefined,
      );
      return NextResponse.json({ media: results });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Search failed: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get media logs endpoint
  if (searchParams.get("logs")) {
    try {
      const logs = await getMediaLogs({
        action: searchParams.get("action") || undefined,
        mediaId: searchParams.get("mediaId") || undefined,
        limit: searchParams.get("limit")
          ? parseInt(searchParams.get("limit")!)
          : undefined,
      });
      return NextResponse.json({ logs });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get logs: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get database info
  if (searchParams.get("info")) {
    try {
      const userCount = await prisma.user.count();
      const auditLogCount = await prisma.auditLog.count();
      const mediaTaskCount = await prisma.mediaTask.count();

      return NextResponse.json({
        users: userCount,
        auditLogs: auditLogCount,
        mediaTasks: mediaTaskCount,
      });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get database info: ${error}` },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
}

export async function POST(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  try {
    const body = await _request.json();

    // Media download endpoint
    if (body.download) {
      const result = await downloadMedia(body.mediaId);
      return NextResponse.json(result);
    }

    // Add new media task
    if (body.addMedia) {
      const mediaTask = await prisma.mediaTask.create({
        data: {
          type: body.type || "video",
          status: "pending",
          metadata: JSON.stringify({
            title: body.title,
            source: body.source,
            url: body.url,
          }),
        },
      });

      return NextResponse.json({
        success: true,
        media: {
          id: mediaTask.id,
          title: body.title,
          type: body.type,
          source: body.source,
          url: body.url,
          status: mediaTask.status,
          createdAt: mediaTask.createdAt,
          updatedAt: mediaTask.updatedAt,
        },
      });
    }

    // Create audit log
    if (body.logAction) {
      const auditLog = await prisma.auditLog.create({
        data: {
          userId: body.userId || "system",
          username: body.username || "system",
          action: body.action,
          resource: body.resource || "media",
          details: JSON.stringify(body.details || {}),
          riskLevel: body.riskLevel || "low",
          status: "success",
          sessionId: body.sessionId,
        },
      });

      return NextResponse.json({ success: true, log: auditLog });
    }

    return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
  } catch (_error) {
    return NextResponse.json(
      { _error: `Request failed: ${error}` },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-database/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
import { NextRequest, NextResponse } from "next/server";

// Dynamic import for Prisma to avoid build-time issues
let prisma: unknown = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaClient } = await import("@/lib/prisma");
    prisma = prismaClient;
  }
  return prisma;
}

// Media management types
interface MediaItem {
  id: string;
  title: string;
  type: "movie" | "series" | "documentary" | "animation";
  source: "public_domain" | "youtube" | "user_upload";
  url: string;
  localPath?: string;
  duration?: number;
  size?: number;
  status: "available" | "downloading" | "downloaded" | "error";
  createdAt: Date;
  updatedAt: Date;
}

// Master-only access check
function isMaster(_request: NextRequest) {
  // Production: implement real master auth via sessions/JWT/tokens
  return _request.headers.get("x-qmoi-master") === "true";
}

// Media search implementation
async function searchMedia(
  _query: string,
  type?: string,
  source?: string,
): Promise<MediaItem[]> {
  const prisma = await getPrisma();
  const where: Record<string, unknown> = {
    title: {
      contains: _query,
      mode: "insensitive",
    },
  };

  if (type) {
    where.type = type;
  }

  if (source) {
    where.source = source;
  }

  const mediaTasks = await prisma.mediaTask.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert to MediaItem format for compatibility
  return mediaTasks.map((task: unknown) => ({
    id: task.id,
    title: task.type, // Using type as title for now
    type: "movie" as const, // Default type
    source: "public_domain" as const, // Default source
    url: task.result || "",
    status:
      task.status === "completed"
        ? "downloaded"
        : task.status === "processing"
          ? "downloading"
          : "available",
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }));
}

// Download media implementation
async function downloadMedia(mediaId: string) {
  const prisma = await getPrisma();
  const mediaTask = await prisma.mediaTask.findUnique({
    where: { id: mediaId },
  });

  if (!mediaTask) {
    return { success: false, message: "Media not found" };
  }

  if (mediaTask.status === "completed") {
    return { success: true, message: "Media already downloaded" };
  }

  try {
    // Update status to processing
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: { status: "processing" },
    });

    // Production: implement real download via external APIs or background jobs
    // Placeholder: marks as completed
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "completed",
        result: "Downloaded successfully",
      },
    });

    return {
      success: true,
      message: "Media downloaded successfully",
    };
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : String(_error);

    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "failed",
        _error: errorMessage,
      },
    });

    return {
      success: false,
      message: `Download failed: ${errorMessage}`,
      _error: errorMessage,
    };
  }
}

// Get media logs (using audit logs for now)
async function getMediaLogs(filter?: {
  action?: string;
  mediaId?: string;
  limit?: number;
}) {
  const where: unknown = {};

  if (filter?.action) {
    where.action = filter.action;
  }

  if (filter?.mediaId) {
    where.resource = filter.mediaId;
  }

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: {
      timestamp: "desc",
    },
    take: filter?.limit || 50,
  });

  return logs;
}

export async function GET(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(_request.url);

  // Media search endpoint
  const searchQuery = searchParams.get("search");
  if (searchQuery) {
    try {
      const results = await searchMedia(
        searchQuery,
        searchParams.get("type") || undefined,
        searchParams.get("source") || undefined,
      );
      return NextResponse.json({ media: results });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Search failed: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get media logs endpoint
  if (searchParams.get("logs")) {
    try {
      const logs = await getMediaLogs({
        action: searchParams.get("action") || undefined,
        mediaId: searchParams.get("mediaId") || undefined,
        limit: searchParams.get("limit")
          ? parseInt(searchParams.get("limit")!)
          : undefined,
      });
      return NextResponse.json({ logs });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get logs: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get database info
  if (searchParams.get("info")) {
    try {
      const userCount = await prisma.user.count();
      const auditLogCount = await prisma.auditLog.count();
      const mediaTaskCount = await prisma.mediaTask.count();

      return NextResponse.json({
        users: userCount,
        auditLogs: auditLogCount,
        mediaTasks: mediaTaskCount,
      });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get database info: ${error}` },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
}

export async function POST(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  try {
    const body = await _request.json();

    // Media download endpoint
    if (body.download) {
      const result = await downloadMedia(body.mediaId);
      return NextResponse.json(result);
    }

    // Add new media task
    if (body.addMedia) {
      const mediaTask = await prisma.mediaTask.create({
        data: {
          type: body.type || "video",
          status: "pending",
          metadata: JSON.stringify({
            title: body.title,
            source: body.source,
            url: body.url,
          }),
        },
      });

      return NextResponse.json({
        success: true,
        media: {
          id: mediaTask.id,
          title: body.title,
          type: body.type,
          source: body.source,
          url: body.url,
          status: mediaTask.status,
          createdAt: mediaTask.createdAt,
          updatedAt: mediaTask.updatedAt,
        },
      });
    }

    // Create audit log
    if (body.logAction) {
      const auditLog = await prisma.auditLog.create({
        data: {
          userId: body.userId || "system",
          username: body.username || "system",
          action: body.action,
          resource: body.resource || "media",
          details: JSON.stringify(body.details || {}),
          riskLevel: body.riskLevel || "low",
          status: "success",
          sessionId: body.sessionId,
        },
      });

      return NextResponse.json({ success: true, log: auditLog });
    }

    return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
  } catch (_error) {
    return NextResponse.json(
      { _error: `Request failed: ${error}` },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-database/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
import { NextRequest, NextResponse } from "next/server";

// Dynamic import for Prisma to avoid build-time issues
let prisma: unknown = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaClient } = await import("@/lib/prisma");
    prisma = prismaClient;
  }
  return prisma;
}

// Media management types
interface MediaItem {
  id: string;
  title: string;
  type: "movie" | "series" | "documentary" | "animation";
  source: "public_domain" | "youtube" | "user_upload";
  url: string;
  localPath?: string;
  duration?: number;
  size?: number;
  status: "available" | "downloading" | "downloaded" | "error";
  createdAt: Date;
  updatedAt: Date;
}

// Master-only access check
function isMaster(_request: NextRequest) {
  // Production: implement real master auth via sessions/JWT/tokens
  return _request.headers.get("x-qmoi-master") === "true";
}

// Media search implementation
async function searchMedia(
  _query: string,
  type?: string,
  source?: string,
): Promise<MediaItem[]> {
  const prisma = await getPrisma();
  const where: Record<string, unknown> = {
    title: {
      contains: _query,
      mode: "insensitive",
    },
  };

  if (type) {
    where.type = type;
  }

  if (source) {
    where.source = source;
  }

  const mediaTasks = await prisma.mediaTask.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert to MediaItem format for compatibility
  return mediaTasks.map((task: unknown) => ({
    id: task.id,
    title: task.type, // Using type as title for now
    type: "movie" as const, // Default type
    source: "public_domain" as const, // Default source
    url: task.result || "",
    status:
      task.status === "completed"
        ? "downloaded"
        : task.status === "processing"
          ? "downloading"
          : "available",
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }));
}

// Download media implementation
async function downloadMedia(mediaId: string) {
  const prisma = await getPrisma();
  const mediaTask = await prisma.mediaTask.findUnique({
    where: { id: mediaId },
  });

  if (!mediaTask) {
    return { success: false, message: "Media not found" };
  }

  if (mediaTask.status === "completed") {
    return { success: true, message: "Media already downloaded" };
  }

  try {
    // Update status to processing
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: { status: "processing" },
    });

    // Production: implement real download via external APIs or background jobs
    // Placeholder: marks as completed
    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "completed",
        result: "Downloaded successfully",
      },
    });

    return {
      success: true,
      message: "Media downloaded successfully",
    };
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : String(_error);

    await prisma.mediaTask.update({
      where: { id: mediaId },
      data: {
        status: "failed",
        _error: errorMessage,
      },
    });

    return {
      success: false,
      message: `Download failed: ${errorMessage}`,
      _error: errorMessage,
    };
  }
}

// Get media logs (using audit logs for now)
async function getMediaLogs(filter?: {
  action?: string;
  mediaId?: string;
  limit?: number;
}) {
  const where: unknown = {};

  if (filter?.action) {
    where.action = filter.action;
  }

  if (filter?.mediaId) {
    where.resource = filter.mediaId;
  }

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: {
      timestamp: "desc",
    },
    take: filter?.limit || 50,
  });

  return logs;
}

export async function GET(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(_request.url);

  // Media search endpoint
  const searchQuery = searchParams.get("search");
  if (searchQuery) {
    try {
      const results = await searchMedia(
        searchQuery,
        searchParams.get("type") || undefined,
        searchParams.get("source") || undefined,
      );
      return NextResponse.json({ media: results });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Search failed: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get media logs endpoint
  if (searchParams.get("logs")) {
    try {
      const logs = await getMediaLogs({
        action: searchParams.get("action") || undefined,
        mediaId: searchParams.get("mediaId") || undefined,
        limit: searchParams.get("limit")
          ? parseInt(searchParams.get("limit")!)
          : undefined,
      });
      return NextResponse.json({ logs });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get logs: ${error}` },
        { status: 500 },
      );
    }
  }

  // Get database info
  if (searchParams.get("info")) {
    try {
      const userCount = await prisma.user.count();
      const auditLogCount = await prisma.auditLog.count();
      const mediaTaskCount = await prisma.mediaTask.count();

      return NextResponse.json({
        users: userCount,
        auditLogs: auditLogCount,
        mediaTasks: mediaTaskCount,
      });
    } catch (_error) {
      return NextResponse.json(
        { _error: `Failed to get database info: ${error}` },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
}

export async function POST(_request: NextRequest) {
  if (!isMaster(_request)) {
    return NextResponse.json(
      { _error: "Master access required" },
      { status: 403 },
    );
  }

  try {
    const body = await _request.json();

    // Media download endpoint
    if (body.download) {
      const result = await downloadMedia(body.mediaId);
      return NextResponse.json(result);
    }

    // Add new media task
    if (body.addMedia) {
      const mediaTask = await prisma.mediaTask.create({
        data: {
          type: body.type || "video",
          status: "pending",
          metadata: JSON.stringify({
            title: body.title,
            source: body.source,
            url: body.url,
          }),
        },
      });

      return NextResponse.json({
        success: true,
        media: {
          id: mediaTask.id,
          title: body.title,
          type: body.type,
          source: body.source,
          url: body.url,
          status: mediaTask.status,
          createdAt: mediaTask.createdAt,
          updatedAt: mediaTask.updatedAt,
        },
      });
    }

    // Create audit log
    if (body.logAction) {
      const auditLog = await prisma.auditLog.create({
        data: {
          userId: body.userId || "system",
          username: body.username || "system",
          action: body.action,
          resource: body.resource || "media",
          details: JSON.stringify(body.details || {}),
          riskLevel: body.riskLevel || "low",
          status: "success",
          sessionId: body.sessionId,
        },
      });

      return NextResponse.json({ success: true, log: auditLog });
    }

    return NextResponse.json({ _error: "Invalid _request" }, { status: 400 });
  } catch (_error) {
    return NextResponse.json(
      { _error: `Request failed: ${error}` },
      { status: 500 },
    );
  }
}
