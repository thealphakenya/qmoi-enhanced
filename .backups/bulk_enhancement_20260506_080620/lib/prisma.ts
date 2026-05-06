import { PrismaClient } from './db/prisma';

export function initPrisma(): PrismaClient {
  return new PrismaClient();
}

export function getPrisma(): PrismaClient {
  return initPrisma();
}

export function getPrismaClient(): PrismaClient {
  return getPrisma();
}

export const prisma = getPrismaClient();

export default prisma;
