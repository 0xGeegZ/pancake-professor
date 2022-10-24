const { GraphQLClient, gql } = require('graphql-request')
const { range, finder } = require('../utils/utils')

const graphQLClient = new GraphQLClient(process.env.PANCAKE_PREDICTION_GRAPHQL_ENDPOINT_BNB, {
  mode: 'cors',
  credentials: 'include',
  headers: {
    // 'Access-Control-Allow-Origin': 'http://localhost:3000',
    'Access-Control-Allow-Origin': '*',
  },
})

const loadPlayer = async (idPlayer) => {
  const query = gql`
    query getUser($id: ID!) {
      users(first: 1, where: { id: $id }) {
        id
        totalBNB
        totalBets
        winRate
        averageBNB
        netBNB
        bets(first: 300, orderBy: createdAt, orderDirection: desc) {
          id
          position
          amount
          createdAt
          block
          round {
            epoch
            position
            failed
            startAt
            closeAt
            lockAt
            lockPrice
            closePrice
            totalAmount
            bullAmount
            bearAmount
            lockBlock
            closeBlock
          }
        }
      }
    }
  `

  const variables = {
    id: idPlayer,
  }
  const data = await graphQLClient.request(query, variables)
  const { users } = data

  return users[0]
}

const checkLastDayWinrate = (player, lastGame) => {
  let results = player.bets
    .map(({ position, round: { epoch, position: final } }) => ({ epoch: +epoch, isWon: position === final }))
    .sort((a, b) => a.epoch > b.epoch)

  results = results.sort((a, b) => {
    return +a.epoch - +b.epoch
  })

  let recentGames = finder(
    lastGame,
    results.map((r) => r.epoch)
  )

  recentGames = recentGames.reduce((a, b) => a + b, 0)
  player.recentGames = recentGames

  let lastHour = finder(
    lastGame.slice(Math.max(lastGame.length - 12, 0)),
    results.map((r) => r.epoch)
  )
  lastHour = lastHour.reduce((a, b) => a + b, 0)
  player.lastHour = lastHour

  // const filteredLastHour = results.slice(Math.max(lastGame.length - 12, 0)).filter((r) => lastGame.includes(r.epoch))
  // const wonsLastHour = filteredLastHour.filter((r) => r.isWon)
  // const winRateLastHour = (wonsLastHour.length * 100) / filteredLastHour.length || 0

  // let lastFive = finder(
  //   lastGame.slice(Math.max(lastGame.length - 5, 0)),
  //   results.map((r) => r.epoch)
  // )

  // lastFive = lastFive.reduce((a, b) => a + b, 0)
  // player.lastFive = lastFive

  const filtereds = results.filter((r) => lastGame.includes(r.epoch))
  const wons = filtereds.filter((r) => r.isWon)
  const winRateRecents = (wons.length * 100) / filtereds.length || 0
  player.winRateRecents = winRateRecents

  if (!filtereds.length || winRateRecents >= 50.0) {
    // console.log('🚀 ~ winRateLastHour', winRateLastHour, 'filteredLastHour', filteredLastHour.length)
    return player
  }
}
module.exports = { loadPlayer, checkLastDayWinrate }

// export default loadPlayer
