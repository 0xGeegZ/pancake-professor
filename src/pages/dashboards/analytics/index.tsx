import { Grid } from '@mui/material'
import Head from 'next/head'
import type { ReactElement } from 'react'
import ActiveReferrals from 'src/client/components/Dashboards/Analytics/ActiveReferrals'
import AudienceOverview from 'src/client/components/Dashboards/Analytics/AudienceOverview'
import BounceRate from 'src/client/components/Dashboards/Analytics/BounceRate'
import Conversions from 'src/client/components/Dashboards/Analytics/Conversions'
import ConversionsAlt from 'src/client/components/Dashboards/Analytics/ConversionsAlt'
import PageHeader from 'src/client/components/Dashboards/Analytics/PageHeader'
import PendingInvitations from 'src/client/components/Dashboards/Analytics/PendingInvitations'
import SessionsByCountry from 'src/client/components/Dashboards/Analytics/SessionsByCountry'
import TopLandingPages from 'src/client/components/Dashboards/Analytics/TopLandingPages'
import TrafficSources from 'src/client/components/Dashboards/Analytics/TrafficSources'
import Footer from 'src/client/components/Footer'
import PageTitleWrapper from 'src/client/components/PageTitleWrapper'
import AccentHeaderLayout from 'src/client/layouts/AccentHeaderLayout'

const DashboardAnalytics = () => (
  <>
    <Head>
      <title>Analytics Dashboard</title>
    </Head>
    <PageTitleWrapper>
      <PageHeader />
    </PageTitleWrapper>
    <Grid sx={{ px: 4 }} container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
      <Grid item lg={8} md={6} xs={12}>
        <Grid container spacing={3} direction="row" justifyContent="center" alignItems="stretch">
          <Grid item sm={6} xs={12}>
            <ActiveReferrals />
          </Grid>
          <Grid item sm={6} xs={12}>
            <PendingInvitations />
          </Grid>
          <Grid item sm={6} xs={12}>
            <BounceRate />
          </Grid>
          <Grid item sm={6} xs={12}>
            <ConversionsAlt />
          </Grid>
        </Grid>
      </Grid>
      <Grid item lg={4} md={6} xs={12}>
        <SessionsByCountry />
      </Grid>
      <Grid item xs={12}>
        <AudienceOverview />
      </Grid>
      <Grid item md={5} xs={12}>
        <Conversions />
      </Grid>
      <Grid item md={7} xs={12}>
        <TopLandingPages />
      </Grid>
      <Grid item xs={12}>
        <TrafficSources />
      </Grid>
    </Grid>
    <Footer />
  </>
)

export default DashboardAnalytics

DashboardAnalytics.getLayout = function getLayout(page: ReactElement) {
  return <AccentHeaderLayout>{page}</AccentHeaderLayout>
}
