/* eslint-disable camelcase */
import { Box, Grid } from '@mui/material'
import { styled } from '@mui/material/styles'
import Head from 'next/head'
import ActiveStrategies from 'src/client/components/Dashboards/Automation/ActiveStrategies'
import AccountBalance from 'src/client/components/Dashboards/Crypto/AccountBalance'
import AllStrategiesResume from 'src/client/components/Dashboards/Finance/AllStrategiesResume'
import Footer from 'src/client/components/Footer'
import MainLayout from 'src/client/layouts/MainLayout'
import { useGlobalStore } from 'src/client/store/swr'

// import BalanceHistory from 'src/client/components/Dashboards/Healthcare/hospital/BalanceHistory'
import type { ReactElement } from 'react'

const MainContentWrapper = styled(Box)(
  ({ theme }) => `
    min-height: calc(100% - ${theme.spacing(20)});
`
)
function Dashboard() {
  // const { t }: { t: any } = useTranslation()

  // const isMountedRef = useRefMounted()

  // const [{ data, fetching, error }] = useGetCurrentUserQuery()
  // const [{ data }] = useGetCurrentUserQuery()
  const { user, fetching } = useGlobalStore()

  // const router = useRouter()
  // const [user, setUser] = useState<any>(null)

  // const [provider, setProvider] = useState<ethers.providers.Web3Provider>()

  // const { enqueueSnackbar } = useSnackbar()

  // const checkBalance = useCallback(async (puser) => {
  //   if (!window.ethereum?.request) return

  //   const provider = new ethers.providers.Web3Provider(window.ethereum)

  //   if (!provider) return

  //   const luser = puser

  //   const rawBalance = await provider.getBalance(luser.address)

  //   const lbalance = ethers.utils.formatUnits(rawBalance)
  //   luser.balance = lbalance
  //   // setBalance(lbalance)

  //   const generatedRawBalance = await provider.getBalance(luser.generated)
  //   const lgeneratedBalance = ethers.utils.formatUnits(generatedRawBalance)
  //   luser.generatedBalance = lgeneratedBalance

  //   setUser(luser)
  // }, [])

  // useEffect(() => {
  //   if (!data) return
  //   if (user) return

  //   let isFinded = false

  //   if (data && data.currentUser) {
  //    const isFinded = process.env.NEXT_PUBLIC_ADMIN_ADDRESS
  // ? process.env.NEXT_PUBLIC_ADMIN_ADDRESS.toLowerCase() === currentUser?.address.toLowerCase()
  // : false

  //     const luser = {
  //       ...data.currentUser,
  //       isAdmin: isFinded,
  //     }
  //     // setUser(luser)
  //     checkBalance(luser)
  //   }
  // }, [data, user, checkBalance])

  // const handleActive = (strategie) => () => {
  //   console.log('handleActive', strategie.id)
  //   const updateds = user.strategies.map((s) => {
  //     const updated = s
  //     if (updated.id === strategie.id) updated.isActive = !updated.isActive

  //     return updated
  //   })
  //   const luser = user
  //   luser.strategies = updateds
  //   setUser(luser)
  //   // strategies = updateds
  //   // setStrategies(updateds)
  //   // strategie.isActive = !strategie.isActive

  //   // for (let i = 0; i < strategies.lenth; i++) {
  //   //   if (strategies[i].id === strategie.id) strategies[i].isActive = !strategies[i].isActive
  //   // }
  // }
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <MainContentWrapper sx={{ my: 3 }}>
        <Grid sx={{ px: 4 }} container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
          {/* {user?.isAdmin && (
            <>
              <Grid item xs={12}>
                <TotalLockedValue />
              </Grid>
              <Grid item xs={12}>
                <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
                  <Grid item lg={3} sm={6} xs={12}>
                    <CountUsers />
                  </Grid>
                  <Grid item lg={3} sm={6} xs={12}>
                    <ActiveUsers />
                  </Grid>
                  <Grid item lg={3} sm={6} xs={12}>
                    <ActiveStrategiesCount />
                  </Grid>
                  <Grid item lg={3} sm={6} xs={12}>
                    <TotalWon />
                  </Grid>
                </Grid>
              </Grid>
            </>
          )} */}
          <Grid item lg={4} xs={12}>
            <AccountBalance user={user} />
          </Grid>
          {/* <Grid item lg={8} xs={12}>
            <BalanceHistory />
          </Grid> */}
          <Grid item md={6} lg={8} xs={12}>
            <AllStrategiesResume strategies={user?.strategies} />
          </Grid>
          {/* <Grid item md={6} lg={8} xs={12}>
            <ActiveStrategiesOverview strategies={user?.strategies} />
          </Grid> */}
          <Grid item xs={12}>
            <ActiveStrategies user={user} fetching={fetching} />
            {/* <ActiveStrategies strategies={user?.strategies} favorites={user?.favorites} fetching={fetching} /> */}
          </Grid>
          {/* <Grid item md={6} xs={12}>
            <AllStrategiesResume />
          </Grid>
          <Grid item md={6} xs={12}>
            <RecentBetsForStrategies />
          </Grid> */}
        </Grid>
      </MainContentWrapper>
      <Footer />
    </>
  )
}

export default Dashboard

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>
}
