// https://dev.to/saisandeepvaddi/simple-way-to-manage-state-in-react-with-context-kig
// https://blog.logrocket.com/end-to-end-type-safety-nextjs-prisma-graphql/
import { ethers } from 'ethers'
import { createContext, FC, ReactNode, useCallback, useContext, useState } from 'react'
import { everything } from 'src/client/graphql/generated/genql'
import { client } from 'src/client/utils/genqlClient'
import useSWR, { SWRConfig } from 'swr'

// import useSWR from 'swr'

// import { useGetCurrentUserQuery } from 'src/client/graphql/getCurrentUser.generated'

type GlobalStateContext = {
  user: any
  mutate: any
  error: null
  fetching: boolean
}

export const GlobalStateContext = createContext<GlobalStateContext>({} as GlobalStateContext)

type Props = {
  children: ReactNode
}

// function localStorageProvider() {
//   console.log('🚀 ~ file: index.tsx ~ line 27 ~ localStorageProvider ~ localStorageProvider')
//   if (typeof window === 'undefined') return

//   // When initializing, we restore the data from `localStorage` into a map.
//   const map = new Map(JSON.parse(localStorage.getItem('app-cache') || '[]'))

//   // Before unloading the app, we write back all the data into `localStorage`.
//   window.addEventListener('beforeunload', () => {
//     const appCache = JSON.stringify(Array.from(map.entries()))
//     localStorage.setItem('app-cache', appCache)
//   })

//   // We still use the map for write & read for performance.
//   return map
// }

export const GlobalStateProvider: FC = ({ children }: Props) => {
  const [value, setValue] = useState<any>({ fetching: true })

  const fetcher = () =>
    client.query({
      currentUser: {
        id: true,
        name: true,
        address: true,
        generated: true,
        email: true,
        isActivated: true,
        registeredAt: true,
        loginAt: true,
        strategies: {
          ...everything,
        },
        favorites: {
          ...everything,
        },
      },
    })

  const { data, error, mutate, isValidating } = useSWR('currentUser', fetcher)

  const checkBalance = useCallback(
    async (user) => {
      const luser = user
      if (!window.ethereum?.request) return

      const provider = new ethers.providers.Web3Provider(window.ethereum)

      if (!provider) return

      const { chainId } = await provider.getNetwork()
      luser.networkId = chainId

      const rawBalance = await provider.getBalance(luser.address)

      const lbalance = ethers.utils.formatUnits(rawBalance)
      luser.balance = lbalance

      const generatedRawBalance = await provider.getBalance(luser.generated)
      const lgeneratedBalance = ethers.utils.formatUnits(generatedRawBalance)
      luser.generatedBalance = lgeneratedBalance

      setValue({ user, error, mutate, fetching: isValidating })
    },
    [error, mutate, isValidating]
  )

  const currentUser = data?.currentUser ? data?.currentUser : null

  if (currentUser) {
    const isFinded =
      process.env.NODE_ENV === 'development'
        ? true
        : process.env.NEXT_PUBLIC_ADMIN_ADDRESS.toLowerCase() === currentUser?.address.toLowerCase()

    const updated = { ...currentUser, isAdmin: isFinded }
    checkBalance(updated)
  } else if (!isValidating && (value.fetching || value.user)) {
    // fetching done but no user or user logout
    setValue({ user: null, error, mutate, fetching: isValidating })
  }
  // else if (!isValidating && value.fetching) {
  //   //fetching done but no user
  //   setValue({ user: null, error, mutate, fetching: isValidating })
  // } else if (!isValidating && value.user) {
  //   // logout
  //   setValue({ user: null, error, mutate, fetching: isValidating })
  // }
  // const value = useMemo(() => ({ user, error, mutate, fetching: !error && !user }), [user, error, mutate])

  return (
    <SWRConfig value={{ provider: () => new Map() }}>
      {/* <SWRConfig value={{ provider: localStorageProvider }}> */}
      <GlobalStateContext.Provider value={value}> {children} </GlobalStateContext.Provider>
    </SWRConfig>
  )
}

export function useGlobalStore() {
  const context = useContext(GlobalStateContext)
  if (!context) {
    throw new Error('You forgot to wrap GlobalStoreProvider')
  }

  return context
}
