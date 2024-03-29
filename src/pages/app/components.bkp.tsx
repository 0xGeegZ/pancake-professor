import { Box, Grid } from '@mui/material'
import Head from 'next/head'
import TeamFolders from 'src/client/components/Applications/FileManager/TeamFolders'
import Devices from 'src/client/components/Dashboards/Automation/Devices'
import PowerConsumption from 'src/client/components/Dashboards/Automation/PowerConsumption'
import Investments from 'src/client/components/Dashboards/Banking/Investments'
import TransactionsStatistics from 'src/client/components/Dashboards/Banking/TransactionsStatistics'
import Customers from 'src/client/components/Dashboards/Commerce/Customers'
import GrossSales from 'src/client/components/Dashboards/Commerce/GrossSales'
import Orders from 'src/client/components/Dashboards/Commerce/Orders'
import Refunds from 'src/client/components/Dashboards/Commerce/Refunds'
import VisitorsOverview from 'src/client/components/Dashboards/Commerce/VisitorsOverview'
import Wallets from 'src/client/components/Dashboards/Crypto/Wallets'
import WatchList from 'src/client/components/Dashboards/Crypto/WatchList'
import ActiveSubscriptions from 'src/client/components/Dashboards/Finance/ActiveSubscriptions'
import UpgradeAccount from 'src/client/components/Dashboards/Finance/UpgradeAccount'
import Activity from 'src/client/components/Dashboards/Fitness/Activity'
import SoonAvailable from 'src/client/components/Dashboards/Healthcare/doctor/SoonAvailable'
import AppointmentsAlt from 'src/client/components/Dashboards/Healthcare/hospital/AppointmentsAlt'
import Doctors from 'src/client/components/Dashboards/Healthcare/hospital/Doctors'
import OverallStatus from 'src/client/components/Dashboards/Healthcare/hospital/OverallStatus'
import Surgeries from 'src/client/components/Dashboards/Healthcare/hospital/Surgeries'
import AssignedTasks from 'src/client/components/Dashboards/Helpdesk/AssignedTasks'
import PendingQuestions from 'src/client/components/Dashboards/Helpdesk/PendingQuestions'
import TopAgents1 from 'src/client/components/Dashboards/Helpdesk/TopAgents1'
import TopAgents2 from 'src/client/components/Dashboards/Helpdesk/TopAgents2'
import TopAgentsHeading from 'src/client/components/Dashboards/Helpdesk/TopAgentsHeading'
import UnresolvedTickets from 'src/client/components/Dashboards/Helpdesk/UnresolvedTickets'
import UpdatedTickets from 'src/client/components/Dashboards/Helpdesk/UpdatedTickets'
import Leaderboard from 'src/client/components/Dashboards/Learning/Leaderboard'
import TimeSpent from 'src/client/components/Dashboards/Learning/TimeSpent'
import TopTrainers from 'src/client/components/Dashboards/Learning/TopTrainers'
import DatacenterClusters from 'src/client/components/Dashboards/Monitoring/DatacenterClusters'
import VirtualServers from 'src/client/components/Dashboards/Monitoring/VirtualServers'
import Footer from 'src/client/components/Footer'
import MainLayout from 'src/client/layouts/MainLayout'

import type { ReactElement } from 'react'

function DashboardCrypto() {
  return (
    <>
      <Head>
        <title>Crypto Dashboard</title>
      </Head>
      {/* <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper> */}
      <Box sx={{ mt: 3 }}>
        <Grid sx={{ px: 4 }} container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
          {/* <Grid item xs={12}>
                      <AccountBalance user={{}} />
          </Grid> */}
          <Grid item lg={8} xs={12}>
            <OverallStatus />
          </Grid>
          <Grid item lg={4} xs={12}>
            <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
              <Grid item lg={12} md={6} xs={12}>
                <AppointmentsAlt />
              </Grid>
              <Grid item lg={12} md={6} xs={12}>
                <Surgeries />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <SoonAvailable />
          </Grid>
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
          <Grid item md={6} lg={5} xs={12}>
            <Doctors />
          </Grid>
          <Grid item md={6} lg={7} xs={12}>
            <VisitorsOverview />
          </Grid>
          <Grid item xs={12}>
            <Wallets />
          </Grid>
          <Grid item xs={12} lg={12}>
            <Devices />
          </Grid>
          <Grid item xs={12} lg={12}>
            <PowerConsumption />
          </Grid>
          {/* <Grid item lg={4} xs={12}>
            <AccountSecurity />
          </Grid>
          <Grid item xs={12}>
            <RecentOrders />
          </Grid> */}
          <Grid item xs={12}>
            <UpgradeAccount />
          </Grid>
          <Grid item lg={6} xs={12}>
            <Activity />
          </Grid>
          <Grid item xs={12}>
            <WatchList />
          </Grid>
          <Grid item lg={5} md={6} xs={12}>
            <Investments />
          </Grid>
          <Grid item lg={7} md={6} xs={12}>
            <TransactionsStatistics />
          </Grid>
          <Grid item xs={12}>
            <ActiveSubscriptions />
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <UnresolvedTickets />
              </Grid>
              <Grid item xs={12} md={6}>
                <PendingQuestions />
              </Grid>
              <Grid item xs={12} md={6}>
                <UpdatedTickets />
              </Grid>
              <Grid item xs={12} md={6}>
                <AssignedTasks />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <TopAgentsHeading />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TopAgents1 />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TopAgents2 />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <TimeSpent />
          </Grid>
          <Grid item xs={12} md={6}>
            <TopTrainers />
          </Grid>
          <Grid item xs={12} md={6}>
            <Leaderboard />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <DatacenterClusters />
        </Grid>
        <Grid item xs={12}>
          <VirtualServers />
        </Grid>
        <Grid item xs={12}>
          <TeamFolders />
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
