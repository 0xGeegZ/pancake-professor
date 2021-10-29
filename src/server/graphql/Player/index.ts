import { extendType, list, objectType } from 'nexus'

import loadPlayers from './loadPlayers'

// import { GraphQLList, GraphQLNonNull } from 'graphql'
const Player = objectType({
  name: 'Player',
  definition(t) {
    t.model.id()
  },
})

const queries = extendType({
  type: 'Query',
  definition: (t) => {
    // t.field('player', {
    //   type: 'Player',
    //   args: {
    //     id: nonNull(stringArg()),
    //   },
    //   resolve: (_, { id }, ctx) => {
    //     if (!ctx.user?.id) return null

    //     return prisma.player.findUnique({
    //       where: {
    //         id,
    //       },
    //     })
    //   },
    // })

    t.field('getPlayers', {
      type: list('Player'),
      resolve: async (_, args, ctx) => {
        const players = await loadPlayers({ currentEpoch: '15931' })
        return players
      },
    })
  },
})

export default [Player, queries]
