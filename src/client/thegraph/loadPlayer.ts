import { gql, GraphQLClient } from 'graphql-request'

const graphQLClient = new GraphQLClient(process.env.NEXT_PUBLIC_PANCAKE_PREDICTION_GRAPHQL_ENDPOINT)

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
        bets(first: 1000, orderBy: createdAt, orderDirection: desc) {
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

export default loadPlayer
