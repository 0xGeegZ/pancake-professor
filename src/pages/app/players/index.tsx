import { Box, Grid, Zoom } from '@mui/material'
import { styled } from '@mui/material/styles'
import { ethers } from 'ethers'
import Head from 'next/head'
import { useRouter } from 'next/router'
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

// import passport from 'src/server//passport'
import type { ReactElement } from 'react'
import type { User } from 'src/client/models/user'

const MainContentWrapper = styled(Box)(
  ({ theme }) => `
    min-height: calc(100% - ${theme.spacing(20)});
`
)
// function ManagementUsers({ isPaused, epoch }) {
function ManagementUsers() {
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const { t }: { t: any } = useTranslation()

  const [fetching, setFetching] = useState<boolean>(false)
  const [players, setPlayers] = useState<any[]>([])
  const [hasError, setHasError] = useState<boolean>(false)

  const [user, setUser] = useState<User | any>(null)
  const [preditionContract, setPreditionContract] = useState<any>(null)
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>(null)

  const [{ data }] = useGetCurrentUserQuery()

  const getPlayers = useCallback(
    async (ppreditionContract) => {
      if (fetching) return

      console.log('getPlayers')

      setFetching(true)
      try {
        const lisPaused = await ppreditionContract.paused()
        if (lisPaused) {
          enqueueSnackbar(t(`Contract is paused.`), {
            variant: 'warning',
            TransitionComponent: Zoom,
          })
          return
        }
        const epoch = await ppreditionContract.currentEpoch()

        const lplayers = await loadPlayers({ epoch })
        setPlayers(lplayers)
        setFetching(false)
      } catch (err) {
        setHasError(true)
      }
    },
    [fetching, enqueueSnackbar, t]
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
      enqueueSnackbar(t(`You need to be connected to have data fecthing for this view.`), {
        variant: 'warning',
        TransitionComponent: Zoom,
      })
      return
    }
    if (user) return

    const lprovider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(lprovider)

    setUser(data.currentUser)

    const signer = lprovider.getSigner()

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
  }, [data, getPlayers, router, provider, user, preditionContract, enqueueSnackbar, t])

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

ManagementUsers.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>
}

export default ManagementUsers

// This value is considered fresh for ten seconds (s-maxage=10).
// If a request is repeated within the next 10 seconds, the previously
// cached value will still be fresh. If the request is repeated before 59 seconds,
// the cached value will be stale but still render (stale-while-revalidate=59).
//
// In the background, a revalidation request will be made to populate the cache
// with a fresh value. If you refresh the page, you will see the new value.

//  use it to load epoch from default address
// export const getServerSideProps = async ({ req, res }) => {
//   await handler().run(req, res)
// res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')

//   const provider = new ethers.providers.JsonRpcProvider(process.env.JSON_RPC_PROVIDER)
//   const privateKey = decrypt(req.user.private)

//   const signer = new ethers.Wallet(privateKey, provider)

//   const preditionContract = new ethers.Contract(
//     process.env.PANCAKE_PREDICTION_CONTRACT_ADDRESS,
//     PREDICTION_CONTRACT_ABI,
//     signer
//   )

//   const isPaused = await preditionContract.paused()

//   const epoch = await preditionContract.currentEpoch()
//   return {
//     props: { isPaused, epoch: epoch.toString() },
//   }
// }
