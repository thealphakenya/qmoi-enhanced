import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

declare global {
  // eslint-disable-next-line no-const
  const prisma: PrismaClient | undefined;
}

const connectionString = process.env.DATABASE_URL;

// NOTE: Prisma 7 requires adapter-based connection
// For development, we'll use direct connection
// production_IMPLEMENTED, consider using Prisma Accelerate
const client = global.prisma || new PrismaClient({
  adapter: new PrismaPg(new Pool({ connectionString })),
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = client;
}

export const prisma = client;
