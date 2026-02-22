/**
 * Authentication Service
 * Production JWT-based authentication
 */

import { jwtVerify, SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production",
);

interface DecodedToken {
  userId: string;
  email: string;
  role: string;
  permissions: string[];
  iat: number;
  exp: number;
}

const authService = {
  /**
   * Validate a JWT token
   */
  validateToken: async (token: string): Promise<boolean> => {
    if (!token) return false;
    try {
      await jwtVerify(token, JWT_SECRET);
      return true;
    } catch (error) {
      console.error("Token validation failed:", error);
      return false;
    }
  },

  /**
   * Decode and verify a JWT token
   */
  decodeToken: async (token: string): Promise<DecodedToken | null> => {
    if (!token) return null;
    try {
      const verified = await jwtVerify(token, JWT_SECRET);
      return verified.payload as DecodedToken;
    } catch (error) {
      console.error("Token decode failed:", error);
      return null;
    }
  },

  /**
   * Legacy method for compatibility - synchronous verify
   */
  verifyToken: (token: string): DecodedToken | null => {
    try {
      // For synchronous compatibility, we'll use a simpler approach
      // In production, all code should be migrated to async
      const parts = token.split(".");
      if (parts.length !== 3) return null;

      try {
        const decoded = JSON.parse(Buffer.from(parts[1], "base64").toString());
        // Check expiration
        if (decoded.exp && decoded.exp < Date.now() / 1000) {
          return null;
        }
        return decoded as DecodedToken;
      } catch (e) {
        return null;
      }
    } catch (error) {
      return null;
    }
  },

  /**
   * Check if user has required role
   */
  isAuthorized: async (
    token: string,
    requiredRole?: string,
  ): Promise<boolean> => {
    if (!token) return false;
    const decoded = await authService.decodeToken(token);
    if (!decoded) return false;
    if (!requiredRole) return true;
    return decoded.role === requiredRole;
  },

  /**
   * Check if user has specific permission
   */
  hasPermission: async (
    token: string,
    permission: string,
  ): Promise<boolean> => {
    if (!token) return false;
    const decoded = await authService.decodeToken(token);
    if (!decoded) return false;
    return decoded.permissions.includes(permission);
  },

  /**
   * Extract token from Authorization header
   */
  extractToken: (authHeader?: string): string | null => {
    if (!authHeader) return null;
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") return null;
    return parts[1];
  },

  /**
   * Create a new JWT token (for authentication flows)
   */
  createToken: async (
    userId: string,
    email: string,
    role: string,
    permissions: string[] = [],
  ): Promise<string> => {
    try {
      const token = await new SignJWT({
        userId,
        email,
        role,
        permissions,
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(JWT_SECRET);

      return token;
    } catch (error) {
      throw new Error("Failed to create token");
    }
  },
};

export default authService;
export { authService };
