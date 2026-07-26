import { NextRequest, NextResponse } from "next/server";
import authService from "@/lib/auth/service";
import { db } from "@/lib/db/prisma";

/**
 * GET /api/admin/audit-logs
 * View audit logs with filtering
 * Admin only
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check admin role
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(_request.url);
    const action = searchParams.get("action");
    const userId = searchParams.get("userId");
    const resource = searchParams.get("resource");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const skip = parseInt(searchParams.get("skip") || "0");
    const take = Math.min(parseInt(searchParams.get("take") || "50"), 100);

    // Build query filters
    const filters: Record<string, unknown> = {};

    if (action) (filters as Record<string, unknown>)["action"] = action;
    if (userId) (filters as Record<string, unknown>)["userId"] = userId;
    if (resource) (filters as Record<string, unknown>)["resource"] = resource;

    if (startDate || endDate) {
      const ts: Record<string, Date> = {};
      if (startDate) ts.gte = new Date(startDate);
      if (endDate) ts.lte = new Date(endDate);
      (filters as Record<string, unknown>)["timestamp"] = ts;
    }

    // Fetch audit logs
    const logs = await db.auditLog.findMany({
      where: filters,
      orderBy: { timestamp: "desc" },
      skip,
      take,
      select: {
        id: true,
        userId: true,
        action: true,
        resource: true,
        resourceId: true,
        changes: true,
        ipAddress: true,
        userAgent: true,
        timestamp: true,
      },
    });

    // Get total count
    const total = await db.auditLog.count({ where: filters });

    return NextResponse.json(
      {
        logs,
        pagination: {
          skip,
          take,
          total,
          pages: Math.ceil(total / take),
        },
        filters: {
          action,
          userId,
          resource,
          startDate,
          endDate,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Audit logs _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}

/**
 * Helper function to create audit log entry
 * Usage: Call this from other API routes to log actions
 */
export async function createAuditLog({
  userId,
  action,
  resource,
  resourceId,
  changes,
  ipAddress,
  userAgent,
}: {
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  changes?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}) {
  try {
    return await db.auditLog.create({
      data: {
        userId,
        action,
        resource,
        resourceId,
        changes: changes ? JSON.stringify(changes) : null,
        ipAddress,
        userAgent,
        timestamp: new Date(),
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Error creating audit log:", _error);
    // Don't throw - audit logging should not break main flow
  }
}

/**
 * Audit log export endpoint
 */
export async function POST(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check admin role
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    const body = (await _request.json()) as Record<string, unknown>;
    const format = (body as any).format as string;
    const filters = (body as any).filters as
      | Record<string, unknown>
      | undefined;

    if (!["csv", "json", "pdf"].includes(format)) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid format. Use csv, json, or pdf",
            code: "INVALID_FORMAT",
          },
        },
        { status: 400 },
      );
    }

    // Fetch all logs matching filters (with limit)
    const logs = await db.auditLog.findMany({
      where: filters || {},
      orderBy: { timestamp: "desc" },
      take: 10000,
    });

    let content: string;
    let filename: string;
    let contentType: string;

    if (format === "json") {
      content = JSON.stringify(logs, null, 2);
      filename = `audit-logs-${new Date().toISOString()}.json`;
      contentType = "application/json";
    } else if (format === "csv") {
      content = convertLogsToCSV(logs as any);
      filename = `audit-logs-${new Date().toISOString()}.csv`;
      contentType = "text/csv";
    } else {
      // PDF format - simplified version
      content = JSON.stringify({
        message: "PDF export not yet implemented",
        logs: logs.length,
      });
      filename = `audit-logs-${new Date().toISOString()}.json`;
      contentType = "application/json";
    }

    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Audit log export _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}

function convertLogsToCSV(logs: Record<string, unknown>[]): string {
  if (logs.length === 0) return "No data";

  const headers = [
    "ID",
    "User ID",
    "Action",
    "Resource",
    "Resource ID",
    "IP Address",
    "Timestamp",
  ];
  const rows = logs.map((log) => [
    (log as any).id,
    (log as any).userId,
    (log as any).action,
    (log as any).resource,
    (log as any).resourceId || "",
    (log as any).ipAddress || "",
    (log as any).timestamp,
  ]);

  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
    ),
  ].join("\n");

  return csv;
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/audit-logs/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import authService from "@/lib/auth/service";
import { db } from "@/lib/db/prisma";

/**
 * GET /api/admin/audit-logs
 * View audit logs with filtering
 * Admin only
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check admin role
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(_request.url);
    const action = searchParams.get("action");
    const userId = searchParams.get("userId");
    const resource = searchParams.get("resource");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const skip = parseInt(searchParams.get("skip") || "0");
    const take = Math.min(parseInt(searchParams.get("take") || "50"), 100);

    // Build query filters
    const filters: Record<string, unknown> = {};

    if (action) (filters as Record<string, unknown>)["action"] = action;
    if (userId) (filters as Record<string, unknown>)["userId"] = userId;
    if (resource) (filters as Record<string, unknown>)["resource"] = resource;

    if (startDate || endDate) {
      const ts: Record<string, Date> = {};
      if (startDate) ts.gte = new Date(startDate);
      if (endDate) ts.lte = new Date(endDate);
      (filters as Record<string, unknown>)["timestamp"] = ts;
    }

    // Fetch audit logs
    const logs = await db.auditLog.findMany({
      where: filters,
      orderBy: { timestamp: "desc" },
      skip,
      take,
      select: {
        id: true,
        userId: true,
        action: true,
        resource: true,
        resourceId: true,
        changes: true,
        ipAddress: true,
        userAgent: true,
        timestamp: true,
      },
    });

    // Get total count
    const total = await db.auditLog.count({ where: filters });

    return NextResponse.json(
      {
        logs,
        pagination: {
          skip,
          take,
          total,
          pages: Math.ceil(total / take),
        },
        filters: {
          action,
          userId,
          resource,
          startDate,
          endDate,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Audit logs _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}

/**
 * Helper function to create audit log entry
 * Usage: Call this from other API routes to log actions
 */
export async function createAuditLog({
  userId,
  action,
  resource,
  resourceId,
  changes,
  ipAddress,
  userAgent,
}: {
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  changes?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}) {
  try {
    return await db.auditLog.create({
      data: {
        userId,
        action,
        resource,
        resourceId,
        changes: changes ? JSON.stringify(changes) : null,
        ipAddress,
        userAgent,
        timestamp: new Date(),
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Error creating audit log:", _error);
    // Don't throw - audit logging should not break main flow
  }
}

/**
 * Audit log export endpoint
 */
export async function POST(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check admin role
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    const body = (await _request.json()) as Record<string, unknown>;
    const format = (body as any).format as string;
    const filters = (body as any).filters as
      | Record<string, unknown>
      | undefined;

    if (!["csv", "json", "pdf"].includes(format)) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid format. Use csv, json, or pdf",
            code: "INVALID_FORMAT",
          },
        },
        { status: 400 },
      );
    }

    // Fetch all logs matching filters (with limit)
    const logs = await db.auditLog.findMany({
      where: filters || {},
      orderBy: { timestamp: "desc" },
      take: 10000,
    });

    let content: string;
    let filename: string;
    let contentType: string;

    if (format === "json") {
      content = JSON.stringify(logs, null, 2);
      filename = `audit-logs-${new Date().toISOString()}.json`;
      contentType = "application/json";
    } else if (format === "csv") {
      content = convertLogsToCSV(logs as any);
      filename = `audit-logs-${new Date().toISOString()}.csv`;
      contentType = "text/csv";
    } else {
      // PDF format - simplified version
      content = JSON.stringify({
        message: "PDF export not yet implemented",
        logs: logs.length,
      });
      filename = `audit-logs-${new Date().toISOString()}.json`;
      contentType = "application/json";
    }

    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Audit log export _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}

function convertLogsToCSV(logs: Record<string, unknown>[]): string {
  if (logs.length === 0) return "No data";

  const headers = [
    "ID",
    "User ID",
    "Action",
    "Resource",
    "Resource ID",
    "IP Address",
    "Timestamp",
  ];
  const rows = logs.map((log) => [
    (log as any).id,
    (log as any).userId,
    (log as any).action,
    (log as any).resource,
    (log as any).resourceId || "",
    (log as any).ipAddress || "",
    (log as any).timestamp,
  ]);

  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
    ),
  ].join("\n");

  return csv;
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/audit-logs/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import authService from "@/lib/auth/service";
import { db } from "@/lib/db/prisma";

