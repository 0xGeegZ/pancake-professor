// https://dev.to/saisandeepvaddi/simple-way-to-manage-state-in-react-with-context-kig
// https://blog.logrocket.com/end-to-end-type-safety-nextjs-prisma-graphql/
import { createContext, ReactNode, useContext, useMemo } from 'react'
import { everything } from 'src/client/graphql/generated/genql'
import { client } from 'src/client/utils/genqlClient'
import useSWR from 'swr'

type GlobalStateContext = {
  user: any
  mutateUser: () => void
  error: null
}

export const GlobalStateContext = createContext<GlobalStateContext>({} as GlobalStateContext)

type Props = {
  children: ReactNode
}

export function GlobalStateProvider({ children }: Props) {
  const fetcher = () =>
    client.query({
      currentUser: {
        id: true,
        name: true,
        address: true,
        generated: true,
        email: true,
        registeredAt: true,
        loginAt: true,
        strategies: {
          ...everything,
        },
      },
    })

  const {
    // data: { currentUser: user },
    data,
    error,
    mutate: mutateUser,
  } = useSWR('currentUser', fetcher)

  const value = useMemo(() => ({ user: data?.currentUser, error, mutateUser }), [data, error, mutateUser])

  return <GlobalStateContext.Provider value={value}> {children} </GlobalStateContext.Provider>
}

export function useGlobalStore() {
  const context = useContext(GlobalStateContext)
  if (!context) {
    throw new Error('You forgot to wrap GlobalStoreProvider')
  }

  return context
}
