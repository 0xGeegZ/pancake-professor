import type { ReactElement } from 'react'

import BoxedSidebarLayout from 'src/client/layouts/BoxedSidebarLayout'

import Head from 'next/head'
import PageHeader from 'src/client/components/Dashboards/Monitoring/PageHeader'
import Footer from 'src/client/components/Footer'
import PageTitleWrapper from 'src/client/components/PageTitleWrapper'

import { Grid } from '@mui/material'

import ResourcesAlarm from 'src/client/components/Dashboards/Monitoring/ResourcesAlarm'
import HealthStatus from 'src/client/components/Dashboards/Monitoring/HealthStatus'
import DatacenterClusters from 'src/client/components/Dashboards/Monitoring/DatacenterClusters'
import VirtualServers from 'src/client/components/Dashboards/Monitoring/VirtualServers'
import ActiveServers from 'src/client/components/Dashboards/Monitoring/ActiveServers'
import DataCenters from 'src/client/components/Dashboards/Monitoring/DataCenters'
import StorageUsage from 'src/client/components/Dashboards/Monitoring/StorageUsage'
import MemoryUsage from 'src/client/components/Dashboards/Monitoring/MemoryUsage'
import CpuUsage from 'src/client/components/Dashboards/Monitoring/CpuUsage'

function DashboardMonitoring() {
  return (
    <>
      <Head>
        <title>Monitoring Dashboard</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>

      <Grid sx={{ px: 4 }} container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
        <Grid item xs={12} md={6}>
          <ResourcesAlarm />
        </Grid>
        <Grid item xs={12} md={6}>
          <HealthStatus />
        </Grid>
        <Grid item xs={12}>
          <DatacenterClusters />
        </Grid>
        <Grid item xs={12}>
          <VirtualServers />
        </Grid>
        <Grid item xs={12}>
          <ActiveServers />
        </Grid>
        <Grid item xs={12} sm={6} md={5}>
          <DataCenters />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CpuUsage />
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
            <Grid item xs={12} sm={6} md={12}>
              <StorageUsage />
            </Grid>
            <Grid item xs={12} sm={6} md={12}>
              <MemoryUsage />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Footer />
    </>
  )
}

export default DashboardMonitoring

DashboardMonitoring.getLayout = function getLayout(page: ReactElement) {
  return <BoxedSidebarLayout>{page}</BoxedSidebarLayout>
}
