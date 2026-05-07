import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: './schema.prisma',
  config: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
});