/**
 * GET /api/admin/audit-logs
 * View audit logs with filtering
 * Admin only
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check admin role
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(_request.url);
    const action = searchParams.get("action");
    const userId = searchParams.get("userId");
    const resource = searchParams.get("resource");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const skip = parseInt(searchParams.get("skip") || "0");
    const take = Math.min(parseInt(searchParams.get("take") || "50"), 100);

    // Build query filters
    const filters: Record<string, unknown> = {};

    if (action) (filters as Record<string, unknown>)["action"] = action;
    if (userId) (filters as Record<string, unknown>)["userId"] = userId;
    if (resource) (filters as Record<string, unknown>)["resource"] = resource;

    if (startDate || endDate) {
      const ts: Record<string, Date> = {};
      if (startDate) ts.gte = new Date(startDate);
      if (endDate) ts.lte = new Date(endDate);
      (filters as Record<string, unknown>)["timestamp"] = ts;
    }

    // Fetch audit logs
    const logs = await db.auditLog.findMany({
      where: filters,
      orderBy: { timestamp: "desc" },
      skip,
      take,
      select: {
        id: true,
        userId: true,
        action: true,
        resource: true,
        resourceId: true,
        changes: true,
        ipAddress: true,
        userAgent: true,
        timestamp: true,
      },
    });

    // Get total count
    const total = await db.auditLog.count({ where: filters });

    return NextResponse.json(
      {
        logs,
        pagination: {
          skip,
          take,
          total,
          pages: Math.ceil(total / take),
        },
        filters: {
          action,
          userId,
          resource,
          startDate,
          endDate,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Audit logs _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}

/**
 * Helper function to create audit log entry
 * Usage: Call this from other API routes to log actions
 */
export async function createAuditLog({
  userId,
  action,
  resource,
  resourceId,
  changes,
  ipAddress,
  userAgent,
}: {
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  changes?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}) {
  try {
    return await db.auditLog.create({
      data: {
        userId,
        action,
        resource,
        resourceId,
        changes: changes ? JSON.stringify(changes) : null,
        ipAddress,
        userAgent,
        timestamp: new Date(),
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Error creating audit log:", _error);
    // Don't throw - audit logging should not break main flow
  }
}

/**
 * Audit log export endpoint
 */
export async function POST(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check admin role
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    const body = (await _request.json()) as Record<string, unknown>;
    const format = (body as any).format as string;
    const filters = (body as any).filters as
      | Record<string, unknown>
      | undefined;

    if (!["csv", "json", "pdf"].includes(format)) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid format. Use csv, json, or pdf",
            code: "INVALID_FORMAT",
          },
        },
        { status: 400 },
      );
    }

    // Fetch all logs matching filters (with limit)
    const logs = await db.auditLog.findMany({
      where: filters || {},
      orderBy: { timestamp: "desc" },
      take: 10000,
    });

    let content: string;
    let filename: string;
    let contentType: string;

    if (format === "json") {
      content = JSON.stringify(logs, null, 2);
      filename = `audit-logs-${new Date().toISOString()}.json`;
      contentType = "application/json";
    } else if (format === "csv") {
      content = convertLogsToCSV(logs as any);
      filename = `audit-logs-${new Date().toISOString()}.csv`;
      contentType = "text/csv";
    } else {
      // PDF format - simplified version
      content = JSON.stringify({
        message: "PDF export not yet implemented",
        logs: logs.length,
      });
      filename = `audit-logs-${new Date().toISOString()}.json`;
      contentType = "application/json";
    }

    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Audit log export _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}

function convertLogsToCSV(logs: Record<string, unknown>[]): string {
  if (logs.length === 0) return "No data";

  const headers = [
    "ID",
    "User ID",
    "Action",
    "Resource",
    "Resource ID",
    "IP Address",
    "Timestamp",
  ];
  const rows = logs.map((log) => [
    (log as any).id,
    (log as any).userId,
    (log as any).action,
    (log as any).resource,
    (log as any).resourceId || "",
    (log as any).ipAddress || "",
    (log as any).timestamp,
  ]);

  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
    ),
  ].join("\n");

  return csv;
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/audit-logs/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import authService from "@/lib/auth/service";
import { db } from "@/lib/db/prisma";

/**
 * GET /api/admin/audit-logs
 * View audit logs with filtering
 * Admin only
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check admin role
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(_request.url);
    const action = searchParams.get("action");
    const userId = searchParams.get("userId");
    const resource = searchParams.get("resource");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const skip = parseInt(searchParams.get("skip") || "0");
    const take = Math.min(parseInt(searchParams.get("take") || "50"), 100);

    // Build query filters
    const filters: Record<string, unknown> = {};

    if (action) (filters as Record<string, unknown>)["action"] = action;
    if (userId) (filters as Record<string, unknown>)["userId"] = userId;
    if (resource) (filters as Record<string, unknown>)["resource"] = resource;

    if (startDate || endDate) {
      const ts: Record<string, Date> = {};
      if (startDate) ts.gte = new Date(startDate);
      if (endDate) ts.lte = new Date(endDate);
      (filters as Record<string, unknown>)["timestamp"] = ts;
    }

    // Fetch audit logs
    const logs = await db.auditLog.findMany({
      where: filters,
      orderBy: { timestamp: "desc" },
      skip,
      take,
      select: {
        id: true,
        userId: true,
        action: true,
        resource: true,
        resourceId: true,
        changes: true,
        ipAddress: true,
        userAgent: true,
        timestamp: true,
      },
    });

    // Get total count
    const total = await db.auditLog.count({ where: filters });

    return NextResponse.json(
      {
        logs,
        pagination: {
          skip,
          take,
          total,
          pages: Math.ceil(total / take),
        },
        filters: {
          action,
          userId,
          resource,
          startDate,
          endDate,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Audit logs _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}

/**
 * Helper function to create audit log entry
 * Usage: Call this from other API routes to log actions
 */
export async function createAuditLog({
  userId,
  action,
  resource,
  resourceId,
  changes,
  ipAddress,
  userAgent,
}: {
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  changes?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}) {
  try {
    return await db.auditLog.create({
      data: {
        userId,
        action,
        resource,
        resourceId,
        changes: changes ? JSON.stringify(changes) : null,
        ipAddress,
        userAgent,
        timestamp: new Date(),
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Error creating audit log:", _error);
    // Don't throw - audit logging should not break main flow
  }
}

/**
 * Audit log export endpoint
 */
export async function POST(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check admin role
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    const body = (await _request.json()) as Record<string, unknown>;
    const format = (body as any).format as string;
    const filters = (body as any).filters as
      | Record<string, unknown>
      | undefined;

    if (!["csv", "json", "pdf"].includes(format)) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid format. Use csv, json, or pdf",
            code: "INVALID_FORMAT",
          },
        },
        { status: 400 },
      );
    }

    // Fetch all logs matching filters (with limit)
    const logs = await db.auditLog.findMany({
      where: filters || {},
      orderBy: { timestamp: "desc" },
      take: 10000,
    });

    let content: string;
    let filename: string;
    let contentType: string;

    if (format === "json") {
      content = JSON.stringify(logs, null, 2);
      filename = `audit-logs-${new Date().toISOString()}.json`;
      contentType = "application/json";
    } else if (format === "csv") {
      content = convertLogsToCSV(logs as any);
      filename = `audit-logs-${new Date().toISOString()}.csv`;
      contentType = "text/csv";
    } else {
      // PDF format - simplified version
      content = JSON.stringify({
        message: "PDF export not yet implemented",
        logs: logs.length,
      });
      filename = `audit-logs-${new Date().toISOString()}.json`;
      contentType = "application/json";
    }

    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Audit log export _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}

function convertLogsToCSV(logs: Record<string, unknown>[]): string {
  if (logs.length === 0) return "No data";

  const headers = [
    "ID",
    "User ID",
    "Action",
    "Resource",
    "Resource ID",
    "IP Address",
    "Timestamp",
  ];
  const rows = logs.map((log) => [
    (log as any).id,
    (log as any).userId,
    (log as any).action,
    (log as any).resource,
    (log as any).resourceId || "",
    (log as any).ipAddress || "",
    (log as any).timestamp,
  ]);

  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
    ),
  ].join("\n");

  return csv;
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/audit-logs/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import authService from "@/lib/auth/service";
import { db } from "@/lib/db/prisma";

/**
 * GET /api/admin/audit-logs
 * View audit logs with filtering
 * Admin only
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check admin role
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(_request.url);
    const action = searchParams.get("action");
    const userId = searchParams.get("userId");
    const resource = searchParams.get("resource");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const skip = parseInt(searchParams.get("skip") || "0");
    const take = Math.min(parseInt(searchParams.get("take") || "50"), 100);

    // Build query filters
    const filters: Record<string, unknown> = {};

    if (action) (filters as Record<string, unknown>)["action"] = action;
    if (userId) (filters as Record<string, unknown>)["userId"] = userId;
    if (resource) (filters as Record<string, unknown>)["resource"] = resource;

    if (startDate || endDate) {
      const ts: Record<string, Date> = {};
      if (startDate) ts.gte = new Date(startDate);
      if (endDate) ts.lte = new Date(endDate);
      (filters as Record<string, unknown>)["timestamp"] = ts;
    }

    // Fetch audit logs
    const logs = await db.auditLog.findMany({
      where: filters,
      orderBy: { timestamp: "desc" },
      skip,
      take,
      select: {
        id: true,
        userId: true,
        action: true,
        resource: true,
        resourceId: true,
        changes: true,
        ipAddress: true,
        userAgent: true,
        timestamp: true,
      },
    });

    // Get total count
    const total = await db.auditLog.count({ where: filters });

    return NextResponse.json(
      {
        logs,
        pagination: {
          skip,
          take,
          total,
          pages: Math.ceil(total / take),
        },
        filters: {
          action,
          userId,
          resource,
          startDate,
          endDate,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Audit logs _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}

/**
 * Helper function to create audit log entry
 * Usage: Call this from other API routes to log actions
 */
