import { Box, Grid } from '@mui/material'
import { styled } from '@mui/material/styles'
import Head from 'next/head'
import Footer from 'src/client/components/Footer'
import PageHeader from 'src/client/components/Management/Users/PageHeader'
import PlayersList from 'src/client/components/Management/Users/PlayersList'
import PageTitleWrapper from 'src/client/components/PageTitleWrapper'
import MainLayout from 'src/client/layouts/MainLayout'

// import passport from 'src/server//passport'
import type { ReactElement } from 'react'

const MainContentWrapper = styled(Box)(
  ({ theme }) => `
    min-height: calc(100% - ${theme.spacing(20)});
`
)
function PlayersView() {
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
            <PlayersList />
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
//     process.env.PANCAKE_PREDICTION_CONTRACT_ADDRESS_BNB,
//     PREDICTION_CONTRACT_ABI,
//     signer
//   )

//   const isPaused = await preditionContract.paused()

//   const epoch = await preditionContract.currentEpoch()
//   return {
//     props: { isPaused, epoch: epoch.toString() },
//   }
// }
