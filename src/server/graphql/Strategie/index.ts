import { booleanArg, extendType, intArg, nonNull, objectType, stringArg } from 'nexus'

import prisma from '../../db/prisma'

const Strategie = objectType({
  name: 'Strategie',
  definition(t) {
    t.model.id()
    t.model.createdAt()
    t.model.modifiedAt()
    t.model.player()
    t.model.startedAmount()
    t.model.currentAmount()
    t.model.roundsCount()
    t.model.playsCount()
    t.model.isActive()
    t.model.isRunning()
    t.model.isDeleted()
    t.model.maxLooseAmount()
    t.model.minWinAmount()
    t.model.user()
  },
})

const queries = extendType({
  type: 'Query',
  definition: (t) => {
    // This will add a { post(id: "...") { id title body } } query to the API
    t.field('strategie', {
      type: 'Strategie',
      args: {
        id: nonNull(stringArg()),
      },
      resolve: (_, { id }, ctx) => {
        // Only let authenticated users fetch posts
        if (!ctx.user?.id) return null

        return prisma.strategie.findFirst({
          where: {
            user: {
              is: {
                // Everyone can fetch the strategie that is logged in needs to be added only public strategie
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
  definition: (t) => {
    t.nullable.field('createStrategie', {
      type: 'Strategie',
      args: {
        player: nonNull(stringArg()),
        startedAmount: nonNull(intArg()),
        maxLooseAmount: intArg(),
        minWinAmount: intArg(),
      },
      resolve: async (_, args, ctx) => {
        if (!ctx.user?.id) return null

        return prisma.strategie.create({
          data: {
            player: args.player,
            startedAmount: args.startedAmount,
            currentAmount: args.startedAmount,
            maxLooseAmount: args.maxLooseAmount || 0,
            minWinAmount: args.minWinAmount || 0,
            user: {
              connect: {
                id: ctx.user.id,
              },
            },
          },
        })
      },
    })

    t.nullable.field('updateStrategie', {
      type: 'Strategie',
      args: {
        id: nonNull(stringArg()),
        player: nonNull(stringArg()),
        startedAmount: nonNull(intArg()),
        currentAmount: nonNull(intArg()),
        roundsCount: nonNull(intArg()),
        playsCount: nonNull(intArg()),
        isActive: booleanArg(),
        isRunning: booleanArg(),
        isDeleted: booleanArg(),
        maxLooseAmount: nonNull(intArg()),
        minWinAmount: nonNull(intArg()),
      },
      resolve: async (_, args, ctx) => {
        if (!ctx.user?.id) return null

        const hasAccess = await prisma.strategie.findFirst({
          where: {
            user: {
              is: {
                id: ctx.user.id,
              },
            },
            id: args.id,
          },
        })

        if (!hasAccess) return null

        return prisma.strategie.update({
          where: { id: args.id },
          data: {
            player: args.player,
            startedAmount: args.startedAmount,
            currentAmount: args.currentAmount,
            roundsCount: args.roundsCount,
            playsCount: args.playsCount,
            isActive: args.isActive,
            isRunning: args.isRunning,
            isDeleted: args.isDeleted,
            maxLooseAmount: args.maxLooseAmount,
            minWinAmount: args.minWinAmount,
          },
        })
      },
    })

    t.nullable.field('toogleActivateStrategie', {
      type: 'Strategie',
      args: {
        id: nonNull(stringArg()),
      },
      resolve: async (_, { id }, ctx) => {
        if (!ctx.user?.id) return null

        const hasAccess = await prisma.strategie.findFirst({
          where: {
            user: {
              is: {
                id: ctx.user.id,
              },
            },
            id,
          },
        })

        if (!hasAccess) return null

        // await prisma.strategieHistory.deleteMany({
        //   where: {
        //     strategieId: id,
        //   },
        // })

        // const strategie = await prisma.strategie.delete({
        //   where: {
        //     id: id,
        //   },
        // })

        // return strategie

        return prisma.strategie.update({
          where: { id },
          data: {
            // isActive: false,
            isActive: !hasAccess.isActive,
          },
        })
      },
    })

    t.nullable.field('deleteStrategie', {
      type: 'Strategie',
      args: {
        id: nonNull(stringArg()),
      },
      resolve: async (_, { id }, ctx) => {
        if (!ctx.user?.id) return null

        const hasAccess = await prisma.strategie.findFirst({
          where: {
            user: {
              is: {
                id: ctx.user.id,
              },
            },
            id,
          },
        })

        if (!hasAccess) return null

        // await prisma.strategieHistory.deleteMany({
        //   where: {
        //     strategieId: id,
        //   },
        // })

        // const strategie = await prisma.strategie.delete({
        //   where: {
        //     id: id,
        //   },
        // })

        // return strategie

        return prisma.strategie.update({
          where: { id },
          data: {
            isActive: false,
            isDeleted: true,
          },
        })
      },
    })
  },
})

export default [Strategie, queries, mutations]
