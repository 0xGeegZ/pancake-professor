import { Box, Grid, Zoom } from '@mui/material'
import { styled } from '@mui/material/styles'
import { ethers } from 'ethers'
import Head from 'next/head'
import { useSnackbar } from 'notistack'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PREDICTION_CONTRACT_ABI } from 'src/client/abis/pancake-prediction-abi-v3'
import Footer from 'src/client/components/Footer'
import PageHeader from 'src/client/components/Management/Users/PageHeader'
import PlayersList from 'src/client/components/Management/Users/PlayersList'
import PageTitleWrapper from 'src/client/components/PageTitleWrapper'
import { useGetCurrentUserQuery } from 'src/client/graphql/getCurrentUser.generated'
import MainLayout from 'src/client/layouts/MainLayout'
import loadPlayers from 'src/client/thegraph/loadPlayers'
import { handler } from 'src/server/api-route'
import { decrypt } from 'src/server/utils/crpyto'

import type { ReactElement } from 'react'
import type { User } from 'src/client/models/user'

const MainContentWrapper = styled(Box)(
  ({ theme }) => `
    min-height: calc(100% - ${theme.spacing(20)});
`
)
const PlayersView = ({ isPaused, epoch }) => {
  const { enqueueSnackbar } = useSnackbar()
  const { t }: { t: any } = useTranslation()

  const [fetching, setFetching] = useState<boolean>(false)
  const [players, setPlayers] = useState<any[]>([])
  const [hasError, setHasError] = useState<boolean>(false)

  const [user, setUser] = useState<User | any>(null)

  const [{ data, error }] = useGetCurrentUserQuery()

  const getPlayers = useCallback(async () => {
    if (fetching) return

    console.log('getPlayers', epoch)

    setFetching(true)
    try {
      const lplayers = await loadPlayers({ epoch })
      setPlayers(lplayers)
      setFetching(false)
    } catch (err) {
      setHasError(true)
    }
  }, [fetching, epoch])

  const refreshQuery = useCallback(
    async ({ orderBy }) => {
      console.log('refreshQuery')
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
    [players, epoch]
  )

  useEffect(() => {
    if (error) setHasError(true)
    if (!data) return
    if (!data?.currentUser) {
      enqueueSnackbar(t(`You need to be connected to have data fecthing for this view.`), {
        variant: 'warning',
        TransitionComponent: Zoom,
      })
      return
    }
    if (user) return

    if (isPaused) {
      enqueueSnackbar(t(`Contract is paused.`), {
        variant: 'warning',
        TransitionComponent: Zoom,
      })
      return
    }

    setUser(data.currentUser)

    try {
      getPlayers()
    } catch (err) {
      setHasError(true)
    }
  }, [data, getPlayers, user, error])

  return (
    <>
      <Head>
        <title>Follow Best Players</title>
      </Head>
      <MainContentWrapper>
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
      </MainContentWrapper>

      <Footer />
    </>
  )
}

PlayersView.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>
}

export default PlayersView

export const getServerSideProps = async ({ req, res }) => {
  await handler().run(req, res)

  const provider = new ethers.providers.JsonRpcProvider(process.env.JSON_RPC_PROVIDER)
  const privateKey = decrypt(req.user.private)

  const signer = new ethers.Wallet(privateKey, provider)

  const preditionContract = new ethers.Contract(
    process.env.PANCAKE_PREDICTION_CONTRACT_ADDRESS,
    PREDICTION_CONTRACT_ABI,
    signer
  )

  const isPaused = await preditionContract.paused()

  const epoch = await preditionContract.currentEpoch()
  return {
    props: { isPaused, epoch: epoch.toString() },
  }
}
