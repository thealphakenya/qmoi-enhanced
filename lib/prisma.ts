import { prisma } from './db/prisma';

export function initPrisma() {
  return prisma;
}

export function getPrisma() {
  return prisma;
}

export function getPrismaClient() {
  return prisma;
}

export { prisma };

export default prisma;