export async function createAuditLog({
  userId,
  action,
  resource,
  resourceId,
  changes,
  ipAddress,
  userAgent,
}: {
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  changes?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}) {
  try {
    return await db.auditLog.create({
      data: {
        userId,
        action,
        resource,
        resourceId,
        changes: changes ? JSON.stringify(changes) : null,
        ipAddress,
        userAgent,
        timestamp: new Date(),
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Error creating audit log:", _error);
    // Don't throw - audit logging should not break main flow
  }
}

/**
 * Audit log export endpoint
 */
export async function POST(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check admin role
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    const body = (await _request.json()) as Record<string, unknown>;
    const format = (body as any).format as string;
    const filters = (body as any).filters as
      | Record<string, unknown>
      | undefined;

    if (!["csv", "json", "pdf"].includes(format)) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid format. Use csv, json, or pdf",
            code: "INVALID_FORMAT",
          },
        },
        { status: 400 },
      );
    }

    // Fetch all logs matching filters (with limit)
    const logs = await db.auditLog.findMany({
      where: filters || {},
      orderBy: { timestamp: "desc" },
      take: 10000,
    });

    let content: string;
    let filename: string;
    let contentType: string;

    if (format === "json") {
      content = JSON.stringify(logs, null, 2);
      filename = `audit-logs-${new Date().toISOString()}.json`;
      contentType = "application/json";
    } else if (format === "csv") {
      content = convertLogsToCSV(logs as any);
      filename = `audit-logs-${new Date().toISOString()}.csv`;
      contentType = "text/csv";
    } else {
      // PDF format - simplified version
      content = JSON.stringify({
        message: "PDF export not yet implemented",
        logs: logs.length,
      });
      filename = `audit-logs-${new Date().toISOString()}.json`;
      contentType = "application/json";
    }

    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Audit log export _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}

function convertLogsToCSV(logs: Record<string, unknown>[]): string {
  if (logs.length === 0) return "No data";

  const headers = [
    "ID",
    "User ID",
    "Action",
    "Resource",
    "Resource ID",
    "IP Address",
    "Timestamp",
  ];
  const rows = logs.map((log) => [
    (log as any).id,
    (log as any).userId,
    (log as any).action,
    (log as any).resource,
    (log as any).resourceId || "",
    (log as any).ipAddress || "",
    (log as any).timestamp,
  ]);

  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
    ),
  ].join("\n");

  return csv;
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/audit-logs/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import authService from "@/lib/auth/service";
import { db } from "@/lib/db/prisma";

/**
 * GET /api/admin/audit-logs
 * View audit logs with filtering
 * Admin only
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check admin role
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(_request.url);
    const action = searchParams.get("action");
    const userId = searchParams.get("userId");
    const resource = searchParams.get("resource");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const skip = parseInt(searchParams.get("skip") || "0");
    const take = Math.min(parseInt(searchParams.get("take") || "50"), 100);

    // Build query filters
    const filters: Record<string, unknown> = {};

    if (action) (filters as Record<string, unknown>)["action"] = action;
    if (userId) (filters as Record<string, unknown>)["userId"] = userId;
    if (resource) (filters as Record<string, unknown>)["resource"] = resource;

    if (startDate || endDate) {
      const ts: Record<string, Date> = {};
      if (startDate) ts.gte = new Date(startDate);
      if (endDate) ts.lte = new Date(endDate);
      (filters as Record<string, unknown>)["timestamp"] = ts;
    }

    // Fetch audit logs
    const logs = await db.auditLog.findMany({
      where: filters,
      orderBy: { timestamp: "desc" },
      skip,
      take,
      select: {
        id: true,
        userId: true,
        action: true,
        resource: true,
        resourceId: true,
        changes: true,
        ipAddress: true,
        userAgent: true,
        timestamp: true,
      },
    });

    // Get total count
    const total = await db.auditLog.count({ where: filters });

    return NextResponse.json(
      {
        logs,
        pagination: {
          skip,
          take,
          total,
          pages: Math.ceil(total / take),
        },
        filters: {
          action,
          userId,
          resource,
          startDate,
          endDate,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Audit logs _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}

/**
 * Helper function to create audit log entry
 * Usage: Call this from other API routes to log actions
 */
export async function createAuditLog({
  userId,
  action,
  resource,
  resourceId,
  changes,
  ipAddress,
  userAgent,
}: {
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  changes?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}) {
  try {
    return await db.auditLog.create({
      data: {
        userId,
        action,
        resource,
        resourceId,
        changes: changes ? JSON.stringify(changes) : null,
        ipAddress,
        userAgent,
        timestamp: new Date(),
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Error creating audit log:", _error);
    // Don't throw - audit logging should not break main flow
  }
}

/**
 * Audit log export endpoint
 */
export async function POST(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check admin role
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    const body = (await _request.json()) as Record<string, unknown>;
    const format = (body as any).format as string;
    const filters = (body as any).filters as
      | Record<string, unknown>
      | undefined;

    if (!["csv", "json", "pdf"].includes(format)) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid format. Use csv, json, or pdf",
            code: "INVALID_FORMAT",
          },
        },
        { status: 400 },
      );
    }

    // Fetch all logs matching filters (with limit)
    const logs = await db.auditLog.findMany({
      where: filters || {},
      orderBy: { timestamp: "desc" },
      take: 10000,
    });

    let content: string;
    let filename: string;
    let contentType: string;

    if (format === "json") {
      content = JSON.stringify(logs, null, 2);
      filename = `audit-logs-${new Date().toISOString()}.json`;
      contentType = "application/json";
    } else if (format === "csv") {
      content = convertLogsToCSV(logs as any);
      filename = `audit-logs-${new Date().toISOString()}.csv`;
      contentType = "text/csv";
    } else {
      // PDF format - simplified version
      content = JSON.stringify({
        message: "PDF export not yet implemented",
        logs: logs.length,
      });
      filename = `audit-logs-${new Date().toISOString()}.json`;
      contentType = "application/json";
    }

    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Audit log export _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}

function convertLogsToCSV(logs: Record<string, unknown>[]): string {
  if (logs.length === 0) return "No data";

  const headers = [
    "ID",
    "User ID",
    "Action",
    "Resource",
    "Resource ID",
    "IP Address",
    "Timestamp",
  ];
  const rows = logs.map((log) => [
    (log as any).id,
    (log as any).userId,
    (log as any).action,
    (log as any).resource,
    (log as any).resourceId || "",
    (log as any).ipAddress || "",
    (log as any).timestamp,
  ]);

  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
    ),
  ].join("\n");

  return csv;
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/audit-logs/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import authService from "@/lib/auth/service";
import { db } from "@/lib/db/prisma";

/**
 * GET /api/admin/audit-logs
 * View audit logs with filtering
 * Admin only
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check admin role
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(_request.url);
    const action = searchParams.get("action");
    const userId = searchParams.get("userId");
    const resource = searchParams.get("resource");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const skip = parseInt(searchParams.get("skip") || "0");
    const take = Math.min(parseInt(searchParams.get("take") || "50"), 100);

    // Build query filters
    const filters: Record<string, unknown> = {};

    if (action) (filters as Record<string, unknown>)["action"] = action;
    if (userId) (filters as Record<string, unknown>)["userId"] = userId;
    if (resource) (filters as Record<string, unknown>)["resource"] = resource;

    if (startDate || endDate) {
      const ts: Record<string, Date> = {};
      if (startDate) ts.gte = new Date(startDate);
      if (endDate) ts.lte = new Date(endDate);
      (filters as Record<string, unknown>)["timestamp"] = ts;
    }

    // Fetch audit logs
    const logs = await db.auditLog.findMany({
      where: filters,
      orderBy: { timestamp: "desc" },
      skip,
      take,
      select: {
        id: true,
        userId: true,
        action: true,
        resource: true,
        resourceId: true,
        changes: true,
        ipAddress: true,
        userAgent: true,
        timestamp: true,
      },
    });

    // Get total count
    const total = await db.auditLog.count({ where: filters });

    return NextResponse.json(
      {
        logs,
        pagination: {
          skip,
          take,
          total,
          pages: Math.ceil(total / take),
        },
        filters: {
          action,
          userId,
          resource,
          startDate,
          endDate,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Audit logs _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}

/**
 * Helper function to create audit log entry
 * Usage: Call this from other API routes to log actions
 */
