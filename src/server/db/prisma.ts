/* eslint-disable no-var */
/* eslint-disable import/no-mutable-exports */
/* eslint-disable vars-on-top */
import { PrismaClient } from '@prisma/client'

// Make global.cachedPrisma work with TypeScript
declare global {
  // NOTE: This actually needs to be a "var", let/const don't work here.
  var cachedPrisma: PrismaClient
}

// Workaround to make Prisma Client work well during "next dev"
// @see https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices
let prisma: PrismaClient
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient()
  }
  prisma = global.cachedPrisma
}

export default prisma
