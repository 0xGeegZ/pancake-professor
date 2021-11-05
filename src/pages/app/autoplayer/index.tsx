import { Box, Grid } from '@mui/material'
import Head from 'next/head'
import AutoPlayerDetails from 'src/client/components/Dashboards/Finance/AutoPlayerDetails'
import SoonAvailable from 'src/client/components/Dashboards/Healthcare/doctor/SoonAvailable'
import Footer from 'src/client/components/Footer'
import MainLayout from 'src/client/layouts/MainLayout'

import type { ReactElement } from 'react'

function AutoPlayer() {
  return (
    <>
      <Head>
        <title>Auto Player</title>
      </Head>
      {/* <PageTitleWrapper><PageHeader /></PageTitleWrapper> */}
      <Box sx={{ mt: 3, py: 9.5 }}>
        <Grid sx={{ px: 4 }} container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
          <Grid item xs={12}>
            <SoonAvailable />
          </Grid>
          <Grid item xs={12}>
            <AutoPlayerDetails />
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </>
  )
}

export default AutoPlayer

AutoPlayer.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>
}
