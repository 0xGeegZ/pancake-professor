import { Grid } from '@mui/material'
import Head from 'next/head'
import type { ReactElement } from 'react'
import { useCallback,useEffect, useState } from 'react'
import Footer from 'src/client/components/Footer'
import PageHeader from 'src/client/components/Management/Commerce/Products/PageHeader'
import Results from 'src/client/components/Management/Commerce/Products/Results'
import PageTitleWrapper from 'src/client/components/PageTitleWrapper'
import useRefMounted from 'src/client/hooks/useRefMounted'
import AccentHeaderLayout from 'src/client/layouts/AccentHeaderLayout'
import type { Product } from 'src/client/models/product'
import axios from 'src/client/utils/axios'

function ManagementProducts() {
  const isMountedRef = useRefMounted()
  const [products, setProducts] = useState<Product[]>([])

  const getProducts = useCallback(async () => {
    try {
      const response = await axios.get<{ products: Product[] }>('/api/products')

      if (isMountedRef.current) {
        setProducts(response.data.products)
      }
    } catch (err) {
      console.error(err)
    }
  }, [isMountedRef])

  useEffect(() => {
    getProducts()
  }, [getProducts])

  return (
    <>
      <Head>
        <title>Products - Management</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>

      <Grid sx={{ px: 4 }} container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
        <Grid item xs={12}>
          <Results products={products} />
        </Grid>
      </Grid>
      <Footer />
    </>
  )
}

export default ManagementProducts

ManagementProducts.getLayout = function getLayout(page: ReactElement) {
  return <AccentHeaderLayout>{page}</AccentHeaderLayout>
}
