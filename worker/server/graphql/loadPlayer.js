const { GraphQLClient, gql } = require('graphql-request')

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
        bets(first: 1, orderBy: createdAt, orderDirection: desc) {
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

module.exports = { loadPlayer }

// export default loadPlayer