export async function createAuditLog({
  userId,
  action,
  resource,
  resourceId,
  changes,
  ipAddress,
  userAgent,
}: {
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  changes?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}) {
  try {
    return await db.auditLog.create({
      data: {
        userId,
        action,
        resource,
        resourceId,
        changes: changes ? JSON.stringify(changes) : null,
        ipAddress,
        userAgent,
        timestamp: new Date(),
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Error creating audit log:", _error);
    // Don't throw - audit logging should not break main flow
  }
}

/**
 * Audit log export endpoint
 */
export async function POST(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check admin role
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    const body = (await _request.json()) as Record<string, unknown>;
    const format = (body as any).format as string;
    const filters = (body as any).filters as
      | Record<string, unknown>
      | undefined;

    if (!["csv", "json", "pdf"].includes(format)) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid format. Use csv, json, or pdf",
            code: "INVALID_FORMAT",
          },
        },
        { status: 400 },
      );
    }

    // Fetch all logs matching filters (with limit)
    const logs = await db.auditLog.findMany({
      where: filters || {},
      orderBy: { timestamp: "desc" },
      take: 10000,
    });

    let content: string;
    let filename: string;
    let contentType: string;

    if (format === "json") {
      content = JSON.stringify(logs, null, 2);
      filename = `audit-logs-${new Date().toISOString()}.json`;
      contentType = "application/json";
    } else if (format === "csv") {
      content = convertLogsToCSV(logs as any);
      filename = `audit-logs-${new Date().toISOString()}.csv`;
      contentType = "text/csv";
    } else {
      // PDF format - simplified version
      content = JSON.stringify({
        message: "PDF export not yet implemented",
        logs: logs.length,
      });
      filename = `audit-logs-${new Date().toISOString()}.json`;
      contentType = "application/json";
    }

    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Audit log export _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}

function convertLogsToCSV(logs: Record<string, unknown>[]): string {
  if (logs.length === 0) return "No data";

  const headers = [
    "ID",
    "User ID",
    "Action",
    "Resource",
    "Resource ID",
    "IP Address",
    "Timestamp",
  ];
  const rows = logs.map((log) => [
    (log as any).id,
    (log as any).userId,
    (log as any).action,
    (log as any).resource,
    (log as any).resourceId || "",
    (log as any).ipAddress || "",
    (log as any).timestamp,
  ]);

  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
    ),
  ].join("\n");

  return csv;
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/audit-logs/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import authService from "@/lib/auth/service";
import { db } from "@/lib/db/prisma";

/**
 * GET /api/admin/audit-logs
 * View audit logs with filtering
 * Admin only
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check admin role
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(_request.url);
    const action = searchParams.get("action");
    const userId = searchParams.get("userId");
    const resource = searchParams.get("resource");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const skip = parseInt(searchParams.get("skip") || "0");
    const take = Math.min(parseInt(searchParams.get("take") || "50"), 100);

    // Build query filters
    const filters: Record<string, unknown> = {};

    if (action) (filters as Record<string, unknown>)["action"] = action;
    if (userId) (filters as Record<string, unknown>)["userId"] = userId;
    if (resource) (filters as Record<string, unknown>)["resource"] = resource;

    if (startDate || endDate) {
      const ts: Record<string, Date> = {};
      if (startDate) ts.gte = new Date(startDate);
      if (endDate) ts.lte = new Date(endDate);
      (filters as Record<string, unknown>)["timestamp"] = ts;
    }

    // Fetch audit logs
    const logs = await db.auditLog.findMany({
      where: filters,
      orderBy: { timestamp: "desc" },
      skip,
      take,
      select: {
        id: true,
        userId: true,
        action: true,
        resource: true,
        resourceId: true,
        changes: true,
        ipAddress: true,
        userAgent: true,
        timestamp: true,
      },
    });

    // Get total count
    const total = await db.auditLog.count({ where: filters });

    return NextResponse.json(
      {
        logs,
        pagination: {
          skip,
          take,
          total,
          pages: Math.ceil(total / take),
        },
        filters: {
          action,
          userId,
          resource,
          startDate,
          endDate,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Audit logs _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}

/**
 * Helper function to create audit log entry
 * Usage: Call this from other API routes to log actions
 */
export async function createAuditLog({
  userId,
  action,
  resource,
  resourceId,
  changes,
  ipAddress,
  userAgent,
}: {
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  changes?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}) {
  try {
    return await db.auditLog.create({
      data: {
        userId,
        action,
        resource,
        resourceId,
        changes: changes ? JSON.stringify(changes) : null,
        ipAddress,
        userAgent,
        timestamp: new Date(),
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Error creating audit log:", _error);
    // Don't throw - audit logging should not break main flow
  }
}

/**
 * Audit log export endpoint
 */
export async function POST(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check admin role
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    const body = (await _request.json()) as Record<string, unknown>;
    const format = (body as any).format as string;
    const filters = (body as any).filters as
      | Record<string, unknown>
      | undefined;

    if (!["csv", "json", "pdf"].includes(format)) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid format. Use csv, json, or pdf",
            code: "INVALID_FORMAT",
          },
        },
        { status: 400 },
      );
    }

    // Fetch all logs matching filters (with limit)
    const logs = await db.auditLog.findMany({
      where: filters || {},
      orderBy: { timestamp: "desc" },
      take: 10000,
    });

    let content: string;
    let filename: string;
    let contentType: string;

    if (format === "json") {
      content = JSON.stringify(logs, null, 2);
      filename = `audit-logs-${new Date().toISOString()}.json`;
      contentType = "application/json";
    } else if (format === "csv") {
      content = convertLogsToCSV(logs as any);
      filename = `audit-logs-${new Date().toISOString()}.csv`;
      contentType = "text/csv";
    } else {
      // PDF format - simplified version
      content = JSON.stringify({
        message: "PDF export not yet implemented",
        logs: logs.length,
      });
      filename = `audit-logs-${new Date().toISOString()}.json`;
      contentType = "application/json";
    }

    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Audit log export _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}

function convertLogsToCSV(logs: Record<string, unknown>[]): string {
  if (logs.length === 0) return "No data";

  const headers = [
    "ID",
    "User ID",
    "Action",
    "Resource",
    "Resource ID",
    "IP Address",
    "Timestamp",
  ];
  const rows = logs.map((log) => [
    (log as any).id,
    (log as any).userId,
    (log as any).action,
    (log as any).resource,
    (log as any).resourceId || "",
    (log as any).ipAddress || "",
    (log as any).timestamp,
  ]);

  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
    ),
  ].join("\n");

  return csv;
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/audit-logs/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import authService from "@/lib/auth/service";
import { db } from "@/lib/db/prisma";

/**
 * GET /api/admin/audit-logs
 * View audit logs with filtering
 * Admin only
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check admin role
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(_request.url);
    const action = searchParams.get("action");
    const userId = searchParams.get("userId");
    const resource = searchParams.get("resource");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const skip = parseInt(searchParams.get("skip") || "0");
    const take = Math.min(parseInt(searchParams.get("take") || "50"), 100);

    // Build query filters
    const filters: Record<string, unknown> = {};

    if (action) (filters as Record<string, unknown>)["action"] = action;
    if (userId) (filters as Record<string, unknown>)["userId"] = userId;
    if (resource) (filters as Record<string, unknown>)["resource"] = resource;

    if (startDate || endDate) {
      const ts: Record<string, Date> = {};
      if (startDate) ts.gte = new Date(startDate);
      if (endDate) ts.lte = new Date(endDate);
      (filters as Record<string, unknown>)["timestamp"] = ts;
    }

    // Fetch audit logs
    const logs = await db.auditLog.findMany({
      where: filters,
      orderBy: { timestamp: "desc" },
      skip,
      take,
      select: {
        id: true,
        userId: true,
        action: true,
        resource: true,
        resourceId: true,
        changes: true,
        ipAddress: true,
        userAgent: true,
        timestamp: true,
      },
    });

    // Get total count
    const total = await db.auditLog.count({ where: filters });

    return NextResponse.json(
      {
        logs,
        pagination: {
          skip,
          take,
          total,
          pages: Math.ceil(total / take),
        },
        filters: {
          action,
          userId,
          resource,
          startDate,
          endDate,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Audit logs _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}

/**
 * Helper function to create audit log entry
 * Usage: Call this from other API routes to log actions
 */
