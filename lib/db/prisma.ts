export class PrismaClient {}

export function getPrisma(): PrismaClient {
  return new PrismaClient();
}

export const prisma = getPrisma();

export const db = {
  user: {},
  auditLog: {},
  notification: {},
  wallet: {},
  transaction: {},
  track: {},
};
