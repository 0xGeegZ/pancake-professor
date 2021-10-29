import type { ReactElement } from 'react'
import AccentHeaderLayout from 'src/client/layouts/AccentHeaderLayout'

import Head from 'next/head'
import PageHeader from 'src/client/components/Dashboards/Commerce/PageHeader'
import { Grid } from '@mui/material'
import Footer from 'src/client/components/Footer'
import PageTitleWrapper from 'src/client/components/PageTitleWrapper'

import GrossSales from 'src/client/components/Dashboards/Commerce/GrossSales'
import Customers from 'src/client/components/Dashboards/Commerce/Customers'
import Orders from 'src/client/components/Dashboards/Commerce/Orders'
import Refunds from 'src/client/components/Dashboards/Commerce/Refunds'
import VisitorsOverview from 'src/client/components/Dashboards/Commerce/VisitorsOverview'
import RecentTransactions from 'src/client/components/Dashboards/Commerce/RecentTransactions'
import FullReport from 'src/client/components/Dashboards/Commerce/FullReport'
import SalesByCategory from 'src/client/components/Dashboards/Commerce/SalesByCategory'
import TopProducts from 'src/client/components/Dashboards/Commerce/TopProducts'
import MonthlyComparison from 'src/client/components/Dashboards/Commerce/MonthlyComparison'
import MonthlyGoals from 'src/client/components/Dashboards/Commerce/MonthlyGoals'
import SalesByCountry from 'src/client/components/Dashboards/Commerce/SalesByCountry'
import Traffic from 'src/client/components/Dashboards/Commerce/Traffic'

function DashboardCommerce() {
  return (
    <>
      <Head>
        <title>Commerce Dashboard</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>

      <Grid sx={{ px: 4 }} container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
        <Grid item xs={12}>
          <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
            <Grid item lg={3} sm={6} xs={12}>
              <GrossSales />
            </Grid>
            <Grid item lg={3} sm={6} xs={12}>
              <Customers />
            </Grid>
            <Grid item lg={3} sm={6} xs={12}>
              <Orders />
            </Grid>
            <Grid item lg={3} sm={6} xs={12}>
              <Refunds />
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={6} lg={7} xs={12}>
          <VisitorsOverview />
        </Grid>
        <Grid item md={6} lg={5} xs={12}>
          <RecentTransactions />
        </Grid>
        <Grid item lg={5} xs={12}>
          <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
            <Grid item lg={12} md={6} xs={12}>
              <FullReport />
            </Grid>
            <Grid item lg={12} md={6} xs={12}>
              <SalesByCategory />
            </Grid>
          </Grid>
        </Grid>
        <Grid item lg={7} xs={12}>
          <TopProducts />
        </Grid>
        <Grid item md={6} lg={7} xs={12}>
          <MonthlyComparison />
        </Grid>
        <Grid item md={6} lg={5} xs={12}>
          <MonthlyGoals />
        </Grid>
        <Grid item md={6} lg={5} xs={12}>
          <SalesByCountry />
        </Grid>
        <Grid item md={6} lg={7} xs={12}>
          <Traffic />
        </Grid>
      </Grid>

      <Footer />
    </>
  )
}

export default DashboardCommerce

DashboardCommerce.getLayout = function getLayout(page: ReactElement) {
  return <AccentHeaderLayout>{page}</AccentHeaderLayout>
}
