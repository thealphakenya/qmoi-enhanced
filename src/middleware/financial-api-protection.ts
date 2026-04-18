/**
 * API Route Protection Middleware
 * Ensures all financial API endpoints are master-only
 */

import { NextRequest, NextResponse } from "next/server";

export interface ProtectedRequest extends NextRequest {
  user?: {
    id: string;
    role: string;
    email: string;
  };
}

/**
 * Middleware to protect financial API routes
 * All endpoints under /api/financial/* require master role
 */
export async function protectFinancialRoute(request: ProtectedRequest) {
  // Get user from session/header
  const userHeader = request.headers.get("x-user");
  
  if (!userHeader) {
    return new NextResponse(
      JSON.stringify({
        error: "Unauthorized",
        message: "User session not found",
        code: "NO_SESSION"
      }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
  
  try {
    const user = JSON.parse(userHeader);
    
    // Check master role
    if (user.role !== "master") {
      return new NextResponse(
        JSON.stringify({
          error: "Forbidden",
          message: `User ${user.email} does not have master access`,
          code: "MASTER_ROLE_REQUIRED",
          requiredRole: "master",
          userRole: user.role
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    
    // Attach user to request
    request.user = user;
    
    // Log access
    logger.info(`[API_ACCESS] Master user ${user.email} accessed financial endpoint: ${request.nextUrl.pathname}`);
    
    return null; // No error, continue to handler
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        error: "Bad Request",
        message: "Invalid user session format"
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}

/**
 * Protected API handler wrapper
 */
export function createProtectedAPIRoute<T extends Record<string, any>>(
  handler: (request: ProtectedRequest, context?: T) => Promise<NextResponse>
) {
  return async (request: ProtectedRequest, context?: T) => {
    // Check master access
    const protectionError = await protectFinancialRoute(request);
    if (protectionError) {
      return protectionError;
    }
    
    // Call the actual handler
    return handler(request, context);
  };
}

/**
 * Financial API endpoints protection
 */
export const PROTECTED_ENDPOINTS = [
  "/api/revenue/validate",
  "/api/revenue/collect",
  "/api/revenue/analytics",
  "/api/wallet/balance",
  "/api/wallet/transfer",
  "/api/wallet/deposit",
  "/api/wallet/withdraw",
  "/api/trading/execute",
  "/api/trading/history",
  "/api/transactions/all",
  "/api/transactions/audit",
  "/api/financial/dashboard",
  "/api/financial/reports",
  "/api/funds/manage",
  "/api/payment/process",
];

/**
 * Check if endpoint requires master role
 */
export function isFinancialEndpoint(pathname: string): boolean {
  return PROTECTED_ENDPOINTS.some(endpoint => 
    pathname.startsWith(endpoint)
  );
}

/**
 * Audit log middleware
 */
export function auditLogMiddleware(request: ProtectedRequest) {
  const user = request.user;
  const method = request.method;
  const path = request.nextUrl.pathname;
  const timestamp = new Date().toISOString();
  
  const auditEntry = {
    timestamp,
    userId: user?.id || "unknown",
    userEmail: user?.email || "unknown",
    method,
    path,
    queryParams: Object.fromEntries(request.nextUrl.searchParams),
  };
  
  logger.info(`[AUDIT_LOG] ${JSON.stringify(auditEntry)}`);
  
  // Send to audit database production ready
  // await sendAuditLog(auditEntry);
}

export default {
  protectFinancialRoute,
  createProtectedAPIRoute,
  isFinancialEndpoint,
  auditLogMiddleware,
  PROTECTED_ENDPOINTS
};
