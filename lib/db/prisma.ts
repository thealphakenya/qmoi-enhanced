/**
 * Prisma Database Client
 * Production connection to QMOI Enhanced database
 */

import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

let prismaInstance: PrismaClient | null = null;
const isBuildTime =
  process.env.NODE_ENV === "production" && !process.env.DATABASE_URL;

// Lazy initialize Prisma to avoid issues at build time
function getPrisma(): PrismaClient {
  // Skip initialization during build
  if (isBuildTime) {
    return {} as PrismaClient;
  }

  if (prismaInstance) return prismaInstance;

  try {
    if (process.env.NODE_ENV === "production") {
      prismaInstance = new PrismaClient({
        errorFormat: "pretty",
        log: [
          { emit: "event", level: "error" },
          { emit: "event", level: "warn" },
        ],
      });

      // Handle errors in production
      prismaInstance.$on("error", (e) => {
        console.error("[Prisma Error]", e.message);
      });

      prismaInstance.$on("warn", (e) => {
        console.warn("[Prisma Warn]", e.message);
      });
    } else {
      if (!global.prisma) {
        global.prisma = new PrismaClient({
          errorFormat: "pretty",
        });
      }
      prismaInstance = global.prisma;
    }
  } catch (error) {
    console.warn(
      "Prisma initialization deferred:",
      error instanceof Error ? error.message : String(error),
    );
    // Return empty object as mock for build time
    return {} as PrismaClient;
  }

  return prismaInstance;
}

// Export compatibility wrapper
export const db = {
  // Lazy getter for prisma client
  get user() {
    const prisma = getPrisma();
    return prisma.user || {};
  },
  get auditLog() {
    const prisma = getPrisma();
    return prisma.auditLog || {};
  },
  get notification() {
    const prisma = getPrisma();
    return prisma.notification || {};
  },
  get wallet() {
    const prisma = getPrisma();
    return prisma.wallet || {};
  },
  get transaction() {
    const prisma = getPrisma();
    return prisma.transaction || {};
  },

  // Service-based access for compatibility
  userService: {
    findById: async (userId: string) => {
      const prisma = getPrisma();
      if (!prisma || !prisma.user) return null;
      try {
        return await prisma.user.findUnique({
          where: { id: userId },
        });
      } catch {
        return null;
      }
    },
    findByEmail: async (email: string) => {
      const prisma = getPrisma();
      if (!prisma || !prisma.user) return null;
      try {
        return await prisma.user.findUnique({
          where: { email },
        });
      } catch {
        return null;
      }
    },
    findMany: async () => {
      const prisma = getPrisma();
      if (!prisma || !prisma.user) return [];
      try {
        return await prisma.user.findMany();
      } catch {
        return [];
      }
    },
    create: async (data: any) => {
      const prisma = getPrisma();
      if (!prisma || !prisma.user) return null;
      try {
        return await prisma.user.create({ data });
      } catch {
        return null;
      }
    },
    update: async (userId: string, data: any) => {
      const prisma = getPrisma();
      if (!prisma || !prisma.user) return null;
      try {
        return await prisma.user.update({
          where: { id: userId },
          data,
        });
      } catch {
        return null;
      }
    },
    delete: async (userId: string) => {
      const prisma = getPrisma();
      if (!prisma || !prisma.user) return null;
      try {
        return await prisma.user.delete({
          where: { id: userId },
        });
      } catch {
        return null;
      }
    },
  },

  auditLogService: {
    create: async (data: any) => {
      const prisma = getPrisma();
      if (!prisma || !prisma.auditLog) return null;
      try {
        return await prisma.auditLog.create({ data });
      } catch {
        return null;
      }
    },
    findMany: async (where?: any) => {
      const prisma = getPrisma();
      if (!prisma || !prisma.auditLog) return [];
      try {
        return await prisma.auditLog.findMany({ where });
      } catch {
        return [];
      }
    },
  },
};

// Export lazy getter function instead of direct instance
export function getPrismaClient(): PrismaClient {
  return getPrisma();
}

export default db;
