import { Grid } from '@mui/material'
import Head from 'next/head'
import type { ReactElement } from 'react'
import AccountBalance from 'src/client/components/Dashboards/Crypto/AccountBalance'
import AccountSecurity from 'src/client/components/Dashboards/Crypto/AccountSecurity'
import PageHeader from 'src/client/components/Dashboards/Crypto/PageHeader'
import RecentOrders from 'src/client/components/Dashboards/Crypto/RecentOrders'
import Wallets from 'src/client/components/Dashboards/Crypto/Wallets'
import WatchList from 'src/client/components/Dashboards/Crypto/WatchList'
import Footer from 'src/client/components/Footer'
import PageTitleWrapper from 'src/client/components/PageTitleWrapper'
import BoxedSidebarLayout from 'src/client/layouts/BoxedSidebarLayout'

function DashboardCrypto() {
  return (
    <>
      <Head>
        <title>Crypto Dashboard</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>

      <Grid sx={{ px: 4 }} container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
        <Grid item xs={12}>
          <AccountBalance user={{}} />
        </Grid>
        <Grid item lg={8} xs={12}>
          <Wallets />
        </Grid>
        <Grid item lg={4} xs={12}>
          <AccountSecurity />
        </Grid>
        <Grid item xs={12}>
          <RecentOrders />
        </Grid>
        <Grid item xs={12}>
          <WatchList />
        </Grid>
      </Grid>

      <Footer />
    </>
  )
}

export default DashboardCrypto

DashboardCrypto.getLayout = function getLayout(page: ReactElement) {
  return <BoxedSidebarLayout>{page}</BoxedSidebarLayout>
}
