import { PrismaClient } from './db/prisma';

export function initPrisma(): PrismaClient {
  return new PrismaClient();
}

export function getPrisma(): PrismaClient {
  return initPrisma();
}

export const prisma = getPrisma();

export default prisma;
