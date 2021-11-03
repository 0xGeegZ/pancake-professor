/* eslint-disable camelcase */
import { Box, Grid } from '@mui/material'
import { ethers } from 'ethers'
import Head from 'next/head'
import { useSnackbar } from 'notistack'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ActiveStrategies from 'src/client/components/Dashboards/Automation/ActiveStrategies'
import ActiveStrategiesOverview from 'src/client/components/Dashboards/Commerce/ActiveStrategiesOverview'
import AccountBalance from 'src/client/components/Dashboards/Crypto/AccountBalance'
import Footer from 'src/client/components/Footer'
import { useGetCurrentUserQuery } from 'src/client/graphql/getCurrentUser.generated'
import MainLayout from 'src/client/layouts/MainLayout'

// import TotalLockedValue from 'src/client/components/Dashboards/Automation/TotalLockedValue'
// import ActiveStrategiesCount from 'src/client/components/Dashboards/Commerce/ActiveStrategiesCount'
// import ActiveUsers from 'src/client/components/Dashboards/Commerce/ActiveUsers'
// import CountUsers from 'src/client/components/Dashboards/Commerce/CountUsers'
// import TotalWon from 'src/client/components/Dashboards/Commerce/TotalWon'
// import BalanceHistory from 'src/client/components/Dashboards/Healthcare/hospital/BalanceHistory'
import type { ReactElement } from 'react'

function DashboardCrypto() {
  const { t }: { t: any } = useTranslation()

  // const isMountedRef = useRefMounted()

  // const [{ data, fetching, error }] = useGetCurrentUserQuery()
  const [{ data, fetching }] = useGetCurrentUserQuery()

  // const router = useRouter()
  const [user, setUser] = useState<any>(null)

  // const [provider, setProvider] = useState<ethers.providers.Web3Provider>()

  const { enqueueSnackbar } = useSnackbar()

  const checkBalance = useCallback(async (puser) => {
    if (!window.ethereum?.request) return

    const provider = new ethers.providers.Web3Provider(window.ethereum)

    if (!provider) return

    const luser = puser

    const rawBalance = await provider.getBalance(luser.address)

    const lbalance = ethers.utils.formatUnits(rawBalance)
    luser.balance = lbalance
    // setBalance(lbalance)

    const generatedRawBalance = await provider.getBalance(luser.generated)
    const lgeneratedBalance = ethers.utils.formatUnits(generatedRawBalance)
    luser.generatedBalance = lgeneratedBalance

    setUser(luser)
  }, [])

  useEffect(() => {
    if (!data) return
    if (user) return

    let isFinded = false

    if (data && data.currentUser) {
      isFinded = process.env.NEXT_PUBLIC_ADMIN_ADDRESS
        ? process.env.NEXT_PUBLIC_ADMIN_ADDRESS.includes(data?.currentUser?.address)
        : false

      const luser = {
        ...data.currentUser,
        isAdmin: isFinded,
      }
      // setUser(luser)
      checkBalance(luser)
    }
  }, [data, user, checkBalance])

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
      <Box sx={{ mt: 3 }}>
        <Grid sx={{ px: 4 }} container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
          {/* <Grid item xs={12}>
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
*/}
          <Grid item lg={4} xs={12}>
            <AccountBalance user={user} />
          </Grid>
          {/* <Grid item lg={8} xs={12}>
            <BalanceHistory />
          </Grid> */}

          <Grid item md={6} lg={8} xs={12}>
            <ActiveStrategiesOverview strategies={user?.strategies} />
          </Grid>
          <Grid item xs={12}>
            <ActiveStrategies strategies={user?.strategies} />
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </>
  )
}

export default DashboardCrypto

DashboardCrypto.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>
}
