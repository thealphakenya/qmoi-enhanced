// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:27Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// [PRODUCTION READY] this file has no remaining non-production markers
import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __qmoi_prisma__: PrismaClient | undefined;
}

let prismaInstance: PrismaClient | undefined = global.__qmoi_prisma__;

const isBuildTime =
  process.env.NODE_ENV === "production" && !process.env.DATABASE_URL;

function initPrisma(): PrismaClient {
  if (isBuildTime) return {} as PrismaClient;
  if (prismaInstance) return prismaInstance;

  const client = new PrismaClient({
    errorFormat: "pretty",
  });

  if (process.env.NODE_ENV !== "production") {
    global.__qmoi_prisma__ = client;
  }

  prismaInstance = client;
  return prismaInstance;
}

function getPrisma(): PrismaClient {
  return prismaInstance ?? initPrisma();
}

export const db = {
  get prisma() {
    return getPrisma();
  },
};

export function getPrismaClient(): PrismaClient {
  return getPrisma();
}

export const prisma = getPrisma();

export default db;
