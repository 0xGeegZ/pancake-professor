import { useState, useEffect, useCallback } from 'react'
import axios from 'src/client/utils/axios'
import type { ReactElement } from 'react'
import AccentHeaderLayout from 'src/client/layouts/AccentHeaderLayout'

import Head from 'next/head'
import PageHeader from 'src/client/components/Management/Invoices/PageHeader'
import Footer from 'src/client/components/Footer'
import Statistics from 'src/client/components/Management/Invoices/Statistics'
import PageTitleWrapper from 'src/client/components/PageTitleWrapper'

import { Grid } from '@mui/material'
import useRefMounted from 'src/client/hooks/useRefMounted'
import type { Invoice } from 'src/client/models/invoice'

import Results from 'src/client/components/Management/Invoices/Results'

function ManagementInvoices() {
  const isMountedRef = useRefMounted()
  const [invoices, setInvoices] = useState<Invoice[]>([])

  const getInvoices = useCallback(async () => {
    try {
      const response = await axios.get<{ invoices: Invoice[] }>('/api/invoices')

      if (isMountedRef.current) {
        setInvoices(response.data.invoices)
      }
    } catch (err) {
      console.error(err)
    }
  }, [isMountedRef])

  useEffect(() => {
    getInvoices()
  }, [getInvoices])

  return (
    <>
      <Head>
        <title>Invoices - Management</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>

      <Grid sx={{ px: 4 }} container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
        <Grid item xs={12}>
          <Statistics />
        </Grid>
        <Grid item xs={12}>
          <Results invoices={invoices} />
        </Grid>
      </Grid>
      <Footer />
    </>
  )
}

export default ManagementInvoices

ManagementInvoices.getLayout = function getLayout(page: ReactElement) {
  return <AccentHeaderLayout>{page}</AccentHeaderLayout>
}
