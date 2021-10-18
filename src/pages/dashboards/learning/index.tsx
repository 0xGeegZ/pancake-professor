import type { ReactElement } from 'react';
import dynamic from 'next/dynamic';

import AccentHeaderLayout from "src/client/layouts/AccentHeaderLayout";

import Head from 'next/head';
import PageHeader from 'src/client/components/Dashboards/Learning/PageHeader';
import Footer from 'src/client/components/Footer';
import { Grid } from '@mui/material';
import PageTitleWrapper from 'src/client/components/PageTitleWrapper';

import TimeSpent from 'src/client/components/Dashboards/Learning/TimeSpent';
import TopTrainers from 'src/client/components/Dashboards/Learning/TopTrainers';
import Leaderboard from 'src/client/components/Dashboards/Learning/Leaderboard';
import RecentCourses from 'src/client/components/Dashboards/Learning/RecentCourses';

const UpcomingConferences = dynamic(
  () => import('src/client/components/Dashboards/Learning/UpcomingConferences'),
  { ssr: true }
)

function DashboardLearning() {
  return (
    <>
      <Head>
        <title>Learning Dashboard</title>
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
        <Grid item xs={12}>
          <TimeSpent />
        </Grid>
        <Grid item xs={12} md={6}>
          <TopTrainers />
        </Grid>
        <Grid item xs={12} md={6}>
          <Leaderboard />
        </Grid>
        <Grid item xs={12}>
          <UpcomingConferences />
        </Grid>
        <Grid item xs={12}>
          <RecentCourses />
        </Grid>
      </Grid>

      <Footer />
    </>
  );
}

export default DashboardLearning;

DashboardLearning.getLayout = function getLayout(page: ReactElement) {
  return (
    <AccentHeaderLayout>
      {page}
    </AccentHeaderLayout>
  )
}