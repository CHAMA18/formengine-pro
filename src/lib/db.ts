import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Only log queries in development — in production, query logging adds
// significant overhead and noise.
const logConfig = process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error']

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: logConfig as never,
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
