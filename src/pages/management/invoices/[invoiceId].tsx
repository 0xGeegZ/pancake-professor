import { useState, useCallback, useEffect } from 'react'

import Head from 'next/head'
import Footer from 'src/client/components/Footer'
import PageTitleWrapper from 'src/client/components/PageTitleWrapper'
import type { ReactElement } from 'react'
import AccentHeaderLayout from 'src/client/layouts/AccentHeaderLayout'

import { Grid } from '@mui/material'
import { useRouter } from 'next/router'
import useRefMounted from 'src/client/hooks/useRefMounted'
import type { Invoice } from 'src/client/models/invoice'
import InvoiceBody from 'src/client/components/Management/Invoices/single/InvoiceBody'
import PageHeader from 'src/client/components/Management/Invoices/single/PageHeader'

import axios from 'src/client/utils/axios'

function ManagementInvoicesView() {
  const isMountedRef = useRefMounted()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const router = useRouter()
  const { invoiceId } = router.query

  const getInvoice = useCallback(async () => {
    try {
      const response = await axios.get<{ invoice: Invoice }>('/api/invoice', {
        params: {
          invoiceId,
        },
      })
      if (isMountedRef.current) {
        setInvoice(response.data.invoice)
      }
    } catch (err) {
      console.error(err)
    }
  }, [invoiceId, isMountedRef])

  useEffect(() => {
    getInvoice()
  }, [getInvoice])

  if (!invoice) {
    return null
  }

  return (
    <>
      <Head>
        <title>Invoice Details - Management</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader invoice={invoice} />
      </PageTitleWrapper>

      <Grid sx={{ px: 4 }} container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
        <Grid item xs={12}>
          <InvoiceBody invoice={invoice} />
        </Grid>
      </Grid>
      <Footer />
    </>
  )
}

export default ManagementInvoicesView

ManagementInvoicesView.getLayout = function getLayout(page: ReactElement) {
  return <AccentHeaderLayout>{page}</AccentHeaderLayout>
}
