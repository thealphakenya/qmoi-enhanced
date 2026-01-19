/**
 * Authentication Middleware Wrapper
 * Provides compatibility layer for existing routes
 */

import authService from "@/lib/auth/service";
import { db } from "@/lib/db/prisma";

/**
 * Legacy compatibility - verifyToken method
 */
export const verifyToken = async (token: string) => {
  try {
    const decoded = await authService.decodeToken(token);
    if (!decoded) return null;
    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      permissions: decoded.permissions,
      ...decoded,
    };
  } catch (error) {
    throw new Error("Token verification failed");
  }
};

/**
 * Create a new auth service instance with all methods
 */
export const createAuthService = () => {
  return {
    ...authService,
    verifyToken,
  };
};

/**
 * Database service wrapper for compatibility
 */
export const createDatabaseService = () => {
  return {
    userService: {
      findById: async (userId: string) => {
        return db.user.findUnique({
          where: { id: userId },
        });
      },
      findByEmail: async (email: string) => {
        return db.user.findUnique({
          where: { email },
        });
      },
      create: async (data: unknown) => {
        return db.user.create({ data });
      },
      update: async (userId: string, data: unknown) => {
        return db.user.update({
          where: { id: userId },
          data,
        });
      },
      delete: async (userId: string) => {
        return db.user.delete({
          where: { id: userId },
        });
      },
    },
    auditLogService: {
      create: async (data: unknown) => {
        return db.auditLog.create({ data });
      },
      findMany: async (where?: unknown) => {
        return db.auditLog.findMany({ where });
      },
    },
  };
};

export default {
  verifyToken,
  createAuthService,
  createDatabaseService,
};
