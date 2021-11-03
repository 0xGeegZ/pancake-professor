import { Box, Grid, Zoom } from '@mui/material'
import { styled } from '@mui/material/styles'
import { ethers } from 'ethers'
import nc from 'next-connect'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import passport from 'passport'
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
import { decrypt } from 'src/server/utils/crpyto'

// import passport from 'src/server//passport'
import type { ReactElement } from 'react'
import type { User } from 'src/client/models/user'
console.log('🚀 ~ OUTSIDE -  process.env.JSON_RPC_PROVIDER', process.env.JSON_RPC_PROVIDER)

const MainContentWrapper = styled(Box)(
  ({ theme }) => `
    min-height: calc(100% - ${theme.spacing(20)});
`
)
function ManagementUsers() {
  console.log('🚀 ~ COMPONENT -  process.env.JSON_RPC_PROVIDER', process.env.JSON_RPC_PROVIDER)

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
        console.log('🚀 ~ file: index.tsx ~ line 39 ~ lisPaused', lisPaused)

        const epoch = await ppreditionContract.currentEpoch()
        console.log('🚀 ~ file: index.tsx ~ line 39 ~ epoch', epoch)

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
      enqueueSnackbar(t(`You need to be connected to have data fecthing for this view.`), {
        variant: 'warning',
        TransitionComponent: Zoom,
      })
      // router.push('/app')
      return
    }
    if (user) return

    const lprovider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(lprovider)

    setUser(data.currentUser)

    const privateKey = decrypt(data.currentUser.private)

    const signer = new ethers.Wallet(privateKey, lprovider)
    // const signer = lprovider.getSigner()

    console.log('🚀 ~ file: index.tsx ~ line 92 ~ useEffect ~ signer', signer)

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

export const getServerSideProps = async ({ req, res }) => {
  // // const handler = nc().use(passport.initialize())
  // try {
  //   // await handler.run(req, res)
  //   await handler.apply(req, res)
  // } catch (e) {
  //   console.log('🚀 ~ file: index.tsx ~ line 148 ~ getServerSideProps ~ e', e)
  //   // handle the error
  // }
  // console.log('🚀 ~ req', req.isAuthenticated())

  const handler = nc().use(passport.initialize())
  try {
    await handler.apply(req, res)
  } catch (e) {
    // handle the error
  }
  console.log('🚀 ~ req', req.user)
  console.log('🚀 ~ PROPS -  process.env.JSON_RPC_PROVIDER', process.env.JSON_RPC_PROVIDER)
  // await handler.apply(req, res)
  // await middleware.apply(req, res)

  // console.log('🚀 ~ file: index.tsx ~ line 142 ~ getServerSideProps ~ req', req.isAuthenticated())

  // eslint-disable-next-line react-hooks/rules-of-hooks
  // const [{ data }] = await useGetCurrentUserQuery()
  return {
    props: {},
  }
}

// export const getStaticProps = async () => {
//   const provider = new ethers.providers.JsonRpcProvider(process.env.JSON_RPC_PROVIDER)
//   // eslint-disable-next-line react-hooks/rules-of-hooks
//   // const [{ data }] = await useGetCurrentUserQuery()
//   // console.log('🚀 ~ file: index.tsx ~ line 144 ~ getStaticProps ~ data', data)
//   return {
//     props: {
//       // hostname: process.env.HOSTNAME,
//       // port: process.env.PORT,
//       // host: process.env.HOST,
//     },
//   }
// }