export async function createAuditLog({
  userId,
  action,
  resource,
  resourceId,
  changes,
  ipAddress,
  userAgent,
}: {
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  changes?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}) {
  try {
    return await db.auditLog.create({
      data: {
        userId,
        action,
        resource,
        resourceId,
        changes: changes ? JSON.stringify(changes) : null,
        ipAddress,
        userAgent,
        timestamp: new Date(),
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Error creating audit log:", _error);
    // Don't throw - audit logging should not break main flow
  }
}

/**
 * Audit log export endpoint
 */
export async function POST(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check admin role
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    const body = (await _request.json()) as Record<string, unknown>;
    const format = (body as any).format as string;
    const filters = (body as any).filters as
      | Record<string, unknown>
      | undefined;

    if (!["csv", "json", "pdf"].includes(format)) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid format. Use csv, json, or pdf",
            code: "INVALID_FORMAT",
          },
        },
        { status: 400 },
      );
    }

    // Fetch all logs matching filters (with limit)
    const logs = await db.auditLog.findMany({
      where: filters || {},
      orderBy: { timestamp: "desc" },
      take: 10000,
    });

    let content: string;
    let filename: string;
    let contentType: string;

    if (format === "json") {
      content = JSON.stringify(logs, null, 2);
      filename = `audit-logs-${new Date().toISOString()}.json`;
      contentType = "application/json";
    } else if (format === "csv") {
      content = convertLogsToCSV(logs as any);
      filename = `audit-logs-${new Date().toISOString()}.csv`;
      contentType = "text/csv";
    } else {
      // PDF format - simplified version
      content = JSON.stringify({
        message: "PDF export not yet implemented",
        logs: logs.length,
      });
      filename = `audit-logs-${new Date().toISOString()}.json`;
      contentType = "application/json";
    }

    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Audit log export _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}

function convertLogsToCSV(logs: Record<string, unknown>[]): string {
  if (logs.length === 0) return "No data";

  const headers = [
    "ID",
    "User ID",
    "Action",
    "Resource",
    "Resource ID",
    "IP Address",
    "Timestamp",
  ];
  const rows = logs.map((log) => [
    (log as any).id,
    (log as any).userId,
    (log as any).action,
    (log as any).resource,
    (log as any).resourceId || "",
    (log as any).ipAddress || "",
    (log as any).timestamp,
  ]);

  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
    ),
  ].join("\n");

  return csv;
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/audit-logs/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import authService from "@/lib/auth/service";
import { db } from "@/lib/db/prisma";

/**
 * GET /api/admin/audit-logs
 * View audit logs with filtering
 * Admin only
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check admin role
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(_request.url);
    const action = searchParams.get("action");
    const userId = searchParams.get("userId");
    const resource = searchParams.get("resource");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const skip = parseInt(searchParams.get("skip") || "0");
    const take = Math.min(parseInt(searchParams.get("take") || "50"), 100);

    // Build query filters
    const filters: Record<string, unknown> = {};

    if (action) (filters as Record<string, unknown>)["action"] = action;
    if (userId) (filters as Record<string, unknown>)["userId"] = userId;
    if (resource) (filters as Record<string, unknown>)["resource"] = resource;

    if (startDate || endDate) {
      const ts: Record<string, Date> = {};
      if (startDate) ts.gte = new Date(startDate);
      if (endDate) ts.lte = new Date(endDate);
      (filters as Record<string, unknown>)["timestamp"] = ts;
    }

    // Fetch audit logs
    const logs = await db.auditLog.findMany({
      where: filters,
      orderBy: { timestamp: "desc" },
      skip,
      take,
      select: {
        id: true,
        userId: true,
        action: true,
        resource: true,
        resourceId: true,
        changes: true,
        ipAddress: true,
        userAgent: true,
        timestamp: true,
      },
    });

    // Get total count
    const total = await db.auditLog.count({ where: filters });

    return NextResponse.json(
      {
        logs,
        pagination: {
          skip,
          take,
          total,
          pages: Math.ceil(total / take),
        },
        filters: {
          action,
          userId,
          resource,
          startDate,
          endDate,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Audit logs _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}

/**
 * Helper function to create audit log entry
 * Usage: Call this from other API routes to log actions
 */
export async function createAuditLog({
  userId,
  action,
  resource,
  resourceId,
  changes,
  ipAddress,
  userAgent,
}: {
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  changes?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}) {
  try {
    return await db.auditLog.create({
      data: {
        userId,
        action,
        resource,
        resourceId,
        changes: changes ? JSON.stringify(changes) : null,
        ipAddress,
        userAgent,
        timestamp: new Date(),
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Error creating audit log:", _error);
    // Don't throw - audit logging should not break main flow
  }
}

/**
 * Audit log export endpoint
 */
export async function POST(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check admin role
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    const body = (await _request.json()) as Record<string, unknown>;
    const format = (body as any).format as string;
    const filters = (body as any).filters as
      | Record<string, unknown>
      | undefined;

    if (!["csv", "json", "pdf"].includes(format)) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid format. Use csv, json, or pdf",
            code: "INVALID_FORMAT",
          },
        },
        { status: 400 },
      );
    }

    // Fetch all logs matching filters (with limit)
    const logs = await db.auditLog.findMany({
      where: filters || {},
      orderBy: { timestamp: "desc" },
      take: 10000,
    });

    let content: string;
    let filename: string;
    let contentType: string;

    if (format === "json") {
      content = JSON.stringify(logs, null, 2);
      filename = `audit-logs-${new Date().toISOString()}.json`;
      contentType = "application/json";
    } else if (format === "csv") {
      content = convertLogsToCSV(logs as any);
      filename = `audit-logs-${new Date().toISOString()}.csv`;
      contentType = "text/csv";
    } else {
      // PDF format - simplified version
      content = JSON.stringify({
        message: "PDF export not yet implemented",
        logs: logs.length,
      });
      filename = `audit-logs-${new Date().toISOString()}.json`;
      contentType = "application/json";
    }

    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Audit log export _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}

function convertLogsToCSV(logs: Record<string, unknown>[]): string {
  if (logs.length === 0) return "No data";

  const headers = [
    "ID",
    "User ID",
    "Action",
    "Resource",
    "Resource ID",
    "IP Address",
    "Timestamp",
  ];
  const rows = logs.map((log) => [
    (log as any).id,
    (log as any).userId,
    (log as any).action,
    (log as any).resource,
    (log as any).resourceId || "",
    (log as any).ipAddress || "",
    (log as any).timestamp,
  ]);

  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
    ),
  ].join("\n");

  return csv;
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/audit-logs/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import authService from "@/lib/auth/service";
import { db } from "@/lib/db/prisma";

/**
 * GET /api/admin/audit-logs
 * View audit logs with filtering
 * Admin only
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check admin role
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(_request.url);
    const action = searchParams.get("action");
    const userId = searchParams.get("userId");
    const resource = searchParams.get("resource");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const skip = parseInt(searchParams.get("skip") || "0");
    const take = Math.min(parseInt(searchParams.get("take") || "50"), 100);

    // Build query filters
    const filters: Record<string, unknown> = {};

    if (action) (filters as Record<string, unknown>)["action"] = action;
    if (userId) (filters as Record<string, unknown>)["userId"] = userId;
    if (resource) (filters as Record<string, unknown>)["resource"] = resource;

    if (startDate || endDate) {
      const ts: Record<string, Date> = {};
      if (startDate) ts.gte = new Date(startDate);
      if (endDate) ts.lte = new Date(endDate);
      (filters as Record<string, unknown>)["timestamp"] = ts;
    }

    // Fetch audit logs
    const logs = await db.auditLog.findMany({
      where: filters,
      orderBy: { timestamp: "desc" },
      skip,
      take,
      select: {
        id: true,
        userId: true,
        action: true,
        resource: true,
        resourceId: true,
        changes: true,
        ipAddress: true,
        userAgent: true,
        timestamp: true,
      },
    });

    // Get total count
    const total = await db.auditLog.count({ where: filters });

    return NextResponse.json(
      {
        logs,
        pagination: {
          skip,
          take,
          total,
          pages: Math.ceil(total / take),
        },
        filters: {
          action,
          userId,
          resource,
          startDate,
          endDate,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Audit logs _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}

/**
 * Helper function to create audit log entry
 * Usage: Call this from other API routes to log actions
 */
