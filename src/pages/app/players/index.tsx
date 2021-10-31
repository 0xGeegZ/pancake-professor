import { Grid } from '@mui/material'
import { ethers } from 'ethers'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { PREDICTION_CONTRACT_ABI } from 'src/client/abis/pancake-prediction-abi-v3'
import Footer from 'src/client/components/Footer'
import PageHeader from 'src/client/components/Management/Users/PageHeader'
import PlayersList from 'src/client/components/Management/Users/PlayersList'
import PageTitleWrapper from 'src/client/components/PageTitleWrapper'
import { useGetCurrentUserQuery } from 'src/client/graphql/getCurrentUser.generated'
import MainLayout from 'src/client/layouts/MainLayout'
import loadPlayers from 'src/client/thegraph/loadPlayers'

import type { ReactElement } from 'react'
import type { User } from 'src/client/models/user'

function ManagementUsers() {
  const router = useRouter()

  const [fetching, setFetching] = useState<boolean>(false)
  const [players, setPlayers] = useState<any[]>([])
  const [hasError, setHasError] = useState<boolean>(false)

  const [user, setUser] = useState<User | any>(null)
  const [preditionContract, setPreditionContract] = useState<any>(null)
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>(null)

  const [{ data }] = useGetCurrentUserQuery()

  const getPlayers = useCallback(
    async (ppreditionContract) => {
      console.log('getPlayers')
      if (fetching) return
      setFetching(true)
      try {
        const epoch = await ppreditionContract.currentEpoch()

        const lplayers = await loadPlayers({ epoch })
        setPlayers(lplayers)
        setFetching(false)
      } catch (err) {
        setHasError(true)
      }
    },
    [fetching]
  )

  const refreshQuery = useCallback(
    async ({ orderBy }) => {
      console.log('refreshQuery')
      const epoch = await preditionContract.currentEpoch()

      setFetching(true)
      setPlayers([])
      players.length = 0

      try {
        const lplayers = await loadPlayers({ epoch, orderBy })
        setPlayers(lplayers)
        setFetching(false)
      } catch (err) {
        setHasError(true)
      }
    },
    [players, preditionContract]
  )

  useEffect(() => {
    if (!data) return
    if (!data?.currentUser) {
      router.push('/app')
      return
    }
    if (user) return

    const lprovider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(lprovider)

    setUser(data.currentUser)

    // TODO decode from server
    // const privateKey = crpyto.decrypt(data.currentUser.private)
    const privateKey = data.currentUser.private

    const signer = new ethers.Wallet(privateKey, lprovider)

    const lpreditionContract = new ethers.Contract(
      process.env.NEXT_PUBLIC_PANCAKE_PREDICTION_CONTRACT_ADDRESS,
      PREDICTION_CONTRACT_ABI,
      signer
    )
    setPreditionContract(lpreditionContract)

    try {
      getPlayers(lpreditionContract)
    } catch (err) {
      setHasError(true)
    }
  }, [data, getPlayers, router, provider, user, preditionContract])

  return (
    <>
      <Head>
        <title>Follow Best Players</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>

      <Grid sx={{ px: 4 }} container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
        <Grid item xs={12}>
          <PlayersList
            user={user}
            refreshQuery={refreshQuery}
            players={players}
            fetching={fetching}
            hasError={hasError}
          />
        </Grid>
      </Grid>
      <Footer />
    </>
  )
}

export default ManagementUsers

ManagementUsers.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>
}
