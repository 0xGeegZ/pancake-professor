import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone'
import { alpha, Box, Drawer, Grid, Hidden, IconButton, useTheme } from '@mui/material'
import { styled } from '@mui/material/styles'
import Head from 'next/head'
import { useState } from 'react'
import { Scrollbars } from 'react-custom-scrollbars-2'
import Appointments from 'src/client/components/Dashboards/Healthcare/doctor/Appointments'
import Cancelled from 'src/client/components/Dashboards/Healthcare/doctor/Cancelled'
import Consultations from 'src/client/components/Dashboards/Healthcare/doctor/Consultations'
import HealthcareSidebar from 'src/client/components/Dashboards/Healthcare/doctor/HealthcareSidebar'
import PageHeader from 'src/client/components/Dashboards/Healthcare/doctor/PageHeader'
import PrescriptionRequests from 'src/client/components/Dashboards/Healthcare/doctor/PrescriptionRequests'
import SoonAvailable from 'src/client/components/Dashboards/Healthcare/doctor/SoonAvailable'
import Footer from 'src/client/components/Footer'
import AccentHeaderLayout from 'src/client/layouts/AccentHeaderLayout'

import type { ReactElement } from 'react'

const DrawerWrapper = styled(Drawer)(
  ({ theme }) => `
    width: 400px;
    flex-shrink: 0;
    position: relative;
    z-index: 3;

    & > .MuiPaper-root {
        width: 400px;
        height: 100%;
        position: absolute;
        top: 0;
        right: 0;
        z-index: 3;
        background: ${alpha(theme.colors.alpha.white[100], 0.5)};
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

function DashboardHealthcare() {
  const theme = useTheme()

  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const sidebarContent = (
    <Scrollbars universal autoHide>
      <HealthcareSidebar />
    </Scrollbars>
  )

  return (
    <>
      <Head>
        <title>Healthcare Dashboard - Doctor Overview</title>
      </Head>
      <Box display="flex">
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
              <SoonAvailable />
            </Grid>
            <Grid item xs={12}>
              <Appointments />
            </Grid>
            <Grid item xs={12}>
              <PrescriptionRequests />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Consultations />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Cancelled />
            </Grid>
          </Grid>
          <Footer />
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

export default DashboardHealthcare

DashboardHealthcare.getLayout = function getLayout(page: ReactElement) {
  return <AccentHeaderLayout>{page}</AccentHeaderLayout>
}