export async function createAuditLog({
  userId,
  action,
  resource,
  resourceId,
  changes,
  ipAddress,
  userAgent,
}: {
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  changes?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}) {
  try {
    return await db.auditLog.create({
      data: {
        userId,
        action,
        resource,
        resourceId,
        changes: changes ? JSON.stringify(changes) : null,
        ipAddress,
        userAgent,
        timestamp: new Date(),
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Error creating audit log:", _error);
    // Don't throw - audit logging should not break main flow
  }
}

/**
 * Audit log export endpoint
 */
export async function POST(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check admin role
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    const body = (await _request.json()) as Record<string, unknown>;
    const format = (body as any).format as string;
    const filters = (body as any).filters as
      | Record<string, unknown>
      | undefined;

    if (!["csv", "json", "pdf"].includes(format)) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid format. Use csv, json, or pdf",
            code: "INVALID_FORMAT",
          },
        },
        { status: 400 },
      );
    }

    // Fetch all logs matching filters (with limit)
    const logs = await db.auditLog.findMany({
      where: filters || {},
      orderBy: { timestamp: "desc" },
      take: 10000,
    });

    let content: string;
    let filename: string;
    let contentType: string;

    if (format === "json") {
      content = JSON.stringify(logs, null, 2);
      filename = `audit-logs-${new Date().toISOString()}.json`;
      contentType = "application/json";
    } else if (format === "csv") {
      content = convertLogsToCSV(logs as any);
      filename = `audit-logs-${new Date().toISOString()}.csv`;
      contentType = "text/csv";
    } else {
      // PDF format - simplified version
      content = JSON.stringify({
        message: "PDF export not yet implemented",
        logs: logs.length,
      });
      filename = `audit-logs-${new Date().toISOString()}.json`;
      contentType = "application/json";
    }

    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Audit log export _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}

function convertLogsToCSV(logs: Record<string, unknown>[]): string {
  if (logs.length === 0) return "No data";

  const headers = [
    "ID",
    "User ID",
    "Action",
    "Resource",
    "Resource ID",
    "IP Address",
    "Timestamp",
  ];
  const rows = logs.map((log) => [
    (log as any).id,
    (log as any).userId,
    (log as any).action,
    (log as any).resource,
    (log as any).resourceId || "",
    (log as any).ipAddress || "",
    (log as any).timestamp,
  ]);

  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
    ),
  ].join("\n");

  return csv;
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/audit-logs/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import authService from "@/lib/auth/service";
import { db } from "@/lib/db/prisma";

/**
 * GET /api/admin/audit-logs
 * View audit logs with filtering
 * Admin only
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check admin role
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(_request.url);
    const action = searchParams.get("action");
    const userId = searchParams.get("userId");
    const resource = searchParams.get("resource");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const skip = parseInt(searchParams.get("skip") || "0");
    const take = Math.min(parseInt(searchParams.get("take") || "50"), 100);

    // Build query filters
    const filters: Record<string, unknown> = {};

    if (action) (filters as Record<string, unknown>)["action"] = action;
    if (userId) (filters as Record<string, unknown>)["userId"] = userId;
    if (resource) (filters as Record<string, unknown>)["resource"] = resource;

    if (startDate || endDate) {
      const ts: Record<string, Date> = {};
      if (startDate) ts.gte = new Date(startDate);
      if (endDate) ts.lte = new Date(endDate);
      (filters as Record<string, unknown>)["timestamp"] = ts;
    }

    // Fetch audit logs
    const logs = await db.auditLog.findMany({
      where: filters,
      orderBy: { timestamp: "desc" },
      skip,
      take,
      select: {
        id: true,
        userId: true,
        action: true,
        resource: true,
        resourceId: true,
        changes: true,
        ipAddress: true,
        userAgent: true,
        timestamp: true,
      },
    });

    // Get total count
    const total = await db.auditLog.count({ where: filters });

    return NextResponse.json(
      {
        logs,
        pagination: {
          skip,
          take,
          total,
          pages: Math.ceil(total / take),
        },
        filters: {
          action,
          userId,
          resource,
          startDate,
          endDate,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Audit logs _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}

/**
 * Helper function to create audit log entry
 * Usage: Call this from other API routes to log actions
 */
export async function createAuditLog({
  userId,
  action,
  resource,
  resourceId,
  changes,
  ipAddress,
  userAgent,
}: {
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  changes?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}) {
  try {
    return await db.auditLog.create({
      data: {
        userId,
        action,
        resource,
        resourceId,
        changes: changes ? JSON.stringify(changes) : null,
        ipAddress,
        userAgent,
        timestamp: new Date(),
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Error creating audit log:", _error);
    // Don't throw - audit logging should not break main flow
  }
}

/**
 * Audit log export endpoint
 */
export async function POST(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check admin role
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    const body = (await _request.json()) as Record<string, unknown>;
    const format = (body as any).format as string;
    const filters = (body as any).filters as
      | Record<string, unknown>
      | undefined;

    if (!["csv", "json", "pdf"].includes(format)) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid format. Use csv, json, or pdf",
            code: "INVALID_FORMAT",
          },
        },
        { status: 400 },
      );
    }

    // Fetch all logs matching filters (with limit)
    const logs = await db.auditLog.findMany({
      where: filters || {},
      orderBy: { timestamp: "desc" },
      take: 10000,
    });

    let content: string;
    let filename: string;
    let contentType: string;

    if (format === "json") {
      content = JSON.stringify(logs, null, 2);
      filename = `audit-logs-${new Date().toISOString()}.json`;
      contentType = "application/json";
    } else if (format === "csv") {
      content = convertLogsToCSV(logs as any);
      filename = `audit-logs-${new Date().toISOString()}.csv`;
      contentType = "text/csv";
    } else {
      // PDF format - simplified version
      content = JSON.stringify({
        message: "PDF export not yet implemented",
        logs: logs.length,
      });
      filename = `audit-logs-${new Date().toISOString()}.json`;
      contentType = "application/json";
    }

    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Audit log export _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}

function convertLogsToCSV(logs: Record<string, unknown>[]): string {
  if (logs.length === 0) return "No data";

  const headers = [
    "ID",
    "User ID",
    "Action",
    "Resource",
    "Resource ID",
    "IP Address",
    "Timestamp",
  ];
  const rows = logs.map((log) => [
    (log as any).id,
    (log as any).userId,
    (log as any).action,
    (log as any).resource,
    (log as any).resourceId || "",
    (log as any).ipAddress || "",
    (log as any).timestamp,
  ]);

  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
    ),
  ].join("\n");

  return csv;
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/audit-logs/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import authService from "@/lib/auth/service";
import { db } from "@/lib/db/prisma";

/**
 * GET /api/admin/audit-logs
 * View audit logs with filtering
 * Admin only
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check admin role
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(_request.url);
    const action = searchParams.get("action");
    const userId = searchParams.get("userId");
    const resource = searchParams.get("resource");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const skip = parseInt(searchParams.get("skip") || "0");
    const take = Math.min(parseInt(searchParams.get("take") || "50"), 100);

    // Build query filters
    const filters: Record<string, unknown> = {};

    if (action) (filters as Record<string, unknown>)["action"] = action;
    if (userId) (filters as Record<string, unknown>)["userId"] = userId;
    if (resource) (filters as Record<string, unknown>)["resource"] = resource;

    if (startDate || endDate) {
      const ts: Record<string, Date> = {};
      if (startDate) ts.gte = new Date(startDate);
      if (endDate) ts.lte = new Date(endDate);
      (filters as Record<string, unknown>)["timestamp"] = ts;
    }

    // Fetch audit logs
    const logs = await db.auditLog.findMany({
      where: filters,
      orderBy: { timestamp: "desc" },
      skip,
      take,
      select: {
        id: true,
        userId: true,
        action: true,
        resource: true,
        resourceId: true,
        changes: true,
        ipAddress: true,
        userAgent: true,
        timestamp: true,
      },
    });

    // Get total count
    const total = await db.auditLog.count({ where: filters });

    return NextResponse.json(
      {
        logs,
        pagination: {
          skip,
          take,
          total,
          pages: Math.ceil(total / take),
        },
        filters: {
          action,
          userId,
          resource,
          startDate,
          endDate,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Audit logs _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}

/**
 * Helper function to create audit log entry
 * Usage: Call this from other API routes to log actions
 */
export async function createAuditLog({
  userId,
  action,
  resource,
  resourceId,
  changes,
  ipAddress,
  userAgent,
}: {
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  changes?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}) {
  try {
    return await db.auditLog.create({
      data: {
        userId,
        action,
        resource,
        resourceId,
        changes: changes ? JSON.stringify(changes) : null,
        ipAddress,
        userAgent,
        timestamp: new Date(),
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Error creating audit log:", _error);
    // Don't throw - audit logging should not break main flow
  }
}

/**
 * Audit log export endpoint
 */
export async function POST(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check admin role
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    const body = (await _request.json()) as Record<string, unknown>;
    const format = (body as any).format as string;
    const filters = (body as any).filters as
      | Record<string, unknown>
      | undefined;

    if (!["csv", "json", "pdf"].includes(format)) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid format. Use csv, json, or pdf",
            code: "INVALID_FORMAT",
          },
        },
        { status: 400 },
      );
    }

    // Fetch all logs matching filters (with limit)
    const logs = await db.auditLog.findMany({
      where: filters || {},
      orderBy: { timestamp: "desc" },
      take: 10000,
    });

    let content: string;
    let filename: string;
    let contentType: string;

    if (format === "json") {
      content = JSON.stringify(logs, null, 2);
      filename = `audit-logs-${new Date().toISOString()}.json`;
      contentType = "application/json";
    } else if (format === "csv") {
      content = convertLogsToCSV(logs as any);
      filename = `audit-logs-${new Date().toISOString()}.csv`;
      contentType = "text/csv";
    } else {
      // PDF format - simplified version
      content = JSON.stringify({
        message: "PDF export not yet implemented",
        logs: logs.length,
      });
      filename = `audit-logs-${new Date().toISOString()}.json`;
      contentType = "application/json";
    }

    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Audit log export _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}

