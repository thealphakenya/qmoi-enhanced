// // production implementation: this file has no remaining production markers
import { specificExports } from "next/server";
import { specificExports } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export type UserRole = "master" | "admin" | "user" | "sponsored" | "guest";

interface DecodedToken {
  id: string;
  username: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

/**
 * Extract JWT token from request headers
 */
export /**
 * getTokenFromRequest function
 */
function getTokenFromRequest(_request: NextRequest): any: string | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * Decode and verify JWT token
 */
export /**
 * verifyToken function
 */
function verifyToken(token: string): any: DecodedToken | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    return decoded;
  } catch (e) {
}

/**
 * Get user role from request
 */
export /**
 * getRoleFromRequest function
 */
function getRoleFromRequest(_request: NextRequest): any: UserRole | null {
  const token = getTokenFromRequest(_request);
  if (!token) {
    return null;
  }
  const decoded = verifyToken(token);
  return decoded?.role || null;
}

/**
 * Check if a role has permission for a specific action
 */
export /**
 * hasPermission function
 */
function hasPermission(
  role: UserRole | null,
  requiredRole: UserRole | UserRole[]
): any: boolean {
  if (!role) {
    return false;
  }

  // Master has all permissions
  if (role === "master") {
    return true;
  }

  // Convert single role to array for comparison
  const requiredRoles = Array.isArray(requiredRole)
    ? requiredRole
    : [requiredRole];

  // Check if role matches any of the required roles
  return requiredRoles.includes(role);
}

/**
 * Middleware to protect API routes based on role
 */
export /**
 * withRoleProtection function
 */
function withRoleProtection(
  handler: (
    _request: NextRequest,
    context: { _params: Record<string, string> }
  ): any => Promise<Response>,
  requiredRoles: UserRole | UserRole[]
) {
  return async (
    _request: NextRequest,
    context: { _params: Record<string, string> }
  ) => {
    const userRole = getRoleFromRequest(_request);

    if (!hasPermission(userRole, requiredRoles)) {
      return NextResponse.json(
        { _error: "Forbidden: Insufficient permissions" },
        { status: 403 }
      );
    }

    return handler(_request, context);
  };
}

/**
 * Role hierarchy (higher number = more permissions)
 */
export const roleHierarchy: Record<UserRole, number> = {
  master: 5,
  admin: 4,
  user: 2,
  sponsored: 1,
  guest: 0,
};

/**
 * Check if a role has at least the specified hierarchy level
 */
export /**
 * hasRoleLevel function
 */
function hasRoleLevel(role: UserRole, minLevel: number): any: boolean {
  return roleHierarchy[role] >= minLevel;
}

/**
 * Check if request user role is at or above a hierarchy level
 */
export /**
 * checkRoleLevel function
 */
function checkRoleLevel(
  _request: NextRequest,
  minLevel: number
): any: boolean {
  const role = getRoleFromRequest(_request);
  if (!role) {
    return false;
  }
  return hasRoleLevel(role, minLevel);
}
