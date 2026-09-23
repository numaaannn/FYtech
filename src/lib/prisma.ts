import { PrismaClient } from '@prisma/client';

const databaseUrl = process.env.DATABASE_URL ?? 'file:./dev.db';

declare global {
  var prisma: PrismaClient | undefined;
}

const prismaClient = new PrismaClient({
  datasources: {
    db: { url: databaseUrl },
  },
});

let prisma: PrismaClient;
if (process.env.NODE_ENV === 'production') {
  prisma = prismaClient;
} else {
  if (!global.prisma) {
    global.prisma = prismaClient;
  }
  prisma = global.prisma;
}

export { prisma };
