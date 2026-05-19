import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

/**
 * @typedef {"master" | "admin" | "user" | "sponsored" | "guest"} UserRole
 */

/**
 * @typedef {{
 *   id: string;
 *   username: string;
 *   role: UserRole;
 *   iat?: number;
 *   exp?: number;
 * }} DecodedToken
 */

/**
 * Extract JWT token from request headers
 */
export function getTokenFromRequest(request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * Decode and verify JWT token
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Get user role from request
 */
export function getRoleFromRequest(request) {
  const token = getTokenFromRequest(request);
  if (!token) {
    return null;
  }
  const decoded = verifyToken(token);
  return decoded?.role || null;
}

/**
 * Check if a role has permission for a specific action
 */
export function hasPermission(role, requiredRole) {
  if (!role) {
    return false;
  }

  if (role === "master") {
    return true;
  }

  const requiredRoles = Array.isArray(requiredRole)
    ? requiredRole
    : [requiredRole];

  return requiredRoles.includes(role);
}

/**
 * Middleware to protect API routes based on role
 */
export function withRoleProtection(handler, requiredRoles) {
  return async (request, context) => {
    const userRole = getRoleFromRequest(request);

    if (!hasPermission(userRole, requiredRoles)) {
      return NextResponse.json(
        { _error: "Forbidden: Insufficient permissions" },
        { status: 403 }
      );
    }

    return handler(request, context);
  };
}

/**
 * Role hierarchy (higher number = more permissions)
 */
export const roleHierarchy = {
  master: 5,
  admin: 4,
  user: 2,
  sponsored: 1,
  guest: 0,
};

/**
 * Check if a role has at least the specified hierarchy level
 */
export function hasRoleLevel(role, minLevel) {
  if (!role) {
    return false;
  }
  return roleHierarchy[role] >= minLevel;
}

/**
 * Check if request user role is at or above a hierarchy level
 */
export function checkRoleLevel(request, minLevel) {
  const role = getRoleFromRequest(request);
  if (!role) {
    return false;
  }
  return hasRoleLevel(role, minLevel);
}
