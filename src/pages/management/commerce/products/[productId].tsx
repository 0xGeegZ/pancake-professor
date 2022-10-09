import { Grid } from '@mui/material'
import Head from 'next/head'
import { useRouter } from 'next/router'
import type { ReactElement } from 'react'
import { useCallback, useEffect,useState } from 'react'
import Footer from 'src/client/components/Footer'
import PageHeader from 'src/client/components/Management/Commerce/Single/PageHeader'
import ProductBody from 'src/client/components/Management/Commerce/Single/ProductBody'
import PageTitleWrapper from 'src/client/components/PageTitleWrapper'
import useRefMounted from 'src/client/hooks/useRefMounted'
import AccentHeaderLayout from 'src/client/layouts/AccentHeaderLayout'
import type { Product } from 'src/client/models/product'
import axios from 'src/client/utils/axios'

function ManagementProductSingle() {
  const isMountedRef = useRefMounted()
  const [product, setProduct] = useState<Product | null>(null)
  const router = useRouter()
  const { productId } = router.query

  const getProduct = useCallback(async () => {
    try {
      const response = await axios.get<{ product: Product }>('/api/product', {
        params: {
          productId,
        },
      })
      if (isMountedRef.current) {
        setProduct(response.data.product)
      }
    } catch (err) {
      console.error(err)
    }
  }, [productId, isMountedRef])

  useEffect(() => {
    getProduct()
  }, [getProduct])

  if (!product) {
    return null
  }

  return (
    <>
      <Head>
        <title>{`${product.name} - Products Management`}</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader product={product} />
      </PageTitleWrapper>

      <Grid sx={{ px: 4 }} container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
        <Grid item xs={12}>
          <ProductBody product={product} />
        </Grid>
      </Grid>
      <Footer />
    </>
  )
}

export default ManagementProductSingle

ManagementProductSingle.getLayout = function getLayout(page: ReactElement) {
  return <AccentHeaderLayout>{page}</AccentHeaderLayout>
}
