import { extendType, list, nonNull, objectType, stringArg } from 'nexus'

import prisma from '../../db/prisma'

// import { GraphQLList, GraphQLNonNull } from 'graphql'

// export const FavoriteType = enumType({
//   name: `FavoriteType`,
//   members: ['LIKE', 'DISLIKE'],
// })

const Favorite = objectType({
  name: 'Favorite',
  definition(t) {
    t.model.id()
    t.model.player()
    t.model.type()
    t.model.comment()
    t.model.note()
    t.model.user()
    t.model.createdAt()
    t.model.modifiedAt()
  },
})

const queries = extendType({
  type: 'Query',
  definition: (t) => {
    t.field('getAllFavorites', {
      type: list('Favorite'),
      resolve: (_, __, ctx) => {
        if (!ctx.user?.id) return null

        return prisma.favorite.findMany({})
      },
    }),
      t.field('getFavorites', {
        type: list('Favorite'),
        resolve: (_, __, ctx) => {
          if (!ctx.user?.id) return null

          return prisma.favorite.findMany({
            where: {
              user: {
                is: {
                  id: ctx.user.id,
                },
              },
            },
          })
        },
      }),
      t.field('getFavorite', {
        type: 'Favorite',
        args: {
          id: nonNull(stringArg()),
        },
        resolve: (_, { id }, ctx) => {
          if (!ctx.user?.id) return null

          return prisma.favorite.findUnique({
            where: {
              user: {
                is: {
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

const mutations = extendType({
  type: 'Mutation',
  definition: () => {},
})

export default [Favorite, mutations, queries]
