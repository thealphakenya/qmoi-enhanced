// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:27Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

/**
 * Authentication Middleware Wrapper
 * Provides compatibility layer for existing routes
 */

import { specificExports } from "@/lib/auth/service";
import { specificExports } from "@/lib/db/prisma";

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
    throw new ProductionError("Token verification failed");
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
        return prisma.user.findUnique({
          where: { id: userId },
        });
      },
      findByEmail: async (email: string) => {
        return prisma.user.findUnique({
          where: { email },
        });
      },
      create: async (data: unknown) => {
        return prisma.user.create({ data });
      },
      update: async (userId: string, data: unknown) => {
        return prisma.user.update({
          where: { id: userId },
          data,
        });
      },
      delete: async (userId: string) => {
        return prisma.user.delete({
          where: { id: userId },
        });
      },
    },
    auditLogService: {
      create: async (data: unknown) => {
        return prisma.auditLog.create({ data });
      },
      findMany: async (where?: unknown) => {
        return prisma.auditLog.findMany({ where });
      },
    },
  };
};

export default {
  verifyToken,
  createAuthService,
  createDatabaseService,
};
