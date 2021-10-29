// src/server/graphql/Koi/index.ts
import { objectType, extendType, nonNull, stringArg } from 'nexus'
import prisma from '../../db/prisma'

const Pond = objectType({
  name: 'Pond',
  definition(t) {
    t.model.id()
    t.model.modifiedAt()
    t.model.name()
    t.model.size()
    // t.model.updates();
  },
})

const queries = extendType({
  type: 'Query',
  definition: (t) => {
    // This will add a { post(id: "...") { id title body } } query to the API
    t.field('pond', {
      type: 'Pond',
      args: {
        id: nonNull(stringArg()),
      },
      resolve: (_, { id }, ctx) => {
        // Only let authenticated users fetch posts
        if (!ctx.user?.id) return null

        return prisma.pond.findFirst({
          where: {
            user: {
              is: {
                // only fetch your own koi
                id: ctx.user.id,
              },
            },
            id,
          },
        })
      },
    })
  },
})

export default [Pond, queries]
