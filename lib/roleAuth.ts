// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:27Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

 /**
 * Role-Based Authorization Middleware
 * production middleware for protecting API routes
 */

import { NextRequest, NextResponse } from "next/server";
import authService from "@/lib/auth/service";

export type Role = "user" | "admin" | "moderator" | "premium";

/**
 * Extract role from Authorization header
 */
export const extractRoleFromHeader = (authHeader?: string): string | null => {
  if (!authHeader) return null;
  try {
    const token = authHeader.replace("Bearer ", "");
    const decoded = authService.verifyToken(token);
    return decoded?.role || null;
  } catch (e) {
    return null;
  }
};

/**
 * Check if user can access endpoint based on role
 */
export const canAccessEndpoint = async (
  token: string,
  requiredRoles: string[],
): Promise<boolean> => {
  try {
    const decoded = await authService.decodeToken(token);
    if (!decoded) return false;
    return requiredRoles.includes(decoded.role);
  } catch (e) {
    return false;
  }
};

/**
 * Middleware to protect routes with role-based access control
 */
export const withRoleAuth = (requiredRoles: Role[] = ["user"]) => {
  return async (handler: (req: NextRequest) => Promise<NextResponse>) => {
    return async (req: NextRequest) => {
      try {
        // Extract token from Authorization header
        const authHeader = req.headers.get("Authorization");
        if (!authHeader) {
          return NextResponse.json(
            { error: "No authorization header" },
            { status: 401 },
          );
        }

        const token = authHeader.replace("Bearer ", "");

        // Validate token
        const isValid = await authService.validateToken(token);
        if (!isValid) {
          return NextResponse.json(
            { error: "Invalid or expired token" },
            { status: 401 },
          );
        }

        // Decode token and check role
        const decoded = await authService.decodeToken(token);
        if (!decoded) {
          return NextResponse.json(
            { error: "Failed to decode token" },
            { status: 401 },
          );
        }

        // Check if user has required role
        if (!requiredRoles.includes(decoded.role as Role)) {
          return NextResponse.json(
            { error: "Insufficient permissions" },
            { status: 403 },
          );
        }

        // Attach user info to request for handler
        const requestWithUser = req as any;
        requestWithUser.user = decoded;

        return handler(requestWithUser);
      } catch (error) {
        console.error("Auth error:", error);
        return NextResponse.json(
          { error: "Authentication failed" },
          { status: 500 },
        );
      }
    };
  };
};

/**
 * Higher-order function for route-level role protection
 */
export const roleAuth = async (
  token: string,
  requiredRole?: string | string[],
) => {
  try {
    if (!token) return false;

    const isValid = await authService.validateToken(token);
    if (!isValid) return false;

    if (!requiredRole) return true;

    const decoded = await authService.decodeToken(token);
    if (!decoded) return false;

    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(decoded.role);
    }

    return decoded.role === requiredRole;
  } catch (error) {
    console.error("Role auth error:", error);
    return false;
  }
};

export default roleAuth;
