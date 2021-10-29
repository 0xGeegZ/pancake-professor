import { Box, Grid } from '@mui/material'
import Head from 'next/head'
import AutomationDetails from 'src/client/components/Dashboards/Finance/AutomationDetails'
import Footer from 'src/client/components/Footer'
import MainLayout from 'src/client/layouts/MainLayout'

import type { ReactElement } from 'react'
import SoonAvailable from '@/client/components/Dashboards/Healthcare/doctor/SoonAvailable'

function Automation() {
  return (
    <>
      <Head>
        <title>Automation</title>
      </Head>
      <Box sx={{ mt: 3, py: 9.5 }}>
        <Grid sx={{ px: 4 }} container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
          <Grid item xs={12}>
            <SoonAvailable />
          </Grid>
          <Grid item xs={12}>
            <AutomationDetails />
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </>
  )
}

export default Automation

Automation.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>
}