function convertLogsToCSV(logs: Record<string, unknown>[]): string {
  if (logs.length === 0) return "No data";

  const headers = [
    "ID",
    "User ID",
    "Action",
    "Resource",
    "Resource ID",
    "IP Address",
    "Timestamp",
  ];
  const rows = logs.map((log) => [
    (log as any).id,
    (log as any).userId,
    (log as any).action,
    (log as any).resource,
    (log as any).resourceId || "",
    (log as any).ipAddress || "",
    (log as any).timestamp,
  ]);

  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
    ),
  ].join("\n");

  return csv;
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/audit-logs/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import authService from "@/lib/auth/service";
import { db } from "@/lib/db/prisma";

/**
 * GET /api/admin/audit-logs
 * View audit logs with filtering
 * Admin only
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check admin role
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(_request.url);
    const action = searchParams.get("action");
    const userId = searchParams.get("userId");
    const resource = searchParams.get("resource");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const skip = parseInt(searchParams.get("skip") || "0");
    const take = Math.min(parseInt(searchParams.get("take") || "50"), 100);

    // Build query filters
    const filters: Record<string, unknown> = {};

    if (action) (filters as Record<string, unknown>)["action"] = action;
    if (userId) (filters as Record<string, unknown>)["userId"] = userId;
    if (resource) (filters as Record<string, unknown>)["resource"] = resource;

    if (startDate || endDate) {
      const ts: Record<string, Date> = {};
      if (startDate) ts.gte = new Date(startDate);
      if (endDate) ts.lte = new Date(endDate);
      (filters as Record<string, unknown>)["timestamp"] = ts;
    }

    // Fetch audit logs
    const logs = await db.auditLog.findMany({
      where: filters,
      orderBy: { timestamp: "desc" },
      skip,
      take,
      select: {
        id: true,
        userId: true,
        action: true,
        resource: true,
        resourceId: true,
        changes: true,
        ipAddress: true,
        userAgent: true,
        timestamp: true,
      },
    });

    // Get total count
    const total = await db.auditLog.count({ where: filters });

    return NextResponse.json(
      {
        logs,
        pagination: {
          skip,
          take,
          total,
          pages: Math.ceil(total / take),
        },
        filters: {
          action,
          userId,
          resource,
          startDate,
          endDate,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Audit logs _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}

/**
 * Helper function to create audit log entry
 * Usage: Call this from other API routes to log actions
 */
export async function createAuditLog({
  userId,
  action,
  resource,
  resourceId,
  changes,
  ipAddress,
  userAgent,
}: {
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  changes?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}) {
  try {
    return await db.auditLog.create({
      data: {
        userId,
        action,
        resource,
        resourceId,
        changes: changes ? JSON.stringify(changes) : null,
        ipAddress,
        userAgent,
        timestamp: new Date(),
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Error creating audit log:", _error);
    // Don't throw - audit logging should not break main flow
  }
}

/**
 * Audit log export endpoint
 */
export async function POST(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check admin role
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    const body = (await _request.json()) as Record<string, unknown>;
    const format = (body as any).format as string;
    const filters = (body as any).filters as
      | Record<string, unknown>
      | undefined;

    if (!["csv", "json", "pdf"].includes(format)) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid format. Use csv, json, or pdf",
            code: "INVALID_FORMAT",
          },
        },
        { status: 400 },
      );
    }

    // Fetch all logs matching filters (with limit)
    const logs = await db.auditLog.findMany({
      where: filters || {},
      orderBy: { timestamp: "desc" },
      take: 10000,
    });

    let content: string;
    let filename: string;
    let contentType: string;

    if (format === "json") {
      content = JSON.stringify(logs, null, 2);
      filename = `audit-logs-${new Date().toISOString()}.json`;
      contentType = "application/json";
    } else if (format === "csv") {
      content = convertLogsToCSV(logs as any);
      filename = `audit-logs-${new Date().toISOString()}.csv`;
      contentType = "text/csv";
    } else {
      // PDF format - simplified version
      content = JSON.stringify({
        message: "PDF export not yet implemented",
        logs: logs.length,
      });
      filename = `audit-logs-${new Date().toISOString()}.json`;
      contentType = "application/json";
    }

    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Audit log export _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}

function convertLogsToCSV(logs: Record<string, unknown>[]): string {
  if (logs.length === 0) return "No data";

  const headers = [
    "ID",
    "User ID",
    "Action",
    "Resource",
    "Resource ID",
    "IP Address",
    "Timestamp",
  ];
  const rows = logs.map((log) => [
    (log as any).id,
    (log as any).userId,
    (log as any).action,
    (log as any).resource,
    (log as any).resourceId || "",
    (log as any).ipAddress || "",
    (log as any).timestamp,
  ]);

  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
    ),
  ].join("\n");

  return csv;
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/audit-logs/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import authService from "@/lib/auth/service";
import { db } from "@/lib/db/prisma";

/**
 * GET /api/admin/audit-logs
 * View audit logs with filtering
 * Admin only
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check admin role
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(_request.url);
    const action = searchParams.get("action");
    const userId = searchParams.get("userId");
    const resource = searchParams.get("resource");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const skip = parseInt(searchParams.get("skip") || "0");
    const take = Math.min(parseInt(searchParams.get("take") || "50"), 100);

    // Build query filters
    const filters: Record<string, unknown> = {};

    if (action) (filters as Record<string, unknown>)["action"] = action;
    if (userId) (filters as Record<string, unknown>)["userId"] = userId;
    if (resource) (filters as Record<string, unknown>)["resource"] = resource;

    if (startDate || endDate) {
      const ts: Record<string, Date> = {};
      if (startDate) ts.gte = new Date(startDate);
      if (endDate) ts.lte = new Date(endDate);
      (filters as Record<string, unknown>)["timestamp"] = ts;
    }

    // Fetch audit logs
    const logs = await db.auditLog.findMany({
      where: filters,
      orderBy: { timestamp: "desc" },
      skip,
      take,
      select: {
        id: true,
        userId: true,
        action: true,
        resource: true,
        resourceId: true,
        changes: true,
        ipAddress: true,
        userAgent: true,
        timestamp: true,
      },
    });

    // Get total count
    const total = await db.auditLog.count({ where: filters });

    return NextResponse.json(
      {
        logs,
        pagination: {
          skip,
          take,
          total,
          pages: Math.ceil(total / take),
        },
        filters: {
          action,
          userId,
          resource,
          startDate,
          endDate,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Audit logs _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}

/**
 * Helper function to create audit log entry
 * Usage: Call this from other API routes to log actions
 */
export async function createAuditLog({
  userId,
  action,
  resource,
  resourceId,
  changes,
  ipAddress,
  userAgent,
}: {
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  changes?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}) {
  try {
    return await db.auditLog.create({
      data: {
        userId,
        action,
        resource,
        resourceId,
        changes: changes ? JSON.stringify(changes) : null,
        ipAddress,
        userAgent,
        timestamp: new Date(),
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Error creating audit log:", _error);
    // Don't throw - audit logging should not break main flow
  }
}

/**
 * Audit log export endpoint
 */
export async function POST(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check admin role
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    const body = (await _request.json()) as Record<string, unknown>;
    const format = (body as any).format as string;
    const filters = (body as any).filters as
      | Record<string, unknown>
      | undefined;

    if (!["csv", "json", "pdf"].includes(format)) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid format. Use csv, json, or pdf",
            code: "INVALID_FORMAT",
          },
        },
        { status: 400 },
      );
    }

    // Fetch all logs matching filters (with limit)
    const logs = await db.auditLog.findMany({
      where: filters || {},
      orderBy: { timestamp: "desc" },
      take: 10000,
    });

    let content: string;
    let filename: string;
    let contentType: string;

    if (format === "json") {
      content = JSON.stringify(logs, null, 2);
      filename = `audit-logs-${new Date().toISOString()}.json`;
      contentType = "application/json";
    } else if (format === "csv") {
      content = convertLogsToCSV(logs as any);
      filename = `audit-logs-${new Date().toISOString()}.csv`;
      contentType = "text/csv";
    } else {
      // PDF format - simplified version
      content = JSON.stringify({
        message: "PDF export not yet implemented",
        logs: logs.length,
      });
      filename = `audit-logs-${new Date().toISOString()}.json`;
      contentType = "application/json";
    }

    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Audit log export _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}

