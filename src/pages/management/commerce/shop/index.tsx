import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone'
import { Box, Drawer, Grid, Hidden, IconButton, useTheme } from '@mui/material'
import { styled } from '@mui/material/styles'
import Head from 'next/head'
import type { ReactElement } from 'react'
import { useCallback,useEffect, useState } from 'react'
import { Scrollbars } from 'react-custom-scrollbars-2'
import Footer from 'src/client/components/Footer'
import PageHeader from 'src/client/components/Management/Commerce/Shop/PageHeader'
import Results from 'src/client/components/Management/Commerce/Shop/Results'
import Sidebar from 'src/client/components/Management/Commerce/Shop/Sidebar'
import useRefMounted from 'src/client/hooks/useRefMounted'
import AccentHeaderLayout from 'src/client/layouts/AccentHeaderLayout'
import type { Product } from 'src/client/models/product'
import axios from 'src/client/utils/axios'

const sidebarContent = (
  <Scrollbars universal autoHide>
    <Sidebar />
  </Scrollbars>
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

const IconButtonToggle = styled(IconButton)(
  ({ theme }) => `
  width: ${theme.spacing(6)};
  height: ${theme.spacing(6)};
`
)

function ManagementProductsShop() {
  const theme = useTheme()

  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

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
        <title>Products Platform - Applications</title>
      </Head>

      <Grid sx={{ px: 4 }} container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
        <Grid display="flex" alignItems="center" item xs={12}>
          <Hidden mdUp>
            <IconButtonToggle sx={{ mr: 1 }} color="primary" onClick={handleDrawerToggle} size="small">
              <MenuTwoToneIcon />
            </IconButtonToggle>
          </Hidden>
          <Box flex={1} mt={3}>
            <PageHeader />
          </Box>
        </Grid>
        <Hidden mdDown>
          <Grid item xs={12} md={3}>
            <Sidebar />
          </Grid>
        </Hidden>
        <Grid item xs={12} md={9}>
          {products && <Results products={products} />}
        </Grid>
      </Grid>
      <Hidden mdUp>
        <DrawerWrapperMobile
          variant="temporary"
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          open={mobileOpen}
          onClose={handleDrawerToggle}>
          {sidebarContent}
        </DrawerWrapperMobile>
      </Hidden>
      <Footer />
    </>
  )
}

export default ManagementProductsShop

ManagementProductsShop.getLayout = function getLayout(page: ReactElement) {
  return <AccentHeaderLayout>{page}</AccentHeaderLayout>
}
