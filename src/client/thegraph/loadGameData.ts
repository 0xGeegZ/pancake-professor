import { gql, GraphQLClient } from 'graphql-request'

const graphQLClient = new GraphQLClient(process.env.NEXT_PUBLIC_PANCAKE_PREDICTION_GRAPHQL_ENDPOINT_BNB, {
  mode: 'cors',
})

const loadGameData = async ({ epoch }) => {
  try {
    const query = gql`
      query getCurrentRound($epoch: String!) {
        rounds(where: { epoch: $epoch }) {
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
    const data = await graphQLClient.request(query, variables)
    console.log('🚀 ~ file: loadGameData.ts ~ line 35 ~ loadGameData ~ data', data)

    const {
      rounds: [round],
    } = data

    return round
  } catch (error) {
    console.error('GraphQL query error')
    console.error(error)
  }
}

export default loadGameData

// export default loadPlayers
