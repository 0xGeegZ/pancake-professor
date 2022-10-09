import { Grid } from '@mui/material'
import Head from 'next/head'
import type { ReactElement } from 'react'
import AppointmentsAlt from 'src/client/components/Dashboards/Healthcare/hospital/AppointmentsAlt'
import Departments from 'src/client/components/Dashboards/Healthcare/hospital/Departments'
import Doctors from 'src/client/components/Dashboards/Healthcare/hospital/Doctors'
import Notifications from 'src/client/components/Dashboards/Healthcare/hospital/Notifications'
import OverallStatus from 'src/client/components/Dashboards/Healthcare/hospital/OverallStatus'
import PageHeader from 'src/client/components/Dashboards/Healthcare/hospital/PageHeaderHospital'
import RecentPatients from 'src/client/components/Dashboards/Healthcare/hospital/RecentPatients'
import Surgeries from 'src/client/components/Dashboards/Healthcare/hospital/Surgeries'
import UpcomingConsults from 'src/client/components/Dashboards/Healthcare/hospital/UpcomingConsults'
import Footer from 'src/client/components/Footer'
import PageTitleWrapper from 'src/client/components/PageTitleWrapper'
import AccentHeaderLayout from 'src/client/layouts/AccentHeaderLayout'

function DashboardHospitalView() {
  return (
    <>
      <Head>
        <title>Healthcare Dashboard - Hospital Management</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      <Grid sx={{ px: 4 }} container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
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
        <Grid item md={6} lg={5} xs={12}>
          <Doctors />
        </Grid>
        <Grid item md={6} lg={7} xs={12}>
          <Departments />
        </Grid>
        <Grid item xs={12}>
          <RecentPatients />
        </Grid>
        <Grid item md={6} lg={7} xs={12}>
          <Notifications />
        </Grid>
        <Grid item md={6} lg={5} xs={12}>
          <UpcomingConsults />
        </Grid>
      </Grid>
      <Footer />
    </>
  )
}

export default DashboardHospitalView

DashboardHospitalView.getLayout = function getLayout(page: ReactElement) {
  return <AccentHeaderLayout>{page}</AccentHeaderLayout>
}
