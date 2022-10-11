/* eslint-disable no-shadow */
import { extendType, list, objectType } from 'nexus'

const Round = objectType({
  name: 'Round',
  definition(t) {
    t.model.epoch()
    t.model.position()
  },
})

const Bet = objectType({
  name: 'Bet',
  definition(t) {
    t.model.position()
    t.model.createdAt()
    t.model.round({
      type: `Round`,
    })
  },
})

const Player = objectType({
  name: 'Player',
  definition(t) {
    t.model.id()
    t.model.totalBNB()
    t.model.totalBets()
    t.model.winRate()
    t.model.averageBNB()
    t.model.netBNB()
    // t.model.bets({
    //   type: `Bet`,
    // })
  },
})

const queries = extendType({
  type: 'Query',
  definition: (t) => {
    t.field('loadPlayers', {
      type: list('Player'),
      args: {},
      resolve: async () => {
        console.log('OOOOOKKKKKKKK')

        return [
          {
            id: 1,
            test: 'ete',
          },
        ]
      },
    })
  },
})

const mutations = extendType({
  type: 'Mutation',
  definition: () => {},
})

export default [Player, mutations, queries]
