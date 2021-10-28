import PlayersList from '@/client/components/Management/Users/PlayersList'
import { Grid } from '@mui/material'
import { ethers } from 'ethers'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Footer from 'src/client/components/Footer'
import PageHeader from 'src/client/components/Management/Users/PageHeader'
import PageTitleWrapper from 'src/client/components/PageTitleWrapper'
import { useGetCurrentUserQuery } from 'src/client/graphql/getCurrentUser.generated'
import useRefMounted from 'src/client/hooks/useRefMounted'
import MainLayout from 'src/client/layouts/MainLayout'
import loadPlayers from 'src/client/thegraph/loadPlayers'

import type { ReactElement } from 'react'
import type { User } from 'src/client/models/user'

const { PREDICTION_CONTRACT_ABI } = require('src/client/abis/pancake-prediction-abi-v3')

function ManagementUsers() {
  // const [{ data, fetching, error }] = useGetUsersQuery()
  // const [{ data, fetching, error }] = useGetPlayersQuery()
  const router = useRouter()

  const { t }: { t: any } = useTranslation()
  const isMountedRef = useRefMounted()
  const { enqueueSnackbar } = useSnackbar()

  // const [users, setUsers] = useState<User[]>([])
  const [fetching, setFetching] = useState<boolean>(true)
  const [players, setPlayers] = useState<any[]>([])
  const [epoch, setEpoch] = useState<String>(null)
  const [hasError, setHasError] = useState<boolean>(false)

  const [user, setUser] = useState<User | any>(null)
  const [preditionContract, setPreditionContract] = useState<any>(null)
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>()

  const [{ data, fetching: userFetching, error: userError }] = useGetCurrentUserQuery()

  const getPlayers = useCallback(
    async (preditionContract) => {
      // if (isMountedRef.current) {

      if (epoch) return
      try {
        // const _epoch = epoch ? epoch : await preditionContract.currentEpoch()

        const epoch = await preditionContract.currentEpoch()
        setEpoch(epoch)

        const players = await loadPlayers({ epoch })
        setPlayers(players)
        setFetching(false)
      } catch (err) {
        console.error(err)
        setHasError(true)
      }
      // }
    },
    [isMountedRef]
  )

  const refreshQuery = useCallback(
    async ({ orderBy }) => {
      let _epoch = epoch
      if (!_epoch) {
        _epoch = await preditionContract.currentEpoch()
        setEpoch(_epoch)
      }
      console.log('🚀 ~ file: index.tsx ~ line 61 ~ refreshQuery ~ orderBy', orderBy)
      console.log('🚀 ~ file: index.tsx ~ line 61 ~ refreshQuery ~ _epoch', _epoch)
      setFetching(true)
      setPlayers([])
      players.length = 0

      try {
        const _players = await loadPlayers({ epoch: _epoch, orderBy })
        setPlayers(_players)
        setFetching(false)
      } catch (err) {
        console.error(err)
        setHasError(true)
      }
    },
    [epoch, players]
  )

  useEffect(() => {
    // console.log('🚀 ~ file: index.tsx ~ line 74 ~ useEffect ~ data', data)

    if (!data) return
    if (!data?.currentUser) {
      // if (!data?.currentUser && !userFetching) {
      router.push('/app')
      return
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    // TODO decode from server
    // const privateKey = crpyto.decrypt(data.currentUser.private)
    const privateKey = data.currentUser.private

    const signer = new ethers.Wallet(privateKey, provider)

    setUser(data.currentUser)
    const preditionContract = new ethers.Contract(
      process.env.NEXT_PUBLIC_PANCAKE_PREDICTION_CONTRACT_ADDRESS,
      PREDICTION_CONTRACT_ABI,
      signer
    )
    setPreditionContract(preditionContract)

    try {
      getPlayers(preditionContract)
    } catch (err) {
      console.error(err)
      setHasError(true)
    }
  }, [data, getPlayers])

  return (
    <>
      <Head>
        <title>Users - Management</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>

      <Grid sx={{ px: 4 }} container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
        <Grid item xs={12}>
          <PlayersList refreshQuery={refreshQuery} players={players} fetching={fetching} hasError={hasError} />
          {/* <PlayersList players={players} fetching={fetching} /> */}
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
