import { finder, range } from '../../utils/utils';

// import utils from '../../utils/utils';

const { GraphQLClient, gql } = require('graphql-request')
const graphQLClient = new GraphQLClient(process.env.PANCAKE_PREDICTION_GRAPHQL_ENDPOINT)

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

  let recentGames = finder(
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

  let lastFive = finder(
    lastGame.slice(Math.max(lastGame.length - 5, 0)),
    results.map((r) => r.epoch)
  )
  lastFive = lastFive.reduce((a, b) => a + b, 0)
  player.lastFive = lastFive

  const filtereds = results.filter((r) => lastGame.includes(r.epoch))
  const wons = filtereds.filter((r) => r.isWon)
  const winRateRecents = (wons.length * 100) / filtereds.length || 0
  player.winRateRecents = winRateRecents
  if (recentGames >= lastGame.length / 4 && lastFive > 1) return player
}

const loadPlayers = async ({ currentEpoch }) => {
  try {
    const query = gql`
      query getUsers($totalBets: String!, $winRate: String!) {
        users(
          first: 100
          where: { totalBets_gt: $totalBets, winRate_gt: $winRate }
          orderBy: winRate
          orderDirection: desc
        ) {
          id
          totalBNB
          totalBets
          winRate
          averageBNB
          netBNB
          bets(first: 1000, orderBy: createdAt, orderDirection: desc) {
            position
            round {
              epoch
              position
            }
          }
        }
      }
    `

    const lastFinishedEpoch = parseInt(currentEpoch) - 1

    console.log(`Current betting epoch ${+lastFinishedEpoch}`)
    const variables = {
      totalBets: TOTAL_BETS.toString(),
      winRate: WIN_RATE.toString(),
    }
    let data = await graphQLClient.request(query, variables)

    const { users } = data

    return users
    console.log(`Loading ${+users.length} players with WIN_RATE ${WIN_RATE} and TOTAL_BETS ${TOTAL_BETS} ...`)

    const LIMIT_HISTORY_LENGTH = 12 * 24

    const lastGame = [...range(lastFinishedEpoch - LIMIT_HISTORY_LENGTH, lastFinishedEpoch)]
    let bestPlayers = users.map((p) => checkIfPlaying(p, lastGame))

    // let bestPlayers = users

    bestPlayers = bestPlayers.filter(Boolean)

    bestPlayers = bestPlayers.filter((p) => +p.lastLooseCount === 0 && +p.lastWinCount < 4)

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
      return await loadPlayers({ currentEpoch })
    } else {
      TOTAL_BETS = TOTAL_BETS_INITIAL
      WIN_RATE = WIN_RATE_INITIAL
    }

    bestPlayers = bestPlayers.sort((a, b) => {
      if (
        +a.winRate > +b.winRate &&
        (a.recentGames >= b.recentGames + 1 ||
          (a.recentGames >= 7 && b.recentGames >= 7 && a.recentGames >= b.recentGames + 2))
      )
        return -1
      if (
        +a.winRate < +b.winRate &&
        (a.recentGames <= b.recentGames + 1 ||
          (a.recentGames <= 7 && b.recentGames <= 7 && a.recentGames <= b.recentGames + 2))
      )
        return 1

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
    return []
    // await sleep(5 * 1000)
    // console.error('Retrying...')
    // await loadPlayers({ currentEpoch })
  }
}

export default loadPlayers
