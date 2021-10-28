// import utils from '../../utils/utils';

const { GraphQLClient, gql } = require('graphql-request')
const graphQLClient = new GraphQLClient(process.env.NEXT_PUBLIC_PANCAKE_PREDICTION_GRAPHQL_ENDPOINT)

const loadGameData = async ({ epoch }) => {
  try {
    const query = gql`
      query getCurrentRound($epoch: String!) {
        rounds(first: 1, where: { epoch: $epoch }) {
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
          bets(first: 1000, orderBy: createdAt, orderDirection: desc) {
            id
            position
            amount
            createdAt
          }
        }
      }
    `

    const variables = {
      epoch: epoch.toString(),
    }
    let data = await graphQLClient.request(query, variables)

    const {
      rounds: [round],
    } = data

    return round
  } catch (error) {
    console.error('GraphQL query error')
    console.error(error)
    return
  }
}

export default loadGameData

// export default loadPlayers