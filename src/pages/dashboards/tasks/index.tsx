import type { ReactElement } from 'react'
import AccentHeaderLayout from 'src/client/layouts/AccentHeaderLayout'

import { ChangeEvent, useState } from 'react'
import Head from 'next/head'
import PageHeader from 'src/client/components/Dashboards/Tasks/PageHeader'
import Footer from 'src/client/components/Footer'
import { Grid, Tab, Tabs } from '@mui/material'
import Link from 'src/client/components/Link'
import PageTitleWrapper from 'src/client/components/PageTitleWrapper'

import TeamOverview from 'src/client/components/Dashboards/Tasks/TeamOverview'
import TasksAnalytics from 'src/client/components/Dashboards/Tasks/TasksAnalytics'
import Performance from 'src/client/components/Dashboards/Tasks/Performance'
import Projects from 'src/client/components/Dashboards/Tasks/Projects'
import Checklist from 'src/client/components/Dashboards/Tasks/Checklist'
import Profile from 'src/client/components/Dashboards/Tasks/Profile'
import TaskSearch from 'src/client/components/Dashboards/Tasks/TaskSearch'
import { useTranslation } from 'react-i18next'

function DashboardTasks() {
  const { t }: { t: any } = useTranslation()

  const [currentTab, setCurrentTab] = useState<string>('analytics')

  const tabs = [
    { value: 'analytics', label: t('Analytics Overview') },
    { value: 'taskSearch', label: t('Task Search') },
  ]

  const handleTabsChange = (_event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value)
  }

  return (
    <>
      <Head>
        <title>Tasks Dashboard</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>

      <Grid sx={{ px: 4 }} container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
        <Grid item xs={12}>
          <Tabs
            onChange={handleTabsChange}
            value={currentTab}
            variant="scrollable"
            scrollButtons="auto"
            textColor="primary"
            indicatorColor="primary">
            {tabs.map((tab) => (
              <Tab key={tab.value} label={tab.label} value={tab.value} />
            ))}
            <Tab component={Link} label={t('Projects Board')} href="/applications/projects-board" />
          </Tabs>
        </Grid>
        {currentTab === 'analytics' && (
          <>
            <Grid item xs={12}>
              <TeamOverview />
            </Grid>
            <Grid item xs={12} sm={6} md={8}>
              <TasksAnalytics />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Performance />
            </Grid>
            <Grid item xs={12}>
              <Projects />
            </Grid>
            <Grid item xs={12} md={6}>
              <Checklist />
            </Grid>
            <Grid item xs={12} md={6}>
              <Profile />
            </Grid>
          </>
        )}
        {currentTab === 'taskSearch' && (
          <Grid item xs={12}>
            <TaskSearch />
          </Grid>
        )}
      </Grid>

      <Footer />
    </>
  )
}

export default DashboardTasks

DashboardTasks.getLayout = function getLayout(page: ReactElement) {
  return <AccentHeaderLayout>{page}</AccentHeaderLayout>
}
