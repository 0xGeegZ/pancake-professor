import { Box, Grid } from '@mui/material'
import Head from 'next/head'
import ActiveStrategies from 'src/client/components/Dashboards/Automation/ActiveStrategies'
import TotalLockedValue from 'src/client/components/Dashboards/Automation/TotalLockedValue'
import ActiveStrategiesCount from 'src/client/components/Dashboards/Commerce/ActiveStrategiesCount'
import ActiveUsers from 'src/client/components/Dashboards/Commerce/ActiveUsers'
import CountUsers from 'src/client/components/Dashboards/Commerce/CountUsers'
import MonthlyComparison from 'src/client/components/Dashboards/Commerce/MonthlyComparison'
import TotalWon from 'src/client/components/Dashboards/Commerce/TotalWon'
import AccountBalance from 'src/client/components/Dashboards/Crypto/AccountBalance'
import BalanceHistory from 'src/client/components/Dashboards/Healthcare/hospital/BalanceHistory'
import Footer from 'src/client/components/Footer'
import MainLayout from 'src/client/layouts/MainLayout'

import type { ReactElement } from 'react'

function DashboardCrypto() {
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Box sx={{ mt: 3 }}>
        <Grid sx={{ px: 4 }} container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
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

          <Grid item lg={4} xs={12}>
            <AccountBalance />
          </Grid>
          <Grid item lg={8} xs={12}>
            <BalanceHistory />
          </Grid>
          <Grid item md={6} lg={7} xs={12}>
            <MonthlyComparison />
          </Grid>
          <Grid item xs={12} lg={12}>
            <ActiveStrategies />
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
