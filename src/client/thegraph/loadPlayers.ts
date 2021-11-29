import { gql, GraphQLClient } from 'graphql-request'
import { finder, range } from 'src/server/utils/utils'

const graphQLClient = new GraphQLClient(process.env.NEXT_PUBLIC_PANCAKE_PREDICTION_GRAPHQL_ENDPOINT)

const TOTAL_BETS_INITIAL = 80
const WIN_RATE_INITIAL = 56

let TOTAL_BETS = TOTAL_BETS_INITIAL
let WIN_RATE = WIN_RATE_INITIAL

const checkIfPlaying = (pplayer, lastGame) => {
  const player = pplayer
  let results = player.bets
    .map(({ position, round: { epoch, position: final } }) => ({ epoch: +epoch, isWon: position === final }))
    .sort((a, b) => a.epoch > b.epoch)

  results = results.sort((a, b) => +a.epoch - +b.epoch)

  let recentGames = finder(
    lastGame,
    results.map((r) => r.epoch)
  )

  recentGames = recentGames.reduce((a, b) => a + b, 0)
  player.recentGames = recentGames

  // let lastHour = finder(
  //   lastGame.slice(Math.max(lastGame.length - 12, 0)),
  //   results.map((r) => r.epoch)
  // )
  // lastHour = lastHour.reduce((a, b) => a + b, 0)
  // player.lastHour = lastHour

  const filtereds = results.filter((r) => lastGame.includes(r.epoch))
  const wons = filtereds.filter((r) => r.isWon)
  const winRateRecents = (wons.length * 100) / filtereds.length || 0
  player.winRateRecents = winRateRecents

  return player
}

const loadPlayers = async ({ epoch, orderBy = 'totalBets' }) => {
  try {
    const orderByFilter = orderBy === 'default' || orderBy === 'mostActiveLastHour' ? 'totalBets' : orderBy
    const LIMIT_HISTORY_LENGTH = orderBy === 'default' ? 12 * 24 : 12 * 2

    const first = orderBy === 'default' || orderBy === 'mostActiveLastHour' ? 250 : 100
    // const first = orderBy === 'default' ? 500 : orderBy === 'mostActiveLastHour' ? 1000 : 50
    const firstBets = orderBy === 'default' ? 12 * 24 : orderBy === 'mostActiveLastHour' ? 24 : 1
    const epochGT = orderBy === 'default' ? epoch - 12 * 24 : orderBy === 'mostActiveLastHour' ? epoch - 24 : 1
    const query = gql`
      query getUsers(
        $totalBets: String!
        $winRate: String!
        $orderBy: String!
        $first: Int!
        $firstBets: Int!
        $epochGT: Int!
      ) {
        users(
          first: $first
          where: { totalBets_gt: $totalBets, winRate_gt: $winRate }
          orderBy: $orderBy
          orderDirection: desc
        ) {
          id
          totalBNB
          totalBets
          winRate
          averageBNB
          netBNB
          bets(first: $firstBets, orderBy: createdAt, orderDirection: desc) {
            position
            createdAt
            round(where: { epoch_gte: $epochGT }) {
              epoch
              position
            }
          }
        }
      }
    `

    const lastFinishedEpoch = epoch - 1

    console.log(`Current betting epoch ${+lastFinishedEpoch}`)

    const variables = {
      totalBets: TOTAL_BETS.toString(),
      winRate: WIN_RATE.toString(),
      orderBy: orderByFilter,
      first,
      firstBets,
      epochGT,
    }
    const data = await graphQLClient.request(query, variables)

    const { users } = data

    if (orderBy !== 'default' && orderBy !== 'mostActiveLastHour') return users

    // console.log(`Loading ${+users.length} players with WIN_RATE ${WIN_RATE} and TOTAL_BETS ${TOTAL_BETS} ...`)

    const lastGame = [...range(lastFinishedEpoch - LIMIT_HISTORY_LENGTH, lastFinishedEpoch)]

    let bestPlayers = users.map((p) => checkIfPlaying(p, lastGame))

    bestPlayers = bestPlayers.filter(Boolean)

    // if (orderBy === 'mostActiveLastHour') {
    bestPlayers = bestPlayers.filter((p) => p.recentGames > 0)
    // }

    if (bestPlayers.length <= 2) {
      if (WIN_RATE < 54) {
        return []
      }
      if (TOTAL_BETS >= 60) {
        TOTAL_BETS -= 5
      } else {
        WIN_RATE -= 1
      }

      return await loadPlayers({ epoch, orderBy })
    }
    TOTAL_BETS = TOTAL_BETS_INITIAL
    WIN_RATE = WIN_RATE_INITIAL

    bestPlayers = bestPlayers.sort((a, b) => {
      if (a.recentGames && b.recentGames && +a.winRate > +b.winRate && a.recentGames > b.recentGames) return -1
      if (a.recentGames && b.recentGames && +a.winRate < +b.winRate && a.recentGames < b.recentGames) return 1

      if (a.recentGames && b.recentGames && a.recentGames > b.recentGames) return -1
      if (a.recentGames && b.recentGames && a.recentGames < b.recentGames) return 1

      if (a.winRate && b.winRate && +a.winRate > +b.winRate) return -1
      if (a.winRate && b.winRate && +a.winRate < +b.winRate) return 1

      return 0
    })

    // bestPlayers = bestPlayers.sort((a, b) => {
    //   if (+a.winRate > +b.winRate && a.recentGames > b.recentGames) return -1
    //   if (+a.winRate < +b.winRate && a.recentGames < b.recentGames) return 1

    //   if (a.recentGames > b.recentGames) return -1
    //   if (a.recentGames < b.recentGames) return 1

    //   if (+a.winRate > +b.winRate) return -1
    //   if (+a.winRate < +b.winRate) return 1

    //   return 0
    // })

    if (bestPlayers.length === 0) return console.error('No players finded')

    // console.log(`Looking within ${bestPlayers.length} best players to listen to (on top ${users.length}).`)

    return bestPlayers
  } catch (error) {
    throw new Error(error)
  }
}

export default loadPlayers
