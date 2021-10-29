import { Grid } from '@mui/material'
import Head from 'next/head'
import ActiveSubscriptions from 'src/client/components/Dashboards/Finance/ActiveSubscriptions'
import AllExpenses from 'src/client/components/Dashboards/Finance/AllExpenses'
import Budget from 'src/client/components/Dashboards/Finance/Budget'
import MyCards from 'src/client/components/Dashboards/Finance/MyCards'
import PageHeader from 'src/client/components/Dashboards/Finance/PageHeader'
import RecentTransactions from 'src/client/components/Dashboards/Finance/RecentTransactions'
import UpgradeAccount from 'src/client/components/Dashboards/Finance/UpgradeAccount'
import Footer from 'src/client/components/Footer'
import PageTitleWrapper from 'src/client/components/PageTitleWrapper'
import BoxedSidebarLayout from 'src/client/layouts/BoxedSidebarLayout'

import type { ReactElement } from 'react'

function DashboardFinance() {
  return (
    <>
      <Head>
        <title>Finance Dashboard</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>

      <Grid sx={{ px: 4 }} container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
        <Grid item lg={7} md={6} xs={12}>
          <RecentTransactions />
        </Grid>
        <Grid item lg={5} md={6} xs={12}>
          <MyCards />
        </Grid>
        <Grid item xs={12}>
          <UpgradeAccount />
        </Grid>
        <Grid item md={6} lg={5} xs={12}>
          <Budget />
        </Grid>
        <Grid item md={6} lg={7} xs={12}>
          <AllExpenses />
        </Grid>
        <Grid item xs={12}>
          <ActiveSubscriptions />
        </Grid>
      </Grid>

      <Footer />
    </>
  )
}

export default DashboardFinance

DashboardFinance.getLayout = function getLayout(page: ReactElement) {
  return <BoxedSidebarLayout>{page}</BoxedSidebarLayout>
}