function convertLogsToCSV(logs: Record<string, unknown>[]): string {
  if (logs.length === 0) return "No data";

  const headers = [
    "ID",
    "User ID",
    "Action",
    "Resource",
    "Resource ID",
    "IP Address",
    "Timestamp",
  ];
  const rows = logs.map((log) => [
    (log as any).id,
    (log as any).userId,
    (log as any).action,
    (log as any).resource,
    (log as any).resourceId || "",
    (log as any).ipAddress || "",
    (log as any).timestamp,
  ]);

  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
    ),
  ].join("\n");

  return csv;
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/audit-logs/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import authService from "@/lib/auth/service";
import { db } from "@/lib/db/prisma";

/**
 * GET /api/admin/audit-logs
 * View audit logs with filtering
 * Admin only
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check admin role
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(_request.url);
    const action = searchParams.get("action");
    const userId = searchParams.get("userId");
    const resource = searchParams.get("resource");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const skip = parseInt(searchParams.get("skip") || "0");
    const take = Math.min(parseInt(searchParams.get("take") || "50"), 100);

    // Build query filters
    const filters: Record<string, unknown> = {};

    if (action) (filters as Record<string, unknown>)["action"] = action;
    if (userId) (filters as Record<string, unknown>)["userId"] = userId;
    if (resource) (filters as Record<string, unknown>)["resource"] = resource;

    if (startDate || endDate) {
      const ts: Record<string, Date> = {};
      if (startDate) ts.gte = new Date(startDate);
      if (endDate) ts.lte = new Date(endDate);
      (filters as Record<string, unknown>)["timestamp"] = ts;
    }

    // Fetch audit logs
    const logs = await db.auditLog.findMany({
      where: filters,
      orderBy: { timestamp: "desc" },
      skip,
      take,
      select: {
        id: true,
        userId: true,
        action: true,
        resource: true,
        resourceId: true,
        changes: true,
        ipAddress: true,
        userAgent: true,
        timestamp: true,
      },
    });

    // Get total count
    const total = await db.auditLog.count({ where: filters });

    return NextResponse.json(
      {
        logs,
        pagination: {
          skip,
          take,
          total,
          pages: Math.ceil(total / take),
        },
        filters: {
          action,
          userId,
          resource,
          startDate,
          endDate,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Audit logs _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}

/**
 * Helper function to create audit log entry
 * Usage: Call this from other API routes to log actions
 */
export async function createAuditLog({
  userId,
  action,
  resource,
  resourceId,
  changes,
  ipAddress,
  userAgent,
}: {
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  changes?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}) {
  try {
    return await db.auditLog.create({
      data: {
        userId,
        action,
        resource,
        resourceId,
        changes: changes ? JSON.stringify(changes) : null,
        ipAddress,
        userAgent,
        timestamp: new Date(),
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Error creating audit log:", _error);
    // Don't throw - audit logging should not break main flow
  }
}

/**
 * Audit log export endpoint
 */
export async function POST(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check admin role
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    const body = (await _request.json()) as Record<string, unknown>;
    const format = (body as any).format as string;
    const filters = (body as any).filters as
      | Record<string, unknown>
      | undefined;

    if (!["csv", "json", "pdf"].includes(format)) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid format. Use csv, json, or pdf",
            code: "INVALID_FORMAT",
          },
        },
        { status: 400 },
      );
    }

    // Fetch all logs matching filters (with limit)
    const logs = await db.auditLog.findMany({
      where: filters || {},
      orderBy: { timestamp: "desc" },
      take: 10000,
    });

    let content: string;
    let filename: string;
    let contentType: string;

    if (format === "json") {
      content = JSON.stringify(logs, null, 2);
      filename = `audit-logs-${new Date().toISOString()}.json`;
      contentType = "application/json";
    } else if (format === "csv") {
      content = convertLogsToCSV(logs as any);
      filename = `audit-logs-${new Date().toISOString()}.csv`;
      contentType = "text/csv";
    } else {
      // PDF format - simplified version
      content = JSON.stringify({
        message: "PDF export not yet implemented",
        logs: logs.length,
      });
      filename = `audit-logs-${new Date().toISOString()}.json`;
      contentType = "application/json";
    }

    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Audit log export _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}

function convertLogsToCSV(logs: Record<string, unknown>[]): string {
  if (logs.length === 0) return "No data";

  const headers = [
    "ID",
    "User ID",
    "Action",
    "Resource",
    "Resource ID",
    "IP Address",
    "Timestamp",
  ];
  const rows = logs.map((log) => [
    (log as any).id,
    (log as any).userId,
    (log as any).action,
    (log as any).resource,
    (log as any).resourceId || "",
    (log as any).ipAddress || "",
    (log as any).timestamp,
  ]);

  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
    ),
  ].join("\n");

  return csv;
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/audit-logs/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import authService from "@/lib/auth/service";
import { db } from "@/lib/db/prisma";

/**
 * GET /api/admin/audit-logs
 * View audit logs with filtering
 * Admin only
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check admin role
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(_request.url);
    const action = searchParams.get("action");
    const userId = searchParams.get("userId");
    const resource = searchParams.get("resource");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const skip = parseInt(searchParams.get("skip") || "0");
    const take = Math.min(parseInt(searchParams.get("take") || "50"), 100);

    // Build query filters
    const filters: Record<string, unknown> = {};

    if (action) (filters as Record<string, unknown>)["action"] = action;
    if (userId) (filters as Record<string, unknown>)["userId"] = userId;
    if (resource) (filters as Record<string, unknown>)["resource"] = resource;

    if (startDate || endDate) {
      const ts: Record<string, Date> = {};
      if (startDate) ts.gte = new Date(startDate);
      if (endDate) ts.lte = new Date(endDate);
      (filters as Record<string, unknown>)["timestamp"] = ts;
    }

    // Fetch audit logs
    const logs = await db.auditLog.findMany({
      where: filters,
      orderBy: { timestamp: "desc" },
      skip,
      take,
      select: {
        id: true,
        userId: true,
        action: true,
        resource: true,
        resourceId: true,
        changes: true,
        ipAddress: true,
        userAgent: true,
        timestamp: true,
      },
    });

    // Get total count
    const total = await db.auditLog.count({ where: filters });

    return NextResponse.json(
      {
        logs,
        pagination: {
          skip,
          take,
          total,
          pages: Math.ceil(total / take),
        },
        filters: {
          action,
          userId,
          resource,
          startDate,
          endDate,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Audit logs _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}

/**
 * Helper function to create audit log entry
 * Usage: Call this from other API routes to log actions
 */
export async function createAuditLog({
  userId,
  action,
  resource,
  resourceId,
  changes,
  ipAddress,
  userAgent,
}: {
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  changes?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}) {
  try {
    return await db.auditLog.create({
      data: {
        userId,
        action,
        resource,
        resourceId,
        changes: changes ? JSON.stringify(changes) : null,
        ipAddress,
        userAgent,
        timestamp: new Date(),
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Error creating audit log:", _error);
    // Don't throw - audit logging should not break main flow
  }
}

/**
 * Audit log export endpoint
 */
export async function POST(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check admin role
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    const body = (await _request.json()) as Record<string, unknown>;
    const format = (body as any).format as string;
    const filters = (body as any).filters as
      | Record<string, unknown>
      | undefined;

    if (!["csv", "json", "pdf"].includes(format)) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid format. Use csv, json, or pdf",
            code: "INVALID_FORMAT",
          },
        },
        { status: 400 },
      );
    }

    // Fetch all logs matching filters (with limit)
    const logs = await db.auditLog.findMany({
      where: filters || {},
      orderBy: { timestamp: "desc" },
      take: 10000,
    });

    let content: string;
    let filename: string;
    let contentType: string;

    if (format === "json") {
      content = JSON.stringify(logs, null, 2);
      filename = `audit-logs-${new Date().toISOString()}.json`;
      contentType = "application/json";
    } else if (format === "csv") {
      content = convertLogsToCSV(logs as any);
      filename = `audit-logs-${new Date().toISOString()}.csv`;
      contentType = "text/csv";
    } else {
      // PDF format - simplified version
      content = JSON.stringify({
        message: "PDF export not yet implemented",
        logs: logs.length,
      });
      filename = `audit-logs-${new Date().toISOString()}.json`;
      contentType = "application/json";
    }

    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Audit log export _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}

function convertLogsToCSV(logs: Record<string, unknown>[]): string {
  if (logs.length === 0) return "No data";

  const headers = [
    "ID",
    "User ID",
    "Action",
    "Resource",
    "Resource ID",
    "IP Address",
    "Timestamp",
  ];
  const rows = logs.map((log) => [
    (log as any).id,
    (log as any).userId,
    (log as any).action,
    (log as any).resource,
    (log as any).resourceId || "",
    (log as any).ipAddress || "",
    (log as any).timestamp,
  ]);

  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
    ),
  ].join("\n");

  return csv;
}
