import utils from 'src/server/utils/utils';

// import utils from '../../utils/utils';

const { GraphQLClient, gql } = require('graphql-request')
const graphQLClient = new GraphQLClient(process.env.NEXT_PUBLIC_PANCAKE_PREDICTION_GRAPHQL_ENDPOINT)

let TOTAL_BETS_INITIAL = 80
let WIN_RATE_INITIAL = 56

let TOTAL_BETS = TOTAL_BETS_INITIAL
let WIN_RATE = WIN_RATE_INITIAL

const checkIfPlaying = (player, lastGame) => {
  let results = player.bets
    .map(({ position, round: { epoch, position: final } }) => {
      return { epoch: +epoch, isWon: position === final }
    })
    .sort((a, b) => a.epoch > b.epoch)

  results = results.sort((a, b) => +a.epoch - +b.epoch)

  let recentGames = utils.finder(
    lastGame,
    results.map((r) => r.epoch)
  )

  recentGames = recentGames.reduce((a, b) => a + b, 0)
  player.recentGames = recentGames

  let lastLooseCountForPlayer = 0
  for (let i = results.length - 1; i >= 0; i--) {
    if (!results[i].isWon && lastGame.includes(results[i].epoch)) lastLooseCountForPlayer++
    else break
  }
  player.lastLooseCount = lastLooseCountForPlayer

  let lastFive = utils.finder(
    lastGame.slice(Math.max(lastGame.length - 5, 0)),
    results.map((r) => r.epoch)
  )
  lastFive = lastFive.reduce((a, b) => a + b, 0)
  player.lastFive = lastFive

  const filtereds = results.filter((r) => lastGame.includes(r.epoch))
  const wons = filtereds.filter((r) => r.isWon)
  const winRateRecents = (wons.length * 100) / filtereds.length || 0
  player.winRateRecents = winRateRecents
  // if (recentGames >= lastGame.length / 4 && lastFive > 1)
  return player
}

const loadPlayers = async ({ epoch, orderBy = 'winRate' }) => {
  console.log('🚀 ~ file: loadPlayers.ts ~ line 53 ~ loadPlayers ~ orderBy', orderBy)
  try {
    // if (orderBy === 'default') {
    //   orderBy = 'winRate'
    // }

    const orderByFilter = orderBy === 'default' ? 'winRate' : orderBy
    const LIMIT_HISTORY_LENGTH = 12 * 24

    const first = orderBy === 'default' ? 500 : 100
    console.log('🚀 ~ file: loadPlayers.ts ~ line 64 ~ loadPlayers ~ first', first)
    const firstBets = orderBy === 'default' ? 300 : 1
    console.log('🚀 ~ file: loadPlayers.ts ~ line 65 ~ loadPlayers ~ firstBets', firstBets)
    const query = gql`
      # query getUsers($totalBets: String!, $winRate: String!, $order_by: tables_order_by!) {
      query getUsers($totalBets: String!, $winRate: String!, $orderBy: String!, $first: Int!, $firstBets: Int!) {
        users(
          first: $first
          # first: 500
          where: { totalBets_gt: $totalBets, winRate_gt: $winRate }
          # sort: { field: winRate, order: asc }
          # order_by: [$order_by]
          # order_by: [{ winRate: desc }]
          # sort: { order: [DESC], fields: [winRate] }
          # orderBy: [{ winRate: desc }]
          orderBy: $orderBy
          # orderBy: winRate
          orderDirection: desc # orderBy: winRate
        ) {
          id
          totalBNB
          totalBets
          winRate
          averageBNB
          netBNB
          # bets(first: 300, orderBy: createdAt, orderDirection: desc) {
          bets(first: $firstBets, orderBy: createdAt, orderDirection: desc) {
            position
            round {
              epoch
              position
            }
          }
        }
      }
    `

    const lastFinishedEpoch = parseInt(epoch) - 1

    console.log(`Current betting epoch ${+lastFinishedEpoch}`)
    const variables = {
      totalBets: TOTAL_BETS.toString(),
      winRate: WIN_RATE.toString(),
      orderBy: orderByFilter,
      first,
      firstBets,
      // orderBy: orderBy.toString(),
      // order_by: {
      //   winRate: 'desc',
      // },
    }
    let data = await graphQLClient.request(query, variables)

    const { users } = data

    if (orderBy !== 'default') return users

    console.log(`Loading ${+users.length} players with WIN_RATE ${WIN_RATE} and TOTAL_BETS ${TOTAL_BETS} ...`)

    const lastGame = [...utils.range(lastFinishedEpoch - LIMIT_HISTORY_LENGTH, lastFinishedEpoch)]

    let bestPlayers = users.map((p) => checkIfPlaying(p, lastGame))
    console.log('🚀 ~ 1 ~ bestPlayers', bestPlayers.length)

    // let bestPlayers = users

    bestPlayers = bestPlayers.filter(Boolean)
    console.log('🚀 ~ 2 ~ bestPlayers', bestPlayers.length)

    if (bestPlayers.length <= 2) {
      if (WIN_RATE < 54) {
        return []
      } else {
        if (TOTAL_BETS >= 60) {
          TOTAL_BETS -= 5
        } else {
          WIN_RATE--
        }
      }
      return await loadPlayers({ epoch })
    } else {
      TOTAL_BETS = TOTAL_BETS_INITIAL
      WIN_RATE = WIN_RATE_INITIAL
    }

    bestPlayers = bestPlayers.sort((a, b) => {
      if (+a.winRate > +b.winRate && a.recentGames > b.recentGames) return -1
      if (+a.winRate < +b.winRate && a.recentGames < b.recentGames) return 1

      if (a.recentGames > b.recentGames) return -1
      if (a.recentGames < b.recentGames) return 1

      if (+a.winRate > +b.winRate) return -1
      if (+a.winRate < +b.winRate) return 1
    })

    if (bestPlayers.length === 0) return console.error('No players finded')

    console.log(`Looking within ${bestPlayers.length} best players to listen to (on top ${users.length}).`)

    return bestPlayers
  } catch (error) {
    console.error('GraphQL query error')
    console.error(error)
    // return []
    throw new Error(error)
  }
}

export default loadPlayers

// export default loadPlayers
