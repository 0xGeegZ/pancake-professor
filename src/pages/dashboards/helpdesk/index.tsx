import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone'
import { Box, Drawer, Grid, Hidden, IconButton,useTheme } from '@mui/material'
import { styled } from '@mui/material/styles'
import Head from 'next/head'
import type { ReactElement } from 'react'
import { useState } from 'react'
import { Scrollbars } from 'react-custom-scrollbars-2'
import AssignedTasks from 'src/client/components/Dashboards/Helpdesk/AssignedTasks'
import HelpdeskSidebar from 'src/client/components/Dashboards/Helpdesk/HelpdeskSidebar'
import PageHeader from 'src/client/components/Dashboards/Helpdesk/PageHeader'
import PendingQuestions from 'src/client/components/Dashboards/Helpdesk/PendingQuestions'
import PendingTickets from 'src/client/components/Dashboards/Helpdesk/PendingTickets'
import RecentQuestions from 'src/client/components/Dashboards/Helpdesk/RecentQuestions'
import TopAgents1 from 'src/client/components/Dashboards/Helpdesk/TopAgents1'
import TopAgents2 from 'src/client/components/Dashboards/Helpdesk/TopAgents2'
import TopAgentsHeading from 'src/client/components/Dashboards/Helpdesk/TopAgentsHeading'
import UnresolvedTickets from 'src/client/components/Dashboards/Helpdesk/UnresolvedTickets'
import UpdatedTickets from 'src/client/components/Dashboards/Helpdesk/UpdatedTickets'
import CollapsedSidebarLayout from 'src/client/layouts/CollapsedSidebarLayout'

const DrawerWrapper = styled(Drawer)(
  ({ theme }) => `
    width: 360px;
    flex-shrink: 0;
    z-index: 3;

    & > .MuiPaper-root {
        width: 360px;
        height: calc(100% - ${theme.header.height});
        position: absolute;
        top: ${theme.header.height};
        right: 0;
        z-index: 3;
        background: ${theme.colors.alpha.white[100]};
    }
`
)

const DrawerWrapperMobile = styled(Drawer)(
  () => `
    width: 340px;
    flex-shrink: 0;

  & > .MuiPaper-root {
        width: 340px;
        z-index: 3;
  }
`
)

const MainContentWrapper = styled(Box)(
  () => `
  flex-grow: 1;
`
)

const IconButtonToggle = styled(IconButton)(
  ({ theme }) => `
  width: ${theme.spacing(6)};
  height: ${theme.spacing(6)};
`
)

function DashboardHelpdesk() {
  const theme = useTheme()

  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const sidebarContent = (
    <Scrollbars universal autoHide>
      <HelpdeskSidebar />
    </Scrollbars>
  )

  return (
    <>
      <Head>
        <title>Helpdesk Dashboard</title>
      </Head>
      <Box sx={{ width: { xs: '100%', lg: 'calc(100% - 340px)' } }}>
        <MainContentWrapper>
          <Grid sx={{ px: 4 }} container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box mt={3}>
                  <PageHeader />
                </Box>
                <Hidden lgUp>
                  <IconButtonToggle color="primary" onClick={handleDrawerToggle} size="small">
                    <MenuTwoToneIcon />
                  </IconButtonToggle>
                </Hidden>
              </Box>
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
              <PendingTickets />
            </Grid>
            <Grid item xs={12}>
              <RecentQuestions />
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
          </Grid>
          <Box mt={3} />
        </MainContentWrapper>
        <Hidden lgUp>
          <DrawerWrapperMobile
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'left' : 'right'}
            open={mobileOpen}
            onClose={handleDrawerToggle}>
            {sidebarContent}
          </DrawerWrapperMobile>
        </Hidden>
        <Hidden lgDown>
          <DrawerWrapper variant="permanent" anchor={theme.direction === 'rtl' ? 'left' : 'right'} open>
            {sidebarContent}
          </DrawerWrapper>
        </Hidden>
      </Box>
    </>
  )
}

export default DashboardHelpdesk

DashboardHelpdesk.getLayout = function getLayout(page: ReactElement) {
  return <CollapsedSidebarLayout>{page}</CollapsedSidebarLayout>
}
