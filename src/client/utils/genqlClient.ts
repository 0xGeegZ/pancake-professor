// /util/genqlClient.ts
import { createClient } from 'src/client/graphql/generated/genql'

export const client = createClient({
  url: '/api',
})
