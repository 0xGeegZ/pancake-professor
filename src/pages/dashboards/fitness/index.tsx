import type { ReactElement } from 'react';
import dynamic from 'next/dynamic';
import AccentHeaderLayout from "src/client/layouts/AccentHeaderLayout";

import Head from 'next/head';
import PageHeader from 'src/client/components/Dashboards/Fitness/PageHeader';
import PageTitleWrapper from 'src/client/components/PageTitleWrapper';
import { Grid } from '@mui/material';
import Footer from 'src/client/components/Footer';

import Steps from 'src/client/components/Dashboards/Fitness/Steps';
import Energy from 'src/client/components/Dashboards/Fitness/Energy';
import Water from 'src/client/components/Dashboards/Fitness/Water';
import Calories from 'src/client/components/Dashboards/Fitness/Calories';
import Activity from 'src/client/components/Dashboards/Fitness/Activity';
import UpcomingEvents from 'src/client/components/Dashboards/Fitness/UpcomingEvents';
import ProfileGoals from 'src/client/components/Dashboards/Fitness/ProfileGoals';
import CaloriesAlt from 'src/client/components/Dashboards/Fitness/CaloriesAlt';
import ProteinAlt from 'src/client/components/Dashboards/Fitness/ProteinAlt';
import CarbsAlt from 'src/client/components/Dashboards/Fitness/CarbsAlt';
import FatAlt from 'src/client/components/Dashboards/Fitness/FatAlt';
import HeartRate from 'src/client/components/Dashboards/Fitness/HeartRate';
import Running from 'src/client/components/Dashboards/Fitness/Running';
import Swimming from 'src/client/components/Dashboards/Fitness/Swimming';

const TrainingPrograms = dynamic(
  () => import('src/client/components/Dashboards/Fitness/TrainingPrograms'),
  { ssr: true }
)

const MonthlyGoalsTarget = dynamic(
  () => import('src/client/components/Dashboards/Fitness/MonthlyGoalsTarget'),
  { ssr: true }
)

function DashboardFitness() {
  return (
    <>
      <Head>
        <title>Fitness Dashboard</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>

      <Grid
        sx={{ px: 4 }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={3}
      >
        <Grid item lg={6} xs={12}>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="stretch"
            spacing={3}
          >
            <Grid item sm={6} md={3} lg={6} xs={12}>
              <Steps />
            </Grid>
            <Grid item sm={6} md={3} lg={6} xs={12}>
              <Energy />
            </Grid>
            <Grid item sm={6} md={3} lg={6} xs={12}>
              <Water />
            </Grid>
            <Grid item sm={6} md={3} lg={6} xs={12}>
              <Calories />
            </Grid>
          </Grid>
        </Grid>
        <Grid item lg={6} xs={12}>
          <Activity />
        </Grid>
        <Grid item xs={12}>
          <TrainingPrograms />
        </Grid>
        <Grid item md={6} xs={12}>
          <UpcomingEvents />
        </Grid>
        <Grid item md={6} xs={12}>
          <ProfileGoals />
        </Grid>
        <Grid item md={6} xs={12}>
          <MonthlyGoalsTarget />
        </Grid>
        <Grid item md={6} xs={12}>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="stretch"
            spacing={3}
          >
            <Grid item sm={6} xs={12}>
              <CaloriesAlt />
            </Grid>
            <Grid item sm={6} xs={12}>
              <ProteinAlt />
            </Grid>
            <Grid item sm={6} xs={12}>
              <CarbsAlt />
            </Grid>
            <Grid item sm={6} xs={12}>
              <FatAlt />
            </Grid>
          </Grid>
        </Grid>
        <Grid item sm={6} md={4} xs={12}>
          <HeartRate />
        </Grid>
        <Grid item sm={6} md={4} xs={12}>
          <Running />
        </Grid>
        <Grid item md={4} xs={12}>
          <Swimming />
        </Grid>
      </Grid>

      <Footer />
    </>
  );
}

export default DashboardFitness;

DashboardFitness.getLayout = function getLayout(page: ReactElement) {
  return (
    <AccentHeaderLayout>
      {page}
    </AccentHeaderLayout>
  )
}