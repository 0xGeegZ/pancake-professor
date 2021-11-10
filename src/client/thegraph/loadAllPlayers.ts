import { gql, GraphQLClient } from 'graphql-request'
import { finder, range } from 'src/server/utils/utils'

const graphQLClient = new GraphQLClient(process.env.NEXT_PUBLIC_PANCAKE_PREDICTION_GRAPHQL_ENDPOINT)

const TOTAL_BETS_INITIAL = 80
const WIN_RATE_INITIAL = 55

const TOTAL_BETS = TOTAL_BETS_INITIAL
const WIN_RATE = WIN_RATE_INITIAL

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

  // let lastLooseCountForPlayer = 0
  // for (let i = results.length - 1; i >= 0; i -= 1) {
  //   if (!results[i].isWon && lastGame.includes(results[i].epoch)) lastLooseCountForPlayer += 1
  //   else break
  // }
  // player.lastLooseCount = lastLooseCountForPlayer

  // let lastFive = finder(
  //   lastGame.slice(Math.max(lastGame.length - 5, 0)),
  //   results.map((r) => r.epoch)
  // )
  // lastFive = lastFive.reduce((a, b) => a + b, 0)
  // player.lastFive = lastFive

  // const filtereds = results.filter((r) => lastGame.includes(r.epoch))
  // const wons = filtereds.filter((r) => r.isWon)
  // const winRateRecents = (wons.length * 100) / filtereds.length || 0
  // player.winRateRecents = winRateRecents

  return player
}

const loadAllPlayers = async ({ epoch, orderBy = 'winRate' }) => {
  const allUsers = []
  let skip = 0
  let isAllLoaded = false

  const orderByFilter = orderBy === 'default' || orderBy === 'mostActiveLastHour' ? 'winRate' : orderBy
  const LIMIT_HISTORY_LENGTH = orderBy === 'default' ? 12 * 24 : 12

  const first = orderBy === 'default' ? 500 : orderBy === 'mostActiveLastHour' ? 1000 : 50
  const firstBets = orderBy === 'default' ? 12 * 24 : orderBy === 'mostActiveLastHour' ? 12 : 1
  const query = gql`
    query getUsers(
      $skip: Int!
      $totalBets: String!
      $winRate: String!
      $orderBy: String!
      $first: Int!
      $firstBets: Int!
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
        bets(first: $firstBets, orderBy: block, orderDirection: desc) {
          position
          createdAt
          round {
            epoch
            position
          }
        }
      }
    }
  `
  const lastFinishedEpoch = epoch - 1

  while (!isAllLoaded) {
    try {
      console.log(`Current betting epoch ${+lastFinishedEpoch}`)
      const variables = {
        totalBets: TOTAL_BETS.toString(),
        winRate: WIN_RATE.toString(),
        orderBy: orderByFilter,
        first,
        firstBets,
        skip,
      }
      console.log('🚀 ~ file: loadPlayers.ts ~ line 93 ~ loadPlayers ~ variables', variables)
      // eslint-disable-next-line no-await-in-loop
      const data = await graphQLClient.request(query, variables)

      // const data = await graphQLClient.request(query)
      const { users } = data
      console.log('🚀 ~ users loaded', users.length)

      allUsers.push(...users)
      console.log('🚀 ~ users total', allUsers.length)
      console.log('🚀 ~ skip', skip)

      // if (users.length < 1000 || skip >= 5000) {
      if (users.length < 1000 || skip >= 4000) {
        isAllLoaded = true
      } else skip += 1000
    } catch (error) {
      console.error(error.message)
    }
  }

  const lastGame = [...range(lastFinishedEpoch - LIMIT_HISTORY_LENGTH, lastFinishedEpoch)]

  let bestPlayers = allUsers.map((p) => checkIfPlaying(p, lastGame))

  bestPlayers = bestPlayers.filter(Boolean)

  if (orderBy === 'mostActiveLastHour') {
    bestPlayers = bestPlayers.filter((p) => p.recentGames > 0)
  }
  bestPlayers = bestPlayers.sort((a, b) => {
    if (a.recentGames && b.recentGames && +a.winRate > +b.winRate && a.recentGames > b.recentGames) return -1
    if (a.recentGames && b.recentGames && +a.winRate < +b.winRate && a.recentGames < b.recentGames) return 1

    if (a.recentGames && b.recentGames && a.recentGames > b.recentGames) return -1
    if (a.recentGames && b.recentGames && a.recentGames < b.recentGames) return 1

    if (a.winRate && b.winRate && +a.winRate > +b.winRate) return -1
    if (a.winRate && b.winRate && +a.winRate < +b.winRate) return 1

    return 0
  })

  // if (bestPlayers.length === 0) return console.error('No players finded')

  // console.log(`Looking within ${bestPlayers.length} best players to listen to (on top ${users.length}).`)

  return bestPlayers
}

export default loadAllPlayers
